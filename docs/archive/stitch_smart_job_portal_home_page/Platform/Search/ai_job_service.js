/**
 * ai_job_service.js
 * ==================
 * Central service for all AI-powered job operations:
 *  - Semantic AI job matching (resume → job scores via Gemini)
 *  - Semantic job search (natural language → ranked results)
 *  - User activity persistence (bookmarks, applied jobs, search history)
 * 
 * Usage:
 *   <script src="../Search/ai_job_service.js"></script>
 *   Then access window.AIJobService
 */

const AI_BASE_URL = 'http://127.0.0.1:5000';

// ── Internal Helpers ──────────────────────────────────────────────────────────

function _getCurrentUser() {
    try {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        const u = JSON.parse(raw);
        return (u && u.email) ? u : null;
    } catch (e) {
        return null;
    }
}

function _getActiveResume(user) {
    if (!user) return null;
    const resumes = user.uploadedResumes || [];
    if (!resumes.length) return null;
    const activeId = user.activeResumeId;
    if (activeId) {
        const found = resumes.find(r => r.id === activeId);
        if (found) return found;
    }
    return resumes[resumes.length - 1]; // Fallback to last resume
}

function _getCandidateType(user) {
    if (!user) return 'fresher';
    if (user.candidateType) return user.candidateType;
    // Auto-detect from ATS analysis
    const resume = _getActiveResume(user);
    if (resume && resume.atsAnalysis) {
        return resume.atsAnalysis.candidate_type || 'fresher';
    }
    return 'fresher';
}

// ── Cache Layer (avoids hammering the API on every filter change) ────────────

const _CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function _getCachedMatches(resumeId) {
    try {
        const raw = localStorage.getItem('ai_match_cache_' + resumeId);
        if (!raw) return null;
        const entry = JSON.parse(raw);
        if (Date.now() - entry.timestamp > _CACHE_TTL_MS) {
            localStorage.removeItem('ai_match_cache_' + resumeId);
            return null;
        }
        return entry.jobs;
    } catch(e) { return null; }
}

function _setCachedMatches(resumeId, jobs) {
    try {
        localStorage.setItem('ai_match_cache_' + resumeId, JSON.stringify({
            timestamp: Date.now(),
            jobs
        }));
    } catch(e) {}
}

// ── Request Throttler (Human-like Moderation) ────────────────────────────────

class RequestThrottler {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.lastRequestTime = 0;
        this.minDelay = 1000; // 1 second mandatory delay between AI calls
        this.activeRequests = new Map(); // Track pending requests by type/key
    }

    /**
     * Executes an AI request with throttling and deduplication.
     * @param {string} type - Request type (e.g. 'search', 'match')
     * @param {string} key - Unique key for this specific request content
     * @param {Function} fetchFn - The actual fetch function to run
     */
    async throttle(type, key, fetchFn) {
        // 1. Deduplication: If an identical request is already pending, return it
        const reqKey = `${type}:${key}`;
        if (this.activeRequests.has(reqKey)) {
            console.log(`[Throttler] Deduplicating pending ${type} request...`);
            return this.activeRequests.get(reqKey);
        }

        const promise = (async () => {
            try {
                // 2. Wait for queue turn
                return await new Promise((resolve, reject) => {
                    this.queue.push({ fetchFn, resolve, reject });
                    this._processQueue();
                });
            } finally {
                this.activeRequests.delete(reqKey);
            }
        })();

        this.activeRequests.set(reqKey, promise);
        return promise;
    }

    async _processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const now = Date.now();
            const timeSinceLast = now - this.lastRequestTime;
            const delayNeeded = Math.max(0, this.minDelay - timeSinceLast);

            if (delayNeeded > 0) {
                console.log(`[Throttler] Pacing ${type} request... waiting ${delayNeeded}ms`);
                await new Promise(r => setTimeout(r, delayNeeded));
            }

            const { fetchFn, resolve, reject } = this.queue.shift();
            this.lastRequestTime = Date.now();

            try {
                const result = await fetchFn();
                resolve(result);
            } catch (err) {
                reject(err);
            }
        }

        this.processing = false;
    }
}

const _throttler = new RequestThrottler();

// ── Main Service Object ───────────────────────────────────────────────────────

window.AIJobService = {

    /**
     * Load semantic AI match scores for the current user's active resume.
     * Returns enriched job array with aiMatchScore, aiReasoning, etc.
     * Uses a 5-minute cache to avoid repeated API calls.
     */
    async loadSemanticMatches(jobIds = null) {
        const user = _getCurrentUser();
        if (!user) return {
            success: false,
            error: 'Not logged in',
            jobs: []
        };

        const resume = _getActiveResume(user);
        if (!resume || !resume.extractedText) {
            return {
                success: false,
                error: 'No resume with extracted text found. Please upload a resume first.',
                jobs: []
            };
        }

        if (!resume.normalATS) {
            return {
                success: false,
                error: 'Run ATS Analysis on your resume first to enable AI matching.',
                jobs: []
            };
        }

        // Check cache first
        const cached = _getCachedMatches(resume.id);
        if (cached) {
            console.log('[AIJobService] Returning cached matches for resume:', resume.id);
            return {
                success: true,
                jobs: cached,
                fromCache: true
            };
        }

        console.log('[AIJobService] Queueing /api/jobs/semantic-match via Throttler...');
        return _throttler.throttle('match', resume.id, async () => {
            try {
                const resp = await fetch(`${AI_BASE_URL}/api/jobs/semantic-match`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        resume_text: resume.extractedText,
                        candidate_type: _getCandidateType(user),
                        job_ids: jobIds
                    })
                });

                const result = await resp.json();
                if (!result.success) {
                    return {
                        success: false,
                        error: result.error || 'AI matching failed',
                        jobs: []
                    };
                }

                const tier = result.tier || 'ai';
                const notice = result.notice || null;

                // Log which tier was actually used
                if (tier === 'local_kb') {
                    console.warn('[AIJobService] Tier 2 (Local KB) was used — AI was unavailable', notice);
                } else if (tier === 'google_enhanced') {
                    console.warn('[AIJobService] Tier 3 (Google-Enhanced) was used — AI and Local KB were insufficient', notice);
                } else {
                    console.log('[AIJobService] Tier 1 (AI) match succeeded');
                }

                _setCachedMatches(resume.id, result.matches);
                return {
                    success: true,
                    jobs: result.matches,
                    fromCache: false,
                    tier,
                    notice
                };
            } catch (err) {
                console.error('[AIJobService] semantic-match error:', err);
                return {
                    success: false,
                    error: 'Could not connect to AI server. Is backend running?',
                    jobs: []
                };
            }
        });
    },

    /**
     * Perform a semantic search on the job database.
     * Returns jobs ranked by relevance to the natural language query.
     */
    async semanticSearch(query, location = '') {
        if (!query || !query.trim()) return {
            success: false,
            error: 'Empty query',
            results: []
        };

        // Get resume text for Tier 3 fallback (Google-enhanced matching)
        const user = _getCurrentUser();
        const resume = _getActiveResume(user);
        const resumeText = resume && resume.extractedText ? resume.extractedText : '';

        const searchKey = `${query}|${location}`;
        console.log('[AIJobService] Queueing /api/jobs/semantic-search via Throttler:', query);
        
        return _throttler.throttle('search', searchKey, async () => {
            try {
                const resp = await fetch(`${AI_BASE_URL}/api/jobs/semantic-search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: query.trim(),
                        location: location.trim(),
                        resume_text: resumeText // Used by Tier 3 fallback
                    })
                });

                const result = await resp.json();
                if (!result.success) {
                    return {
                        success: false,
                        error: result.error || 'Semantic search failed',
                        results: []
                    };
                }

                const tier = result.tier || 'ai';
                if (tier !== 'ai') {
                    console.warn(`[AIJobService] Search used ${tier} tier:`, result.notice);
                }

                // Also record search history in DB
                this.recordSearch(query, location);

                return {
                    success: true,
                    results: result.results,
                    total: result.total,
                    tier,
                    notice: result.notice || null
                };
            } catch (err) {
                console.error('[AIJobService] semantic-search error:', err);
                return {
                    success: false,
                    error: 'Could not connect to AI server.',
                    results: []
                };
            }
        });
    },

    /**
     * Toggle bookmark for a job — persists to DB.
     * Falls back to localStorage if not logged in.
     */
    async toggleBookmark(job) {
        const user = _getCurrentUser();

        // Always update localStorage for instant UI (offline-first)
        if (window.BookmarkService) {
            window.BookmarkService.toggle({
                id: job.id || job.jobId,
                title: job.title || job.jobTitle,
                company: job.company,
                location: job.location,
                salary: job.salary,
                type: job.type,
                tags: job.tags || [],
                url: job.url || ''
            });
        }

        if (!user) return {
            success: false,
            error: 'Not logged in (localStorage only)'
        };

        try {
            const resp = await fetch(`${AI_BASE_URL}/api/user/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    job: {
                        jobId: String(job.id || job.jobId),
                        jobTitle: job.title || job.jobTitle || '',
                        company: job.company || '',
                        location: job.location || '',
                        salary: job.salary || '',
                        type: job.type || '',
                        tags: job.tags || []
                    }
                })
            });
            return await resp.json();
        } catch (err) {
            console.error('[AIJobService] bookmark error:', err);
            return {
                success: false,
                error: 'Backend not reachable, saved locally only'
            };
        }
    },

    /**
     * Record a job application — persists to DB.
     */
    async recordApplication(job) {
        const user = _getCurrentUser();
        if (!user) return {
            success: false,
            error: 'Not logged in'
        };

        try {
            const resp = await fetch(`${AI_BASE_URL}/api/user/applied`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    job: {
                        jobId: String(job.id || job.jobId),
                        jobTitle: job.title || job.jobTitle || '',
                        company: job.company || '',
                        location: job.location || '',
                        salary: job.salary || '',
                        type: job.type || '',
                        tags: job.tags || []
                    }
                })
            });
            const result = await resp.json();
            console.log('[AIJobService] Application recorded:', result.status);
            return result;
        } catch (err) {
            console.error('[AIJobService] record-application error:', err);
            return {
                success: false,
                error: 'Backend not reachable'
            };
        }
    },

    /**
     * Record a search query — persists to DB (fire & forget).
     */
    async recordSearch(query, location = '') {
        const user = _getCurrentUser();
        if (!user || !query) return;

        try {
            await fetch(`${AI_BASE_URL}/api/user/search-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    query: query.trim(),
                    location: location.trim()
                })
            });
        } catch (err) {
            // Silent — search history is non-critical
            console.warn('[AIJobService] search-history record failed silently:', err);
        }
    },

    /**
     * Load all user activity from DB (bookmarks, applied, history).
     */
    async loadUserActivity() {
        const user = _getCurrentUser();
        if (!user) return null;

        try {
            const resp = await fetch(`${AI_BASE_URL}/api/user/activity?email=${encodeURIComponent(user.email)}`);
            return await resp.json();
        } catch (err) {
            console.error('[AIJobService] load-activity error:', err);
            return null;
        }
    },

    /**
     * Get candidate type for the current user.
     */
    getCandidateType() {
        return _getCandidateType(_getCurrentUser());
    },

    /**
     * Get the active resume for the current user.
     */
    getActiveResume() {
        return _getActiveResume(_getCurrentUser());
    },

    /**
     * Invalidate the match cache (call this when a new resume is uploaded/analyzed).
     */
    invalidateCache() {
        _matchCache.clear();
        console.log('[AIJobService] Match cache cleared.');
    },

    /**
     * Fetch external jobs by crawling Naukri, Indeed RSS, Internshala, Wellfound.
     * Uses ../../Admin/web_crawling.json (6-hr TTL cache) to avoid IP blocking.
     * Results are scored against the user's resume skills.
     * @param {string} query - Search keyword (e.g. "MERN stack developer")
     * @param {string} location - Location filter (e.g. "remote", "Bangalore")
     * @returns {Promise<{success, jobs, total, from_cache, tier}>}
     */
    async fetchExternalJobs(query = '', location = '') {
        const user = _getCurrentUser();
        const resume = _getActiveResume(user);

        // Extract resume skills for scoring (only if ATS has been run)
        let resumeSkills = [];
        if (resume) {
            if (resume.normalATS && resume.normalATS.matched_keywords) {
                resumeSkills = resume.normalATS.matched_keywords;
            } else if (resume.extractedDetails && resume.extractedDetails.skills) {
                resumeSkills = resume.extractedDetails.skills;
            } else if (resume.extractedSkills) {
                resumeSkills = resume.extractedSkills;
            }
        }

        console.log('[AIJobService] fetchExternalJobs — query:', query, '| skills:', resumeSkills.length);

        try {
            const resp = await fetch(`${AI_BASE_URL}/api/external/crawl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query.trim(),
                    location: location.trim(),
                    resume_skills: resumeSkills
                })
            });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const result = await resp.json();

            if (!result.success) {
                return { success: false, error: result.error || 'Crawl failed', jobs: [] };
            }

            console.log(`[AIJobService] External: ${result.total} jobs (from_cache=${result.from_cache})`);
            return {
                success: true,
                jobs: result.jobs || [],
                total: result.total || 0,
                from_cache: result.from_cache || false,
                query: result.query || query,
                crawled_at: result.crawled_at || null
            };
        } catch (err) {
            console.error('[AIJobService] fetchExternalJobs error:', err);
            return { success: false, error: 'Could not connect to backend.', jobs: [] };
        }
    },

    /**
     * Extract skills from resume using the local KB (debug/test helper).
     * Calls /api/jobs/extract-skills
     */
    async extractSkills(resumeText) {
        const text = resumeText || (this.getActiveResume() || {}).extractedText || '';
        if (!text) return {
            success: false,
            error: 'No resume text provided',
            extracted_skills: []
        };

        try {
            const resp = await fetch(`${AI_BASE_URL}/api/jobs/extract-skills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume_text: text
                })
            });
            return await resp.json();
        } catch (err) {
            console.error('[AIJobService] extract-skills error:', err);
            return {
                success: false,
                error: 'Backend not reachable',
                extracted_skills: []
            };
        }
    },

    /**
     * Compare multiple jobs using AI.
     * @param {Array} jobs - Array of {url, title, company}
     * @returns {Promise<{success, comparison_markdown}>}
     */
    async compareExternalJobs(jobs) {
        if (!jobs || jobs.length === 0) return { success: false, error: 'No jobs to compare' };

        console.log('[AIJobService] Calling /api/external/compare for', jobs.length, 'jobs');
        try {
            const resp = await fetch(`${AI_BASE_URL}/api/external/compare`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobs })
            });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return await resp.json();
        } catch (err) {
            console.error('[AIJobService] compare-jobs error:', err);
            return { success: false, error: 'Could not connect to comparison service.' };
        }
    }
};

console.log('[AIJobService] Loaded. Backend:', AI_BASE_URL);
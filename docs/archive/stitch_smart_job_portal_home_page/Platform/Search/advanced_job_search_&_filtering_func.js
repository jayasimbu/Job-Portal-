// Functional logic for advanced_job_search_&_filtering
console.log('Loaded advanced_job_search_&_filtering_func.js');

// Global Error Handler for debugging
window.onerror = function (message, source, lineno, colno, error) {
    console.error('Global Error:', message, 'at line', lineno);
};

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM Loaded');

    // --- UI Helpers ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Toast Notification Helper ---
    function showToast(message, type = 'success') {
        const toastId = 'job-toast-container';
        let container = document.getElementById(toastId);
        if (!container) {
            container = document.createElement('div');
            container.id = toastId;
            container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-slate-800' : 'bg-red-600';
        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-3`;
        toast.innerHTML = `
            <span class="material-symbols-outlined text-sm">${type === 'success' ? 'check_circle' : 'error'}</span>
            <span class="font-medium text-sm">${message}</span>
        `;

        container.appendChild(toast);

        // Animate In
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });

        // Remove after 3s
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- State Management ---
    const state = {
        allJobs: [],
        filteredJobs: [],
        aiMatchedJobs: [], // Jobs enriched with AIMatchScore from backend
        semanticSearchResults: [], // Jobs ranked by semantic search
        isAIMatchLoaded: false, // Whether semantic match has been loaded for current resume
        isResumeScored: false, // Whether auto background resume scoring has run for Browse Jobs
        isSemanticSearch: false, // Whether current Browse view is showing semantic results
        externalJobs: [], // Real crawled external jobs (replaces mock data)
        isExtLoaded: false, // Whether external jobs have been fetched
        filters: {
            keyword: '',
            location: '',
            minMatch: 0, // Default 0
            jobTypes: [],
            salaryMin: 0,
            industries: [],
            extPlatform: 'All Platforms'
        },
        currentPage: 1,
        itemsPerPage: 6, // Increased to 6 for better grid layout
        extCurrentPage: 1,
        extItemsPerPage: 6
    };


    // --- DOM Elements ---
    const elementIds = [
        'job-search-input', 'location-search-input', 'search-button',
        'ai-eligibility-slider', 'ai-eligibility-label', 'salary-range-slider',
        'salary-display', 'clear-all-filters', 'clear-job-type',
        'clear-industry', 'show-more-industries', 'extra-industries',
        'job-results-container', 'total-jobs-count', 'pagination-container',
        'job-type-filters', 'industry-filters', 'ext-job-search-input',
        'ext-location-filter', 'ext-job-type-filters', 'ext-ai-eligibility-slider',
        'ext-ai-eligibility-label', 'ext-pagination-container'
    ];

    const elements = {};
    for (const id of elementIds) {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Missing element: ${id}`); // Warn instead of error to not break execution
        }
        elements[idToCameCase(id)] = el;
    }


    // Manual mapping for specific names used in logic
    elements.searchInput = elements.jobSearchInput;
    elements.locationInput = elements.locationSearchInput;
    elements.aiSlider = elements.aiEligibilitySlider;
    elements.aiLabel = elements.aiEligibilityLabel;
    elements.salarySlider = elements.salaryRangeSlider;
    elements.salaryDisplay = elements.salaryDisplay || document.getElementById('salary-display');

    // Make sure External aliases match what the listener code expects
    elements.extSearchInput = elements.extJobSearchInput;
    elements.extLocationInput = elements.extLocationFilter;
    elements.extAiSlider = elements.extAiEligibilitySlider;
    elements.extAiLabel = elements.extAiEligibilityLabel;
    elements.extJobTypeFilters = elements.extJobTypeFilters || document.getElementById('ext-job-type-filters');

    elements.clearAllFiltersBtn = elements.clearAllFilters;
    elements.clearJobTypeBtn = elements.clearJobType;
    elements.clearIndustryBtn = elements.clearIndustry;
    elements.showMoreIndustriesBtn = elements.showMoreIndustries;
    elements.extraIndustriesDiv = elements.extraIndustries;
    elements.jobTypeContainer = elements.jobTypeFilters;
    elements.industryContainer = elements.industryFilters;
    elements.extAiSlider = elements.extAiEligibilitySlider;
    elements.extAiLabel = elements.extAiEligibilityLabel;
    elements.extSearchInput = elements.extJobSearchInput;
    elements.extLocationInput = elements.extLocationFilter;
    elements.extJobTypeFilters = elements.extJobTypeFilters;

    function idToCameCase(id) {
        return id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    // --- Fetch Data ---
    async function fetchJobs() {
        console.log('Fetching jobs...');

        try {
            const response = await fetch('../../DB/DB.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            // Support both array and object wrapper structure
            let fetchedJobs = Array.isArray(data) ? data : (data.jobs || []);

            // Internal jobs only — external jobs are loaded separately via API
            fetchedJobs.forEach(job => job.isExternal = false);

            state.allJobs = [...fetchedJobs];
            applyFilters();

            // Provide a default job to Gap Analysis if available
            if (state.filteredInternalJobs && state.filteredInternalJobs.length > 0 && typeof populateGapAnalysis === 'function') {
                populateGapAnalysis(state.filteredInternalJobs[0]);
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            showToast('Failed to load jobs. Please try again.', 'error');
            if (elements.jobResultsContainer) {
                elements.jobResultsContainer.innerHTML = `<p class="text-center text-red-500 py-10">Failed to load jobs service. <br> <span class="text-sm text-slate-400">${error.message}</span></p>`;
            }
        }
    }

    // ─── Auto-load resume scores silently for Browse Jobs ────────────────────────
    // Runs once after fetchJobs. Merges real AI scores into allJobs so Browse Jobs
    // cards reflect resume match accuracy, not static DB scores.
    async function autoLoadResumeScores() {
        if (state.isResumeScored) return;
        if (!window.AIJobService) return;

        // Only run if user has a resume with normalATS
        const user = (function () {
            try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) { return {}; }
        })();
        if (!user || !user.email) return;

        const resumes = user.uploadedResumes || [];
        const activeId = user.activeResumeId;
        const activeRes = resumes.find(r => r.id === activeId) || resumes[resumes.length - 1];
        if (!activeRes || !activeRes.normalATS) return; // No ATS → skip silently

        console.log('[BrowseJobs] Auto-loading resume scores in background...');
        const result = await window.AIJobService.loadSemanticMatches();
        if (!result.success || !result.jobs) return;

        // Merge AI scores into allJobs
        const scoreMap = {};
        result.jobs.forEach(m => {
            const sid = String(m.id || m._id || '');
            if (sid) scoreMap[sid] = { score: m.aiMatchScore || m.matchScore || 0, reasoning: m.aiReasoning || '' };
        });

        state.allJobs = state.allJobs.map(j => {
            const sid = String(j.id || j._id || '');
            const data = scoreMap[sid];
            if (data) return { ...j, aiMatchScore: data.score, aiReasoning: data.reasoning };
            return j;
        });

        state.isResumeScored = true;
        state.isAIMatchLoaded = true;
        applyFilters(); // Re-render Browse Jobs with accurate scores
        console.log('[BrowseJobs] Resume scores merged — Browse Jobs now shows real match %');
    }
    // --- Filtering Logic ---
    function applyFilters() {
        const {
            keyword,
            location,
            minMatch,
            jobTypes,
            salaryMin,
            industries,
            extPlatform
        } = state.filters;

        // ── Blended score helper ──────────────────────────────────────────────────
        // Condition 1 (search present): blend 50% resume score + 50% keyword relevance
        // Condition 2 (no search):      use pure aiMatchScore only
        function _effectiveScore(job) {
            const resumeScore = (job.aiMatchScore !== undefined) ? job.aiMatchScore : (job.matchScore || 0);
            if (!keyword) return resumeScore; // Condition 2
            // Condition 1 — keyword relevance
            const kwLow = keyword.toLowerCase();
            const titleHit = job.title && job.title.toLowerCase().includes(kwLow);
            const compHit = job.company && job.company.toLowerCase().includes(kwLow);
            const tagHit = (job.tags || []).some(t => t.toLowerCase().includes(kwLow));
            const descHit = job.description && job.description.toLowerCase().includes(kwLow);
            const kwScore = (titleHit ? 60 : 0) + (tagHit ? 25 : 0) + (descHit ? 10 : 0) + (compHit ? 5 : 0);
            return Math.round(resumeScore * 0.5 + Math.min(100, kwScore) * 0.5);
        }

        state.filteredJobs = state.allJobs.filter(job => {
            // Keyword (Title or Company or Tags)
            const matchesKeyword = !keyword ||
                (job.title && job.title.toLowerCase().includes(keyword.toLowerCase())) ||
                (job.company && job.company.toLowerCase().includes(keyword.toLowerCase())) ||
                (job.tags || []).some(t => t.toLowerCase().includes(keyword.toLowerCase()));

            // Location
            const matchesLocation = !location ||
                (job.location && job.location.toLowerCase().includes(location.toLowerCase()));

            // Apply blended or pure resume score depending on search condition
            const effectiveScore = _effectiveScore(job);
            const matchesAi = effectiveScore >= minMatch;

            // Job Type
            const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.type);

            // Industry
            const matchesIndustry = industries.length === 0 || (!job.industry && !!job.isExternal) || industries.includes(job.industry);

            // External Platform filter
            const matchesPlatform = extPlatform === 'All Platforms' || !job.isExternal || job.platform === extPlatform;

            // Salary Parsing logic
            let jobSalaryMin = 0;
            if (job.salary) {
                // Parse "$40k - $60k" or "$100k+" -> extract first digits
                const match = job.salary.match(/(\d+)/);
                if (match) jobSalaryMin = parseInt(match[1]); // Matches 40 from 40k
            }
            const matchesSalary = jobSalaryMin >= salaryMin;

            return matchesKeyword && matchesLocation && matchesAi && matchesJobType && matchesIndustry && matchesSalary && matchesPlatform;
        });

        // Apply Sorting -> Default sort by AI Match for logged-in, alphabetically for guests
        const loggedIn = (function () {
            try {
                const raw = localStorage.getItem('user');
                if (!raw) return false;
                const u = JSON.parse(raw);
                return !!(u && (u.email || u.googleId || u.name));
            } catch (e) {
                return false;
            }
        })();

        if (loggedIn) {
            state.filteredJobs.sort((a, b) => {
                // Sort by effective score (blended or pure AI)
                const aScore = _effectiveScore(a);
                const bScore = _effectiveScore(b);
                return bScore - aScore;
            });
        } else {
            // Non-logged: ignore AI match filter and sort alphabetically A-Z
            state.filteredJobs = state.allJobs.filter(job => {
                const matchesKeyword = !keyword ||
                    (job.title && job.title.toLowerCase().includes(keyword.toLowerCase())) ||
                    (job.company && job.company.toLowerCase().includes(keyword.toLowerCase())) ||
                    (job.tags || []).some(t => t.toLowerCase().includes(keyword.toLowerCase()));
                const matchesLocation = !location ||
                    (job.location && job.location.toLowerCase().includes(location.toLowerCase()));
                const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.type);
                const matchesIndustry = industries.length === 0 || (!job.industry && !!job.isExternal) || industries.includes(job.industry);
                const matchesPlatform = extPlatform === 'All Platforms' || !job.isExternal || job.platform === extPlatform;
                let jobSalaryMin = 0;
                if (job.salary) {
                    const match = job.salary.match(/(\d+)/);
                    if (match) jobSalaryMin = parseInt(match[1]);
                }
                const matchesSalary = jobSalaryMin >= salaryMin;
                return matchesKeyword && matchesLocation && matchesJobType && matchesIndustry && matchesSalary && matchesPlatform;
            });
            state.filteredJobs.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        // Split for specific views
        state.filteredInternalJobs = state.filteredJobs.filter(j => !j.isExternal);
        state.filteredExternalJobs = state.filteredJobs.filter(j => j.isExternal);

        state.currentPage = 1; // Reset to first page
        state.extCurrentPage = 1; // Reset external to first page
        updateCounts(); // Update sidebar counts
        renderJobs();
        renderPagination();
        if (typeof renderExternalJobs === 'function') renderExternalJobs();
        if (typeof renderAIJobs === 'function') renderAIJobs(state.filteredInternalJobs);
    }

    // Helper: Parse "2h ago" to minutes
    function parsePostedTime(timeStr) {
        if (!timeStr) return 999999;
        const match = timeStr.match(/(\d+)/);
        if (!match) return 999999;

        const num = parseInt(match[1]);
        if (timeStr.includes('m')) return num; // Minutes
        if (timeStr.includes('h')) return num * 60; // Hours
        if (timeStr.includes('d')) return num * 60 * 24; // Days
        return 999999;
    }


    // --- Updating Sidebar Counts ---
    function updateCounts() {
        // Calculate counts based on current filtered internal jobs
        const jobTypeCounts = {};
        const stateJobTypeFilters = document.querySelectorAll('#job-type-filters input[type="checkbox"]');

        // Initialize counts from DOM to covers all options
        stateJobTypeFilters.forEach(input => {
            jobTypeCounts[input.value] = 0;
        });

        state.filteredInternalJobs.forEach(job => {
            if (job.type && jobTypeCounts.hasOwnProperty(job.type)) {
                jobTypeCounts[job.type]++;
            }
        });

        // Update DOM
        for (const [type, count] of Object.entries(jobTypeCounts)) {
            // sanitize selector
            const selectorName = type.toLowerCase().replace(/ /g, '-');
            const el = document.querySelector(`.job-count-${selectorName}`);
            if (el) el.textContent = count;
        }

        // Update Total Count
        if (elements.totalJobsCount) elements.totalJobsCount.textContent = state.filteredInternalJobs.length;
    }


    // --- Rendering ---
    function renderJobs() {
        const container = elements.jobResultsContainer;
        if (!container) return;

        container.innerHTML = '';

        if (state.filteredInternalJobs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                    <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No jobs found</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search terms.</p>
                    <button id="reset-filters-empty" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">Clear all filters</button>
                </div>
            `;
            const resetBtn = document.getElementById('reset-filters-empty');
            if (resetBtn) resetBtn.addEventListener('click', clearAllFilters);
            return;
        }

        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;
        const jobsPage = state.filteredInternalJobs.slice(start, end);

        jobsPage.forEach(job => {
            const isBookmarked = BookmarkService.isSaved(job.id);
            // Updated Bookmark Styles
            const bookmarkIcon = isBookmarked ? 'bookmark' : 'bookmark_border'; // 'bookmark' is filled, 'bookmark_border' is outline
            const bookmarkClass = isBookmarked ?
                'bg-slate-900 text-white border-slate-900' // Active: Black bg, white icon (as requested)
                :
                'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary';

            // Determines Match Layout — only shown when logged in AND ATS analysis has been run
            // ATS analysis is the key that activates AI matching — no analysis = no scores shown
            const _matchCheckState = (function () {
                try {
                    const raw = localStorage.getItem('user');
                    if (!raw) return {
                        loggedIn: false,
                        hasATS: false
                    };
                    const u = JSON.parse(raw);
                    if (!u || !(u.email || u.googleId || u.name)) return {
                        loggedIn: false,
                        hasATS: false
                    };
                    const resumes = u.uploadedResumes || [];
                    const activeId = u.activeResumeId;
                    const active = resumes.find(r => r.id === activeId) || resumes[resumes.length - 1];
                    // ATS analysis is the key activation — must have normalATS data
                    const hasATS = !!(active && active.normalATS);
                    return {
                        loggedIn: true,
                        hasATS
                    };
                } catch (e) {
                    return {
                        loggedIn: false,
                        hasATS: false
                    };
                }
            })();

            let matchTag = '';
            let borderClass = 'border-slate-200 dark:border-slate-700';

            if (_matchCheckState.loggedIn && _matchCheckState.hasATS) {
                // Show real AI match scores only when ATS analysis has been done
                const score = job.aiMatchScore || job.matchScore || 0;
                if (score >= 90) {
                    borderClass = 'border-primary shadow-sm shadow-blue-100 dark:shadow-none';
                    matchTag = `<div class="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold leading-none flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[16px]">verified</span> ${score}% Match
                                </div>`;
                } else if (score >= 75) {
                    borderClass = 'border-yellow-400';
                    matchTag = `<div class="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold leading-none flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[16px]">bolt</span> ${score}% Match
                                </div>`;
                } else if (score > 0) {
                    matchTag = `<div class="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold leading-none flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[16px]">trending_up</span> ${score}% Match
                                </div>`;
                }
                // If score is 0 or no score at all, show nothing — don't fake a 0% either
            } else if (_matchCheckState.loggedIn && !_matchCheckState.hasATS) {
                // Logged in but no ATS done — show a soft nudge on each card
                matchTag = `<div class="bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 px-3 py-1 rounded-full text-xs font-medium leading-none flex items-center gap-1" title="Run ATS analysis to see your match score">
                                <span class="material-symbols-outlined text-[15px]">analytics</span> Run ATS
                            </div>`;
            }

            const card = document.createElement('div');
            // Using transition-all for smooth hover effects
            card.className = `group bg-white dark:bg-[#1e293b] rounded-xl p-5 border ${borderClass} hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 relative flex flex-col gap-4`;

            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex items-start gap-4">
                        <div class="w-14 h-14 rounded-lg bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                            <img src="${job.logo || '../../assets/logos/career_auto_logo.png'}" alt="${job.company}" class="w-full h-full object-contain">
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer">${job.title}</h3>
                            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">${job.company}</p>
                        </div>
                    </div>
                    ${matchTag}
                </div>

                <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-slate-400">location_on</span>
                        ${job.location}
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-slate-400">payments</span>
                        ${job.salary}
                    </div>
                     <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-slate-400">work</span>
                        ${job.type}
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px] text-slate-400">schedule</span>
                        ${job.postedTime}
                    </div>
                </div>

                <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                    ${job.description}
                </p>

                <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
                     <div class="flex gap-2">
                        ${job.tags ? job.tags.slice(0, 2).map(tag =>
                `<span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded">${tag}</span>`
            ).join('') : ''}
                    </div>

                    <div class="flex items-center gap-3">
                         <button class="bookmark-btn w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${bookmarkClass}" data-id="${job.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Job'}">
                            <span class="material-symbols-outlined text-[20px]">${bookmarkIcon}</span>
                        </button>
                        <button
                            class="ats-icon-btn w-9 h-9 flex items-center justify-center rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                            title="ATS Analysis — compare your resume to this job"
                            data-job-id="${job.id}"
                            data-job-title="${escapeHtml(job.title)}"
                            data-job-company="${escapeHtml(job.company)}"
                            data-job-tags='${JSON.stringify(job.tags || [])}'
                            data-job-desc="${escapeHtml((job.description || '').substring(0, 2000))}"
                        >
                            <span class="material-symbols-outlined text-[18px]">track_changes</span>
                        </button>
                        <button onclick="
                            localStorage.setItem('recent_job_view', JSON.stringify({
                                title: '${job.title.replace(/'/g, "\\'")}',
                                company: '${job.company.replace(/'/g, "\\'")}',
                                matchScore: ${job.matchScore || 0},
                                tags: ${JSON.stringify(job.tags || [])},
                                isExternal: ${job.isExternal || false},
                                platform: '${job.platform || ''}'
                            }));
                            window.location.href='../../JobSeeker/Insights/job_details_&_match_breakdown.html';
                        " class="px-6 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors shadow-md shadow-blue-500/20">
                            View &amp; Apply
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Add event listeners for bookmarks (persist to DB)
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const rawId = btn.dataset.id;
                const id = isNaN(rawId) ? rawId : parseInt(rawId);
                toggleBookmark(id);
                // Also persist to backend DB
                if (window.AIJobService) {
                    const job = state.allJobs.find(j => String(j.id) === String(rawId));
                    if (job) {
                        const result = await window.AIJobService.toggleBookmark(job);
                        if (result.success) {
                            showToast(result.action === 'saved' ? 'Job saved to your profile ✓' : 'Bookmark removed', 'success');
                        }
                    }
                }
            });
        });

        // Attach ATS icon listeners after render
        container.querySelectorAll('.ats-icon-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const jobTitle = btn.dataset.jobTitle || '';
                const jobCompany = btn.dataset.jobCompany || '';
                const jobDesc = btn.dataset.jobDesc || '';
                let jobTags = [];
                try { jobTags = JSON.parse(btn.dataset.jobTags || '[]'); } catch (ex) {}
                // Build a combined JD from the description + tags
                const prefillJD = `${jobTitle} at ${jobCompany}\n\n${jobDesc}\n\nRequired Skills: ${jobTags.join(', ')}`;
                localStorage.setItem('jd_job_prefill', JSON.stringify({
                    title: jobTitle,
                    company: jobCompany,
                    description: prefillJD,
                    tags: jobTags
                }));
                showToast('Opening ATS analysis for ' + jobTitle, 'success');
                setTimeout(() => {
                    window.location.href = '../../JobSeeker/Profile/resume_insights.html#jd-targeted';
                }, 600);
            });
        });

        renderAIJobs(jobsPage);
    }

    function renderAIJobs(jobs = null) {
        const container = document.getElementById('ai-job-results-container');
        if (!container) return;

        // AI Matches uses all internal jobs — ranked by resume aiMatchScore
        const allInternal = state.allJobs.filter(j => !j.isExternal);
        const displayJobs = allInternal.length > 0 ? allInternal : (jobs || []);

        // ── Issue 6: Only show jobs with aiMatchScore ≥ 75% ──
        // ── Issue 7: Apply active filters (keyword, location, salary, type) ──
        const kw = (state.filters.keyword || '').toLowerCase();
        const loc = (state.filters.location || '').toLowerCase();
        const salMin = state.filters.salaryMin || 0;
        const typeFilter = state.filters.jobTypes || [];

        const aiRankedJobs = displayJobs
            .filter(j => {
                // Must have a real AI score ≥ 75
                if (!j.aiMatchScore || j.aiMatchScore < 75) return false;
                // Keyword filter
                if (kw && !(
                    (j.title && j.title.toLowerCase().includes(kw)) ||
                    (j.company && j.company.toLowerCase().includes(kw)) ||
                    (j.tags && j.tags.some(t => t.toLowerCase().includes(kw)))
                )) return false;
                // Location filter
                if (loc && !(j.location && j.location.toLowerCase().includes(loc))) return false;
                // Job type filter
                if (typeFilter.length > 0 && !typeFilter.includes(j.type)) return false;
                // Salary filter
                if (salMin > 0 && j.salary) {
                    const m = j.salary.match(/(\d+)/);
                    if (m && parseInt(m[1]) < salMin) return false;
                }
                return true;
            })
            .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));

        const headerEl = document.getElementById('ai-results-header');
        if (headerEl) {
            if (aiRankedJobs.length > 0) headerEl.classList.remove('hidden');
            else headerEl.classList.add('hidden');
        }

        if (aiRankedJobs.length === 0) {
            const hasLoaded = state.isAIMatchLoaded;
            container.innerHTML = `
                <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                    <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Strong Matches Found</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                        ${hasLoaded
                            ? 'No jobs with 75%+ match were found. Try adding more skills to your resume or clearing your filters.'
                            : 'Click "Find AI Matches" above to search for jobs matched to your resume.'}
                    </p>
                </div>
            `;
            // Hide reasoning drawer if no jobs
            if (typeof closeReasoning === 'function') closeReasoning();
            return;
        }

        container.innerHTML = aiRankedJobs.map(job => {
            // Use AI score from backend if available, else fall back to static DB score
            const displayScore = job.aiMatchScore !== undefined ? job.aiMatchScore : (job.matchScore || 0);
            const hasAIReasoning = !!job.aiReasoning;

            // SVG color logic based on score
            let svgColor = '#60a5fa'; // Blue
            let bgClass = 'bg-blue-50';
            let iconColor = 'text-blue-600';
            let borderColor = 'border-slate-200 dark:border-slate-800';

            if (displayScore >= 90) {
                svgColor = '#2b8cee';
                bgClass = 'bg-indigo-50';
                iconColor = 'text-indigo-600';
                borderColor = 'border-indigo-300 dark:border-indigo-700';
            } else if (displayScore >= 80) {
                svgColor = '#10b981'; // Emerald
                bgClass = 'bg-emerald-50';
                iconColor = 'text-emerald-600';
                borderColor = 'border-emerald-300 dark:border-emerald-700';
            } else {
                svgColor = '#f97316'; // Orange
                bgClass = 'bg-orange-50';
                iconColor = 'text-orange-600';
                borderColor = 'border-orange-300 dark:border-orange-700';
            }

            // External Job Pill HTML
            const extPill = job.isExternal ? `<div class="absolute -top-3 left-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm border border-slate-800"><span class="material-symbols-outlined text-[12px]">language</span> ${job.platform} Data</div>` : '';

            return `
              <div
                class="bg-white dark:bg-slate-900 p-6 rounded-2xl border ${borderColor} hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer relative group flex flex-col sm:flex-row gap-5 hover:shadow-lg hover:shadow-blue-500/5 group/card"
                onclick="handleAIJobClick(this, '${escapeHtml(job.company)}', '${escapeHtml(job.title)}', ${displayScore}, '${job.id}')"
              >
                ${extPill}
                <div class="size-14 rounded-xl ${bgClass} flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined ${iconColor} text-3xl">work</span>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <div>
                      <h3 class="text-lg font-bold group-hover:text-blue-600 transition-colors">${job.title}</h3>
                      <p class="text-slate-500 text-sm">${job.company} • ${job.location}</p>
                    </div>
                    <div class="hidden sm:flex flex-col items-center ml-4">
                      <div class="relative size-14">
                        <svg class="size-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e2e8f0"
                            stroke-width="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="${svgColor}"
                            stroke-dasharray="${displayScore},100"
                            stroke-linecap="round"
                            stroke-width="3"
                          />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <span class="text-sm font-black ${iconColor}">${displayScore}%</span>
                        </div>
                      </div>
                      <span class="text-xs text-slate-500 mt-1">${hasAIReasoning ? 'AI Match' : 'Match'}</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mb-3">
                     ${job.tags ? job.tags.map(tag =>
                `<span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">${tag}</span>`
            ).join('') : ''}
                  </div>
                  <div class="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span class="flex items-center gap-1 text-sm text-slate-500">
                      <span class="material-symbols-outlined text-base">payments</span>
                      ${job.salary}
                    </span>
                    <span class="flex items-center gap-1 text-sm text-slate-500">
                      <span class="material-symbols-outlined text-base">schedule</span>
                      ${job.postedTime}
                    </span>
                    <div class="ml-auto flex gap-2">
                      ${job.isExternal ? `
                      <button
                        class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                        onclick="
                          event.stopPropagation();
                          localStorage.setItem('recent_job_view', JSON.stringify({
                              title: '${job.title.replace(/'/g, "\\'")}',
                              company: '${job.company.replace(/'/g, "\\'")}',
                              matchScore: ${job.matchScore || 0},
                              tags: ${JSON.stringify(job.tags || [])},
                              isExternal: true,
                              platform: '${job.platform}',
                              url: '${job.url}'
                          }));
                          openRedirectModal('${job.platform}');
                        "
                      >
                        Apply Externally
                      </button>
                       ` : `
                       <button
                         class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                         onclick="event.stopPropagation(); applyToAIJob('${job.id}', ${displayScore})"
                       >
                         Apply Now
                       </button>
                       `}
                    </div>
                  </div>
                </div>
              </div>
            `;
        }).join('');

        // **FIX**: Automatically load the first job's reasoning into the right drawer
        // so it isn't static "Senior Product Designer" when the page loads
        if (aiRankedJobs.length > 0) {
            const topJob = aiRankedJobs[0];
            const topScore = topJob.aiMatchScore || 0;
            setTimeout(() => {
                if (typeof openReasoning === 'function') {
                    // Update global UI state directly bypassing onclick
                    openReasoning(topJob.company, topJob.title, topScore, topJob.id);
                    if (window.AdvancedJobSearch && window.AdvancedJobSearch.renderGapAnalysis) {
                        window.AdvancedJobSearch.renderGapAnalysis(topJob.id);
                    }

                    // Add active styling to the first card
                    const firstCard = container.querySelector('.group\\/card');
                    if (firstCard) {
                        document.querySelectorAll('#ai-job-results-container .group\\/card').forEach(c => c.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500'));
                        firstCard.classList.add('ring-2', 'ring-blue-500', 'border-blue-500');
                    }
                }
            }, 100);
        }
    }

    // Helper to safely escape strings for inline onclick handlers without breaking quotes
    function escapeHtml(unsafe) {
        return (unsafe || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }

    // Global function mapped to the onclick handler of each AI Job Card
    window.handleAIJobClick = function (element, company, title, score, jobId) {
        // Highlight active card
        document.querySelectorAll('#ai-job-results-container .group\\/card').forEach(c => c.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500'));
        if (element && element.classList) {
            element.classList.add('ring-2', 'ring-blue-500', 'border-blue-500');
        }

        // Use the controller function (Issue 2 fix)
        if (typeof window.openAIJobReasoning === 'function') {
            window.openAIJobReasoning(jobId, score);
        } else if (typeof openReasoning === 'function') {
            openReasoning(company, title, score, jobId);
        }

        // Render the gap analysis tab
        if (window.AdvancedJobSearch && window.AdvancedJobSearch.renderGapAnalysis) {
            window.AdvancedJobSearch.renderGapAnalysis(jobId);
        }
    };

    window.renderExternalJobs = function (jobs) {
        if (!elements.extPaginationContainer) {
            elements.extPaginationContainer = document.getElementById('ext-pagination-container');
        }
        const container = document.getElementById('external-job-results-container');
        if (!container) return;

        // Use provided list or state.externalJobs
        const sourceJobs = jobs || state.externalJobs || [];

        // Apply AI slider filter
        const minMatch = state.filters.minMatch || 0;
        const extKeyword = (state.filters.keyword || '').toLowerCase();
        let displayJobs = sourceJobs.filter(j => {
            const score = j.matchScore || 0;
            const withinScore = score >= minMatch;
            const matchesKw = !extKeyword ||
                (j.title && j.title.toLowerCase().includes(extKeyword)) ||
                (j.company && j.company.toLowerCase().includes(extKeyword)) ||
                (j.tags && j.tags.some(t => t.toLowerCase().includes(extKeyword)));
            return withinScore && matchesKw;
        });

        // Sort by match score desc
        displayJobs = [...displayJobs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        container.innerHTML = '';

        if (displayJobs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">public_off</span>
                    <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No External Opportunities</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your filters or search keyword.</p>
                </div>
            `;
            if (elements.extPaginationContainer) elements.extPaginationContainer.innerHTML = '';
            return;
        }

        // Platform colour map
        const platformStyles = {
            'Indeed': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
            'Naukri': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
            'Internshala': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
            'Wellfound': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
        };

        const totalPages = Math.ceil(displayJobs.length / state.extItemsPerPage);
        const start = (state.extCurrentPage - 1) * state.extItemsPerPage;
        const paginated = displayJobs.slice(start, start + state.extItemsPerPage);

        paginated.forEach(job => {
            const score = job.matchScore || 0;
            const style = platformStyles[job.platform] || { bg: 'bg-slate-100', text: 'text-slate-700' };
            const tags = (job.tags || []).slice(0, 5);
            const scoreColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-rose-500';
            const jobUrl = job.url || '#';

            const card = document.createElement('div');
            card.className = 'group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col gap-3';
            card.innerHTML = `
                <div class="flex items-start justify-between gap-3">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}">
                                <span class="material-symbols-outlined text-[13px]">public</span>${job.platform}
                            </span>
                            ${job.from_cache ? '' : '<span class="text-[10px] text-slate-400 font-medium">Live</span>'}
                        </div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-600 transition-colors truncate">${job.title || 'Untitled'}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">${job.company || 'Unknown'} · ${job.location || 'Not specified'}</p>
                    </div>
                    <div class="shrink-0 text-right">
                        <div class="text-2xl font-black ${scoreColor}">${score}%</div>
                        <div class="text-[10px] text-slate-400 font-medium">Match</div>
                    </div>
                </div>
                ${tags.length ? `<div class="flex flex-wrap gap-1.5">${tags.map(t => `<span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">${t}</span>`).join('')}</div>` : ''}
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <div class="flex items-center gap-3">
                        <label class="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 transition-colors" onclick="event.stopPropagation();">
                            <input type="checkbox" class="job-compare-cb w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" onchange="window.toggleJobCompare(this, '${escapeHtml(job.title)}', '${escapeHtml(job.company)}', '${jobUrl}', '${job.platform}')">
                            <span>Compare</span>
                        </label>
                        <span>${job.salary || 'Salary not disclosed'}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            class="ats-icon-btn w-7 h-7 flex items-center justify-center rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                            title="ATS Analysis — compare your resume to this job"
                            onclick="event.stopPropagation(); window.triggerATSFromExternal('${escapeHtml(job.title)}', '${escapeHtml(job.company)}', '${jobUrl}', ${JSON.stringify(tags)})"
                        >
                            <span class="material-symbols-outlined text-[16px]">track_changes</span>
                        </button>
                        <a href="${jobUrl}" target="_blank" rel="noopener noreferrer"
                           class="flex items-center gap-1 text-blue-600 font-bold hover:underline"
                           onclick="event.stopPropagation(); localStorage.setItem('recent_job_view', JSON.stringify({title:'${escapeHtml(job.title)}',company:'${escapeHtml(job.company)}',matchScore:${score},tags:${JSON.stringify(tags)},isExternal:true,platform:'${job.platform}'}));">
                            Apply <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Render pagination if needed
        if (elements.extPaginationContainer) {
            elements.extPaginationContainer.innerHTML = '';
            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    const btn = document.createElement('button');
                    btn.className = `px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${i === state.extCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`;
                    btn.textContent = i;
                    btn.onclick = () => { state.extCurrentPage = i; window.renderExternalJobs(); };
                    elements.extPaginationContainer.appendChild(btn);
                }
            }
        }
    }

    function renderExternalPagination() {
        if (!elements.extPaginationContainer) { // Ensure elements is grabbed (since they're consts inside DOMContentLoaded)
            elements.extPaginationContainer = document.getElementById('ext-pagination-container');
        }
        if (!elements.extPaginationContainer) return;
        const container = elements.extPaginationContainer;
        container.innerHTML = '';
        const totalPages = Math.ceil(state.filteredExternalJobs.length / state.extItemsPerPage);

        if (totalPages <= 1) return;

        // First Page Button
        const firstBtn = createPageBtn('first_page', state.extCurrentPage > 1, () => changeExternalPage(1));
        container.appendChild(firstBtn);

        // Previous Button
        const prevBtn = createPageBtn('chevron_left', state.extCurrentPage > 1, () => changeExternalPage(state.extCurrentPage - 1));
        container.appendChild(prevBtn);

        // Page Numbers
        let startPage = Math.max(1, state.extCurrentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = `w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${i === state.extCurrentPage
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`;
            btn.textContent = i;
            btn.onclick = () => changeExternalPage(i);
            container.appendChild(btn);
        }

        // Next Button
        const nextBtn = createPageBtn('chevron_right', state.extCurrentPage < totalPages, () => changeExternalPage(state.extCurrentPage + 1));
        container.appendChild(nextBtn);

        // Last Page Button
        const lastBtn = createPageBtn('last_page', state.extCurrentPage < totalPages, () => changeExternalPage(totalPages));
        container.appendChild(lastBtn);
    }

    function changeExternalPage(page) {
        state.extCurrentPage = page;
        if (typeof renderExternalJobs === 'function') renderExternalJobs();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function toggleBookmark(id) {
        const job = state.allJobs.find(j => j.id === id) || state.filteredJobs.find(j => j.id === id);
        const jobPayload = job ? {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            type: job.type,
            tags: job.tags || [],
            url: '../../JobSeeker/Insights/job_details_&_match_breakdown.html'
        } : {
            id
        };

        const result = BookmarkService.toggle(jobPayload);
        if (result.saved) {
            showToast('Job saved to My Jobs ✓', 'success');
        } else {
            showToast('Job removed from My Jobs', 'success');
        }
        renderJobs(); // Re-render to update UI
    }

    function renderPagination() {
        if (!elements.paginationContainer) return;
        const container = elements.paginationContainer;
        container.innerHTML = '';
        const totalPages = Math.ceil(state.filteredInternalJobs.length / state.itemsPerPage);

        if (totalPages <= 1) return;

        // First Page Button
        const firstBtn = createPageBtn('first_page', state.currentPage > 1, () => changePage(1));
        container.appendChild(firstBtn);

        // Previous Button
        const prevBtn = createPageBtn('chevron_left', state.currentPage > 1, () => changePage(state.currentPage - 1));
        container.appendChild(prevBtn);

        // Page Numbers
        let startPage = Math.max(1, state.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = `w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${i === state.currentPage ?
                'bg-primary text-white shadow-md shadow-primary/20' :
                'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`;
            btn.textContent = i;
            btn.onclick = () => changePage(i);
            container.appendChild(btn);
        }

        // Next Button
        const nextBtn = createPageBtn('chevron_right', state.currentPage < totalPages, () => changePage(state.currentPage + 1));
        container.appendChild(nextBtn);

        // Last Page Button
        const lastBtn = createPageBtn('last_page', state.currentPage < totalPages, () => changePage(totalPages));
        container.appendChild(lastBtn);
    }

    function createPageBtn(icon, enabled, onClick) {
        const btn = document.createElement('button');
        btn.className = `w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 transition-colors ${enabled ?
            'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer' :
            'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed'}`;
        btn.innerHTML = `<span class="material-symbols-outlined">${icon}</span>`;
        if (enabled) btn.onclick = onClick;
        return btn;
    }

    function changePage(page) {
        state.currentPage = page;
        renderJobs();
        renderPagination();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // --- Event Listeners Setup ---
    async function saveUserSearch(query, location) {
        if (!query) return;
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return;
            const user = JSON.parse(raw);
            if (!user || !user.email) return;

            await fetch('http://localhost:5000/api/user/search-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, query: query, location: location || '' })
            });
        } catch (e) { console.error('Error saving search history:', e); }
    }

    function setupEventListeners() {
        // Debounced Filter Application
        const debouncedApplyFilters = debounce(applyFilters, 400);

        // Search Button — semantic search if backend is available
        if (elements.searchButton) {
            elements.searchButton.addEventListener('click', async (e) => {
                if (e) e.preventDefault();
                const keyword = elements.searchInput ? elements.searchInput.value.trim() : '';
                const location = elements.locationInput ? elements.locationInput.value.trim() : '';
                state.filters.keyword = keyword;
                state.filters.location = location;
                saveUserSearch(keyword, location);

                // Try semantic search first if there's a keyword and AIJobService available
                if (keyword && window.AIJobService) {
                    const btn = elements.searchButton;
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span><span>AI Searching...</span>';
                    btn.disabled = true;

                    try {
                        const result = await window.AIJobService.semanticSearch(keyword, location);
                        if (result.success && result.results.length > 0) {
                            // Merge semantic scores back into state.allJobs
                            const scoreMap = {};
                            result.results.forEach(j => {
                                scoreMap[String(j.id)] = j;
                            });
                            state.allJobs = state.allJobs.map(j => {
                                const ai = scoreMap[String(j.id)];
                                if (ai) {
                                    const resumeScore = (state.resumeScoreMap && state.resumeScoreMap[String(j.id)]) || 0;
                                    const searchScore = ai.searchScore || 0;
                                    const blended = state.isAIMatchLoaded ?
                                        Math.round(0.4 * resumeScore + 0.6 * searchScore) :
                                        searchScore;
                                    return {
                                        ...j,
                                        _searchScore: searchScore,
                                        aiMatchScore: searchScore,
                                        aiReasoning: ai.searchReason,
                                        _blendedScore: blended
                                    };
                                }
                                return j;
                            });
                            if (state.isAIMatchLoaded) {
                                var noticeEl = document.getElementById('search-blend-notice');
                                if (!noticeEl) {
                                    noticeEl = document.createElement('div');
                                    noticeEl.id = 'search-blend-notice';
                                    noticeEl.className = 'mb-3 flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2';
                                    noticeEl.innerHTML = '<span class="material-symbols-outlined text-sm">auto_awesome</span>\u00a0AI Blend: Resume (40%) + Search Relevance (60%)';
                                    var jrc = document.getElementById('job-results-container');
                                    if (jrc && jrc.parentNode) jrc.parentNode.insertBefore(noticeEl, jrc);
                                }
                            }
                            state.isSemanticSearch = true;
                            showToast(`🤖 AI found ${result.results.length} semantically matched jobs`, 'success');
                        } else {
                            // Fallback to keyword filter
                            state.isSemanticSearch = false;
                            if (!result.success) showToast('AI search unavailable — using keyword filter', 'error');
                        }
                    } catch (err) {
                        console.error('Semantic search failed, using keyword:', err);
                        state.isSemanticSearch = false;
                    } finally {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                    }
                } else {
                    state.isSemanticSearch = false;
                }

                applyFilters();
            });
        }

        const mainSearchIcon = document.getElementById('main-job-search-icon');
        if (mainSearchIcon) {
            mainSearchIcon.addEventListener('click', (e) => {
                if (e) e.preventDefault();
                state.filters.keyword = elements.searchInput ? elements.searchInput.value : '';
                state.filters.location = elements.locationInput ? elements.locationInput.value : '';
                saveUserSearch(state.filters.keyword, state.filters.location);
                applyFilters();
            });
        }

        // Enter key for search
        if (elements.searchInput) {
            elements.searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' && elements.searchButton) {
                    e.preventDefault();
                    elements.searchButton.click();
                }
            });
            // Also enable debounced live filtering (local)
            elements.searchInput.addEventListener('input', (e) => {
                state.filters.keyword = e.target.value.trim();
                debouncedApplyFilters();
            });
        }
        if (elements.locationInput) {
            elements.locationInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' && elements.searchButton) {
                    e.preventDefault();
                    elements.searchButton.click();
                }
            });
            // Also enable debounced live filtering (local)
            elements.locationInput.addEventListener('input', (e) => {
                state.filters.location = e.target.value.trim();
                debouncedApplyFilters();
            });
        }

        // AI Tab Search & Logic
        const aiSearchInput = document.getElementById('ai-job-search-input');
        const aiLocationInput = document.getElementById('ai-location-filter');
        const aiApplyFiltersBtn = document.getElementById('ai-apply-filters-btn');
        const aiSearchIcon = document.getElementById('ai-job-search-icon');
        const aiSalarySlider = document.getElementById('ai-salary-filter');
        const aiSalaryProgress = document.getElementById('ai-salary-progress');
        const aiSalaryThumb = document.getElementById('ai-salary-thumb');
        const aiSalaryValue = document.getElementById('ai-salary-value');
        const aiJobTypeContainer = document.getElementById('ai-job-type-filters');

        if (aiApplyFiltersBtn) {
            aiApplyFiltersBtn.addEventListener('click', (e) => {
                if (e) e.preventDefault();
                state.filters.keyword = aiSearchInput ? aiSearchInput.value : '';
                state.filters.location = aiLocationInput ? aiLocationInput.value : '';
                saveUserSearch(state.filters.keyword, state.filters.location);
                applyFilters();
            });
        }

        if (aiSearchIcon) {
            aiSearchIcon.addEventListener('click', (e) => {
                if (e) e.preventDefault();
                state.filters.keyword = aiSearchInput ? aiSearchInput.value : '';
                state.filters.location = aiLocationInput ? aiLocationInput.value : '';
                saveUserSearch(state.filters.keyword, state.filters.location);
                applyFilters();
            });
        }

        if (aiSearchInput) {
            aiSearchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' && aiApplyFiltersBtn) {
                    e.preventDefault();
                    aiApplyFiltersBtn.click();
                }
            });
            aiSearchInput.addEventListener('input', (e) => {
                state.filters.keyword = e.target.value.trim();
                debouncedApplyFilters();
            });
        }

        if (aiLocationInput) {
            aiLocationInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' && aiApplyFiltersBtn) {
                    e.preventDefault();
                    aiApplyFiltersBtn.click();
                }
            });
            aiLocationInput.addEventListener('input', (e) => {
                state.filters.location = e.target.value.trim();
                debouncedApplyFilters();
            });
        }

        if (aiSalarySlider) {
            aiSalarySlider.addEventListener('input', (e) => {
                const val = e.target.value;
                const percentage = (val / 250) * 100;

                if (aiSalaryProgress) aiSalaryProgress.style.width = `${percentage}%`;
                if (aiSalaryThumb) aiSalaryThumb.style.left = `${percentage}%`;
                if (aiSalaryValue) aiSalaryValue.textContent = val == 0 ? 'Any' : `$${val}k+`;
                
                // Live filter as sliding
                state.filters.salaryMin = parseInt(val);
                debouncedApplyFilters();
            });
        }

        if (aiJobTypeContainer) {
            aiJobTypeContainer.addEventListener('change', (e) => {
                if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                    const checked = Array.from(aiJobTypeContainer.querySelectorAll('input:checked')).map(c => c.value);
                    state.filters.jobTypes = checked;
                    applyFilters();
                }
            });
        }


        // AI Slider
        if (elements.aiSlider) {
            elements.aiSlider.addEventListener('input', (e) => {
                const val = e.target.value;
                if (elements.aiLabel) elements.aiLabel.textContent = `Min. ${val}% Match`;
                
                state.filters.minMatch = parseInt(val);
                debouncedApplyFilters();
            });
        }

        // Salary Slider
        if (elements.salarySlider) {
            elements.salarySlider.addEventListener('input', (e) => {
                const val = e.target.value;
                if (elements.salaryDisplay) elements.salaryDisplay.textContent = `$${val}k+`;
                
                state.filters.salaryMin = parseInt(val);
                debouncedApplyFilters();
            });
        }

        // Job Type Checkboxes (Delegation)
        if (elements.jobTypeContainer) {
            elements.jobTypeContainer.addEventListener('change', (e) => {
                if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                    const checked = Array.from(elements.jobTypeContainer.querySelectorAll('input:checked')).map(c => c.value);
                    state.filters.jobTypes = checked;
                    toggleClearButton('clear-job-type', checked.length > 0);
                    applyFilters();
                }
            });
        }

        // Industry Checkboxes (Delegation)
        if (elements.industryContainer) {
            elements.industryContainer.addEventListener('change', (e) => {
                if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                    const checked = Array.from(elements.industryContainer.querySelectorAll('input:checked')).map(c => c.value);
                    state.filters.industries = checked;
                    toggleClearButton('clear-industry', checked.length > 0);
                    applyFilters();
                }
            });
        }

        // Clear Buttons
        if (elements.clearAllFiltersBtn) elements.clearAllFiltersBtn.addEventListener('click', clearAllFilters);

        if (elements.clearJobTypeBtn) {
            elements.clearJobTypeBtn.addEventListener('click', () => {
                if (elements.jobTypeContainer) elements.jobTypeContainer.querySelectorAll('input').forEach(c => c.checked = false);
                state.filters.jobTypes = [];
                toggleClearButton('clear-job-type', false);
                applyFilters();
            });
        }

        if (elements.clearIndustryBtn) {
            elements.clearIndustryBtn.addEventListener('click', () => {
                if (elements.industryContainer) elements.industryContainer.querySelectorAll('input').forEach(c => c.checked = false);
                state.filters.industries = [];
                toggleClearButton('clear-industry', false);
                applyFilters();
            });
        }

        // --- External Tabs Filter Listeners
        const extSearchIcon = document.getElementById('ext-job-search-icon');
        if (elements.extSearchInput) {
            elements.extSearchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    state.filters.keyword = elements.extSearchInput.value;
                    saveUserSearch(state.filters.keyword, state.filters.location);
                    applyFilters();
                }
            });
        }
        if (extSearchIcon) {
            extSearchIcon.addEventListener('click', (e) => {
                if (e) e.preventDefault();
                state.filters.keyword = elements.extSearchInput ? elements.extSearchInput.value : '';
                saveUserSearch(state.filters.keyword, state.filters.location);
                applyFilters();
            });
        }
        if (elements.extLocationInput) {
            elements.extLocationInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    state.filters.location = elements.extLocationInput.value;
                    saveUserSearch(state.filters.keyword, state.filters.location);
                    applyFilters();
                }
            });
        }
        if (elements.extAiSlider) {
            elements.extAiSlider.addEventListener('input', (e) => {
                const val = e.target.value;
                if (elements.extAiLabel) elements.extAiLabel.textContent = `Min. ${val}% Match`;
            });
            elements.extAiSlider.addEventListener('change', (e) => {
                state.filters.minMatch = parseInt(e.target.value);
                applyFilters();
            });
        }
        if (elements.extJobTypeFilters) {
            elements.extJobTypeFilters.addEventListener('change', (e) => {
                if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                    const checked = Array.from(elements.extJobTypeFilters.querySelectorAll('input:checked')).map(c => c.value);
                    state.filters.jobTypes = checked;
                    applyFilters();
                }
            });
        }

        const aiClearFiltersBtn = document.getElementById('ai-clear-filters');
        if (aiClearFiltersBtn) {
            aiClearFiltersBtn.addEventListener('click', clearAllFilters);
        }

        // Show More Industries
        if (elements.showMoreIndustriesBtn && elements.extraIndustriesDiv) {
            elements.showMoreIndustriesBtn.addEventListener('click', () => {
                const isHidden = elements.extraIndustriesDiv.classList.contains('hidden');
                if (isHidden) {
                    elements.extraIndustriesDiv.classList.remove('hidden');
                    elements.showMoreIndustriesBtn.innerHTML = 'Show less <span class="material-symbols-outlined text-sm">expand_less</span>';
                } else {
                    elements.extraIndustriesDiv.classList.add('hidden');
                    elements.showMoreIndustriesBtn.innerHTML = 'Show more <span class="material-symbols-outlined text-sm">expand_more</span>';
                }
            });
        }



        const extPlatformCbs = ['ext-filter-all', 'ext-filter-linkedin', 'ext-filter-indeed', 'ext-filter-naukri'].map(id => document.getElementById(id)).filter(Boolean);

        extPlatformCbs.forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Check this one, uncheck others (radio behavior)
                    extPlatformCbs.forEach(c => {
                        if (c !== e.target) c.checked = false;
                    });
                    state.filters.extPlatform = e.target.value;
                    applyFilters();
                } else if (!extPlatformCbs.some(c => c.checked)) {
                    // If all unchecked, force "All Platforms" to be checked
                    const allCb = document.getElementById('ext-filter-all');
                    if (allCb) {
                        allCb.checked = true;
                        state.filters.extPlatform = 'All Platforms';
                        applyFilters();
                    }
                }
            });
        });

        // Mobile Menu Config
        // Mobile menu logic removed (moved to navbar.js)
    }

    function toggleClearButton(id, visible) {
        const btn = document.getElementById(id);
        if (btn) {
            if (visible) btn.classList.remove('hidden');
            else btn.classList.add('hidden');
        }
    }

    function clearAllFilters() {
        // Reset Inputs
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.locationInput) elements.locationInput.value = '';

        if (elements.aiSlider) {
            elements.aiSlider.value = 0;
            if (elements.aiLabel) elements.aiLabel.textContent = 'Min. 0% Match';
        }

        if (elements.salarySlider) {
            elements.salarySlider.value = 0;
            if (elements.salaryDisplay) elements.salaryDisplay.textContent = '$0k+';
        }

        // AI Filters Reset
        const aiSearchInput = document.getElementById('ai-job-search-input');
        const aiLocationInput = document.getElementById('ai-location-filter');
        const aiSalarySlider = document.getElementById('ai-salary-filter');
        const aiSalaryProgress = document.getElementById('ai-salary-progress');
        const aiSalaryThumb = document.getElementById('ai-salary-thumb');
        const aiSalaryValue = document.getElementById('ai-salary-value');

        if (aiSearchInput) aiSearchInput.value = '';
        if (aiLocationInput) aiLocationInput.value = '';
        if (aiSalarySlider) {
            aiSalarySlider.value = 0;
            if (aiSalaryProgress) aiSalaryProgress.style.width = '0%';
            if (aiSalaryThumb) aiSalaryThumb.style.left = '0%';
            if (aiSalaryValue) aiSalaryValue.textContent = 'Any';
        }

        // External Filters Reset
        const extSearchInput = document.getElementById('ext-job-search-input');
        const extLocationInput = document.getElementById('ext-location-filter');
        if (extSearchInput) extSearchInput.value = '';
        if (extLocationInput) extLocationInput.value = '';

        // Uncheck all checkboxes (exclude external platform filters)
        document.querySelectorAll('input[type="checkbox"]').forEach(c => {
            if (!c.id.startsWith('ext-filter-')) {
                c.checked = false;
            }
        });

        // Reset external platforms visually
        document.querySelectorAll('input[id^="ext-filter-"]').forEach(c => c.checked = false);
        const allExtCb = document.getElementById('ext-filter-all');
        if (allExtCb) allExtCb.checked = true;

        // Reset State
        state.filters = {
            keyword: '',
            location: '',
            minMatch: 0, // Reset to 0 not 80 to show all initially
            jobTypes: [],
            salaryMin: 0,
            industries: [],
            extPlatform: 'All Platforms'
        };

        // Hide Clear Btns
        toggleClearButton('clear-job-type', false);
        toggleClearButton('clear-industry', false);
        toggleClearButton('ai-clear-filters', false);

        applyFilters();
        showToast('All filters cleared', 'success');
    }



    // --- Init ---
    setupEventListeners();
    await fetchJobs();

    // ── Expose globals for cross-script access (AI tab, HTML inline scripts) ──
    window.AdvancedJobSearch = {
        getState: () => state,
        applyFilters,
        showToast,
        renderJobs
    };
    window.renderAIJobs = renderAIJobs;

    // ════════════════════════════════════════════════════════════
    // DYNAMIC GAP ANALYSIS POPULATION
    // ════════════════════════════════════════════════════════════
    window.populateGapAnalysis = function (job) {
        if (!job) return;

        // 1. Update Title
        const titleEl = document.getElementById('gap-analysis-title');
        if (titleEl) titleEl.textContent = `${job.title} at ${job.company}`;

        // 2. Generate Random/Pseudo-random scores based on MatchScore for realism
        const baseScore = job.matchScore || 75;
        let keywordMatch = Math.min(100, Math.max(0, baseScore - 15 + Math.floor(Math.random() * 30)));
        let skillCoverage = Math.min(100, Math.max(0, baseScore - 10 + Math.floor(Math.random() * 20)));
        let expFit = Math.min(100, Math.max(0, baseScore - 5 + Math.floor(Math.random() * 15)));

        // Update Progress Bars & Text
        const kwText = document.getElementById('gap-keyword-match-text');
        const kwBar = document.getElementById('gap-keyword-match-bar');
        if (kwText) kwText.textContent = `${keywordMatch}%`;
        if (kwBar) {
            kwBar.style.width = `${keywordMatch}%`;
            kwBar.className = `bg-amber-500 h-2 rounded-full transition-all duration-1000 ${keywordMatch >= 80 ? 'bg-emerald-500' : keywordMatch >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`;
            kwText.className = `font-bold ${keywordMatch >= 80 ? 'text-emerald-600' : keywordMatch >= 60 ? 'text-amber-600' : 'text-rose-600'}`;
        }

        const scText = document.getElementById('gap-skill-coverage-text');
        const scBar = document.getElementById('gap-skill-coverage-bar');
        if (scText) scText.textContent = `${skillCoverage}%`;
        if (scBar) {
            scBar.style.width = `${skillCoverage}%`;
            scBar.className = `bg-blue-500 h-2 rounded-full transition-all duration-1000 ${skillCoverage >= 80 ? 'bg-blue-500' : skillCoverage >= 60 ? 'bg-blue-400' : 'bg-rose-500'}`;
            scText.className = `font-bold ${skillCoverage >= 80 ? 'text-blue-600' : skillCoverage >= 60 ? 'text-blue-500' : 'text-rose-600'}`;
        }

        const efText = document.getElementById('gap-experience-fit-text');
        const efBar = document.getElementById('gap-experience-fit-bar');
        if (efText) efText.textContent = `${expFit}%`;
        if (efBar) {
            efBar.style.width = `${expFit}%`;
            efBar.className = `bg-emerald-500 h-2 rounded-full transition-all duration-1000 ${expFit >= 80 ? 'bg-emerald-500' : expFit >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`;
            efText.className = `font-bold ${expFit >= 80 ? 'text-emerald-600' : expFit >= 60 ? 'text-amber-600' : 'text-rose-600'}`;
        }

        // 3. Update AI Verdict
        const verdictEl = document.getElementById('gap-ai-verdict');
        if (verdictEl) {
            if (baseScore >= 90) {
                verdictEl.innerHTML = `<strong>AI Verdict:</strong> Exceptional match! Apply immediately. Your profile strongly aligns with their core requirements.`;
            } else if (baseScore >= 75) {
                verdictEl.innerHTML = `<strong>AI Verdict:</strong> Apply confidently. Your overall profile is strong. Detail your past projects to offset any minor gaps.`;
            } else {
                verdictEl.innerHTML = `<strong>AI Verdict:</strong> Good potential, but consider upskilling in missing areas or addressing gaps explicitly in your cover letter.`;
            }
        }

        // 4. Update Eligibility Rows Dynamically
        const rowsContainer = document.getElementById('gap-analysis-eligibility-rows');
        if (rowsContainer) {
            rowsContainer.innerHTML = ''; // Clear default rows

            // Create some dynamic rows
            const rowsData = [{
                icon: 'work_history',
                title: 'Experience Level',
                desc: expFit >= 80 ? `Your experience strongly aligns with this ${job.type || 'Full-time'} role.` : `Slight gap in expected tenure for this level.`,
                statusText: expFit >= 80 ? '✓ Met' : 'Review',
                statusColor: expFit >= 80 ? 'emerald' : 'amber'
            },
            {
                icon: 'location_on',
                title: 'Location Match',
                desc: `Job is located in ${job.location || 'Remote'}.`,
                statusText: '✓ Met',
                statusColor: 'emerald'
            }
            ];

            if (job.tags && job.tags.length > 0) {
                rowsData.push({
                    icon: 'check_circle',
                    title: 'Key Skill Validation',
                    desc: `Your profile features ${job.tags[0]}, which is highly relevant here.`,
                    statusText: '✓ Met',
                    statusColor: 'emerald'
                });
            } else {
                rowsData.push({
                    icon: 'cancel',
                    title: 'Specific Tooling',
                    desc: `Certain niche tools mentioned might be missing from your resume.`,
                    statusText: 'Missing',
                    statusColor: 'rose'
                });
            }

            rowsData.forEach(row => {
                const colorMap = {
                    emerald: {
                        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
                        border: 'border-emerald-100',
                        text: 'text-emerald-600',
                        badgeBg: 'bg-emerald-100'
                    },
                    amber: {
                        bg: 'bg-amber-50 dark:bg-amber-900/10',
                        border: 'border-amber-100',
                        text: 'text-amber-600',
                        badgeBg: 'bg-amber-100'
                    },
                    rose: {
                        bg: 'bg-rose-50 dark:bg-rose-900/10',
                        border: 'border-rose-100',
                        text: 'text-rose-600',
                        badgeBg: 'bg-rose-100'
                    },
                    blue: {
                        bg: 'bg-blue-50 dark:bg-blue-900/10',
                        border: 'border-blue-100',
                        text: 'text-blue-600',
                        badgeBg: 'bg-blue-100'
                    },
                };
                const theme = colorMap[row.statusColor];

                const rowEl = document.createElement('div');
                rowEl.className = `flex items-center gap-4 p-3 rounded-xl ${theme.bg} border ${theme.border}`;
                rowEl.innerHTML = `
                  <span class="material-symbols-outlined ${theme.text}">${row.icon}</span>
                  <div>
                    <p class="font-bold text-sm">${row.title}</p>
                    <p class="text-xs text-slate-500">${row.desc}</p>
                  </div>
                  <span class="ml-auto text-xs font-bold ${theme.text} ${theme.badgeBg} px-2 py-1 rounded-full">${row.statusText}</span>
                `;
                rowsContainer.appendChild(rowEl);
            });
        }
    };


    // --- Resume-Linked Banner (Issue 2) ---
    function renderResumeBanner() {
        var targets = [
            document.getElementById('job-results-container'),
            document.getElementById('ai-job-results-container')
        ].filter(Boolean);
        if (!targets.length) return;

        var user;
        try {
            user = JSON.parse(localStorage.getItem('user') || '{}');
        } catch (e) {
            user = {};
        }
        if (!user || !(user.email || user.googleId)) return;

        var resumes = user.uploadedResumes || [];
        var activeId = user.activeResumeId;
        var activeResume = resumes.find(function (r) {
            return r.id === activeId;
        }) || resumes[resumes.length - 1];

        document.querySelectorAll('#resume-link-banner').forEach(function (el) {
            el.remove();
        });

        if (!activeResume) {
            var banner = _buildResumeBanner('warning',
                'No resume uploaded',
                'Upload a resume to enable AI-powered job matching based on your skills.',
                '<a href="../../JobSeeker/Profile/resume_upload_&_validation_center.html" class="ml-auto shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">Upload Resume</a>'
            );
            if (targets[0] && targets[0].parentNode) {
                targets[0].parentNode.insertBefore(banner, targets[0]);
            }
            return;
        }

        var skills = [];
        if (activeResume.extractedDetails && activeResume.extractedDetails.skills && activeResume.extractedDetails.skills.length) {
            skills = activeResume.extractedDetails.skills;
        } else if (activeResume.atsAnalysis && activeResume.atsAnalysis.matched_keywords && activeResume.atsAnalysis.matched_keywords.length) {
            skills = activeResume.atsAnalysis.matched_keywords;
        } else if (activeResume.extractedSkills && activeResume.extractedSkills.length) {
            skills = activeResume.extractedSkills;
        }

        var filename = activeResume.filename || 'Resume';
        var shortName = filename.length > 28 ? '...' + filename.slice(-26) : filename;

        if (activeResume.normalATS && skills.length > 0) {
            targets.forEach(function (t) {
                if (!t.parentNode) return;
                var existing = t.parentNode.querySelector('#resume-link-banner');
                if (!existing) {
                    var b = _buildResumeBanner('success',
                        'Resume Linked — ' + shortName,
                        'AI matching active using ' + skills.length + ' extracted skills from this resume.',
                        '<a href="../../JobSeeker/Profile/resume_insights.html" class="ml-auto shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors">View Insights</a>'
                    );
                    t.parentNode.insertBefore(b, t);
                }
            });
        } else {
            targets.forEach(function (t) {
                if (!t.parentNode) return;
                var existing = t.parentNode.querySelector('#resume-link-banner');
                if (!existing) {
                    var b = _buildResumeBanner('info',
                        'Resume uploaded: ' + shortName,
                        'Run ATS analysis once to enable skill-based AI job matching.',
                        '<a href="../../JobSeeker/Profile/resume_insights.html" class="ml-auto shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">Run ATS Analysis</a>'
                    );
                    t.parentNode.insertBefore(b, t);
                }
            });
        }
    }

    function _buildResumeBanner(type, title, subtitle, actionHtml) {
        var configs = {
            success: {
                bg: 'bg-emerald-50 dark:bg-emerald-900/15',
                border: 'border-emerald-200 dark:border-emerald-700',
                icon: 'check_circle',
                iconColor: 'text-emerald-500'
            },
            info: {
                bg: 'bg-blue-50 dark:bg-blue-900/15',
                border: 'border-blue-200 dark:border-blue-700',
                icon: 'info',
                iconColor: 'text-blue-500'
            },
            warning: {
                bg: 'bg-amber-50 dark:bg-amber-900/15',
                border: 'border-amber-200 dark:border-amber-700',
                icon: 'warning',
                iconColor: 'text-amber-500'
            }
        };
        var c = configs[type] || configs.info;
        var div = document.createElement('div');
        div.id = 'resume-link-banner';
        div.className = 'flex items-center gap-3 ' + c.bg + ' border ' + c.border + ' rounded-xl px-4 py-3 mb-4 text-sm';
        div.innerHTML = '<span class="material-symbols-outlined ' + c.iconColor + ' text-xl shrink-0">' + c.icon + '</span>' +
            '<div class="flex-1 min-w-0">' +
            '<p class="font-bold text-slate-800 dark:text-slate-200 truncate">' + title + '</p>' +
            '<p class="text-xs text-slate-500 dark:text-slate-400">' + subtitle + '</p>' +
            '</div>' + actionHtml;
        return div;
    }

    // ────────────────────────────────────────────────────────────────────────────
    // autoLoadResumeScores — silently fetches AI scores so Browse Jobs AI slider works
    // ────────────────────────────────────────────────────────────────────────────
    async function autoLoadResumeScores() {
        if (!window.AIJobService) return;
        if (state.isAIMatchLoaded) return; // already loaded

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || (!user.email && !user.googleId)) return;

        try {
            const result = await window.AIJobService.loadSemanticMatches();
            if (result && result.success && result.jobs) {
                state.resumeScoreMap = {};
                if (!window._aiJobDataCache) window._aiJobDataCache = {};

                result.jobs.forEach(match => {
                    const sid = String(match.id);
                    state.resumeScoreMap[sid] = match.score || match.aiMatchScore || 0;
                    window._aiJobDataCache[sid] = {
                        aiReasoning: match.reasoning || match.aiReasoning || ''
                    };
                });

                // Merge into existing jobs quietly
                state.allJobs = state.allJobs.map(j => {
                    const sid = String(j.id);
                    const aiScore = state.resumeScoreMap[sid];
                    const matchObj = result.jobs.find(m => String(m.id) === sid);
                    if (aiScore !== undefined) {
                        return {
                            ...j,
                            aiMatchScore: aiScore,
                            aiReasoning: matchObj ? (matchObj.reasoning || matchObj.aiReasoning || '') : '',
                            aiWhyFit: matchObj ? (matchObj.why_fit || matchObj.aiWhyFit || '') : ''
                        };
                    }
                    return j;
                });
                state.isAIMatchLoaded = true;

                // If they have an active AI slider filter, dynamically re-render
                if (state.filters.minMatch > 0) {
                    applyFilters();
                }
            }
        } catch (e) {
            console.warn('[AutoLoadScores] Failed to auto-load semantic match scores:', e);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // initAIMatchTab — loads real resume-based AI scores into AI Matches tab
    // ────────────────────────────────────────────────────────────────────────────
    async function initAIMatchTab() {
        const container = document.getElementById('ai-job-results-container');
        if (!container) return;

        // If already loaded, just re-render (respecting current filters)
        if (state.isAIMatchLoaded) {
            renderAIJobs(state.allJobs.filter(j => !j.isExternal));
            return;
        }

        // ── Issue 2/4: Automatically load if user visits AI tab (cached via localStorage)
        let hasCache = false;
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                const u = JSON.parse(raw);
                let r = null;
                if (u.uploadedResumes && u.uploadedResumes.length > 0) {
                    r = u.uploadedResumes.find(x => x.id === u.activeResumeId) || u.uploadedResumes[u.uploadedResumes.length - 1];
                }
                if (r && localStorage.getItem('ai_match_cache_' + r.id)) hasCache = true;
            }
        } catch(e) {}

        if (!hasCache && !container.dataset.userRequestedAI) {
            container.innerHTML = `
                <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div class="size-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-4xl text-blue-500">psychology</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">AI Resume Matching</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
                        Click below to find jobs matched to your resume. This uses AI and runs on-demand to save resources.
                    </p>
                    <button
                        id="btn-find-ai-matches"
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2"
                    >
                        <span class="material-symbols-outlined">auto_awesome</span>
                        Find AI Matches
                    </button>
                </div>`;

            const btn = document.getElementById('btn-find-ai-matches');
            if (btn) {
                btn.addEventListener('click', () => {
                    container.dataset.userRequestedAI = '1';
                    initAIMatchTab();
                });
            }
            return;
        }

        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                    <span class="material-symbols-outlined text-3xl text-blue-500">psychology</span>
                </div>
                <p class="font-bold text-slate-700 dark:text-slate-300">Loading AI job matches from your resume…</p>
                <p class="text-sm text-slate-400">Analyzing skills, experience and best-fit roles</p>
                <div class="flex gap-1 mt-2">
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:0ms"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:150ms"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:300ms"></div>
                </div>
            </div>`;

        if (!window.AIJobService) {
            container.innerHTML = '<div class="py-16 text-center text-slate-400">AI service unavailable.</div>';
            return;
        }

        const result = await window.AIJobService.loadSemanticMatches();

        if (!result.success) {
            let actionBtn = '<a href="../../JobSeeker/Profile/resume_upload_&_validation_center.html" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">Upload Resume</a>';
            if (result.error && result.error.includes("ATS Analysis")) {
                actionBtn = '<a href="../../JobSeeker/Profile/resume_insights.html" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">Run ATS Analysis</a>';
            }
            container.innerHTML = `
                <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                    <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">AI Matching Not Ready</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-4">${result.error || 'Upload and analyze a resume to enable AI matching.'}</p>
                    ${actionBtn}
                </div>`;
            return;
        }

        // Build resume score map and cache reasoning + why_fit
        state.resumeScoreMap = {};
        if (!window._aiJobDataCache) window._aiJobDataCache = {};
        result.jobs.forEach(match => {
            const sid = String(match.id);
            state.resumeScoreMap[sid] = match.score || match.aiMatchScore || 0;
            window._aiJobDataCache[sid] = {
                aiReasoning: match.reasoning || match.aiReasoning || '',
                aiWhyFit:    match.aiWhyFit || match.why_fit || ''
            };
        });

        // Merge AI scores back into allJobs (including aiWhyFit — Issue 3)
        state.allJobs = state.allJobs.map(j => {
            const sid = String(j.id);
            const aiScore = state.resumeScoreMap[sid];
            const matchObj = result.jobs.find(m => String(m.id) === sid);
            if (aiScore !== undefined) {
                return {
                    ...j,
                    aiMatchScore: aiScore,
                    aiReasoning: matchObj ? (matchObj.reasoning || matchObj.aiReasoning || '') : '',
                    aiWhyFit:    matchObj ? (matchObj.aiWhyFit || matchObj.why_fit || '') : '',
                    aiMatchedSkills: matchObj ? (matchObj.aiMatchedSkills || matchObj.matched_skills || []) : [],
                    aiMissingSkills: matchObj ? (matchObj.aiMissingSkills || matchObj.missing_skills || []) : []
                };
            }
            return j;
        });

        state.isAIMatchLoaded = true;

        // Show tier fallback notice if applicable
        if (result.tier && result.tier !== 'ai' && result.notice) {
            if (!document.getElementById('ai-tier-notice')) {
                const notice = document.createElement('div');
                notice.id = 'ai-tier-notice';
                notice.className = 'mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-medium flex items-start gap-2';
                notice.innerHTML = '<span class="material-symbols-outlined text-base shrink-0">info</span><span>' + result.notice + '</span>';
                if (container.parentNode) container.parentNode.insertBefore(notice, container);
            }
        }

        const goodMatches = result.jobs.filter(j => (j.score || j.aiMatchScore || 0) >= 50).length;
        showToast('AI matched ' + goodMatches + ' relevant jobs for your resume', 'success');
        renderAIJobs(state.allJobs.filter(j => !j.isExternal));
        console.log('[AI Tab] Loaded', result.jobs.length, 'jobs. Tier:', result.tier || 'ai');
    }

    // ─── Global: open reasoning drawer without fragile inline JSON ───────────
    window.openAIJobReasoning = function (jobId, displayScore) {
        const stRef = window.AdvancedJobSearch ? window.AdvancedJobSearch.getState() : null;
        const job = stRef ? stRef.allJobs.find(j => String(j.id) === String(jobId)) : null;
        const cached = window._aiJobDataCache && window._aiJobDataCache[jobId];
        const reasoning = cached ? cached.aiReasoning : (job ? job.aiReasoning : null);
        if (typeof openReasoning === 'function') {
            openReasoning((job ? job.company : '') + (reasoning ? ': ' + reasoning : ''), job ? job.title : '', displayScore || 0, jobId);
        }
        if (typeof window.populateGapAnalysis === 'function' && job) window.populateGapAnalysis(job);
        if (typeof window.updateReasoningDrawer === 'function') window.updateReasoningDrawer(jobId);
    };

    window.updateReasoningDrawer = function(jobId) {
        const cached = window._aiJobDataCache && window._aiJobDataCache[jobId];
        const whyFitText = cached && cached.aiWhyFit ? cached.aiWhyFit : (cached && cached.aiReasoning ? cached.aiReasoning : "No detailed insights found for this profile match.");
        
        const whyFitEl = document.getElementById('drawer-why-fit');
        if (whyFitEl) whyFitEl.innerHTML = whyFitText;

        const skillsContainer = document.getElementById('drawer-skill-analysis');
        if (skillsContainer) {
            skillsContainer.innerHTML = '<h4 class="font-bold text-sm border-b border-slate-100 pb-2">Skill Analysis</h4>';
            
            const stRef = window.AdvancedJobSearch ? window.AdvancedJobSearch.getState() : null;
            const job = stRef ? stRef.allJobs.find(j => String(j.id) === String(jobId)) : null;

            if (job && job.aiMatchedSkills && job.aiMatchedSkills.length > 0) {
                job.aiMatchedSkills.forEach(skill => {
                    skillsContainer.innerHTML += `
                    <div class="flex items-start gap-3">
                        <div class="size-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <span class="material-symbols-outlined text-sm">check</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold">${skill}</p>
                            <p class="text-xs text-slate-500">Matched requirement.</p>
                        </div>
                    </div>`;
                });
            }
            if (job && job.aiMissingSkills && job.aiMissingSkills.length > 0) {
                job.aiMissingSkills.forEach(skill => {
                    skillsContainer.innerHTML += `
                    <div class="flex items-start gap-3 opacity-70">
                        <div class="size-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <span class="material-symbols-outlined text-sm">priority_high</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold">${skill}</p>
                            <p class="text-xs text-slate-500">Desired but not required.</p>
                        </div>
                    </div>`;
                });
            }
        }
    };

    window.populateGapAnalysis = function(job) {
        if (!job) return;
        
        const titleEl = document.getElementById('gap-analysis-title');
        if (titleEl) titleEl.textContent = job.title + ' at ' + job.company;

        const rowsEl = document.getElementById('gap-analysis-eligibility-rows');
        if (rowsEl) {
            let matchesHTML = '';
            
            if (job.aiMatchedSkills && job.aiMatchedSkills.length > 0) {
                matchesHTML += `
                <div class="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                    <span class="material-symbols-outlined text-emerald-500 mt-0.5">verified</span>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-800 dark:text-slate-200">Matching Skills</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Your resume aligns well: ${job.aiMatchedSkills.slice(0, 5).join(', ')}.</p>
                    </div>
                    <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">check</span> Met
                    </span>
                </div>`;
            } else {
                matchesHTML += `
                <div class="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                    <span class="material-symbols-outlined text-emerald-500 mt-0.5">work_history</span>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-800 dark:text-slate-200">Experience Level</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Your experience aligns with this ${job.type || 'Full-time'} role.</p>
                    </div>
                    <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">check</span> Met
                    </span>
                </div>`;
            }

            if (job.aiMissingSkills && job.aiMissingSkills.length > 0) {
                matchesHTML += `
                <div class="flex items-start gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800">
                    <span class="material-symbols-outlined text-amber-500 mt-0.5">error_outline</span>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-800 dark:text-slate-200">Skills to Improve</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Recommended to learn: ${job.aiMissingSkills.slice(0, 3).join(', ')}.</p>
                    </div>
                    <span class="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">close</span> Gap
                    </span>
                </div>`;
            } else {
                matchesHTML += `
                <div class="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                    <span class="material-symbols-outlined text-emerald-500 mt-0.5">location_on</span>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-800 dark:text-slate-200">Location Match</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Job is located in ${job.location || 'Remote'}.</p>
                    </div>
                    <span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">check</span> Met
                    </span>
                </div>`;
            }

            rowsEl.innerHTML = matchesHTML;
        }

        const skillScore = Math.min(100, Math.max(0, job.aiMatchScore || 80));
        const keyScore = Math.min(100, Math.max(0, skillScore - 15));
        
        const keyText = document.getElementById('gap-keyword-match-text');
        const keyBar = document.getElementById('gap-keyword-match-bar');
        if(keyText) keyText.textContent = keyScore + "%";
        if(keyBar) keyBar.style.width = keyScore + "%";

        const skillText = document.getElementById('gap-skill-coverage-text');
        const skillBar = document.getElementById('gap-skill-coverage-bar');
        if(skillText) skillText.textContent = skillScore + "%";
        if(skillBar) skillBar.style.width = skillScore + "%";

        const expText = document.getElementById('gap-experience-fit-text');
        const expBar = document.getElementById('gap-experience-fit-bar');
        if(expText) expText.textContent = "100%";
        if(expBar) expBar.style.width = "100%";

        const verdictEl = document.getElementById('gap-ai-verdict');
        const cached = window._aiJobDataCache && window._aiJobDataCache[job.id];
        const reasoning = cached && cached.aiWhyFit ? cached.aiWhyFit : "Excellent match overall.";
        if (verdictEl) {
            verdictEl.innerHTML = '<strong>AI Verdict:</strong> ' + reasoning;
        }
    };

    // ─── Global: navigate to apply without fragile inline JSON ───────────────
    window.applyToAIJob = async function (jobId, displayScore) {
        const stRef = window.AdvancedJobSearch ? window.AdvancedJobSearch.getState() : null;
        const job = stRef ? stRef.allJobs.find(j => String(j.id) === String(jobId)) : null;
        if (window.AIJobService && job) await window.AIJobService.recordApplication(job);
        
        localStorage.setItem('recent_job_view', JSON.stringify({
            title: job ? job.title : '',
            company: job ? job.company : '',
            matchScore: displayScore,
            aiMatchScore: displayScore,
            aiWhyFit: job ? (job.aiWhyFit || job.aiReasoning || '') : '',
            aiMatchedSkills: job ? (job.aiMatchedSkills || []) : [],
            aiMissingSkills: job ? (job.aiMissingSkills || []) : [],
            tags: job ? (job.tags || []) : [],
            isExternal: job ? (!!job.isExternal) : false,
            platform: job ? (job.platform || '') : '',
            url: job ? job.url : null
        }));
        window.location.href = '../../JobSeeker/Insights/job_details_&_match_breakdown.html';
    };

    // --- Initialize Data ---
    fetchJobs().then(function () {
        setTimeout(renderResumeBanner, 150);
        // Auto-load resume scores in background to fix Browse Jobs AI slider accuracy
        setTimeout(autoLoadResumeScores, 500);

        try {
            var urlParams = new URLSearchParams(window.location.search);
            var tabParam = urlParams.get('tab');
            var qParam = urlParams.get('q');
            var locParam = urlParams.get('location');

            if (qParam) {
                state.filters.keyword = qParam;
                if (elements.searchInput) elements.searchInput.value = qParam;
            }
            if (locParam) {
                state.filters.location = locParam;
                if (elements.locationInput) elements.locationInput.value = locParam;
            }
            if (qParam || locParam) {
                applyFilters();
            }

            // ── Issue 2/4: Manual Refresh for AI Matches ──
            window.refreshAIMatches = async function() {
                try {
                    const raw = localStorage.getItem('user');
                    if (!raw) return;
                    const u = JSON.parse(raw);
                    const activeId = u.activeResumeId || (u.uploadedResumes && u.uploadedResumes[0]?.id);
                    if (!activeId) {
                        showToast('Please upload a resume first.', 'error');
                        return;
                    }

                    // Clear the persistent cache
                    localStorage.removeItem('ai_match_cache_' + activeId);
                    state.isAIMatchLoaded = false;
                    
                    // Mark that user explicitly requested it
                    const c = document.getElementById('ai-job-results-container');
                    if (c) c.dataset.userRequestedAI = 'true';

                    showToast('Refreshing AI matches...', 'info');
                    await initAIMatchTab();
                } catch(e) {
                    console.error('Refresh failed:', e);
                    showToast('Could not refresh matches.', 'error');
                }
            };

            var resultsEl = document.getElementById('job-results-container');
            if (resultsEl) {
                setTimeout(function () {
                    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }

            // Do NOT auto-trigger AI Matches on page load — Issue 2: lazy-load only
            if (tabParam === 'external-jobs') {
                setTimeout(initExternalJobsTab, 400);
            }
        } catch (e) {
            console.error('Init error:', e);
        }
    }).catch(function (error) {
        console.error('Failed to initialize jobs:', error);
    });

    // Hook AI Matches tab button to show lazy-load CTA when clicked
    setTimeout(function () {
        document.querySelectorAll('[data-tab], button, a').forEach(function (el) {
            var tabAttr = el.getAttribute('data-tab') || '';
            var txt = (el.textContent || '').toLowerCase();
            var oc = el.getAttribute('onclick') || '';
            // AI Matches tab hook — only show CTA, don't auto-load
            if (tabAttr === 'ai-matches' || txt.includes('ai match') ||
                oc.includes('ai-matches') || oc.includes('aiMatches')) {
                el.addEventListener('click', function () {
                    // If already loaded, just re-render; otherwise show the CTA
                    if (state.isAIMatchLoaded) {
                        setTimeout(() => renderAIJobs(state.allJobs.filter(j => !j.isExternal)), 200);
                    } else {
                        // Show CTA without triggering auto-load
                        const c = document.getElementById('ai-job-results-container');
                        if (c && !c.dataset.userRequestedAI) {
                            setTimeout(initAIMatchTab, 200); // initAIMatchTab now shows CTA first
                        }
                    }
                });
            }
            // External Jobs tab hook
            if (tabAttr === 'external-jobs' || txt.includes('external job') ||
                oc.includes('external-jobs') || oc.includes('externalJobs')) {
                el.addEventListener('click', function () {
                    setTimeout(initExternalJobsTab, 200);
                });
            }
        });
    }, 800);

    // ─── initExternalJobsTab — fetch real crawled jobs when External Jobs tab is clicked ───
    async function initExternalJobsTab() {
        const container = document.getElementById('external-job-results-container');
        if (!container) return;

        // Show loading spinner
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <div class="size-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center animate-pulse">
                    <span class="material-symbols-outlined text-3xl text-blue-500">public</span>
                </div>
                <p class="font-bold text-slate-700 dark:text-slate-300">Searching external job sites…</p>
                <p class="text-sm text-slate-400">Crawling Naukri, Indeed, Internshala, Wellfound</p>
                <div class="flex gap-1 mt-2">
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:0ms"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:150ms"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:300ms"></div>
                </div>
            </div>`;

        // Get query from current search filters
        const query = state.filters.keyword || '';
        const location = state.filters.location || '';

        if (!window.AIJobService) {
            container.innerHTML = '<div class="py-16 text-center text-slate-400">External job service unavailable. Ensure backend is running.</div>';
            return;
        }

        const result = await window.AIJobService.fetchExternalJobs(query, location);

        if (!result.success || !result.jobs || result.jobs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">public_off</span>
                    <h3 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No External Jobs Found</h3>
                    <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-4">${result.error || 'Try a different search keyword or check your internet connection.'}</p>
                </div>`;
            return;
        }

        // Store in state and render
        state.externalJobs = result.jobs;
        state.isExtLoaded = true;
        state.extCurrentPage = 1;

        const cached = result.from_cache;
        showToast(
            cached
                ? `Loaded ${result.total} cached external jobs`
                : `Found ${result.total} live external jobs across 4 platforms`,
            'success'
        );

        window.renderExternalJobs(result.jobs);
    }

    // ─── Job Comparison Logic ───
    window.selectedCompareJobs = [];

    window.toggleJobCompare = function (checkboxEl, title, company, url, platform) {
        if (checkboxEl.checked) {
            if (window.selectedCompareJobs.length >= 5) {
                showToast('You can only compare up to 5 jobs at a time.', 'error');
                checkboxEl.checked = false;
                return;
            }
            window.selectedCompareJobs.push({ title, company, url, platform });
        } else {
            window.selectedCompareJobs = window.selectedCompareJobs.filter(j => j.url !== url);
        }
        updateCompareActionBar();
    };

    function updateCompareActionBar() {
        const bar = document.getElementById('compare-action-bar');
        const count = document.getElementById('compare-count');
        if (!bar || !count) return;

        count.textContent = window.selectedCompareJobs.length;
        if (window.selectedCompareJobs.length > 0) {
            bar.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
            bar.classList.add('translate-y-0', 'opacity-100');
        } else {
            bar.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
            bar.classList.remove('translate-y-0', 'opacity-100');
        }
    }

    window.closeComparisonModal = function () {
        const modal = document.getElementById('comparison-modal');
        const content = document.getElementById('comparison-modal-content');
        if (!modal || !content) return;
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    window.openComparisonModal = function () {
        const modal = document.getElementById('comparison-modal');
        const content = document.getElementById('comparison-modal-content');
        if (!modal || !content) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // prompt reflow
        void modal.offsetWidth;
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    };

    // Attach event listener to Compare Now button
    setTimeout(() => {
        const btnCompare = document.getElementById('btn-compare-jobs');
        if (btnCompare) {
            btnCompare.addEventListener('click', async () => {
                if (window.selectedCompareJobs.length < 2) {
                    showToast('Please select at least 2 jobs to compare.', 'error');
                    return;
                }
                window.openComparisonModal();
                const modalBody = document.getElementById('comparison-modal-body');

                modalBody.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-20 gap-4">
                        <div class="size-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center animate-pulse">
                            <span class="material-symbols-outlined text-3xl text-blue-500">auto_awesome</span>
                        </div>
                        <p class="font-bold text-slate-700 dark:text-slate-300">AI is analyzing ${window.selectedCompareJobs.length} jobs...</p>
                        <p class="text-sm text-slate-400">Extracting details and generating comparison</p>
                        <div class="flex gap-1 mt-2">
                            <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:0ms"></div>
                            <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:150ms"></div>
                            <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style="animation-delay:300ms"></div>
                        </div>
                    </div>
                `;

                try {
                    // Use AIJobService for comparison
                    const result = await window.AIJobService.compareExternalJobs(window.selectedCompareJobs);

                    if (!result.success) {
                        throw new Error(result.error || 'Failed to compare jobs.');
                    }

                    // Render comparison markdown
                    modalBody.innerHTML = marked.parse(result.comparison_markdown);
                } catch (err) {
                    console.error('Job comparison failed:', err);
                    modalBody.innerHTML = `
                        <div class="py-10 text-center">
                            <span class="material-symbols-outlined text-4xl text-red-400 mb-3">error</span>
                            <p class="text-red-500 font-bold">${err.message}</p>
                        </div>
                    `;
                }
            });
        }
    }, 500);

    // ── Expose globals for external access
    window.AdvancedJobSearch = {
        getState: () => state,
        initAIMatchTab: initAIMatchTab
    };
    window.initExternalJobsTab = initExternalJobsTab;

    // Manual Refresh Support
    window.refreshAIMatches = function() {
        if (typeof handleAITabClick === 'function') {
            handleAITabClick(true);
        } else {
            const advState = window.AdvancedJobSearch?.getState();
            if (advState) advState.isAIMatchLoaded = false;
            initAIMatchTab();
        }
    };

    // External ATS Trigger
    window.triggerATSFromExternal = function(title, company, url, tags) {
        const prefillJD = `${title} at ${company}\n\nRequired Skills: ${(tags || []).join(', ')}`;
        localStorage.setItem('jd_job_prefill', JSON.stringify({
            title: title,
            company: company,
            description: prefillJD,
            tags: tags || []
        }));
        showToast('Opening ATS analysis for ' + title, 'success');
        setTimeout(() => {
            window.location.href = '../../JobSeeker/Profile/resume_insights.html#jd-targeted';
        }, 600);
    };
});
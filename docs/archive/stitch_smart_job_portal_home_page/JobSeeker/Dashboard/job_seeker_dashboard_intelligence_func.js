// Functional logic for job_seeker_dashboard_intelligence
console.log('Loaded job_seeker_dashboard_intelligence_func.js');


// Mobile Menu Toggle Functionality
// Initial Dashboard Population
document.addEventListener('DOMContentLoaded', function () {
    updateDashboard();

    // Re-run on storage changes (in case resume is analyzed in another tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'user' || e.key === 'uploadedResumes' || e.key === 'activeResumeId') {
            updateDashboard();
        }
    });
});


function updateDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    updateWelcome(user);
    updateATSScore(user);
    updateProfileStrength(user);
    renderAppliedJobsGrid(user);
    renderUpcomingInterviews(user);
    setupNavigationButtons();
}

function updateWelcome(user) {
    try {
        const name = user.name || 'there';
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) {
            welcomeEl.innerHTML = `Welcome back${name !== 'there' ? ', ' + name : ''}! 👋`;
        }
    } catch (e) {
        console.error('Error updating welcome', e);
    }
}

function updateATSScore(user) {
    try {
        const activeResId = user.activeResumeId;
        const resumes = user.uploadedResumes || [];
        const activeRes = resumes.find(r => r.id === activeResId);

        const scoreNum = document.getElementById('dash-ats-num');
        const badge = document.getElementById('dash-ats-badge');
        const ring = document.getElementById('dash-ats-ring');

        // Try multiple score sources:
        // 1) normalATS.score or normalATS.format_score (format-only analysis)
        // 2) atsAnalysis.ats_score (JD-targeted analysis)
        let score = null;
        let label = '';
        if (activeRes) {
            // Prioritize JD-targeted match score if it exists, as it's more relevant
            if (activeRes.atsAnalysis) {
                score = activeRes.atsAnalysis.ats_score || null;
                label = 'JD Match Score';
            } else if (activeRes.normalATS) {
                score = activeRes.normalATS.score || activeRes.normalATS.format_score || null;
                label = 'Format Score';
            }
        }

        if (score) {
            if (scoreNum) scoreNum.textContent = score;
            if (ring) ring.style.strokeDasharray = `${score}, 100`;
            if (badge) {
                const color = score >= 70 ? 'green' : score >= 40 ? 'amber' : 'red';
                badge.innerHTML = `<span class="material-symbols-outlined text-[16px]">verified</span> ${label}`;
                badge.className = `inline-flex items-center gap-1 text-${color}-600 text-sm font-bold bg-${color}-50 dark:bg-${color}-900/20 px-2 py-0.5 rounded-md w-fit`;
            }
        } else {
            if (scoreNum) scoreNum.textContent = '—';
            if (ring) ring.style.strokeDasharray = '0, 100';
            if (badge) {
                badge.innerHTML = `<span class="material-symbols-outlined text-[16px]">info</span> No analysis yet`;
                badge.className = "inline-flex items-center gap-1 text-slate-400 text-sm font-bold bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded-md w-fit";
            }
        }
    } catch (e) {
        console.error('Error updating ATS score', e);
    }
}

function updateProfileStrength(user) {
    try {
        const activeResId = user.activeResumeId;
        const resumes = user.uploadedResumes || [];
        const activeRes = resumes.find(r => r.id === activeResId);

        // Define criteria and their completion status
        const criteria = [
            { label: 'Upload Resume', completed: resumes.length > 0, link: '../Profile/resume_upload_&_validation_center.html' },
            { label: 'Verify Email', completed: !!user.email, link: '../../Platform/Settings/settings_center.html?tab=account' },
            { label: 'Complete Profile', completed: !!(user.headline && user.about), link: '../../Platform/Settings/settings_center.html?tab=profile' },
            { label: 'ATS Analysis', completed: !!(activeRes && activeRes.normalATS), link: '../Profile/resume_insights.html' },
            { label: 'Skills Added', completed: !!(activeRes && activeRes.extractedSkills && activeRes.extractedSkills.length > 0), link: '../Profile/resume_insights.html' }
        ];

        const completedCount = criteria.filter(c => c.completed).length;
        const percent = Math.floor((completedCount / criteria.length) * 100);

        // Update Ring and Percentage
        const ring = document.getElementById('ps-ring');
        const percentText = document.getElementById('ps-percent');
        const labelText = document.getElementById('ps-label');

        if (ring) ring.style.strokeDasharray = `${percent}, 100`;
        if (percentText) percentText.textContent = `${percent}%`;

        if (percent === 0 && percentText) percentText.textContent = "0%";

        if (labelText) {
            if (percent < 40) labelText.textContent = "Getting started";
            else if (percent < 80) labelText.textContent = "Intermediate";
            else labelText.textContent = "All-Star Status";
        }

        // Update Checklist
        const checklist = document.getElementById('ps-checklist');
        if (checklist) {
            checklist.innerHTML = criteria.map(c => `
                <div class="flex flex-col items-center text-center gap-1 group">
                    <span class="material-symbols-outlined text-lg ${c.completed ? 'text-primary' : 'text-slate-300/60'}">
                        ${c.completed ? 'check_circle' : 'circle'}
                    </span>
                    <a href="${c.link}" class="text-[11px] leading-tight font-bold ${c.completed ? 'text-slate-400 line-through' : 'text-text-main dark:text-white hover:text-primary'} transition-colors">
                        ${c.label}
                    </a>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error updating profile strength', e);
    }
}

// ── PROFILE PERFECTION & RESUME EVOLUTION removed — cards no longer on dashboard ──

// ── NAVIGATION BUTTONS ─────────────────────────────────────────────────────
function setupNavigationButtons() {
    const btns = Array.from(document.querySelectorAll('button'));
    const updateAvailBtn = btns.find(el => el.textContent.includes('Update Availability'));
    const newAppBtn = btns.find(el => el.textContent.includes('New Application'));

    if (updateAvailBtn) {
        updateAvailBtn.onclick = () => {
            window.location.href = "../../Platform/Settings/settings_center.html?tab=profile";
        };
        updateAvailBtn.classList.add('cursor-pointer');
    }

    if (newAppBtn) {
        newAppBtn.onclick = () => {
            window.location.href = "../../Platform/Search/advanced_job_search_&_filtering.html";
        };
        newAppBtn.classList.add('cursor-pointer');
    }
}

function renderAppliedJobsGrid(user) {
    try {
        const appliedJobs = user.appliedJobs || JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        const grid = document.getElementById('applied-jobs-grid');
        const emptyState = document.getElementById('applied-jobs-empty');

        if (!grid) return;

        // Clear existing cards (except empty state)
        const oldCards = grid.querySelectorAll('.job-card-dynamic');
        oldCards.forEach(c => c.remove());

        if (appliedJobs.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        // Show last 4 applications
        appliedJobs.slice(-4).reverse().forEach(job => {
            const card = document.createElement('div');
            card.className = "job-card-dynamic p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-primary/30 hover:shadow-sm transition-all";
            card.innerHTML = `
                <div class="flex items-start gap-3 mb-3">
                    <div class="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-blue-500 text-[20px]">work</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-sm text-text-main dark:text-white group-hover:text-primary transition-colors truncate">
                            ${job.title || job.jobTitle}
                        </h4>
                        <p class="text-xs text-text-secondary">
                            ${job.company} • ${job.location || 'Remote'}
                        </p>
                    </div>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span class="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 rounded-full text-xs font-bold">
                        Applied
                    </span>
                    <p class="text-xs text-text-secondary">Oct 2024</p>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        console.error('Error rendering applied jobs', e);
    }
}

function renderUpcomingInterviews() {
    try {
        const interviews = JSON.parse(localStorage.getItem('upcomingInterviews') || '[]');
        const listContainer = document.getElementById('upcoming-interviews-list');
        const alertBanner = document.getElementById('interview-alert-banner');

        if (!listContainer) return;

        if (interviews.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-8 text-slate-400">
                    <span class="material-symbols-outlined text-3xl mb-1 block">event_busy</span>
                    <p class="text-xs font-medium">No upcoming interviews</p>
                </div>
            `;
            if (alertBanner) alertBanner.classList.add('hidden');
            return;
        }

        // Check for today's interview
        const today = new Date().toISOString().split('T')[0];
        const todayInterview = interviews.find(i => i.date === today);

        if (todayInterview && alertBanner) {
            alertBanner.classList.remove('hidden');
            const alertSub = document.getElementById('interview-alert-sub');
            if (alertSub) alertSub.textContent = `${todayInterview.company} — ${todayInterview.time}`;
        } else if (alertBanner) {
            alertBanner.classList.add('hidden');
        }

        listContainer.innerHTML = interviews.slice(0, 3).map(i => `
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-[10px] font-bold ${i.date === today ? 'text-red-500' : 'text-text-secondary'} uppercase">
                        ${i.date === today ? 'Today' : i.date}
                    </span>
                    <span class="text-[10px] font-medium text-text-secondary">${i.time}</span>
                </div>
                <h4 class="font-bold text-text-main dark:text-white text-xs">${i.company}</h4>
                <p class="text-[10px] text-text-secondary mb-2">${i.type || 'Interview'}</p>
                <button class="w-full py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold rounded hover:bg-slate-50 transition-colors">
                    View Details
                </button>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error rendering interviews', e);
    }
}

// Populate user info from localStorage for settings
const u = JSON.parse(localStorage.getItem('user') || '{}');
if (u.name) {
    const nameParts = u.name.split(' ');
    const fNameInput = document.getElementById('profile-firstname');
    const lNameInput = document.getElementById('profile-lastname');
    if (fNameInput) fNameInput.value = nameParts[0] || '';
    if (lNameInput) lNameInput.value = nameParts.slice(1).join(' ') || '';
}
if (u.headline) {
    const headlineInput = document.getElementById('profile-headline');
    if (headlineInput) headlineInput.value = u.headline;
}
if (u.about) {
    const aboutInput = document.getElementById('profile-about');
    if (aboutInput) aboutInput.value = u.about;
}

// Save Profile Logic
const saveProfileBtn = document.getElementById('save-profile-btn');
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
        const fname = document.getElementById('profile-firstname').value.trim();
        const lname = document.getElementById('profile-lastname').value.trim();
        const headline = document.getElementById('profile-headline').value.trim();
        const about = document.getElementById('profile-about').value.trim();

        const currUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (fname || lname) {
            currUser.name = `${fname} ${lname}`.trim();
        }
        currUser.headline = headline;
        currUser.about = about;
        localStorage.setItem('user', JSON.stringify(currUser));

        // Visual feedback
        const originalText = saveProfileBtn.textContent;
        saveProfileBtn.textContent = 'Saved!';
        saveProfileBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        saveProfileBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');

        // Update Sidebar name if changed
        if (currUser.name) {
            const sidebarNameEl = document.getElementById('sidebar-name');
            if (sidebarNameEl) sidebarNameEl.textContent = currUser.name;

            const welcomeEl = document.getElementById('welcome-message');
            if (welcomeEl) {
                const n = currUser.name || 'there';
                welcomeEl.innerHTML = `Welcome back${n !== 'there' ? ', ' + n : ''}! 👋`;
            }
        }

        setTimeout(() => {
            saveProfileBtn.textContent = originalText;
            saveProfileBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            saveProfileBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }, 2000);
    });
    // New Application button logic
    const newAppBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim().includes('New Application'));
    if (newAppBtn) {
        newAppBtn.addEventListener('click', () => {
            window.location.href = '../Jobs/my_jobs.html';
        });
    }

    // Update Availability button logic
    const updateAvailBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim().includes('Update Availability'));
    if (updateAvailBtn) {
        updateAvailBtn.addEventListener('click', () => {
            const profileTab = document.querySelector('[onclick*="profile"]');
            if (profileTab) {
                profileTab.click();
            } else {
                // Fallback scroll to profile section if it's on same page
                const profileSec = document.getElementById('profile-section');
                if (profileSec) profileSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Toggle slider interaction
document.querySelectorAll('.toggle input').forEach(input => {
    input.addEventListener('change', function () {
        const slider = this.nextElementSibling;
        slider.style.background = this.checked ? '#2b8cee' : '#cbd5e1';
        const knob = slider.querySelector('.toggle-knob');
        if (knob) knob.style.transform = this.checked ? 'translateX(20px)' : 'translateX(0)';
    });
    // Init state
    const slider = input.nextElementSibling;
    if (input.checked && slider) {
        slider.style.background = '#2b8cee';
        const knob = slider.querySelector('.toggle-knob');
        if (knob) knob.style.transform = 'translateX(20px)';
    }
});

// Delete Account
const deleteBtn = document.getElementById('deleteAccountBtn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
        const usr = JSON.parse(localStorage.getItem('user') || '{}');
        const email = usr.email;
        if (!email) {
            alert('No account found in session.');
            return;
        }
        if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;

        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';

        fetch('http://localhost:5000/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to delete account. Please try again.');
                return response.json();
            })
            .then(function () {
                localStorage.removeItem('user');
                localStorage.removeItem('bookmarks_' + email);
                window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
            })
            .catch(function (err) {
                const msg = document.getElementById('deleteAccountMsg');
                if (msg) {
                    msg.textContent = err.message;
                    msg.classList.remove('hidden');
                }
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Delete Account';
            });
    });
}

// Deep link
const params = new URLSearchParams(window.location.search);
const tab = params.get('tab');
if (tab) {
    const btnQuery = document.querySelector(`.dash-tab-btn[onclick*="switchDashTab('${tab}'"]`);
    if (btnQuery) {
        switchDashTab(tab, btnQuery);
    } else if (['profile', 'notifications', 'account'].includes(tab)) {
        switchDashTab(tab, null);
    }
}
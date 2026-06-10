/**
 * render_footer.js — Career Auto
 * Role-aware footer: shows different "Services" links depending on user role.
 * Dashboard pages get a compact mini-footer instead of the full footer.
 */

// ── Pages that use the mini (compact) footer instead of the full footer ──────
const DASHBOARD_PAGES = [
    'job_seeker_dashboard_intelligence',
    'resume_insights',
    'my_jobs',
    'resume_upload',
    'settings_center',
    'personal_job_search_history',
    'employer_dashboard_overview',
    'employer_job_management_dashboard',
    'hiring_analytics',
    'ai-powered_candidate_ranking',
    'applicant_status_control',
    'application_status_management',
    'application_tracking',
    'interview_scheduling',
];

document.addEventListener("DOMContentLoaded", function() {

    // ── Check if current page is a dashboard page ──────────────────────────
    const currentPath = window.location.pathname;
    const isDashboardPage = DASHBOARD_PAGES.some(p => currentPath.includes(p));

    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    // ── Mini footer for dashboard / sidebar pages ──────────────────────────
    if (isDashboardPage) {
        footerContainer.innerHTML = `
        <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632] py-3 px-6 flex items-center justify-between text-xs text-slate-400 mt-auto flex-shrink-0">
            <span>© 2026 Career Auto AI Inc.</span>
            <div class="flex gap-4 items-center">
                <a href="../../Platform/Home/smart_job_portal_home_page.html" title="Home" class="hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-[16px]">home</span>
                </a>
                <a href="#" class="hover:text-primary transition-colors">Privacy</a>
                <a href="#" class="hover:text-primary transition-colors">Terms</a>
                <a href="#" title="Contact" class="hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-[16px]">mail</span>
                </a>
            </div>
        </footer>`;
        return;
    }

    // ── Read auth state for full footer ───────────────────────────────────
    let role = null;
    try {
        const raw = localStorage.getItem('user');
        if (raw) {
            const user = JSON.parse(raw);
            if (user && (user.email || user.googleId || user.name)) {
                role = user.role || 'jobseeker';
            }
        }
    } catch (e) {
        role = null;
    }

    const isEmployer = role === 'employer';
    const isJobSeeker = role === 'jobseeker';

    // ── Services section based on role ────────────────────────────────────
    function servicesSection() {
        if (isEmployer) return `
            <div class="flex flex-col gap-3">
                <h4 class="font-bold text-[#0d141b] dark:text-white">Employer Tools</h4>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Employer/Dashboard/employer_dashboard_overview.html">Dashboard</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Employer/JobManagement/post_a_new_job_-_step_1.html">Post a Job</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Employer/JobManagement/employer_job_management_dashboard.html">Manage Jobs</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Employer/Candidates/ai-powered_candidate_ranking.html">AI Ranking</a>
            </div>`;

        if (isJobSeeker) return `
            <div class="flex flex-col gap-3">
                <h4 class="font-bold text-[#0d141b] dark:text-white">Job Seeker</h4>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Platform/Search/advanced_job_search_&_filtering.html">Browse Jobs</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../JobSeeker/Profile/resume_upload_&_validation_center.html">Resume Upload</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html">Dashboard</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../JobSeeker/Jobs/my_jobs.html">My Jobs</a>
            </div>`;

        // Public / logged-out
        return `
            <div class="flex flex-col gap-3">
                <h4 class="font-bold text-[#0d141b] dark:text-white">Services</h4>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Platform/Search/advanced_job_search_&_filtering.html">Browse Jobs</a>
                <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Platform/Home/smart_job_portal_home_page.html">Pricing</a>
            </div>`;
    }

    const footerHTML = `
    <footer class="bg-white dark:bg-[#1a2632] border-t border-[#e7edf3] dark:border-[#2a3b4d] pt-12 pb-8 mt-auto">
        <div class="mx-auto max-w-[1200px] px-4 md:px-10">
            <div class="flex flex-col md:flex-row justify-between gap-10 mb-10">
                <div class="flex flex-col gap-4 max-w-sm">
                    <div class="flex items-center gap-2 text-[#0d141b] dark:text-white cursor-pointer" onclick="window.location.href='../../Platform/Home/smart_job_portal_home_page.html'">
                        <div class="flex items-center justify-center text-primary">
                            <img src="../../assets/logos/career_auto_logo.png" class="h-10 object-cover rounded-full w-10" alt="Career Auto Logo" onerror="this.src='https://via.placeholder.com/40';">
                        </div>
                        <span class="text-xl font-bold">Career Auto</span>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400">
                        The world's first AI-native job board designed to match talent with opportunity through deep learning analysis.
                    </p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                    ${servicesSection()}
                    <div class="flex flex-col gap-3">
                        <h4 class="font-bold text-[#0d141b] dark:text-white">Resources</h4>
                        <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Platform/Intelligence/about_the_intelligence_platform.html">About</a>
                        <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Platform/Intelligence/interactive_how_it_works_guide.html">Career Guide</a>
                        <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="../../Platform/SiteMap/site_map.html">Site Map</a>
                    </div>
                    <div class="flex flex-col gap-3">
                        <h4 class="font-bold text-[#0d141b] dark:text-white">Connect</h4>
                        <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="https://twitter.com">Twitter</a>
                        <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="https://linkedin.com">LinkedIn</a>
                        <a class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="https://github.com">GitHub</a>
                    </div>
                </div>
            </div>

            <!-- Platform Links -->
            <div class="border-t border-[#e7edf3] dark:border-[#2a3b4d] pt-6 pb-6">
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
                    <span class="font-bold text-slate-800 dark:text-slate-200 mr-2">Platform:</span>
                    <a href="../../Platform/Home/smart_job_portal_home_page.html" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Home</a>
                    <a href="../../Platform/Intelligence/about_the_intelligence_platform.html" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">About / Vision / Ethics / Team</a>
                    <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Help Center / FAQ</a>
                    <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Contact Support</a>
                </div>
            </div>

            <div class="border-t border-[#e7edf3] dark:border-[#2a3b4d] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm text-slate-400">© 2026 Career Auto AI Inc. All rights reserved.</p>
                <div class="flex gap-4">
                    <a class="text-slate-400 hover:text-primary transition-colors" href="../../Platform/Home/smart_job_portal_home_page.html" title="Home"><span class="material-symbols-outlined text-[20px]">public</span></a>
                    <a class="text-slate-400 hover:text-primary transition-colors" href="#" title="Contact Us"><span class="material-symbols-outlined text-[20px]">mail</span></a>
                </div>
            </div>
        </div>
    </footer>
    `;

    footerContainer.innerHTML = footerHTML;
});
/**
 * render_header.js — Career Auto
 * Role-aware navigation header. Shows different nav links and buttons
 * depending on whether the user is logged out, a job seeker, or an employer.
 */
document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;

    // If sidebar is present, completely remove the top nav bar (per user request)
    if (document.getElementById('sidebar-container')) {
        headerContainer.style.display = 'none';
        return;
    }

    // ── Read auth state ────────────────────────────────────────────────────
    let user = null,
        role = null;
    try {
        const raw = localStorage.getItem('user');
        if (raw) {
            user = JSON.parse(raw);
            if (!(user && (user.email || user.googleId || user.name))) user = null;
        }
    } catch (e) {
        user = null;
    }
    if (user) role = user.role || 'jobseeker';

    const isLoggedIn = !!user;
    const isJobSeeker = isLoggedIn && role === 'jobseeker';
    const isEmployer = isLoggedIn && role === 'employer';

    // ── Avatar / user badge (top-right when logged in) ─────────────────────
    function getUserLabel() {
        const name = user && user.name ? user.name.split(' ')[0] : (user && user.email ? user.email.split('@')[0] : 'Account');
        const initial = name.charAt(0).toUpperCase();
        const pic = user && user.picture ?
            `<img src="${user.picture}" alt="avatar" class="w-7 h-7 rounded-full object-cover" />` :
            `<div class="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">${initial}</div>`;
        const roleTag = isEmployer ?
            `<span class="text-[10px] font-bold text-orange-500 bg-orange-50 rounded-full px-2 py-0.5">Employer</span>` :
            `<span class="text-[10px] font-bold text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">Job Seeker</span>`;
        return `<div class="flex items-center gap-2">${pic}<span class="text-sm font-bold hidden lg:inline">${name}</span>${roleTag}</div>`;
    }

    function makeLink(href, text, isMobile = false) {
        let isMatch = false;
        if (text === 'Dashboard') {
            isMatch = window.location.pathname.includes('dashboard');
        } else {
            const filename = href.split('/').pop().split('.')[0];
            if (filename && window.location.pathname.includes(filename)) isMatch = true;
        }

        const activeCls = isMatch ? ' active text-blue-600 dark:text-blue-400 font-bold' : '';
        const baseCls = 'nav-link-anim text-[#0d141b] dark:text-slate-200 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors' + (isMobile ? ' py-2' : '');

        return `<a class="${baseCls}${activeCls}" href="${href}">${text}</a>`;
    }

    // ── Desktop nav links by role ──────────────────────────────────────────
    function desktopLinks() {
        if (document.getElementById('sidebar-container')) return '';

        if (isJobSeeker) return `
            ${makeLink('../../Platform/Search/advanced_job_search_&_filtering.html', 'Jobs')}
            ${makeLink('../../JobSeeker/Jobs/my_jobs.html', 'My Jobs')}
            ${makeLink('../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html', 'Dashboard')}
            ${makeLink('../../Platform/Intelligence/interactive_how_it_works_guide.html', 'How It Works')}
            ${makeLink('../../Platform/SiteMap/site_map.html', 'Site Map')}
            ${makeLink('../../Platform/Intelligence/about_the_intelligence_platform.html', 'About')}`;

        if (isEmployer) return `
            ${makeLink('../../Employer/Dashboard/employer_dashboard_overview.html', 'Dashboard')}
            ${makeLink('../../Employer/JobManagement/post_a_new_job_-_step_1.html', 'Post a Job')}
            ${makeLink('../../Employer/JobManagement/employer_job_management_dashboard.html', 'Manage Jobs')}
            ${makeLink('../../Employer/Candidates/ai-powered_candidate_ranking.html', 'AI Ranking')}
            ${makeLink('../../Platform/SiteMap/site_map.html', 'Site Map')}
            ${makeLink('../../Platform/Intelligence/about_the_intelligence_platform.html', 'About')}`;

        return `
            ${makeLink('../../Platform/Search/advanced_job_search_&_filtering.html', 'Jobs')}
            ${makeLink('../../Platform/Intelligence/about_the_intelligence_platform.html', 'About')}
            ${makeLink('../../Platform/Intelligence/interactive_how_it_works_guide.html', 'How It Works')}
            ${makeLink('../../Platform/SiteMap/site_map.html', 'Site Map')}`;
    }

    // ── Mobile nav links by role ───────────────────────────────────────────
    function mobileLinks() {
        if (document.getElementById('sidebar-container')) return '';

        if (isJobSeeker) return `
            ${makeLink('../../Platform/Search/advanced_job_search_&_filtering.html', 'Jobs', true)}
            ${makeLink('../../JobSeeker/Jobs/my_jobs.html', 'My Jobs', true)}
            ${makeLink('../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html', 'Dashboard', true)}
            ${makeLink('../../Platform/Intelligence/interactive_how_it_works_guide.html', 'How It Works', true)}
            ${makeLink('../../Platform/SiteMap/site_map.html', 'Site Map', true)}
            ${makeLink('../../Platform/Intelligence/about_the_intelligence_platform.html', 'About', true)}`;

        if (isEmployer) return `
            ${makeLink('../../Employer/Dashboard/employer_dashboard_overview.html', 'Dashboard', true)}
            ${makeLink('../../Employer/JobManagement/employer_job_management_dashboard.html', 'Jobs', true)}
            ${makeLink('../../Employer/Candidates/ai-powered_candidate_ranking.html', 'Applicants', true)}
            ${makeLink('../../Employer/Interview/interview_scheduling_calendar.html', 'Calendar', true)}
            ${makeLink('../../Employer/JobManagement/post_a_new_job_-_step_1.html', 'Post Job', true)}`;

        return `
            ${makeLink('../../Platform/Search/advanced_job_search_&_filtering.html', 'Jobs', true)}
            ${makeLink('../../Platform/Intelligence/about_the_intelligence_platform.html', 'About', true)}
            ${makeLink('../../Platform/Intelligence/interactive_how_it_works_guide.html', 'How It Works', true)}
            ${makeLink('../../Platform/SiteMap/site_map.html', 'Site Map', true)}`;
    }

    // ── Action buttons (top-right) ─────────────────────────────────────────
    const logoutHome = isEmployer ?
        '../../Employer/Dashboard/employer_dashboard_overview.html' :
        '../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html';

    function desktopActions(alignLeft = false) {
        if (isLoggedIn) {
            const userName = user && user.name ? user.name : (user && user.email ? user.email.split('@')[0] : 'User');
            const userEmail = user && user.email ? user.email : '';
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=cbd5e1&color=334155`;
            const pic = user && user.picture ?
                `<img src="${user.picture}" alt="avatar" class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />` :
                `<img src="${defaultAvatar}" alt="avatar" class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />`;

            return `
            <div class="relative" id="profile-dropdown-container">
                <button id="profile-dropdown-trigger" class="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    ${getUserLabel()}
                </button>
                
                <!-- Dropdown Menu -->
                <div id="profile-dropdown-menu" class="hidden absolute ${alignLeft ? 'left-0' : 'right-0'} mt-2 w-72 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transform opacity-0 scale-95 transition-all duration-200 origin-top-right z-50">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        ${pic}
                        <div class="flex flex-col min-w-0">
                            <span class="text-sm font-bold text-slate-900 dark:text-white truncate">${userName}</span>
                            <span class="text-xs text-slate-500 dark:text-slate-400 truncate">${userEmail}</span>
                        </div>
                    </div>
                    <div class="p-2 flex flex-col gap-1">
                        <a href="${isEmployer ? '../../Employer/Profile/employer_company_profile.html' : '../../Platform/Settings/settings_center.html?tab=profile'}" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span class="material-symbols-outlined text-[20px]">person</span>
                            View Profile
                        </a>
                        <a href="../../Platform/Settings/settings_center.html?tab=account" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span class="material-symbols-outlined text-[20px]">settings</span>
                            Account Settings
                        </a>
                    </div>
                    <div class="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button onclick="(function(){localStorage.removeItem('user');sessionStorage.removeItem('redirectAfterLogin');window.location.href='../../Platform/Auth/auth_center.html?tab=login';})()" class="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <span class="material-symbols-outlined text-[20px]">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>`;
        }

        return `
            <button onclick="window.location.href='../../Platform/Auth/auth_center.html?tab=login'" class="flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0d141b] dark:text-white text-sm font-bold transition-colors">
                <span class="truncate">Log In</span>
            </button>
            <button onclick="window.location.href='../../Platform/Auth/auth_center.html?tab=role'" class="flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                <span class="truncate">Get Started</span>
            </button>`;
    }

    function mobileActions() {
        if (isLoggedIn) {
            const userName = user && user.name ? user.name : (user && user.email ? user.email.split('@')[0] : 'User');
            const userEmail = user && user.email ? user.email : '';
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=cbd5e1&color=334155`;
            const pic = user && user.picture ?
                `<img src="${user.picture}" alt="avatar" class="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />` :
                `<img src="${defaultAvatar}" alt="avatar" class="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />`;

            return `
            <hr class="border-[#e7edf3] dark:border-[#2a3b4d]">
            <div class="px-2 py-3 mb-2 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                ${pic}
                <div class="flex flex-col min-w-0">
                    <span class="text-sm font-bold text-slate-900 dark:text-white truncate">${userName}</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400 truncate">${userEmail}</span>
                </div>
            </div>
            <div class="flex flex-col gap-1">
                <a href="${isEmployer ? '../../Employer/Profile/employer_company_profile.html' : '../../Platform/Settings/settings_center.html?tab=profile'}" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span class="material-symbols-outlined text-[22px]">person</span>
                    View Profile
                </a>
                <a href="../../Platform/Settings/settings_center.html?tab=account" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span class="material-symbols-outlined text-[22px]">settings</span>
                    Account Settings
                </a>
                <button onclick="(function(){localStorage.removeItem('user');sessionStorage.removeItem('redirectAfterLogin');window.location.href='../../Platform/Auth/auth_center.html?tab=login';})()" class="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/30 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                </button>
            </div>`;
        }

        return `
            <hr class="border-[#e7edf3] dark:border-[#2a3b4d]">
            <button onclick="window.location.href='../../Platform/Auth/auth_center.html?tab=login'" class="flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0d141b] dark:text-white text-sm font-bold transition-colors">
                Log In
            </button>
            <button onclick="window.location.href='../../Platform/Auth/auth_center.html?tab=role'" class="flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                Get Started
            </button>`;
    }

    // ── Logo rendering (hide on dashboard) ─────────────────────────────────
    function renderLeftNav() {
        if (document.getElementById('sidebar-container')) {
            return desktopActions(true);
        }

        return `
        <!-- Logo -->
        <a href="../../Platform/Home/smart_job_portal_home_page.html" class="flex items-center gap-4 text-[#0d141b] dark:text-white hover:opacity-80 transition-opacity cursor-pointer decoration-0" title="Go to HomePage">
            <img src="../../assets/logos/career_auto_logo.png" alt="Career Auto Logo" class="h-8 w-8 object-contain rounded-xl shadow-sm bg-white" />
            <h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">Career Auto</h2>
        </a>`;
    }

    function renderRightNav() {
        if (document.getElementById('sidebar-container')) return '';
        return desktopActions(false);
    }

    // ── Assemble header ────────────────────────────────────────────────────
    const headerHTML = `
    <style>
        .nav-link-anim {
            position: relative;
            display: inline-block;
        }
        .nav-link-anim::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 0;
            height: 2px;
            background-color: #2b8cee;
            transition: width 0.3s ease;
        }
        .nav-link-anim:hover::after,
        .nav-link-anim.active::after {
            width: 100%;
        }
        .dark .nav-link-anim::after {
            background-color: #60a5fa;
        }
    </style>
    <header id="career-auto-nav" class="sticky top-0 z-50 w-full bg-white dark:bg-[#1a2632] border-b border-[#e7edf3] dark:border-[#2a3b4d]">
        <div class="layout-container flex h-full grow flex-col">
            <div class="pl-4 md:pl-10 pr-2 md:pr-4 flex flex-1 justify-center py-3">
                <div class="layout-content-container flex w-full items-center justify-between whitespace-nowrap">
                    ${renderLeftNav()}

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex flex-1 justify-center gap-9 border-l border-[#e7edf3] dark:border-[#2a3b4d] ml-6 pl-6">
                        ${desktopLinks()}
                    </div>

                    <!-- Desktop Action Buttons -->
                    <div class="hidden md:flex items-center gap-2 flex-shrink-0">
                        ${renderRightNav()}
                    </div>

                    <!-- Mobile Hamburger -->
                    <button id="mobile-menu-toggle" class="md:hidden flex items-center justify-center w-10 h-10 text-[#0d141b] dark:text-white">
                        <span class="material-symbols-outlined text-2xl">menu</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Panel -->
        <div id="mobile-menu" class="hidden absolute top-full left-0 w-full bg-white dark:bg-[#1a2632] border-b border-[#e7edf3] dark:border-[#2a3441] shadow-xl z-50 md:hidden">
            <nav class="flex flex-col px-4 py-4 gap-4">
                ${mobileLinks()}
                ${mobileActions()}
            </nav>
        </div>
    </header>
    `;

    headerContainer.innerHTML = headerHTML;

    // Profile Dropdown Logic
    if (isLoggedIn) {
        const trigger = document.getElementById('profile-dropdown-trigger');
        const menu = document.getElementById('profile-dropdown-menu');

        if (trigger && menu) {
            function toggleMenu(e) {
                e.stopPropagation();

                const isHidden = menu.classList.contains('hidden');

                if (isHidden) {
                    menu.classList.remove('hidden');
                    // Small delay for transition to take effect
                    setTimeout(() => {
                        menu.classList.remove('opacity-0', 'scale-95');
                        menu.classList.add('opacity-100', 'scale-100');
                    }, 10);
                } else {
                    closeMenu();
                }
            }

            function closeMenu() {
                if (!menu.classList.contains('hidden')) {
                    menu.classList.remove('opacity-100', 'scale-100');
                    menu.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => {
                        menu.classList.add('hidden');
                    }, 200); // Wait for transition duration
                }
            }

            trigger.addEventListener('click', toggleMenu);

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!trigger.contains(e.target) && !menu.contains(e.target)) {
                    closeMenu();
                }
            });
        }
    }

    // Dispatch event for navbar.js
    document.dispatchEvent(new Event('headerLoaded'));
});
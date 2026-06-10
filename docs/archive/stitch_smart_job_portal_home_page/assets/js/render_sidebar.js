/**
 * render_sidebar.js
 * Injects the persistent left sidebar navigation into any page that includes it.
 * Works alongside render_header.js for consistent site-wide navigation.
 */

(function () {

    // ── Role Guard: sidebar is exclusively for job seekers ─────────────────
    (function () {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) {
                // Not logged in → redirect to login
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
                return;
            }
            const user = JSON.parse(raw);
            if (!(user && (user.email || user.googleId || user.name))) {
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
                return;
            }
            const role = user.role || 'jobseeker';
            if (role === 'employer') {
                // Employer trying to access a job seeker page → send to employer portal
                window.location.href = '../../Employer/Dashboard/employer_dashboard_overview.html';
                return;
            }
        } catch (e) {
            window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
        }
    })();

    const NAV_ITEMS = [{
        icon: 'dashboard',
        label: 'Dashboard',
        href: '../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html',
        match: 'job_seeker_dashboard'
    },
    {
        icon: 'bookmark',
        label: 'My Jobs',
        href: '../../JobSeeker/Jobs/my_jobs.html',
        match: 'my_jobs'
    },
    {
        icon: 'cloud_upload',
        label: 'Upload Resume',
        href: '../../JobSeeker/Profile/resume_upload_&_validation_center.html',
        match: 'resume_upload_&_validation_center'
    },
    {
        icon: 'analytics',
        label: 'Resume Insights',
        href: '../../JobSeeker/Profile/resume_insights.html',
        match: 'resume_insights'
    },
    {
        icon: 'chat',
        label: 'Messages',
        href: '../../JobSeeker/Notifications/job_seeker_notification_center.html',
        match: 'job_seeker_notification_center'
    },
    {
        icon: 'history',
        label: 'Search History',
        href: '../../JobSeeker/Jobs/personal_job_search_history.html',
        match: 'personal_job_search_history'
    }
    ];

    function isActive(item) {
        const path = window.location.pathname;
        const search = window.location.search;

        if (item.match.startsWith('tab=')) {
            return search.includes(item.match);
        } else if (item.match === 'settings_center') {
            return path.includes('settings_center') && !search.includes('tab=');
        }

        const fileName = path.split('/').pop();
        return fileName.startsWith(item.match);
    }

    function buildNavItems() {
        return NAV_ITEMS.map(item => {
            const active = isActive(item);
            return `
            <a href="${item.href}" class="sidebar-nav-item${active ? ' active' : ''}" title="${item.label}">
                <span class="material-symbols-outlined sidebar-nav-icon">${item.icon}</span>
                <span class="sidebar-nav-label">${item.label}</span>
            </a>`;
        }).join('');
    }

    function getUserBadge() {
        return `
        <a href="../../Platform/Home/smart_job_portal_home_page.html" class="sidebar-brand-row" style="text-decoration: none; color: inherit;">
            <img src="../../assets/logos/career_auto_logo.png" alt="Career Auto Logo" class="sidebar-brand-icon" style="background: white; object-fit: contain; padding: 2px;" />
            <div class="sidebar-brand-text">
                <span class="sidebar-brand-name">Career Auto</span>
                <span class="sidebar-brand-plan">Pro Plan</span>
            </div>
        </a>`;
    }

    function renderProfileFooter() {
        let user = null;
        try {
            const raw = localStorage.getItem('user');
            if (raw) user = JSON.parse(raw);
            if (!(user && (user.email || user.googleId || user.name))) user = null;
        } catch (e) { }

        if (!user) {
            return `
            <div class="sidebar-footer">
                <a href="../../Platform/Home/smart_job_portal_home_page.html">
                    <span class="material-symbols-outlined" style="font-size:18px">home</span>
                    Home
                </a>
            </div>`;
        }

        const userName = user.name ? user.name : (user.email ? user.email.split('@')[0] : 'User');
        const userEmail = user.email ? user.email : '';
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=cbd5e1&color=334155`;
        const pic = user.picture ?
            `<img src="${user.picture}" alt="avatar" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />` :
            `<img src="${defaultAvatar}" alt="avatar" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />`;

        return `
        <div class="sidebar-footer pb-2">
            <div class="relative w-full" id="sidebar-profile-dropdown-container">
                <button id="sidebar-profile-trigger" class="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e3a5f] transition-colors focus:outline-none text-left">
                    <div class="flex items-center gap-3 overflow-hidden">
                        ${pic}
                        <div class="flex flex-col min-w-0 flex-1">
                            <span class="text-xs font-bold text-slate-900 dark:text-white truncate" style="max-width: 120px;">${userName}</span>
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate" style="max-width: 120px;">${userEmail}</span>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 text-base ml-1 shrink-0">unfold_more</span>
                </button>
                
                <!-- Dropdown Menu (Open Upwards) -->
                <div id="sidebar-profile-menu" class="hidden absolute bottom-[110%] left-0 w-full bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 overflow-hidden transform opacity-0 translate-y-2 transition-all duration-200 z-[60]">
                    <div class="p-2 flex flex-col gap-1">
                        <a href="../../Platform/Settings/settings_center.html?tab=profile" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">person</span>
                            View Profile
                        </a>
                        <a href="../../Platform/Settings/settings_center.html?tab=account" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">settings</span>
                            Account Settings
                        </a>
                    </div>
                    <div class="p-2 border-t border-slate-100 dark:border-slate-800">
                        <button onclick="(function(){localStorage.removeItem('user');sessionStorage.removeItem('redirectAfterLogin');window.location.href='../../Platform/Auth/auth_center.html?tab=login';})()" class="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    const sidebarHTML = `
    <style>
        /* ─── Sidebar Shell ─────────────────────────────────────────────── */
        #career-auto-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 220px;
            height: 100vh;
            background: #ffffff;
            border-right: 1px solid #e4eaf0;
            display: flex;
            flex-direction: column;
            z-index: 40;
            padding: 20px 12px 24px;
            box-sizing: border-box;
            transition: transform 0.3s ease, width 0.3s ease;
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* dark mode */
        .dark #career-auto-sidebar {
            background: #1a2632;
            border-color: #2a3b4d;
        }

        /* ─── Brand / User Row ───────────────────────────────────────────── */
        .sidebar-brand-row,
        .sidebar-user-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 4px 4px 16px;
            border-bottom: 1px solid #e4eaf0;
            margin-bottom: 16px;
        }

        .dark .sidebar-brand-row,
        .dark .sidebar-user-row {
            border-color: #2a3b4d;
        }

        .sidebar-brand-icon,
        .sidebar-avatar-img,
        .sidebar-avatar-initials {
            flex-shrink: 0;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            overflow: hidden;
            background: #e8f1fb;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sidebar-logo {
            width: 38px;
            height: 38px;
            object-fit: cover;
            border-radius: 10px;
        }

        .sidebar-avatar-img {
            width: 38px;
            height: 38px;
            object-fit: cover;
        }

        .sidebar-avatar-initials {
            font-size: 16px;
            font-weight: 800;
            color: #2b8cee;
            background: #e8f1fb;
        }

        .sidebar-brand-text,
        .sidebar-user-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            overflow: hidden;
        }

        .sidebar-brand-name,
        .sidebar-user-name {
            font-size: 14px;
            font-weight: 800;
            color: #0d141b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .dark .sidebar-brand-name,
        .dark .sidebar-user-name {
            color: #f1f5f9;
        }

        .sidebar-brand-plan,
        .sidebar-user-plan {
            font-size: 11px;
            font-weight: 700;
            color: #2b8cee;
            background: #e8f1fb;
            border-radius: 999px;
            padding: 1px 8px;
            display: inline-block;
            width: fit-content;
        }

        .dark .sidebar-brand-plan,
        .dark .sidebar-user-plan {
            background: #1e3a5f;
            color: #60a5fa;
        }

        /* ─── Nav Items ──────────────────────────────────────────────────── */
        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
        }

        .sidebar-nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 10px;
            text-decoration: none;
            color: #4a6075;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.15s, color 0.15s;
            white-space: nowrap;
            overflow: hidden;
        }

        .sidebar-nav-item:hover {
            background: #f0f6fe;
            color: #2b8cee;
        }

        .sidebar-nav-item.active {
            background: #e8f1fb;
            color: #2b8cee;
        }

        .dark .sidebar-nav-item {
            color: #94a3b8;
        }

        .dark .sidebar-nav-item:hover {
            background: #1e3a5f;
            color: #60a5fa;
        }

        .dark .sidebar-nav-item.active {
            background: #1e3a5f;
            color: #60a5fa;
        }

        .sidebar-nav-icon {
            font-size: 20px;
            flex-shrink: 0;
            transition: color 0.15s;
        }

        .sidebar-nav-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* ─── Sidebar Message Badge ──────────────────────────────────────── */
        .sidebar-badge {
            background: #ef4444;
            color: #fff;
            font-size: 10px;
            font-weight: 800;
            border-radius: 999px;
            padding: 1px 6px;
            min-width: 18px;
            text-align: center;
        }

        /* ─── Sidebar Footer (Home link) ─────────────────────────────────── */
        .sidebar-footer {
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid #e4eaf0;
        }

        .dark .sidebar-footer {
            border-color: #2a3b4d;
        }

        .sidebar-footer a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 10px;
            text-decoration: none;
            color: #4a6075;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.15s, color 0.15s;
        }

        .sidebar-footer a:hover {
            background: #f0f6fe;
            color: #2b8cee;
        }

        .dark .sidebar-footer a {
            color: #94a3b8;
        }

        .dark .sidebar-footer a:hover {
            background: #1e3a5f;
            color: #60a5fa;
        }

        /* ─── Mobile Overlay Toggle ──────────────────────────────────────── */
        #sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 39;
        }

        #sidebar-overlay.open {
            display: block;
        }

        /* ─── Mobile Toggle Button ──────────────────────────────────────── */
        #sidebar-mobile-toggle {
            display: none;
            position: fixed;
            bottom: 24px;
            left: 16px;
            z-index: 41;
            background: #2b8cee;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 50%;
            width: 46px;
            height: 46px;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(43,140,238,0.4);
            transition: background 0.2s;
        }

        #sidebar-mobile-toggle:hover {
            background: #1a7cd8;
        }

        /* ─── Responsive: push main content right on desktop ─────────────── */
        @media (min-width: 1024px) {
            body.has-sidebar {
                padding-left: 220px;
            }
            /* Keep the top header full-width, shift it to account for sidebar */
            body.has-sidebar #career-auto-nav {
            }
        }

        @media (max-width: 1023px) {
            #career-auto-sidebar {
                transform: translateX(-100%);
                top: 0;
                box-shadow: 4px 0 24px rgba(0,0,0,0.12);
            }

            #career-auto-sidebar.open {
                transform: translateX(0);
            }

            #sidebar-mobile-toggle {
                display: flex;
            }

            body.has-sidebar {
                padding-left: 0;
            }
        }
    </style>

    <!-- Sidebar Overlay (mobile) -->
    <div id="sidebar-overlay"></div>

    <!-- Mobile Toggle Button -->
    <button id="sidebar-mobile-toggle" aria-label="Toggle sidebar">
        <span class="material-symbols-outlined" style="font-size:22px">menu_open</span>
    </button>

    <!-- Sidebar Panel -->
    <nav id="career-auto-sidebar" aria-label="Main navigation">
        ${getUserBadge()}
        <div class="sidebar-nav">
            ${buildNavItems()}
        </div>
        ${renderProfileFooter()}
    </nav>
    `;

    // ─── Inject HTML ────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('sidebar-container');
        if (!container) return;

        container.innerHTML = sidebarHTML;

        window.renderSidebarNav = function () {
            const navElement = container.querySelector('.sidebar-nav');
            if (navElement) {
                navElement.innerHTML = buildNavItems();
            }
        };

        window.addEventListener('hashchange', () => {
            if (window.renderSidebarNav) window.renderSidebarNav();
        });

        // Add class to body so layout shifts right on desktop
        document.body.classList.add('has-sidebar');

        // ─── Mobile toggle ────────────────────────────────────────────────
        const toggleBtn = document.getElementById('sidebar-mobile-toggle');
        const sidebar = document.getElementById('career-auto-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggleIcon = toggleBtn ? toggleBtn.querySelector('.material-symbols-outlined') : null;

        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            if (toggleIcon) toggleIcon.textContent = 'close';
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            if (toggleIcon) toggleIcon.textContent = 'menu_open';
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }

        // Close on resize to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) closeSidebar();
        });

        // ─── Profile Dropdown logic ───────────────────────────────────────
        const profileTrigger = document.getElementById('sidebar-profile-trigger');
        const profileMenu = document.getElementById('sidebar-profile-menu');

        if (profileTrigger && profileMenu) {
            function toggleProfileMenu(e) {
                e.stopPropagation();
                const isHidden = profileMenu.classList.contains('hidden');

                if (isHidden) {
                    profileMenu.classList.remove('hidden');
                    // Small delay for transition
                    setTimeout(() => {
                        profileMenu.classList.remove('opacity-0', 'translate-y-2');
                    }, 10);
                } else {
                    closeProfileMenu();
                }
            }

            function closeProfileMenu() {
                if (!profileMenu.classList.contains('hidden')) {
                    profileMenu.classList.add('opacity-0', 'translate-y-2');
                    setTimeout(() => {
                        profileMenu.classList.add('hidden');
                    }, 200);
                }
            }

            profileTrigger.addEventListener('click', toggleProfileMenu);

            document.addEventListener('click', (e) => {
                if (!profileTrigger.contains(e.target) && !profileMenu.contains(e.target)) {
                    closeProfileMenu();
                }
            });
        }
    });

})();
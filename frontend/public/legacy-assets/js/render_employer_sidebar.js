/**
 * render_employer_sidebar.js
 * Injects a standardized sidebar for employer-facing pages.
 */

(function () {
    // ── Role Guard: employer only ──────────────────────────────
    (function () {
        try {
            var raw = localStorage.getItem("user");
            if (!raw) {
                sessionStorage.setItem("redirectAfterLogin", window.location.href);
                window.location.replace("../../Platform/Auth/auth_center.html?tab=login";
                return;
            }
            var user = JSON.parse(raw);
            if (!(user && (user.role === "employer"))) {
                window.location.replace("../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html";
                return;
            }
        } catch (e) {
            window.location.replace("../../Platform/Auth/auth_center.html?tab=login";
        }
    })();

    const NAV_ITEMS = [
        { icon: 'grid_view', label: 'Dashboard', href: '../../Employer/Dashboard/employer_dashboard_overview.html' },
        { icon: 'group', label: 'Candidates & Ranking', href: '../../Employer/Candidates/ai-powered_candidate_ranking.html' },
        { icon: 'auto_awesome', label: 'Jobs', href: '../../Employer/JobManagement/employer_job_management_dashboard.html' },
        { icon: 'pie_chart', label: 'Reports', href: '../../Employer/Analytics/hiring_analytics_&_reports_dashboard.html' },
        { icon: 'business', label: 'Company Profile', href: '../../Employer/Profile/employer_company_profile.html' }
    ];

    const SETTINGS_ITEMS = [
        { icon: 'manage_accounts', label: 'Account & Security', href: '../../Platform/Settings/settings_center.html?tab=account' },
        { icon: 'notifications', label: 'Notifications', href: '../../Platform/Settings/settings_center.html?tab=notifications' },
        { icon: 'balance', label: 'Bias-Free Policy', href: '../../Employer/HiringPolicy/bias-free_hiring_policy_configuration.html' }
    ];

    function isActive(href) {
        const currentPath = window.location.pathname;
        const targetPath = new URL(href, window.location.origin).pathname;
        // Check if current path includes the target folder name
        const folder = targetPath.split('/').slice(-2, -1)[0];
        return currentPath.includes(folder);
    }

    function renderNav(items) {
        return items.map(item => {
            const active = isActive(item.href);
            const activeClass = active ? 'bg-primary/10 text-primary border-primary font-bold' : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 font-medium';
            return `
            <a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border-l-4 ${activeClass} group">
                <span class="material-symbols-outlined text-[20px] ${active ? 'text-primary' : 'group-hover:text-primary'}">${item.icon}</span>
                <p class="text-sm leading-normal">${item.label}</p>
            </a>`;
        }).join('');
    }

    const sidebarHTML = `
    <aside class="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen shrink-0 sticky top-0">
        <!-- Logo Header -->
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div class="bg-blue-100 rounded-xl p-2 shrink-0">
                <img src="../../assets/logos/career_auto_logo.png" alt="Logo" class="size-6 object-contain" />
            </div>
            <div class="flex flex-col">
                <h1 class="text-slate-900 dark:text-white text-lg font-bold leading-tight">Career Auto</h1>
                <p class="text-slate-500 text-xs font-normal">Employer Portal</p>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto min-h-0">
            ${renderNav(NAV_ITEMS)}
            
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Settings</p>
                ${renderNav(SETTINGS_ITEMS)}
            </div>
        </nav>

        <!-- User Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto relative">
            <div id="sidebar-user-menu" class="hidden absolute bottom-[calc(100%-10px)] left-4 w-[calc(100%-32px)] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
                <a href="../../Employer/Profile/employer_company_profile.html" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">
                    <span class="material-symbols-outlined text-slate-500">account_circle</span>
                    <span class="font-medium text-sm">View Profile</span>
                </a>
                <a href="../../Platform/Settings/settings_center.html" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">
                    <span class="material-symbols-outlined text-slate-500">settings</span>
                    <span class="font-medium text-sm">Settings</span>
                </a>
                <div class="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <a href="../../Platform/System/system_status.html?type=logout" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="font-medium text-sm">Logout</span>
                </a>
            </div>

            <div id="sidebar-user-footer" class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div id="sidebar-user-avatar" class="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">U</div>
                <div class="flex-1 overflow-hidden">
                    <p id="sidebar-user-name" class="text-sm font-bold text-slate-900 dark:text-white truncate">User Account</p>
                    <p id="sidebar-user-plan" class="text-xs text-slate-500 dark:text-slate-400 truncate">Employer Account</p>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-base">expand_more</span>
            </div>
        </div>
    </aside>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.outerHTML = sidebarHTML;
            
            // Re-initialize event listeners for the newly injected HTML
            const userFooter = document.getElementById('sidebar-user-footer');
            const userMenu = document.getElementById('sidebar-user-menu');
            if (userFooter && userMenu) {
                userFooter.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userMenu.classList.toggle('hidden');
                });
                document.addEventListener('click', () => userMenu.classList.add('hidden'));
            }

            // Populate user data
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const nameEl = document.getElementById('sidebar-user-name');
                const avatarEl = document.getElementById('sidebar-user-avatar');
                if (nameEl && user.name) nameEl.textContent = user.name;
                if (avatarEl && user.name) {
                    avatarEl.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                }
            } catch (e) {}
        }
    });
})();

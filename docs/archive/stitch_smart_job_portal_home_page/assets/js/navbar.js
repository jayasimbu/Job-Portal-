/**
 * Shared Navbar Functionality
 * Handles the mobile menu toggle across all pages.
 */

function initNavbar() {
    console.log('navbar.js initializing...');

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Prevent double binding if this script is somehow loaded twice or conflicts with existing logic
    if (menuToggle && menuToggle.dataset.navInitialized) {
        return;
    }

    if (menuToggle && mobileMenu) {
        menuToggle.dataset.navInitialized = 'true';

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent bubbling issues
            mobileMenu.classList.toggle('hidden');

            // Toggle icon between menu and close
            const icon = menuToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = mobileMenu.contains(event.target) || menuToggle.contains(event.target);

            if (!isClickInside && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');

                // Reset icon
                const icon = menuToggle.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'menu';
                }
            }
        });

        // Handle window resize - close menu if switching to desktop view
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) { // md breakpoint is usually 768px
                mobileMenu.classList.add('hidden');
                const icon = menuToggle.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'menu';
                }
            }
        });
    }

    // --- Auth State Logic ---
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }

    // Desktop Navbar
    const desktopActions = document.querySelector('.hidden.md\\:flex.gap-3');
    if (desktopActions) {
        if (user) {
            // Logged In State
            const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
            const userImage = user.picture ? `<img src="${user.picture}" class="h-8 w-8 rounded-full border border-gray-300" alt="User Profile">` : `<div class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border border-gray-300">${userInitial}</div>`;

            desktopActions.innerHTML = `
                <div class="relative">
                    <button id="user-menu-btn" class="flex items-center gap-2 focus:outline-none">
                        ${userImage}
                        <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">expand_more</span>
                    </button>
                    <!-- Dropdown -->
                    <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a2632] rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50">
                        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                             <p class="text-sm font-bold text-gray-900 dark:text-white truncate">${user.name || 'User'}</p>
                             <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${user.email}</p>
                        </div>
                        <a href="../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
                        <a href="../../Platform/Settings/settings_center.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile & Settings</a>
                        <a href="../../Platform/System/system_status.html?type=logout" id="logout-btn" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">Logout</a>
                    </div>
                </div>
            `;

            // Dropdown Toggle Logic
            const userBtn = document.getElementById('user-menu-btn');
            const userDropdown = document.getElementById('user-dropdown');
            const logoutBtn = document.getElementById('logout-btn');

            if (userBtn && userDropdown) {
                userBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userDropdown.classList.toggle('hidden');
                });

                // Close on click outside
                document.addEventListener('click', (e) => {
                    if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                        userDropdown.classList.add('hidden');
                    }
                });
            }

            // Logout Logic — now handled by system_status?type=logout page

        } else {
            // Logged Out State (Restore default if needed, though usually hardcoded in HTML)
            // HTML already has login/signup buttons, so we essentially do nothing or ensure they are present.
            // If we were replacing dynamic content content, we would reset it here.
        }
    }

    // Mobile Navbar (Simplified for now - append Logout if logged in)
    const mobileNav = document.querySelector('#mobile-menu nav');
    if (mobileNav && user) {
        // Find existing login/signup buttons (usually at bottom) and remove/replace them
        const buttons = mobileNav.querySelectorAll('button');
        buttons.forEach(btn => btn.remove());

        // Add User Info & Logout
        const hr = mobileNav.querySelector('hr');
        if (hr) hr.remove();

        const userDivider = document.createElement('hr');
        userDivider.className = 'border-[#e7edf3] dark:border-[#2a3b4d]';
        mobileNav.appendChild(userDivider);

        const mobileUser = document.createElement('div');
        mobileUser.className = 'flex flex-col gap-2 mt-2';
        mobileUser.innerHTML = `
             <div class="px-2 py-1">
                 <p class="text-sm font-bold text-gray-900 dark:text-white truncate">${user.name || 'User'}</p>
                 <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${user.email}</p>
             </div>
             <button id="mobile-logout-btn" class="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg px-4 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-sm font-bold transition-colors mt-2">
                Logout
             </button>
        `;
        mobileNav.appendChild(mobileUser);

        const mbLogout = document.getElementById('mobile-logout-btn');
        if (mbLogout) {
            mbLogout.addEventListener('click', () => {
                window.location.href = '../../Platform/System/system_status.html?type=logout';
            });
        }
    }

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname;

    // Highlight matching links in Desktop and Mobile Nav
    const navLinks = document.querySelectorAll('#career-auto-nav a, #mobile-menu a');

    navLinks.forEach(link => {
        // Skip links containing images (like the logo) or buttons
        if (link.querySelector('img') || link.closest('.hidden.md\\:flex.gap-3') || link.classList.contains('bg-primary') || link.closest('#user-dropdown')) {
            return;
        }

        try {
            const linkUrl = new URL(link.href, window.location.origin);
            const isHomePage = currentPath.endsWith('/') || currentPath.includes('smart_job_portal_home_page');

            // Match current path to link path
            if (currentPath.includes(linkUrl.pathname) && !linkUrl.pathname.includes('smart_job_portal_home_page')) {
                link.classList.add('text-primary');
                link.classList.remove('text-[#0d141b]', 'dark:text-slate-200');
            } else if (isHomePage && linkUrl.href.includes('smart_job_portal_home_page')) {
                link.classList.add('text-primary');
                link.classList.remove('text-[#0d141b]', 'dark:text-slate-200');
            }
        } catch (e) {
            console.error('Error parsing link URL for active state', e);
        }
    });
}

// Ensure active highlighting runs when DOM is loaded or header is dynamically injected
document.addEventListener('DOMContentLoaded', initNavbar);
document.addEventListener('headerLoaded', initNavbar);
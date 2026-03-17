/**
 * auth_guard.js — Career Auto
 *
 * Role-Based Access Control (RBAC) utilities used across all pages.
 *
 * Usage:
 *   AuthGuard.isLoggedIn()               → true/false
 *   AuthGuard.getUser()                  → stored user object or null
 *   AuthGuard.getRole()                  → 'jobseeker' | 'employer' | null
 *   AuthGuard.requireLogin()             → redirects to login if not logged in
 *   AuthGuard.requireRole('jobseeker')   → must be a job seeker; employers → their dashboard; guests → login
 *   AuthGuard.requireRole('employer')    → must be an employer; job seekers → their dashboard; guests → login
 *   AuthGuard.logout()                   → clears session and redirects to login
 *   AuthGuard.showLockedOverlay(el)      → shows blurred lock overlay on an element
 */

const AuthGuard = (() => {

    const JOBSEEKER_HOME = '../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html';
    const EMPLOYER_HOME = '../../Employer/Dashboard/employer_dashboard_overview.html';

    /**
     * Returns the current user object from localStorage, or null if not logged in.
     */
    function getUser() {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return null;
            const user = JSON.parse(raw);
            // Must have at least an email or googleId to be considered logged in
            if (user && (user.email || user.googleId || user.name)) return user;
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Returns true if a user session exists in localStorage.
     */
    function isLoggedIn() {
        return getUser() !== null;
    }

    /**
     * Returns the role of the logged-in user: 'jobseeker', 'employer', or null.
     */
    function getRole() {
        const user = getUser();
        if (!user) return null;
        return user.role || 'jobseeker'; // default to jobseeker for legacy accounts
    }

    /**
     * Redirects to the login/signup page if the user is not logged in.
     * Stores the current URL so the user can be sent back after login.
     * @param {boolean} preferSignup - if true, opens the signup tab instead of login
     */
    function requireLogin(preferSignup = false) {
        if (!isLoggedIn()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            const tab = preferSignup ? 'role' : 'login';
            window.location.href = '../../Platform/Auth/auth_center.html?tab=' + tab;
            return false;
        }
        return true;
    }

    /**
     * Enforces role-based access:
     *   - If not logged in → redirect to login (saves redirect URL)
     *   - If logged in but wrong role → redirect to that user's own portal home silently
     *   - If correct role → do nothing (return true)
     *
     * @param {'jobseeker'|'employer'} requiredRole
     */
    function requireRole(requiredRole) {
        if (!isLoggedIn()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
            return false;
        }
        const role = getRole();
        if (role !== requiredRole) {
            // User is logged in but wrong role — send them to THEIR own home
            if (role === 'employer') {
                window.location.href = EMPLOYER_HOME;
            } else {
                window.location.href = JOBSEEKER_HOME;
            }
            return false;
        }
        return true;
    }

    /**
     * Returns the correct home URL for the currently logged-in user's role.
     */
    function getRoleHome() {
        const role = getRole();
        if (role === 'employer') return EMPLOYER_HOME;
        return JOBSEEKER_HOME;
    }

    /**
     * Logs the user out by clearing localStorage and redirecting to login.
     */
    function logout() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = '../../Platform/Auth/auth_center.html?tab=login';
    }

    /**
     * Shows a locked/blurred overlay on a given element with a "Login to unlock" prompt.
     * @param {HTMLElement} el
     * @param {string} message
     */
    function showLockedOverlay(el, message = 'Log in to unlock AI features') {
        el.style.position = 'relative';
        const overlay = document.createElement('div');
        overlay.className = 'auth-lock-overlay';
        overlay.innerHTML = `
            <div class="auth-lock-box">
                <span class="material-symbols-outlined auth-lock-icon">lock</span>
                <p class="auth-lock-title">${message}</p>
                <p class="auth-lock-sub">Create a free account to access AI-powered matching, resume analysis, ATS scoring and more.</p>
                <div class="auth-lock-buttons">
                    <button onclick="window.location.href='../../Platform/Auth/auth_center.html?tab=login'" class="auth-lock-btn-login">Log In</button>
                    <button onclick="window.location.href='../../Platform/Auth/auth_center.html?tab=role'" class="auth-lock-btn-signup">Sign Up Free</button>
                </div>
            </div>
        `;
        el.appendChild(overlay);
    }

    return {
        isLoggedIn,
        getUser,
        getRole,
        getRoleHome,
        requireLogin,
        requireRole,
        logout,
        showLockedOverlay
    };
})();
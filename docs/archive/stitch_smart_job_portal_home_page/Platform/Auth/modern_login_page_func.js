// modern_login_page_func.js
// NOTE: Login form submission is handled inline in auth_center.html.
// This file only handles password visibility toggle for the login panel.

document.addEventListener('DOMContentLoaded', () => {
    // ── Login password visibility toggle ────────────────────────────────────
    const toggleLoginPw = document.getElementById('togglePassword');
    if (toggleLoginPw) {
        toggleLoginPw.addEventListener('click', function(e) {
            e.preventDefault();
            const inp = document.getElementById('login-password');
            if (!inp) return;
            const newType = inp.type === 'password' ? 'text' : 'password';
            inp.type = newType;
            const icon = this.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = newType === 'text' ? 'visibility_off' : 'visibility';
        });
    }
});
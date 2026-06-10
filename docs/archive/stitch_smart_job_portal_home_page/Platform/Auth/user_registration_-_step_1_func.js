// Functional logic for user_registration_-_step_1

document.addEventListener('DOMContentLoaded', () => {
    console.log('Loaded user_registration_-_step_1_func.js');

    // Password Visibility Toggle
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentType = passwordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);
            const iconSpan = this.querySelector('.material-symbols-outlined');
            if (iconSpan) {
                iconSpan.textContent = newType === 'text' ? 'visibility_off' : 'visibility';
            }
        });
    }

    // Confirm Password Visibility Toggle
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (toggleConfirmPasswordBtn && confirmPasswordInput) {
        toggleConfirmPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentType = confirmPasswordInput.getAttribute('type');
            const newType = currentType === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', newType);
            const iconSpan = this.querySelector('.material-symbols-outlined');
            if (iconSpan) {
                iconSpan.textContent = newType === 'text' ? 'visibility_off' : 'visibility';
            }
        });
    }

    // Password Strength Meter Logic
    const passwordStrengthInput = document.getElementById('password');
    const confirmPasswordMatchInput = document.getElementById('confirmPassword');
    const matchError = document.getElementById('passwordMatchError');

    if (passwordStrengthInput) {
        passwordStrengthInput.addEventListener('input', function() {
            const val = this.value;
            const criteria = {
                length: val.length >= 8 && val.length <= 15,
                upper: /[A-Z]/.test(val),
                lower: /[a-z]/.test(val),
                number: /[0-9]/.test(val),
                symbol: /[^A-Za-z0-9]/.test(val)
            };
            updateStrengthUI('length', criteria.length);
            updateStrengthUI('upper', criteria.upper);
            updateStrengthUI('lower', criteria.lower);
            updateStrengthUI('number', criteria.number);
            updateStrengthUI('symbol', criteria.symbol);
            checkMatch();
        });
    }

    if (confirmPasswordMatchInput) {
        confirmPasswordMatchInput.addEventListener('input', checkMatch);
    }

    function checkMatch() {
        if (!passwordStrengthInput || !confirmPasswordMatchInput) return;
        const pass = passwordStrengthInput.value;
        const confirm = confirmPasswordMatchInput.value;
        if (!confirm) {
            matchError.classList.add('hidden');
            return;
        }
        matchError.classList.remove('hidden');
        if (pass === confirm) {
            matchError.textContent = 'Passwords match ✅';
            matchError.classList.remove('text-red-500');
            matchError.classList.add('text-green-500');
        } else {
            matchError.textContent = 'Passwords do not match ❌';
            matchError.classList.remove('text-green-500');
            matchError.classList.add('text-red-500');
        }
    }

    function updateStrengthUI(idSuffix, isMet) {
        const bar = document.getElementById(`bar-${idSuffix}`);
        const text = document.getElementById(`req-${idSuffix}`);
        if (isMet) {
            if (bar) {
                bar.classList.remove('bg-slate-200', 'dark:bg-slate-700');
                bar.classList.add('bg-green-500');
            }
            if (text) {
                text.classList.remove('text-slate-500', 'dark:text-slate-400');
                text.classList.add('text-green-600', 'font-bold');
            }
        } else {
            if (bar) {
                bar.classList.add('bg-slate-200', 'dark:bg-slate-700');
                bar.classList.remove('bg-green-500');
            }
            if (text) {
                text.classList.add('text-slate-500', 'dark:text-slate-400');
                text.classList.remove('text-green-600', 'font-bold');
            }
        }
    }

    // Form Submission Logic
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameElement = document.getElementById('fullname');
            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');
            const confirmPasswordElement = document.getElementById('confirmPassword');
            const matchErr = document.getElementById('passwordMatchError');

            const name = nameElement ? nameElement.value.trim() : '';
            const email = emailElement ? emailElement.value.trim() : '';
            const password = passwordElement ? passwordElement.value : '';
            const confirmPassword = confirmPasswordElement ? confirmPasswordElement.value : '';

            if (!name || !email || !password || !confirmPassword) {
                showSignupError('Please fill in all fields');
                return;
            }

            if (password !== confirmPassword) {
                if (matchErr) matchErr.classList.remove('hidden');
                showSignupError('Passwords do not match');
                return;
            }

            // Role is set when user clicked "Job Seeker" or "Employer" on the role panel
            const pendingRole = sessionStorage.getItem('pendingRole') || 'jobseeker';

            const signupError = document.getElementById('signupError');
            if (signupError) signupError.classList.add('hidden');

            // Disable button while submitting
            const btn = document.getElementById('nextStepBtn');
            if (btn) btn.disabled = true;

            fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role: pendingRole
                    })
                })
                .then(response => {
                    if (response.status === 409) {
                        throw new Error('⚠️ Account already exists. Please log in instead.');
                    }
                    if (!response.ok) {
                        throw new Error('Registration failed. Please try again.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Signup success:', data);
                    localStorage.setItem('user', JSON.stringify({
                        name: name,
                        email: email,
                        role: pendingRole
                    }));
                    sessionStorage.removeItem('pendingRole');
                    const redirect = sessionStorage.getItem('redirectAfterLogin');
                    sessionStorage.removeItem('redirectAfterLogin');
                    if (redirect && !redirect.includes('auth_center')) {
                        window.location.href = redirect;
                    } else if (pendingRole === 'employer') {
                        window.location.href = '../../Employer/Dashboard/employer_dashboard_overview.html';
                    } else {
                        window.location.href = '../../JobSeeker/Profile/resume_upload_&_validation_center.html';
                    }
                })
                .catch((error) => {
                    console.error('Signup error:', error);
                    showSignupError(error.message);
                    if (btn) btn.disabled = false;
                });
        });
    }

    function showSignupError(msg) {
        const signupError = document.getElementById('signupError');
        if (signupError) {
            signupError.textContent = msg;
            signupError.classList.remove('hidden');
        }
    }
});
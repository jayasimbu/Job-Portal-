// Google OAuth Configuration and Initialization
// Handles both Google Sign-In (login) and Google Sign-Up flows

const getClientId = () => {
    if (typeof OAUTH_CONFIG === 'undefined') {
        console.error('OAUTH_CONFIG is not defined. Please check ../../config/oauth_config.js');
        return null;
    }
    return OAUTH_CONFIG.GOOGLE_CLIENT_ID;
};

let tokenClient;
// Track whether user clicked Sign In or Sign Up button
let googleAuthAction = 'login';

function initializeGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
        setTimeout(initializeGoogleSignIn, 100);
        return;
    }

    const clientId = getClientId();
    if (!clientId) {
        console.error('Missing Google Client ID. Check oauth_config.js');
        return;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: handleGoogleSignIn
    });

    // Sign In button → action = 'login'
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            googleAuthAction = 'login';
            if (!tokenClient) {
                alert('Google Sign-In not ready. Try again.');
                return;
            }
            tokenClient.requestAccessToken();
        });
    }

    // Sign Up button → action = 'signup'
    const googleSignUpBtn = document.getElementById('googleSignUpBtn');
    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener('click', () => {
            googleAuthAction = 'signup';
            if (!tokenClient) {
                alert('Google Sign-In not ready. Try again.');
                return;
            }
            tokenClient.requestAccessToken();
        });
    }
}

async function handleGoogleSignIn(tokenResponse) {
    if (!tokenResponse || !tokenResponse.access_token) {
        console.error('No access token received from Google');
        return;
    }

    try {
        const userInfo = await fetchUserProfile(tokenResponse.access_token);
        const action = googleAuthAction;
        const role = sessionStorage.getItem('pendingRole') || 'jobseeker';

        if (action === 'signup') {
            const signupRes = await fetch('http://localhost:5000/google_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userInfo.email,
                    name: userInfo.name,
                    sub: userInfo.sub,
                    picture: userInfo.picture,
                    role: role,
                    action: 'signup'
                })
            });

            const data = await signupRes.json();

            if (!signupRes.ok) {
                showAuthError('signupError', data.message || 'Google Sign-Up failed.');
                return;
            }

            // Success: store user and redirect
            sessionStorage.removeItem('pendingRole');
            localStorage.setItem('user', JSON.stringify({
                name: data.user?.name || userInfo.name,
                email: data.user?.email || userInfo.email,
                picture: data.user?.picture || userInfo.picture,
                role: role,
                isGoogle: true
            }));
            const redirect = sessionStorage.getItem('redirectAfterLogin');
            sessionStorage.removeItem('redirectAfterLogin');
            if (redirect && !redirect.includes('auth_center')) {
                window.location.href = redirect;
            } else if (role === 'employer') {
                window.location.href = '../../Employer/Dashboard/employer_dashboard_overview.html';
            } else {
                window.location.href = '../../JobSeeker/Profile/resume_upload_&_validation_center.html';
            }
            return;
        }

        // action === 'login'
        const backendResponse = await fetch('http://localhost:5000/google_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userInfo.email,
                name: userInfo.name,
                sub: userInfo.sub,
                action: 'login'
            })
        });

        const data = await backendResponse.json();

        if (backendResponse.status === 404) {
            showAuthError('loginError', '❌ Account does not exist. Please sign up first.');
            return;
        }
        if (!backendResponse.ok) {
            throw new Error(data.message || 'Google Login failed.');
        }

        const userRole = (data.user && data.user.role) ? data.user.role : 'jobseeker';

        if (typeof handlePostLoginRedirect === 'function') {
            handlePostLoginRedirect({
                name: data.user?.name || userInfo.name,
                email: data.user?.email || userInfo.email,
                role: userRole,
                picture: (data.user && data.user.picture !== undefined) ? data.user.picture : userInfo.picture,
                uploadedResumes: data.user.uploadedResumes,
                activeResumeId: data.user.activeResumeId,
                headline: data.user.headline,
                skills: data.user.skills,
                isGoogle: true
            });
        } else {
            localStorage.setItem('user', JSON.stringify({
                name: data.user?.name || userInfo.name,
                email: data.user?.email || userInfo.email,
                picture: (data.user && data.user.picture !== undefined) ? data.user.picture : userInfo.picture,
                role: userRole,
                isGoogle: true
            }));
            const redirect = sessionStorage.getItem('redirectAfterLogin');
            sessionStorage.removeItem('redirectAfterLogin');
            if (redirect && !redirect.includes('auth_center')) {
                window.location.href = redirect;
            } else if (userRole === 'employer') {
                window.location.href = '../../Employer/Dashboard/employer_dashboard_overview.html';
            } else {
                window.location.href = '../../JobSeeker/Dashboard/job_seeker_dashboard_intelligence.html';
            }
        }

    } catch (error) {
        console.error('Google auth error:', error);
        showAuthError(googleAuthAction === 'signup' ? 'signupError' : 'loginError', error.message);
    }
}

function showAuthError(elementId, msg) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = msg;
        el.classList.remove('hidden');
    } else {
        alert(msg);
    }
}

async function fetchUserProfile(accessToken) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch Google user info');
    return await response.json();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGoogleSignIn);
} else {
    initializeGoogleSignIn();
}
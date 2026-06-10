// OAuth Configuration
// This file contains OAuth client credentials
// IMPORTANT: While this file helps organize your config, OAuth Client IDs
// are PUBLIC by design and will always be visible in frontend code.
// The CLIENT SECRET should NEVER be in frontend code - it stays on the server.

const OAUTH_CONFIG = {
    // Replace this with your actual Google OAuth Client ID
    // Get it from: https://console.cloud.google.com/apis/credentials
    GOOGLE_CLIENT_ID: '263143123757-frlm7p4mrhakatnp4i71j4uo6sjl78bu.apps.googleusercontent.com',

    // OAuth scopes (what user data you need access to)
    SCOPES: 'email profile',

    // Authorized redirect URIs should match what's configured in Google Cloud Console
    // For local development: http://127.0.0.1:5500 or http://localhost:3000
    // For production: https://yourdomain.com
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OAUTH_CONFIG;
}
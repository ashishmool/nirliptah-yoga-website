// import { OAuthProvider } from 'appwrite'
// import { account } from "@/backend/configs/config"
//
// export async function googleAuth() {
//     await account.createOAuth2Session(
//         OAuthProvider.Google,
//         'http://localhost:5173', // Localhost URL for the redirect
//         'http://localhost:5173'  // Localhost URL for the redirect
//     )
// }

// googleAuth.ts

export async function googleAuth() {
    try {
        // Mocked OAuth2 authentication logic
        const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const clientId = "your-google-client-id"; // Replace with your Google OAuth2 client ID
        const redirectUri = "http://localhost:5000";
        const responseType = "token"; // or "code" if using server-side
        const scope = "profile email";

        // Construct the OAuth2 URL
        const oauthUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

        // Redirect the user to the Google OAuth2 URL
        window.location.href = oauthUrl;
    } catch (error) {
        console.error("Error during Google OAuth:", error);
    }
}

function handleOAuthResponse() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');

    if (token) {
        console.log("Access Token:", token);
        // Proceed with API calls using the token
    } else {
        console.error("Failed to retrieve access token.");
    }
}

// handleOAuthResponse();
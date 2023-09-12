const CLIENT_ID: string = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI: string = import.meta.env.VITE_REDIRECT_URL;
const SCOPES: string[] = JSON.parse(import.meta.env.VITE_SPOTIFY_SCOPES)

function generateCodeVerifier(length: number): string {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function requestAuthorisation() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("scope", SCOPES.join(' '));
    params.append("code_challenge", challenge);
    params.append("response_type", "code");
    params.append("code_challenge_method", "S256");

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", verifier!);
    params.append("grant_type", "authorization_code");
    params.append("code", code);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })


        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }

        let data = await response.json();

        return data.access_token

    } catch (error) {

        console.error('Error:', error);
    }
}
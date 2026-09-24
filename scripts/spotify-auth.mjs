// One-time helper to get a Spotify refresh token for the "now playing" widget.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    and add this Redirect URI: http://127.0.0.1:8888/callback
// 2. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file
// 3. Run: npm run spotify:auth   and open the URL it prints
//
// The refresh token is printed in this terminal only; copy it into .env
// and into Vercel's environment variables. Nothing is sent anywhere else.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = "user-read-currently-playing user-read-recently-played";

// Minimal .env reader so the script has no dependencies
if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
}

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;

if (!clientId || !clientSecret) {
    console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env");
    process.exit(1);
}

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
}).toString();

const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", REDIRECT_URI);
    if (url.pathname !== "/callback") {
        response.writeHead(404).end();
        return;
    }

    const code = url.searchParams.get("code");
    if (!code) {
        response.end(`Authorization failed: ${url.searchParams.get("error") ?? "no code"}`);
        server.close();
        return;
    }

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
    });
    const data = await tokenResponse.json();

    if (!data.refresh_token) {
        console.error("\nCould not get a refresh token:", data);
        response.end("Something went wrong, check the terminal.");
    } else {
        console.log("\nDone! Add this line to .env and to Vercel (Settings → Environment Variables):\n");
        console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
        response.end("All set! You can close this tab and go back to the terminal.");
    }

    server.close();
});

server.listen(PORT, "127.0.0.1", () => {
    console.log("Open this URL in your browser and accept:\n");
    console.log(authorizeUrl.toString());
});

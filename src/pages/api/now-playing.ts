// What Carlos is listening to on Spotify (or the last track he played).
// Runs on demand as a Vercel function; responses are cached at the edge.
import type { APIRoute } from "astro";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from "astro:env/server";

export const prerender = false;

interface SpotifyTrack {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string; width: number }[] };
    external_urls: { spotify: string };
}

export interface NowPlaying {
    isPlaying: boolean;
    title: string;
    artist: string;
    url: string;
    cover?: string;
}

const API = "https://api.spotify.com/v1/me/player";

async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN! }),
    });

    if (!response.ok) throw new Error(`Spotify token request failed: ${response.status}`);
    return (await response.json()).access_token as string;
}

function toNowPlaying(track: SpotifyTrack, isPlaying: boolean): NowPlaying {
    // Smallest cover that is still sharp at 2x for a 40px thumbnail
    const images = [...track.album.images].sort((a, b) => a.width - b.width);
    const cover = images.find((image) => image.width >= 64) ?? images.at(-1);

    return {
        isPlaying,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        url: track.external_urls.spotify,
        cover: cover?.url,
    };
}

async function fetchNowPlaying(): Promise<NowPlaying | null> {
    const headers = { Authorization: `Bearer ${await getAccessToken()}` };

    // 204 means nothing is playing; podcasts and ads have no `item.album`
    const current = await fetch(`${API}/currently-playing`, { headers });
    if (current.status === 200) {
        const data = await current.json();
        if (data.item?.album) return toNowPlaying(data.item, data.is_playing);
    }

    const recent = await fetch(`${API}/recently-played?limit=1`, { headers });
    if (!recent.ok) return null;

    const track = (await recent.json()).items?.[0]?.track;
    return track ? toNowPlaying(track, false) : null;
}

const json = (body: unknown, maxAge: number) =>
    new Response(JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
            // Shared by every visitor for `maxAge` seconds; keeps Spotify's rate limit safe
            "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
        },
    });

export const GET: APIRoute = async () => {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
        return json(null, 3600);
    }

    try {
        return json(await fetchNowPlaying(), 30);
    } catch (error) {
        console.error(error);
        return json(null, 60);
    }
};

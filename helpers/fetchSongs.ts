import axios, { AxiosError } from 'axios';
import 'dotenv/config';

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface SpotifyTrack {
    name: string;
    artist: string;
    album: string;
    preview_url: string | null;
    image: string | undefined;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

console.log("Client ID: ", CLIENT_ID);


// Validate environment variables
if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing required environment variables. Please check your .env file.');
}

const getSpotifyAccessToken = async (): Promise<string | null> => {
    try {
        const { data } = await axios.post<SpotifyTokenResponse>(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return data.access_token;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error getting Spotify token:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers
            });
        } else {
            console.error('Unexpected error:', error);
        }
        return null;
    }
};

export const fetchSongs = async (query: string): Promise<SpotifyTrack[]> => {
    if (!query) return [];
    
    const token = await getSpotifyAccessToken();
    if (!token) return [];
    
    try {
        const { data } = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: query, type: 'track', limit: 10 },
        });
        
        return data.tracks.items.map((track: any) => ({
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            preview_url: track.preview_url,
            image: track.album.images[0]?.url,
        }));
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error fetching songs:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
        } else {
            console.error('Unexpected error:', error);
        }
        return [];
    }
};
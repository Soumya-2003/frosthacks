import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

console.log(API_KEY); // Debugging: Ensure the API key is loaded

// Function to fetch games from RAWG
export const fetchGames = async (query: string) => {
    if (!query) return [];

    try {
        const { data } = await axios.get(`${BASE_URL}/games`, {
            params: { key: API_KEY, search: query, page_size: 10 },
        });

        return data.results.map((game: any) => ({
            name: game.name,
            releaseDate: game.released || "Unknown",
            backgroundImage: game.background_image || "",
            rating: game.rating || "N/A",
            platforms: game.platforms?.map((p: any) => p.platform.name).join(", ") || "Unknown",
        }));
    } catch (error) {
        console.error("Error fetching games:", error);
        return [];
    }
};

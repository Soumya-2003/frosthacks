import axios from "axios";


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // Replace with your TMDB API Key
const BASE_URL = "https://api.themoviedb.org/3";

// Function to fetch movies from TMDB
export const fetchMovies = async (query: string) => {
    if (!query) return [];

    try {
        const { data } = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: query,
                language: "en-US",
                include_adult: false,
                page: 1,
            },
        });

        return data.results.map((movie: any) => ({
            title: movie.title,
            year: movie.release_date ? movie.release_date.split("-")[0] : "Unknown",
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
            overview: movie.overview,
            rating: movie.vote_average,
        }));
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};

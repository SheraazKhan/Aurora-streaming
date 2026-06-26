const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchNewest: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`,
  fetchTrendingTV: `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`,
  fetchActionAdventureTV: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10759`,
  fetchTrendingDay: `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`,
  fetchUpcomingMovies: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`,
  fetchOnTheAir: `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US`,
  fetchSimilar: (type: string, id: number) =>
    `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`,
  fetchCredits: (type: string, id: number) =>
    `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`,
  fetchVideos: (type: string, id: number) =>
    `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`,
  fetchDetails: (type: string, id: number) =>
    `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`,
  fetchSeasonDetails: (tvId: number, seasonNum: number) =>
    `${BASE_URL}/tv/${tvId}/season/${seasonNum}?api_key=${API_KEY}&language=en-US`,
  fetchGenres: (type: string) =>
    `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=en-US`,
  fetchDiscover: (type: string, genreId: number) =>
    `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`,
  searchMulti: (query: string, page: number) =>
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
};

export default requests;

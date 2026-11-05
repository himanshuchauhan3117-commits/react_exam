import axios from 'axios';
import { MOCK_POPULAR_MOVIES } from './mockMovieData';

// Default TMDb v3 API Key (can be overridden via localStorage or REACT_APP_TMDB_API_KEY)
const DEFAULT_TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || '84145f8e02d8478d10b784a9ec047a0c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const getApiKey = () => {
  return localStorage.getItem('tmdb_api_key') || DEFAULT_TMDB_API_KEY;
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem('tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('tmdb_api_key');
  }
};

/**
 * Fetch popular movies from TMDb with fallback to mock data
 */
export const fetchPopularMoviesApi = async (page = 1) => {
  const apiKey = getApiKey();
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: apiKey,
        page: page,
        language: 'en-US'
      },
      timeout: 6000
    });

    if (response.data && response.data.results && response.data.results.length > 0) {
      return {
        results: response.data.results.map(formatMovieSummary),
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
        isLive: true
      };
    }
    throw new Error('No results received from TMDb');
  } catch (err) {
    console.warn('TMDb API request failed, falling back to mock catalog:', err.message);
    // Return high-quality mock data
    return {
      results: MOCK_POPULAR_MOVIES.map(formatMovieSummary),
      page: 1,
      total_pages: 1,
      total_results: MOCK_POPULAR_MOVIES.length,
      isLive: false,
      fallbackNotice: 'Displaying curated library catalog (offline mode or API fallback)'
    };
  }
};

/**
 * Fetch detailed movie information including cast, languages, runtime, and overview
 */
export const fetchMovieDetailsApi = async (id) => {
  const apiKey = getApiKey();
  const movieId = parseInt(id, 10);

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: apiKey,
        append_to_response: 'credits,videos',
        language: 'en-US'
      },
      timeout: 6000
    });

    const data = response.data;
    return {
      id: data.id,
      title: data.title || data.original_title,
      original_title: data.original_title,
      tagline: data.tagline,
      overview: data.overview || 'No overview available for this movie.',
      poster_path: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : 'https://placehold.co/500x750?text=No+Poster',
      backdrop_path: data.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${data.backdrop_path}` : null,
      release_date: data.release_date || 'N/A',
      vote_average: data.vote_average ? Number(data.vote_average.toFixed(1)) : 0,
      vote_count: data.vote_count || 0,
      runtime: data.runtime || 0,
      genres: data.genres || [],
      spoken_languages: data.spoken_languages && data.spoken_languages.length > 0
        ? data.spoken_languages
        : [{ english_name: 'English', name: 'English' }],
      cast: data.credits && data.credits.cast
        ? data.credits.cast.slice(0, 10).map(c => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profile_path: c.profile_path ? `${TMDB_IMAGE_BASE_URL}${c.profile_path}` : null
          }))
        : [],
      budget: data.budget,
      revenue: data.revenue,
      status: data.status,
      isLive: true
    };
  } catch (err) {
    console.warn(`TMDb movie details failed for ID ${id}, searching mock dataset:`, err.message);
    const mockMovie = MOCK_POPULAR_MOVIES.find(m => m.id === movieId) || MOCK_POPULAR_MOVIES[0];
    return {
      ...mockMovie,
      isLive: false,
      fallbackNotice: 'Displaying details from catalog cache'
    };
  }
};

/**
 * Search movies by query with fallback to mock search
 */
export const searchMoviesApi = async (query, page = 1) => {
  if (!query || !query.trim()) {
    return { results: [], total_results: 0, page: 1, total_pages: 0 };
  }

  const apiKey = getApiKey();
  const trimmedQuery = query.trim();

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: apiKey,
        query: trimmedQuery,
        page: page,
        language: 'en-US',
        include_adult: false
      },
      timeout: 6000
    });

    if (response.data && response.data.results) {
      return {
        results: response.data.results.map(formatMovieSummary),
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
        isLive: true
      };
    }
    throw new Error('Search yielded empty payload');
  } catch (err) {
    console.warn('TMDb search failed, searching mock catalog:', err.message);
    const filtered = MOCK_POPULAR_MOVIES.filter(m =>
      m.title.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      (m.overview && m.overview.toLowerCase().includes(trimmedQuery.toLowerCase())) ||
      (m.genres && m.genres.some(g => g.name.toLowerCase().includes(trimmedQuery.toLowerCase())))
    );

    return {
      results: filtered.map(formatMovieSummary),
      page: 1,
      total_pages: 1,
      total_results: filtered.length,
      isLive: false,
      fallbackNotice: 'Search filtered from local movie library'
    };
  }
};

/**
 * Normalize movie summary shape
 */
function formatMovieSummary(m) {
  let poster = m.poster_path;
  if (poster && !poster.startsWith('http')) {
    poster = `${TMDB_IMAGE_BASE_URL}${poster}`;
  }
  let backdrop = m.backdrop_path;
  if (backdrop && !backdrop.startsWith('http')) {
    backdrop = `${TMDB_BACKDROP_BASE_URL}${backdrop}`;
  }

  return {
    id: m.id,
    title: m.title || m.original_title || 'Untitled',
    original_title: m.original_title || m.title,
    overview: m.overview || 'No overview available.',
    poster_path: poster || 'https://placehold.co/500x750?text=No+Poster',
    backdrop_path: backdrop,
    release_date: m.release_date || 'N/A',
    vote_average: m.vote_average ? Number(m.vote_average.toFixed(1)) : 0,
    vote_count: m.vote_count || 0,
    popularity: m.popularity || 0,
    genre_ids: m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []),
    genres: m.genres || [],
    spoken_languages: m.spoken_languages || [{ english_name: 'English' }]
  };
}


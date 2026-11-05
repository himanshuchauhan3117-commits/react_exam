import {
  FETCH_POPULAR_MOVIES_REQUEST,
  FETCH_POPULAR_MOVIES_SUCCESS,
  FETCH_POPULAR_MOVIES_FAILURE,
  FETCH_MOVIE_DETAILS_REQUEST,
  FETCH_MOVIE_DETAILS_SUCCESS,
  FETCH_MOVIE_DETAILS_FAILURE,
  CLEAR_MOVIE_DETAILS,
  SEARCH_MOVIES_REQUEST,
  SEARCH_MOVIES_SUCCESS,
  SEARCH_MOVIES_FAILURE,
  CLEAR_SEARCH_RESULTS,
  SET_SEARCH_QUERY,
  SET_GENRE_FILTER,
  SET_SORT_BY
} from '../types';

import {
  fetchPopularMoviesApi,
  fetchMovieDetailsApi,
  searchMoviesApi
} from '../../services/movieApi';

// ==========================================
// THUNKS FOR ASYNCHRONOUS OPERATIONS
// ==========================================

/**
 * Thunk to fetch popular movies
 * Handles REQUEST, SUCCESS, and FAILURE actions
 */
export const fetchPopularMovies = (page = 1) => async (dispatch) => {
  dispatch({ type: FETCH_POPULAR_MOVIES_REQUEST });
  try {
    const data = await fetchPopularMoviesApi(page);
    dispatch({
      type: FETCH_POPULAR_MOVIES_SUCCESS,
      payload: {
        movies: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
        isLive: data.isLive,
        fallbackNotice: data.fallbackNotice
      }
    });
  } catch (error) {
    dispatch({
      type: FETCH_POPULAR_MOVIES_FAILURE,
      payload: error.message || 'Failed to fetch popular movies'
    });
  }
};

/**
 * Thunk to fetch complete details of a specific movie
 * Handles REQUEST, SUCCESS, and FAILURE actions
 */
export const fetchMovieDetails = (id) => async (dispatch) => {
  dispatch({ type: FETCH_MOVIE_DETAILS_REQUEST });
  try {
    const movieData = await fetchMovieDetailsApi(id);
    dispatch({
      type: FETCH_MOVIE_DETAILS_SUCCESS,
      payload: movieData
    });
  } catch (error) {
    dispatch({
      type: FETCH_MOVIE_DETAILS_FAILURE,
      payload: error.message || `Failed to fetch details for movie ${id}`
    });
  }
};

/**
 * Thunk to search movies by text query
 * Handles REQUEST, SUCCESS, and FAILURE actions
 */
export const searchMovies = (query, page = 1) => async (dispatch) => {
  if (!query || !query.trim()) {
    dispatch(clearSearchResults());
    return;
  }

  dispatch({ type: SEARCH_MOVIES_REQUEST, payload: query });
  try {
    const data = await searchMoviesApi(query, page);
    dispatch({
      type: SEARCH_MOVIES_SUCCESS,
      payload: {
        results: data.results,
        query: query,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
        isLive: data.isLive,
        fallbackNotice: data.fallbackNotice
      }
    });
  } catch (error) {
    dispatch({
      type: SEARCH_MOVIES_FAILURE,
      payload: error.message || 'Error executing movie search'
    });
  }
};

// ==========================================
// SYNCHRONOUS ACTION CREATORS
// ==========================================

export const clearMovieDetails = () => ({
  type: CLEAR_MOVIE_DETAILS
});

export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS
});

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query
});

export const setGenreFilter = (genreId) => ({
  type: SET_GENRE_FILTER,
  payload: genreId
});

export const setSortBy = (sortBy) => ({
  type: SET_SORT_BY,
  payload: sortBy
});


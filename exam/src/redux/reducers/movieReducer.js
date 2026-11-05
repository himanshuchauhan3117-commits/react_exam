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

const initialState = {
  popularMovies: [],
  popularLoading: false,
  popularError: null,
  page: 1,
  totalPages: 1,
  totalResults: 0,
  
  movieDetails: null,
  detailsLoading: false,
  detailsError: null,

  searchResults: [],
  searchQuery: '',
  searchLoading: false,
  searchError: null,
  searchTotalResults: 0,

  genreFilter: 'all',
  sortBy: 'popularity.desc',
  fallbackNotice: null
};

export default function movieReducer(state = initialState, action) {
  switch (action.type) {
    // Popular Movies
    case FETCH_POPULAR_MOVIES_REQUEST:
      return {
        ...state,
        popularLoading: true,
        popularError: null
      };

    case FETCH_POPULAR_MOVIES_SUCCESS:
      return {
        ...state,
        popularLoading: false,
        popularMovies: action.payload.movies,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        popularError: null,
        fallbackNotice: action.payload.fallbackNotice || null
      };

    case FETCH_POPULAR_MOVIES_FAILURE:
      return {
        ...state,
        popularLoading: false,
        popularError: action.payload
      };

    // Movie Details
    case FETCH_MOVIE_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null
      };

    case FETCH_MOVIE_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        movieDetails: action.payload,
        detailsError: null
      };

    case FETCH_MOVIE_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.payload
      };

    case CLEAR_MOVIE_DETAILS:
      return {
        ...state,
        movieDetails: null,
        detailsError: null,
        detailsLoading: false
      };

    // Movie Search
    case SEARCH_MOVIES_REQUEST:
      return {
        ...state,
        searchLoading: true,
        searchError: null,
        searchQuery: action.payload
      };

    case SEARCH_MOVIES_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: action.payload.results,
        searchQuery: action.payload.query,
        searchTotalResults: action.payload.totalResults,
        searchError: null
      };

    case SEARCH_MOVIES_FAILURE:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload,
        searchResults: []
      };

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: [],
        searchQuery: '',
        searchLoading: false,
        searchError: null
      };

    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };

    case SET_GENRE_FILTER:
      return {
        ...state,
        genreFilter: action.payload
      };

    case SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      };

    default:
      return state;
  }
}


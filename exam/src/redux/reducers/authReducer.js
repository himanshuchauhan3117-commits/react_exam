import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST,
  UPDATE_PREFERENCES
} from '../types';

// Load initial state from localStorage
const storedUser = localStorage.getItem('cineverse_user');
const storedFavorites = localStorage.getItem('cineverse_favorites');
const storedWatchlist = localStorage.getItem('cineverse_watchlist');

const initialState = {
  isAuthenticated: !!storedUser,
  user: storedUser ? JSON.parse(storedUser) : null,
  favorites: storedFavorites ? JSON.parse(storedFavorites) : [],
  watchlist: storedWatchlist ? JSON.parse(storedWatchlist) : [],
  loading: false,
  error: null
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      };

    case ADD_TO_FAVORITES: {
      const movie = action.payload;
      if (state.favorites.some(f => f.id === movie.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [movie, ...state.favorites]
      };
    }

    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(m => m.id !== action.payload)
      };

    case ADD_TO_WATCHLIST: {
      const movie = action.payload;
      if (state.watchlist.some(w => w.id === movie.id)) {
        return state;
      }
      return {
        ...state,
        watchlist: [movie, ...state.watchlist]
      };
    }

    case REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter(m => m.id !== action.payload)
      };

    case UPDATE_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    default:
      return state;
  }
}


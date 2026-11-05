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

/**
 * User login action thunk
 */
export const login = (username, password, preferences = {}) => (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  // Simulate network auth delay
  setTimeout(() => {
    if (!username || !username.trim()) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: 'Please enter a valid username'
      });
      return;
    }

    const userData = {
      username: username.trim(),
      email: `${username.toLowerCase().replace(/\s+/g, '')}@cineverse.io`,
      role: 'Member',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      preferredGenres: preferences.preferredGenres || ['Action', 'Sci-Fi'],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    // Store in localStorage for session persistence
    localStorage.setItem('cineverse_user', JSON.stringify(userData));

    dispatch({
      type: LOGIN_SUCCESS,
      payload: userData
    });
  }, 400);
};

/**
 * User logout action
 */
export const logout = () => (dispatch) => {
  localStorage.removeItem('cineverse_user');
  dispatch({ type: LOGOUT });
};

/**
 * Add movie to user favorites
 */
export const addToFavorites = (movie) => (dispatch, getState) => {
  dispatch({
    type: ADD_TO_FAVORITES,
    payload: movie
  });
  const updatedFavorites = getState().auth.favorites;
  localStorage.setItem('cineverse_favorites', JSON.stringify(updatedFavorites));
};

/**
 * Remove movie from user favorites
 */
export const removeFromFavorites = (movieId) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_FAVORITES,
    payload: movieId
  });
  const updatedFavorites = getState().auth.favorites;
  localStorage.setItem('cineverse_favorites', JSON.stringify(updatedFavorites));
};

/**
 * Add movie to user watchlist
 */
export const addToWatchlist = (movie) => (dispatch, getState) => {
  dispatch({
    type: ADD_TO_WATCHLIST,
    payload: movie
  });
  const updatedWatchlist = getState().auth.watchlist;
  localStorage.setItem('cineverse_watchlist', JSON.stringify(updatedWatchlist));
};

/**
 * Remove movie from user watchlist
 */
export const removeFromWatchlist = (movieId) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_WATCHLIST,
    payload: movieId
  });
  const updatedWatchlist = getState().auth.watchlist;
  localStorage.setItem('cineverse_watchlist', JSON.stringify(updatedWatchlist));
};

/**
 * Update user preferences
 */
export const updatePreferences = (preferences) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_PREFERENCES,
    payload: preferences
  });
  const updatedUser = getState().auth.user;
  localStorage.setItem('cineverse_user', JSON.stringify(updatedUser));
};


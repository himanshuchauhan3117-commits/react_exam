import movieReducer from './redux/reducers/movieReducer';
import authReducer from './redux/reducers/authReducer';
import store from './redux/store';
import {
  FETCH_POPULAR_MOVIES_REQUEST,
  FETCH_POPULAR_MOVIES_SUCCESS,
  FETCH_POPULAR_MOVIES_FAILURE,
  FETCH_MOVIE_DETAILS_SUCCESS,
  SEARCH_MOVIES_SUCCESS,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST,
  LOGIN_SUCCESS,
  LOGOUT
} from './redux/types';

describe('Redux Movie Reducer Tests', () => {
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
    genreFilter: 'all',
    sortBy: 'popularity.desc'
  };

  test('should handle FETCH_POPULAR_MOVIES_REQUEST', () => {
    const nextState = movieReducer(initialState, { type: FETCH_POPULAR_MOVIES_REQUEST });
    expect(nextState.popularLoading).toBe(true);
    expect(nextState.popularError).toBeNull();
  });

  test('should handle FETCH_POPULAR_MOVIES_SUCCESS', () => {
    const movies = [
      { id: 1, title: 'Inception', vote_average: 8.4 },
      { id: 2, title: 'Interstellar', vote_average: 8.6 }
    ];
    const action = {
      type: FETCH_POPULAR_MOVIES_SUCCESS,
      payload: {
        movies,
        page: 1,
        totalPages: 10,
        totalResults: 100
      }
    };
    const nextState = movieReducer(initialState, action);
    expect(nextState.popularLoading).toBe(false);
    expect(nextState.popularMovies).toHaveLength(2);
    expect(nextState.popularMovies[0].title).toBe('Inception');
    expect(nextState.totalPages).toBe(10);
  });

  test('should handle FETCH_POPULAR_MOVIES_FAILURE', () => {
    const action = {
      type: FETCH_POPULAR_MOVIES_FAILURE,
      payload: 'Network Error'
    };
    const nextState = movieReducer(initialState, action);
    expect(nextState.popularLoading).toBe(false);
    expect(nextState.popularError).toBe('Network Error');
  });

  test('should handle FETCH_MOVIE_DETAILS_SUCCESS', () => {
    const detail = {
      id: 99,
      title: 'The Dark Knight',
      vote_average: 9.0,
      cast: [{ id: 1, name: 'Christian Bale' }]
    };
    const nextState = movieReducer(initialState, {
      type: FETCH_MOVIE_DETAILS_SUCCESS,
      payload: detail
    });
    expect(nextState.movieDetails).toBeDefined();
    expect(nextState.movieDetails.title).toBe('The Dark Knight');
  });

  test('should handle SEARCH_MOVIES_SUCCESS', () => {
    const action = {
      type: SEARCH_MOVIES_SUCCESS,
      payload: {
        results: [{ id: 10, title: 'Dune: Part Two' }],
        query: 'Dune',
        totalResults: 1
      }
    };
    const nextState = movieReducer(initialState, action);
    expect(nextState.searchResults).toHaveLength(1);
    expect(nextState.searchQuery).toBe('Dune');
  });
});

describe('Redux Auth Reducer & Preferences Tests', () => {
  const initialAuthState = {
    isAuthenticated: false,
    user: null,
    favorites: [],
    watchlist: [],
    loading: false,
    error: null
  };

  test('should handle LOGIN_SUCCESS and LOGOUT', () => {
    const userPayload = { username: 'MovieBuff', preferredGenres: ['Sci-Fi'] };
    const loggedInState = authReducer(initialAuthState, {
      type: LOGIN_SUCCESS,
      payload: userPayload
    });
    expect(loggedInState.isAuthenticated).toBe(true);
    expect(loggedInState.user.username).toBe('MovieBuff');

    const loggedOutState = authReducer(loggedInState, { type: LOGOUT });
    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.user).toBeNull();
  });

  test('should handle ADD_TO_FAVORITES and REMOVE_FROM_FAVORITES', () => {
    const movie = { id: 50, title: 'Fight Club' };
    const withFav = authReducer(initialAuthState, {
      type: ADD_TO_FAVORITES,
      payload: movie
    });
    expect(withFav.favorites).toHaveLength(1);
    expect(withFav.favorites[0].title).toBe('Fight Club');

    // Duplicate prevention
    const duplicate = authReducer(withFav, {
      type: ADD_TO_FAVORITES,
      payload: movie
    });
    expect(duplicate.favorites).toHaveLength(1);

    const withoutFav = authReducer(withFav, {
      type: REMOVE_FROM_FAVORITES,
      payload: 50
    });
    expect(withoutFav.favorites).toHaveLength(0);
  });

  test('should handle ADD_TO_WATCHLIST and REMOVE_FROM_WATCHLIST', () => {
    const movie = { id: 70, title: 'Parasite' };
    const withWatch = authReducer(initialAuthState, {
      type: ADD_TO_WATCHLIST,
      payload: movie
    });
    expect(withWatch.watchlist).toHaveLength(1);

    const withoutWatch = authReducer(withWatch, {
      type: REMOVE_FROM_WATCHLIST,
      payload: 70
    });
    expect(withoutWatch.watchlist).toHaveLength(0);
  });
});

describe('Store Integration', () => {
  test('Redux store is configured and has movie & auth slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('movies');
    expect(state).toHaveProperty('auth');
    expect(Array.isArray(state.movies.popularMovies)).toBe(true);
  });
});

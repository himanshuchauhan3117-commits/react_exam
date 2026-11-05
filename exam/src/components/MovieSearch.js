import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearchResults, setSearchQuery } from '../redux/actions/movieActions';
import MovieCard from './MovieCard';

const QUICK_SEARCH_SUGGESTIONS = [
  'Batman',
  'Inception',
  'Interstellar',
  'Dune',
  'Spider-Man',
  'Oppenheimer',
  'Avengers',
  'Godfather'
];

const MovieSearch = () => {
  const dispatch = useDispatch();
  const {
    searchResults,
    searchQuery,
    searchLoading,
    searchError,
    fallbackNotice
  } = useSelector((state) => state.movies);

  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const debounceTimerRef = useRef(null);

  // Implement the searchMovies function in the MovieSearch component
  const executeSearch = useCallback(
    (query) => {
      if (query && query.trim()) {
        dispatch(searchMovies(query.trim()));
      } else {
        dispatch(clearSearchResults());
      }
    },
    [dispatch]
  );

  // Handle dynamic updating of movie results as users type (debounced)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.trim() === '') {
      dispatch(clearSearchResults());
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(searchTerm);
      dispatch(setSearchQuery(searchTerm));
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, executeSearch, dispatch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    dispatch(clearSearchResults());
  };

  const handleQuickTagClick = (tag) => {
    setSearchTerm(tag);
    executeSearch(tag);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    executeSearch(searchTerm);
  };

  return (
    <div className="container py-4 bg-white">
      {/* Search Header Banner */}
      <div className="card bg-white border border-light-subtle p-4 p-md-5 rounded-4 mb-4 shadow-sm position-relative overflow-hidden">
        <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
            <i className="bi bi-search me-1"></i> Global Movie Finder
          </span>
          <h1 className="display-6 fw-bold text-dark mb-2">Search Movies & Titles</h1>
          <p className="text-muted mb-4">
            Type any movie title, character, or director name. Results update dynamically as you type.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="position-relative">
            <div className="input-group input-group-lg shadow-sm">
              <span className="input-group-text bg-light text-secondary border-secondary-subtle">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-white text-dark border-secondary-subtle px-3 py-3"
                placeholder="Search for movies (e.g. Interstellar, Inception, Dune...)"
                value={searchTerm}
                onChange={handleInputChange}
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-light text-secondary border-secondary-subtle border-start-0 px-3"
                  onClick={handleClear}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
                disabled={searchLoading}
              >
                <span>Search</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </form>

          {/* Quick Suggestion Pills */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-3">
            <span className="small text-muted fw-semibold">Popular queries:</span>
            {QUICK_SEARCH_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="btn btn-sm btn-light border border-secondary-subtle rounded-pill py-1 px-3 text-dark fw-medium"
                onClick={() => handleQuickTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fallback Notice Alert */}
      {fallbackNotice && (
        <div className="alert alert-info bg-light border-info-subtle text-dark d-flex align-items-center gap-2 mb-4 rounded-3 shadow-sm" role="alert">
          <i className="bi bi-info-circle-fill text-info fs-5"></i>
          <div>
            <strong>Notice:</strong> {fallbackNotice}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {searchLoading && (
        <div className="text-center py-5 my-4">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Searching movies...</span>
          </div>
          <h5 className="mt-3 text-dark">Searching for "{searchTerm}"...</h5>
          <p className="text-muted small">Querying movie titles and overviews</p>
        </div>
      )}

      {/* Error Message with Graceful Handling */}
      {!searchLoading && searchError && (
        <div className="alert alert-danger bg-light border-danger text-dark p-4 rounded-4 shadow-sm my-4" role="alert">
          <div className="d-flex align-items-start gap-3">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-2"></i>
            <div className="flex-grow-1">
              <h5 className="alert-heading text-danger fw-bold mb-1">Search Error</h5>
              <p className="mb-2 text-muted">{searchError}</p>
              <button
                className="btn btn-outline-danger btn-sm rounded-pill px-3 mt-2"
                onClick={() => executeSearch(searchTerm)}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Retry Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {!searchLoading && !searchError && searchTerm.trim() !== '' && (
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h5 className="text-dark mb-0 fw-bold">
            Results for <span className="text-primary">"{searchTerm}"</span>
          </h5>
          <span className="badge bg-light text-dark border px-3 py-2">
            {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
          </span>
        </div>
      )}

      {/* Empty / No Results Message */}
      {!searchLoading && !searchError && searchTerm.trim() !== '' && searchResults.length === 0 && (
        <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm p-5">
          <i className="bi bi-search text-secondary display-3"></i>
          <h4 className="mt-3 text-dark">No Movies Found</h4>
          <p className="text-muted mb-3">
            We couldn't find any movies matching "{searchTerm}". Check the spelling or try searching for another title.
          </p>
          <button className="btn btn-outline-secondary rounded-pill px-4" onClick={handleClear}>
            Clear Search
          </button>
        </div>
      )}

      {/* Initial State / Prompt when no query */}
      {!searchLoading && !searchError && searchTerm.trim() === '' && (
        <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm p-5">
          <i className="bi bi-film text-secondary display-4"></i>
          <h4 className="mt-3 text-dark">Start Typing to Search</h4>
          <p className="text-muted" style={{ maxWidth: '450px', margin: '0 auto' }}>
            Search through popular classics, modern hits, sci-fi masterpieces, and animated adventures.
          </p>
        </div>
      )}

      {/* Dynamic Results Grid */}
      {!searchLoading && !searchError && searchResults.length > 0 && (
        <div className="row">
          {searchResults.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieSearch;

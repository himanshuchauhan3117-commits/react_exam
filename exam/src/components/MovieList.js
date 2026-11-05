import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularMovies, setGenreFilter, setSortBy } from '../redux/actions/movieActions';
import MovieCard from './MovieCard';
import MovieDetails from './MovieDetails';

const GENRE_MAP = [
  { id: 'all', name: 'All Genres' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

const MovieList = () => {
  const dispatch = useDispatch();
  const {
    popularMovies,
    popularLoading,
    popularError,
    page,
    totalPages,
    genreFilter,
    sortBy,
    fallbackNotice
  } = useSelector((state) => state.movies);

  const [selectedQuickViewId, setSelectedQuickViewId] = useState(null);

  // Implement the fetchPopularMovies function in the MovieList component
  useEffect(() => {
    if (!popularMovies || popularMovies.length === 0) {
      dispatch(fetchPopularMovies(1));
    }
  }, [dispatch, popularMovies]);

  const handleRefresh = (targetPage = 1) => {
    dispatch(fetchPopularMovies(targetPage));
  };

  const handleGenreChange = (e) => {
    const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
    dispatch(setGenreFilter(val));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  // Filter and sort movies client-side
  const filteredAndSortedMovies = useMemo(() => {
    if (!popularMovies) return [];

    let result = [...popularMovies];

    // Filter by genre
    if (genreFilter && genreFilter !== 'all') {
      result = result.filter((m) => {
        if (m.genre_ids && m.genre_ids.includes(genreFilter)) return true;
        if (m.genres && m.genres.some((g) => g.id === genreFilter || g.name === genreFilter)) return true;
        return false;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'vote_average.desc':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'release_date.desc':
          return new Date(b.release_date || 0) - new Date(a.release_date || 0);
        case 'title.asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'popularity.desc':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return result;
  }, [popularMovies, genreFilter, sortBy]);

  return (
    <div className="container py-4 bg-white">
      {/* Hero Banner Header */}
      <div className="hero-banner p-4 p-md-5 mb-4 rounded-4 bg-white position-relative overflow-hidden border border-light-subtle shadow-sm">
        <div className="row align-items-center position-relative z-1">
          <div className="col-lg-8">
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
              <i className="bi bi-fire me-1"></i> Trending This Week
            </span>
            <h1 className="display-5 fw-extrabold text-dark mb-2">
              Discover Popular Movies
            </h1>
            <p className="lead text-secondary mb-4" style={{ maxWidth: '650px' }}>
              Explore highest rated blockbusters, trending releases, and all-time cinema favorites with comprehensive details, ratings, cast, and trailers.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                onClick={() => handleRefresh(page || 1)}
                disabled={popularLoading}
              >
                <i className={`bi bi-arrow-repeat ${popularLoading ? 'spin-icon' : ''}`}></i>
                <span>{popularLoading ? 'Refreshing...' : 'Refresh Catalog'}</span>
              </button>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-block text-end">
            <div className="p-3 bg-white rounded-4 border border-light-subtle shadow-sm d-inline-block text-start">
              <div className="text-muted small text-uppercase fw-bold mb-1">Catalog Status</div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle p-2 rounded-circle"></span>
                <span className="fw-semibold text-dark">Live Movie Database</span>
              </div>
              <div className="small text-muted mt-2">
                <i className="bi bi-film me-1"></i> Showing {filteredAndSortedMovies.length} titles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Notice Alert (if active) */}
      {fallbackNotice && (
        <div className="alert alert-info bg-light border-info-subtle text-dark d-flex align-items-center gap-2 mb-4 rounded-3 shadow-sm" role="alert">
          <i className="bi bi-info-circle-fill text-info fs-5"></i>
          <div>
            <strong>Notice:</strong> {fallbackNotice}
          </div>
        </div>
      )}

      {/* Controls Bar: Genre Filter, Sort By, and Quick Stats */}
      <div className="card bg-white border border-light-subtle p-3 mb-4 rounded-3 shadow-sm">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <label className="form-label text-dark small fw-semibold mb-1">
              <i className="bi bi-funnel me-1 text-primary"></i> Filter By Genre
            </label>
            <select
              className="form-select bg-white text-dark border-secondary-subtle"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              {GENRE_MAP.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label text-dark small fw-semibold mb-1">
              <i className="bi bi-sort-down me-1 text-primary"></i> Sort By
            </label>
            <select
              className="form-select bg-white text-dark border-secondary-subtle"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="popularity.desc">Most Popular First</option>
              <option value="vote_average.desc">Highest Rated (IMDb / TMDb)</option>
              <option value="release_date.desc">Release Date (Newest First)</option>
              <option value="title.asc">Title (Alphabetical A-Z)</option>
            </select>
          </div>

          <div className="col-12 col-md-4 text-md-end pt-md-3">
            <span className="text-muted small">
              Found <strong className="text-dark">{filteredAndSortedMovies.length}</strong> movies
              {genreFilter !== 'all' && ' in this genre'}
            </span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {popularLoading && (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
            <span className="visually-hidden">Loading movies...</span>
          </div>
          <h4 className="mt-3 text-dark">Fetching Popular Movies...</h4>
          <p className="text-muted">Connecting to movie library service and retrieving latest entries</p>
        </div>
      )}

      {/* Error Message with Graceful Handling */}
      {!popularLoading && popularError && (
        <div className="alert alert-danger bg-light border-danger text-dark p-4 rounded-4 shadow-sm my-4" role="alert">
          <div className="d-flex align-items-start gap-3">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-2"></i>
            <div className="flex-grow-1">
              <h5 className="alert-heading text-danger fw-bold mb-1">Unable to Fetch Movies</h5>
              <p className="mb-2 text-muted">{popularError}</p>
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                  onClick={() => handleRefresh(page || 1)}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!popularLoading && !popularError && filteredAndSortedMovies.length === 0 && (
        <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm p-5">
          <i className="bi bi-film text-secondary display-3"></i>
          <h4 className="mt-3 text-dark">No Movies Found</h4>
          <p className="text-muted">Try switching the genre filter or resetting your search preferences.</p>
          <button
            className="btn btn-outline-primary rounded-pill px-4 mt-2"
            onClick={() => dispatch(setGenreFilter('all'))}
          >
            Reset Genre Filter
          </button>
        </div>
      )}

      {/* Dynamic Movie Grid */}
      {!popularLoading && !popularError && filteredAndSortedMovies.length > 0 && (
        <div className="row">
          {filteredAndSortedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!popularLoading && !popularError && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 pb-4">
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
            disabled={page <= 1}
            onClick={() => handleRefresh(page - 1)}
          >
            <i className="bi bi-chevron-left me-1"></i> Previous
          </button>
          <span className="badge bg-light text-dark border px-3 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
            disabled={page >= totalPages}
            onClick={() => handleRefresh(page + 1)}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}

      {/* Quick View Modal if triggered */}
      {selectedQuickViewId && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-white text-dark border-light-subtle shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Movie Details Quick View</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedQuickViewId(null)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <MovieDetails modalMode movieId={selectedQuickViewId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;

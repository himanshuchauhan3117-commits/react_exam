import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, clearMovieDetails } from '../redux/actions/movieActions';
import {
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist
} from '../redux/actions/authActions';

const MovieDetails = ({ modalMode = false, movieId: propMovieId }) => {
  const { id: routeId } = useParams();
  const movieId = propMovieId || routeId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { movieDetails, detailsLoading, detailsError } = useSelector((state) => state.movies);
  const { isAuthenticated, favorites, watchlist } = useSelector((state) => state.auth);

  const [notification, setNotification] = useState(null);

  // Implement the fetchMovieDetails function in the MovieDetails component
  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieDetails(movieId));
    }

    return () => {
      if (!modalMode) {
        dispatch(clearMovieDetails());
      }
    };
  }, [dispatch, movieId, modalMode]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const isFavorite = movieDetails && favorites.some((f) => f.id === movieDetails.id);
  const isWatchlisted = movieDetails && watchlist.some((w) => w.id === movieDetails.id);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      alert('Please sign in to save movies to your favorites!');
      return;
    }
    if (isFavorite) {
      dispatch(removeFromFavorites(movieDetails.id));
      showToast('Removed from favorites');
    } else {
      dispatch(addToFavorites(movieDetails));
      showToast('Added to favorites!');
    }
  };

  const handleToggleWatchlist = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add movies to your watchlist!');
      return;
    }
    if (isWatchlisted) {
      dispatch(removeFromWatchlist(movieDetails.id));
      showToast('Removed from watchlist');
    } else {
      dispatch(addToWatchlist(movieDetails));
      showToast('Added to watchlist!');
    }
  };

  // Loading state
  if (detailsLoading) {
    return (
      <div className="container py-5 text-center my-5 bg-white">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading movie details...</span>
        </div>
        <h3 className="mt-4 text-dark">Loading Movie Details...</h3>
        <p className="text-muted">Retrieving cast, crew, ratings, and synopsis</p>
      </div>
    );
  }

  // Error state
  if (detailsError) {
    return (
      <div className="container py-5 my-4 bg-white">
        <div className="alert alert-danger bg-light border-danger text-dark p-4 rounded-4 shadow-sm" role="alert">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-exclamation-octagon-fill text-danger fs-1"></i>
            <div>
              <h4 className="alert-heading text-danger mb-1">Movie Details Unavailable</h4>
              <p className="mb-3 text-muted">{detailsError}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => dispatch(fetchMovieDetails(movieId))}
                >
                  <i className="bi bi-arrow-repeat me-1"></i> Try Again
                </button>
                {!modalMode && (
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate(-1)}>
                    Go Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="container py-5 text-center bg-white">
        <p className="text-muted">No movie selected.</p>
        <Link to="/" className="btn btn-outline-primary rounded-pill">
          Return to Popular Movies
        </Link>
      </div>
    );
  }

  const {
    title,
    original_title,
    tagline,
    poster_path,
    backdrop_path,
    overview,
    release_date,
    vote_average,
    vote_count,
    runtime,
    genres = [],
    spoken_languages = [],
    cast = []
  } = movieDetails;

  const formattedRating = typeof vote_average === 'number' ? vote_average.toFixed(1) : vote_average;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const formattedRuntime = runtime > 0 ? `${hours}h ${minutes}m` : 'Runtime N/A';

  return (
    <div className={`movie-details-container bg-white ${modalMode ? 'p-3' : 'pb-5'}`}>
      {/* Toast Notification */}
      {notification && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4 z-3">
          <div className="alert alert-success bg-success text-white shadow-lg rounded-pill px-4 py-2 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Hero Backdrop Backdrop / Header */}
      <div
        className="backdrop-hero position-relative rounded-bottom-4 overflow-hidden mb-4 border-bottom border-light-subtle shadow-sm"
        style={{
          minHeight: '380px',
          backgroundImage: backdrop_path
            ? `linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 60%, rgba(15, 23, 42, 0.3) 100%), url(${backdrop_path})`
            : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container py-4">
          {!modalMode && (
            <button
              className="btn btn-sm btn-white bg-white border border-secondary-subtle rounded-pill px-3 py-2 text-dark mb-3 shadow-sm d-inline-flex align-items-center gap-1"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i>
              <span>Back to Browse</span>
            </button>
          )}
        </div>
      </div>

      {/* Movie Information Grid */}
      <div className="container position-relative" style={{ marginTop: '-120px' }}>
        <div className="row g-4">
          {/* Poster Column */}
          <div className="col-12 col-md-4 col-lg-3 text-center text-md-start">
            <div className="card bg-white border border-light-subtle shadow-md rounded-4 overflow-hidden p-1">
              <img
                src={poster_path}
                alt={title}
                className="img-fluid rounded-3 w-100"
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/500x750/f1f5f9/334155?text=' + encodeURIComponent(title);
                }}
              />
            </div>

            {/* Quick Actions for Favorites and Watchlist */}
            <div className="d-grid gap-2 mt-3">
              <button
                type="button"
                className={`btn rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold ${
                  isFavorite ? 'btn-danger shadow-sm' : 'btn-outline-danger'
                }`}
                onClick={handleToggleFavorite}
              >
                <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                type="button"
                className={`btn rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold ${
                  isWatchlisted ? 'btn-primary shadow-sm' : 'btn-outline-primary'
                }`}
                onClick={handleToggleWatchlist}
              >
                <i className={`bi ${isWatchlisted ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}`}></i>
                <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>

          {/* Details Column */}
          <div className="col-12 col-md-8 col-lg-9">
            <div className="card bg-white border border-light-subtle p-4 rounded-4 shadow-sm">
              {/* Title & Tagline */}
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <h1 className="h2 text-dark fw-bold mb-1">{title}</h1>
                  {original_title && original_title !== title && (
                    <div className="text-muted small fst-italic mb-2">
                      Original: {original_title}
                    </div>
                  )}
                  {tagline && (
                    <p className="text-primary fst-italic mb-2 fw-medium">"{tagline}"</p>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="badge bg-warning text-dark p-2 rounded-3 text-center shadow-sm">
                  <div className="d-flex align-items-center gap-1 fs-5 fw-bold">
                    <i className="bi bi-star-fill text-dark"></i>
                    <span>{formattedRating}</span>
                    <span className="small fs-6 fw-normal text-muted">/10</span>
                  </div>
                  <div className="small text-dark-emphasis" style={{ fontSize: '0.7rem' }}>
                    {vote_count ? `${vote_count.toLocaleString()} votes` : 'User Rating'}
                  </div>
                </div>
              </div>

              {/* Meta Badges (Release Date, Runtime, Languages) */}
              <div className="d-flex flex-wrap gap-2 my-3 align-items-center">
                <span className="badge bg-light text-secondary border border-secondary-subtle px-3 py-2 rounded-pill">
                  <i className="bi bi-calendar3 me-1"></i> {release_date || 'N/A'}
                </span>
                <span className="badge bg-light text-secondary border border-secondary-subtle px-3 py-2 rounded-pill">
                  <i className="bi bi-clock me-1"></i> {formattedRuntime}
                </span>

                {/* Languages */}
                <div className="d-flex align-items-center gap-1 ms-1">
                  <span className="text-muted small me-1">
                    <i className="bi bi-translate me-1"></i> Languages:
                  </span>
                  {spoken_languages.map((lang, idx) => (
                    <span key={idx} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                      {lang.english_name || lang.name || lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Genres */}
              {genres && genres.length > 0 && (
                <div className="mb-4">
                  <div className="text-muted small text-uppercase fw-bold mb-2">Genres</div>
                  <div className="d-flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <span key={g.id || g.name} className="badge bg-light text-dark border border-secondary-subtle px-3 py-2 rounded-2">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description / Overview */}
              <div className="mb-4">
                <h5 className="text-dark fw-bold mb-2">
                  <i className="bi bi-file-text me-2 text-primary"></i> Description
                </h5>
                <p className="text-secondary lead fs-6 lh-base" style={{ whiteSpace: 'pre-line' }}>
                  {overview || 'No synopsis available for this movie.'}
                </p>
              </div>

              {/* Cast Members */}
              {cast && cast.length > 0 && (
                <div>
                  <h5 className="text-dark fw-bold mb-3">
                    <i className="bi bi-people me-2 text-primary"></i> Featured Cast
                  </h5>
                  <div className="row g-3">
                    {cast.map((actor) => (
                      <div key={actor.id} className="col-6 col-sm-4 col-md-3">
                        <div className="p-2 bg-light rounded-3 border border-light-subtle h-100 text-center shadow-xs">
                          {actor.profile_path ? (
                            <img
                              src={actor.profile_path}
                              alt={actor.name}
                              className="rounded-circle mb-2 object-fit-cover shadow-sm"
                              style={{ width: '56px', height: '56px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/100x100/e2e8f0/334155?text=' + encodeURIComponent(actor.name.charAt(0));
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-secondary-subtle text-dark border d-inline-flex align-items-center justify-content-center fw-bold mb-2 shadow-sm"
                              style={{ width: '56px', height: '56px' }}
                            >
                              {actor.name.charAt(0)}
                            </div>
                          )}
                          <div className="fw-semibold text-dark small text-truncate" title={actor.name}>
                            {actor.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }} title={actor.character}>
                            {actor.character}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

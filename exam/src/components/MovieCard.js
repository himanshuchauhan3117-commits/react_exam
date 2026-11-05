import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist
} from '../redux/actions/authActions';

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, favorites, watchlist } = useSelector((state) => state.auth);

  if (!movie) return null;

  const isFavorite = favorites.some((f) => f.id === movie.id);
  const isWatchlisted = watchlist.some((w) => w.id === movie.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to save movies to your favorites!');
      return;
    }
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie));
    }
  };

  const handleToggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to add movies to your watchlist!');
      return;
    }
    if (isWatchlisted) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist(movie));
    }
  };

  // Extract language display
  const languageDisplay = movie.spoken_languages && movie.spoken_languages.length > 0
    ? movie.spoken_languages.map(l => l.english_name || l.name || l).slice(0, 2).join(', ')
    : 'English';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear() || movie.release_date.slice(0, 4)
    : 'N/A';

  const rating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : (movie.vote_average || 'N/A');

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div className="card movie-card bg-white border border-light-subtle text-dark w-100 shadow-sm position-relative d-flex flex-column">
        {/* Rating Badge */}
        <div className="position-absolute top-0 start-0 m-2 z-2">
          <span className="badge bg-warning text-dark fw-bold d-flex align-items-center gap-1 shadow-sm px-2 py-1">
            <i className="bi bi-star-fill text-dark"></i>
            {rating}
          </span>
        </div>

        {/* Quick Save Buttons */}
        <div className="position-absolute top-0 end-0 m-2 z-2 d-flex flex-column gap-1">
          <button
            type="button"
            className={`btn btn-sm rounded-circle shadow-sm ${
              isFavorite ? 'btn-danger' : 'btn-white bg-white border border-secondary-subtle text-dark'
            }`}
            style={{ width: '34px', height: '34px', padding: 0 }}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            onClick={handleToggleFavorite}
          >
            <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-circle shadow-sm ${
              isWatchlisted ? 'btn-primary' : 'btn-white bg-white border border-secondary-subtle text-dark'
            }`}
            style={{ width: '34px', height: '34px', padding: 0 }}
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            onClick={handleToggleWatchlist}
          >
            <i className={`bi ${isWatchlisted ? 'bi-bookmark-check-fill' : 'bi-bookmark-plus'}`}></i>
          </button>
        </div>

        {/* Poster Image */}
        <Link to={`/movie/${movie.id}`} className="text-decoration-none">
          <div className="poster-container overflow-hidden position-relative bg-light rounded-top">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="card-img-top movie-poster"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/500x750/f1f5f9/334155?text=' + encodeURIComponent(movie.title);
              }}
            />
            <div className="poster-overlay d-flex align-items-center justify-content-center">
              <span className="btn btn-primary btn-sm rounded-pill px-3 shadow">
                <i className="bi bi-eye me-1"></i> View Details
              </span>
            </div>
          </div>
        </Link>

        {/* Card Body */}
        <div className="card-body d-flex flex-column justify-content-between p-3 bg-white">
          <div>
            <div className="d-flex justify-content-between align-items-baseline mb-1">
              <span className="badge bg-light text-secondary border border-secondary-subtle font-monospace" style={{ fontSize: '0.75rem' }}>
                {releaseYear}
              </span>
              <span className="text-secondary small d-flex align-items-center gap-1" title="Language">
                <i className="bi bi-translate"></i>
                <span className="text-truncate" style={{ maxWidth: '90px' }}>{languageDisplay}</span>
              </span>
            </div>

            <h5 className="card-title text-truncate mb-2 fw-bold" title={movie.title}>
              <Link to={`/movie/${movie.id}`} className="text-dark text-decoration-none hover-primary">
                {movie.title}
              </Link>
            </h5>

            <p className="card-text text-muted small line-clamp-2 mb-3">
              {movie.overview || 'No description available for this title.'}
            </p>
          </div>

          <div className="pt-2 border-top border-light-subtle d-grid">
            <Link
              to={`/movie/${movie.id}`}
              className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1 fw-semibold"
            >
              <span>Explore Details</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

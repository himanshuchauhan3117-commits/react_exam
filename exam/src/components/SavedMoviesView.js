import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

const SavedMoviesView = ({ type = 'watchlist' }) => {
  const { isAuthenticated, favorites, watchlist } = useSelector((state) => state.auth);

  const isFavorites = type === 'favorites';
  const movies = isFavorites ? favorites : watchlist;
  const title = isFavorites ? 'Favorite Movies' : 'My Watchlist';
  const icon = isFavorites ? 'bi-heart-fill text-danger' : 'bi-bookmark-fill text-primary';
  const emptyDescription = isFavorites
    ? 'You have not added any movies to your favorites list yet.'
    : 'You have not saved any movies to your watchlist yet.';

  return (
    <div className="container py-4 bg-white">
      {/* Header */}
      <div className="card bg-white border border-light-subtle p-4 rounded-4 shadow-sm mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-light rounded-circle border border-secondary-subtle shadow-xs">
              <i className={`bi ${icon} fs-3`}></i>
            </div>
            <div>
              <h2 className="text-dark fw-bold mb-1">{title}</h2>
              <p className="text-muted small mb-0">
                {movies.length} {movies.length === 1 ? 'title' : 'titles'} saved to your collection
              </p>
            </div>
          </div>
          <Link to="/" className="btn btn-outline-primary rounded-pill px-3 shadow-xs">
            <i className="bi bi-compass me-1"></i> Explore More Movies
          </Link>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="alert alert-warning bg-light border-warning text-dark rounded-3 d-flex align-items-center gap-3 mb-4 shadow-xs">
          <i className="bi bi-info-circle-fill text-warning fs-4"></i>
          <div className="flex-grow-1">
            <strong className="text-dark">Guest Mode Notice:</strong> You are browsing as guest. Sign in to sync your preferences and access your library across devices.
          </div>
          <Link to="/login" className="btn btn-warning btn-sm rounded-pill px-3 text-dark fw-bold shadow-xs">
            Sign In Now
          </Link>
        </div>
      )}

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm p-5">
          <i className={`bi ${isFavorites ? 'bi-heart' : 'bi-bookmark'} text-secondary display-3`}></i>
          <h4 className="mt-3 text-dark">Your {title} is Empty</h4>
          <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
            {emptyDescription} Click on the heart or bookmark icons on any movie card to add them here!
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn btn-primary rounded-pill px-4 shadow-sm">
              <i className="bi bi-fire me-1"></i> Browse Popular Movies
            </Link>
            <Link to="/search" className="btn btn-outline-secondary rounded-pill px-4">
              <i className="bi bi-search me-1"></i> Search Movies
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedMoviesView;

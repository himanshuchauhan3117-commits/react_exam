import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences, logout } from '../redux/actions/authActions';
import MovieCard from './MovieCard';

const ALL_GENRES = [
  'Action',
  'Sci-Fi',
  'Drama',
  'Adventure',
  'Comedy',
  'Animation',
  'Crime',
  'Thriller',
  'Fantasy',
  'Horror',
  'Mystery'
];

const Profile = () => {
  const dispatch = useDispatch();
  const { user, favorites, watchlist } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('favorites');
  const [selectedGenres, setSelectedGenres] = useState(user?.preferredGenres || ['Action', 'Sci-Fi']);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="container py-5 text-center bg-white">
        <h4 className="text-dark">User profile not found.</h4>
      </div>
    );
  }

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    dispatch(updatePreferences({ preferredGenres: selectedGenres }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="container py-4 bg-white">
      {/* Profile Header Card */}
      <div className="card bg-white border border-light-subtle p-4 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center g-4">
          <div className="col-auto">
            <img
              src={user.avatar}
              alt={user.username}
              className="rounded-circle border border-primary p-1 bg-light shadow-sm"
              style={{ width: '90px', height: '90px' }}
            />
          </div>
          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h2 className="text-dark fw-bold mb-0">{user.username}</h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                {user.role}
              </span>
            </div>
            <p className="text-muted small mb-2">{user.email}</p>
            <div className="d-flex flex-wrap gap-3 small text-muted">
              <span>
                <i className="bi bi-heart-fill text-danger me-1"></i>
                <strong className="text-dark">{favorites.length}</strong> Favorites
              </span>
              <span>
                <i className="bi bi-bookmark-fill text-primary me-1"></i>
                <strong className="text-dark">{watchlist.length}</strong> In Watchlist
              </span>
              <span>
                <i className="bi bi-calendar-event me-1"></i>
                Joined {user.joinedDate || '2024'}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-auto text-md-end">
            <button
              className="btn btn-outline-danger rounded-pill px-4"
              onClick={() => dispatch(logout())}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Preferences Customization */}
        <div className="col-12 col-lg-4">
          <div className="card bg-white border border-light-subtle p-4 rounded-4 shadow-sm mb-4">
            <h5 className="text-dark fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-sliders text-primary"></i> Movie Preferences
            </h5>
            <p className="text-muted small mb-3">
              Customize the film genres you enjoy most. These preferences are stored in your Redux profile.
            </p>

            {saveSuccess && (
              <div className="alert alert-success py-2 small mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill"></i> Preferences saved successfully!
              </div>
            )}

            <form onSubmit={handleSavePreferences}>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {ALL_GENRES.map((g) => {
                  const isChecked = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 ${
                        isChecked ? 'btn-primary' : 'btn-outline-secondary text-dark'
                      }`}
                      onClick={() => toggleGenre(g)}
                    >
                      {isChecked && <i className="bi bi-check me-1"></i>}
                      {g}
                    </button>
                  );
                })}
              </div>

              <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold shadow-sm">
                Save Preferences
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: User Saved Movies Tabs */}
        <div className="col-12 col-lg-8">
          <div className="card bg-white border border-light-subtle p-4 rounded-4 shadow-sm">
            {/* Tab navigation */}
            <ul className="nav nav-pills gap-2 mb-4 border-bottom pb-3">
              <li className="nav-item">
                <button
                  type="button"
                  className={`btn rounded-pill px-4 ${
                    activeTab === 'favorites' ? 'btn-danger shadow-sm' : 'btn-outline-secondary text-dark'
                  }`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <i className="bi bi-heart-fill me-1"></i> Favorites ({favorites.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`btn rounded-pill px-4 ${
                    activeTab === 'watchlist' ? 'btn-primary shadow-sm' : 'btn-outline-secondary text-dark'
                  }`}
                  onClick={() => setActiveTab('watchlist')}
                >
                  <i className="bi bi-bookmark-fill me-1"></i> Watchlist ({watchlist.length})
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-heart text-secondary display-4"></i>
                    <h5 className="mt-3 text-dark">No Favorite Movies Yet</h5>
                    <p className="small">Browse popular movies or search for films and click the heart icon to save favorites.</p>
                  </div>
                ) : (
                  <div className="row">
                    {favorites.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div>
                {watchlist.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-bookmark text-secondary display-4"></i>
                    <h5 className="mt-3 text-dark">Your Watchlist is Empty</h5>
                    <p className="small">Click the bookmark icon on any movie to queue it up in your watchlist.</p>
                  </div>
                ) : (
                  <div className="row">
                    {watchlist.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

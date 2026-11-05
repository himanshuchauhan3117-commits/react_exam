import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import { getApiKey, setApiKey } from '../services/movieApi';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, favorites, watchlist } = useSelector((state) => state.auth);

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);
  const [customKey, setCustomKey] = useState(getApiKey());
  const [apiSaveSuccess, setApiSaveSuccess] = useState(false);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  const handleSignOut = () => {
    dispatch(logout());
    closeNav();
    navigate('/');
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setApiKey(customKey);
    setApiSaveSuccess(true);
    setTimeout(() => {
      setApiSaveSuccess(false);
      setShowApiModal(false);
      window.location.reload();
    }, 900);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-light-subtle sticky-top py-3 shadow-sm">
        <div className="container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeNav}>
            <div className="brand-logo-icon rounded-3 d-flex align-items-center justify-content-center p-2 text-white shadow-sm">
              <i className="bi bi-film fs-4"></i>
            </div>
            <div>
              <span className="fw-black fs-4 tracking-tight text-dark brand-title">Cine<span className="text-primary">Verse</span></span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-2 fw-semibold" style={{ fontSize: '0.65rem' }}>PRO</span>
            </div>
          </Link>

          {/* Mobile Hamburger Toggler */}
          <button
            className="navbar-toggler border-secondary-subtle"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="cineverseNavbar"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links and User Controls */}
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="cineverseNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-1">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link px-3 rounded-pill fw-medium ${isActive ? 'active fw-bold text-white bg-primary shadow-sm' : 'text-dark'}`}
                  onClick={closeNav}
                >
                  <i className="bi bi-fire me-1"></i> Popular Movies
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/search"
                  className={({ isActive }) => `nav-link px-3 rounded-pill fw-medium ${isActive ? 'active fw-bold text-white bg-primary shadow-sm' : 'text-dark'}`}
                  onClick={closeNav}
                >
                  <i className="bi bi-search me-1"></i> Movie Search
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) => `nav-link px-3 rounded-pill fw-medium position-relative ${isActive ? 'active fw-bold text-white bg-primary shadow-sm' : 'text-dark'}`}
                  onClick={closeNav}
                >
                  <i className="bi bi-bookmark-fill me-1"></i> Watchlist
                  {watchlist.length > 0 && (
                    <span className="badge rounded-pill bg-primary ms-1" style={{ fontSize: '0.7rem' }}>
                      {watchlist.length}
                    </span>
                  )}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/favorites"
                  className={({ isActive }) => `nav-link px-3 rounded-pill fw-medium position-relative ${isActive ? 'active fw-bold text-white bg-primary shadow-sm' : 'text-dark'}`}
                  onClick={closeNav}
                >
                  <i className="bi bi-heart-fill text-danger me-1"></i> Favorites
                  {favorites.length > 0 && (
                    <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: '0.7rem' }}>
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>

            {/* Right Side Controls: API Key & User Auth */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* API Configuration Button */}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1"
                onClick={() => setShowApiModal(true)}
                title="API Settings"
              >
                <i className="bi bi-key me-1"></i>
                <span className="d-none d-sm-inline">API Config</span>
              </button>

              {/* User Authentication state */}
              {isAuthenticated && user ? (
                <div className="d-flex align-items-center gap-2">
                  <NavLink
                    to="/profile"
                    className="btn btn-light border border-secondary-subtle rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-decoration-none shadow-sm"
                    onClick={closeNav}
                  >
                    <img
                      src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                      alt={user.username}
                      className="rounded-circle"
                      style={{ width: '24px', height: '24px' }}
                    />
                    <span className="text-dark small fw-semibold text-truncate" style={{ maxWidth: '110px' }}>
                      {user.username}
                    </span>
                  </NavLink>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                    onClick={handleSignOut}
                    title="Sign Out"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="d-none d-md-inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary rounded-pill px-4 py-1 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                  onClick={closeNav}
                >
                  <i className="bi bi-person-fill"></i>
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* API Key Modal */}
      {showApiModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-white text-dark border-light-subtle shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <i className="bi bi-gear-fill text-primary"></i> External Movie API Settings
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApiModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveApiKey}>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    The app connects to <strong>The Movie Database (TMDb) API</strong> for live popular movies and search queries, and includes an offline curated catalog fallback.
                  </p>
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-bold">TMDb v3 API Key</label>
                    <input
                      type="text"
                      className="form-control bg-white text-dark border-secondary-subtle"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="Paste your TMDb API key here"
                      required
                    />
                    <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
                      Leave as default or enter your own TMDb v3 API Key.
                    </div>
                  </div>
                  {apiSaveSuccess && (
                    <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill"></i> API key updated! Refreshing catalog...
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={() => setShowApiModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">
                    Save & Apply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

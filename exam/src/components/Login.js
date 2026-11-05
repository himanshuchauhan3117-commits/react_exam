import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../redux/actions/authActions';

const ALL_GENRES = [
  'Action',
  'Sci-Fi',
  'Drama',
  'Adventure',
  'Comedy',
  'Animation',
  'Crime',
  'Thriller',
  'Fantasy'
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('Alex Hunter');
  const [password, setPassword] = useState('password123');
  const [selectedGenres, setSelectedGenres] = useState(['Sci-Fi', 'Action']);

  const from = location.state?.from?.pathname || '/profile';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      login(username, password, {
        preferredGenres: selectedGenres
      })
    );
  };

  const handleUseDemo = () => {
    setUsername('CinephileDemo');
    setPassword('demo2024');
    setSelectedGenres(['Sci-Fi', 'Action', 'Drama']);
  };

  return (
    <div className="container py-5 my-3 bg-white">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 p-sm-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3">
                <i className="bi bi-person-lock fs-2"></i>
              </div>
              <h2 className="text-dark fw-bold">Sign In to CineVerse</h2>
              <p className="text-muted small">
                Sign in to save favorites, build your watchlist, and personalize movie recommendations.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger bg-light border-danger text-danger py-2 small mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="mb-3">
                <label className="form-label text-dark small fw-bold">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-secondary-subtle">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-white text-dark border-secondary-subtle"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="form-label text-dark small fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-secondary-subtle">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-white text-dark border-secondary-subtle"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Movie Preferences Customization */}
              <div className="mb-4 p-3 bg-light rounded-3 border border-light-subtle">
                <label className="form-label text-dark small fw-bold d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-sliders me-1 text-primary"></i> Customize Movie Preferences
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Select preferred genres
                  </span>
                </label>
                <div className="d-flex flex-wrap gap-2 pt-1">
                  {ALL_GENRES.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1 transition-all ${
                          isSelected ? 'btn-primary' : 'btn-outline-secondary text-dark'
                        }`}
                        onClick={() => toggleGenre(genre)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {isSelected && <i className="bi bi-check me-1"></i>}
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary py-2 rounded-pill text-dark small fw-medium"
                  onClick={handleUseDemo}
                >
                  <i className="bi bi-magic me-1 text-warning"></i> Autofill Demo Credentials
                </button>
              </div>
            </form>

            <div className="text-center mt-4 pt-3 border-top border-light-subtle">
              <span className="text-muted small">Don't have an account? Any username works for this demo.</span>
              <div className="mt-2">
                <Link to="/" className="text-primary text-decoration-none small fw-semibold">
                  <i className="bi bi-house me-1"></i> Continue as Guest
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

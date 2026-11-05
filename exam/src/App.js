import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import MovieSearch from './components/MovieSearch';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Profile from './components/Profile';
import SavedMoviesView from './components/SavedMoviesView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-white text-dark">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Application Body */}
        <main className="flex-grow-1 bg-white">
          <Routes>
            {/* 1. Popular Movies Page */}
            <Route path="/" element={<MovieList />} />

            {/* 2. Movie Search Page */}
            <Route path="/search" element={<MovieSearch />} />

            {/* 3. Movie Details Page */}
            <Route path="/movie/:id" element={<MovieDetails />} />

            {/* 4. User Authentication Page */}
            <Route path="/login" element={<Login />} />

            {/* 5. Watchlist View */}
            <Route path="/watchlist" element={<SavedMoviesView type="watchlist" />} />

            {/* 6. Favorites View */}
            <Route path="/favorites" element={<SavedMoviesView type="favorites" />} />

            {/* 7. Protected User Profile Page */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Modern Footer */}
        <footer className="footer-cineverse py-4 mt-auto">
          <div className="container text-center text-muted small">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <span className="fw-bold text-dark">Cine<span className="text-primary">Verse</span></span>
              <span>•</span>
              <span>Movie Discovery & Personal Library</span>
            </div>
            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
              Built with React.js, Redux, Redux-Thunk, Axios, React Router & Bootstrap. Powered by The Movie Database (TMDb) API.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;


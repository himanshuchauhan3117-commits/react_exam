# CineVerse - React.js Movie Discovery & Personal Library

A modern, full-featured Movie Discovery and Personal Library web application built purely with **React.js**, **Redux**, **Redux-Thunk**, **Axios**, **React Router v6**, and **Bootstrap 5**.

---

## 🌟 Features & Requirements Matrix

| Requirement | Implementation & Component | Points | Status |
| :--- | :--- | :---: | :---: |
| **1. Project Setup** | React 18, `react-router-dom`, `redux`, `react-redux`, `redux-thunk`, `axios`, `bootstrap`, `bootstrap-icons` | - | ✅ Complete |
| **2. Component Structure** | `MovieList`, `MovieDetails`, `MovieSearch`, `PrivateRoute`, `Navbar`, `Login`, `Profile`, `MovieCard`, `SavedMoviesView` | - | ✅ Complete |
| **3. Redux Setup** | Redux Store with action creators, thunks (`redux-thunk`), and normalized reducers for movie catalog and authentication | 5 pts | ✅ Complete |
| **4. External Movie API** | Integrated with **The Movie Database (TMDb) v3 API** (`/movie/popular`, `/movie/:id`, `/search/movie`) + offline fallback engine | 5 pts | ✅ Complete |
| **5. Fetching & Displaying** | `fetchPopularMovies` thunk in `MovieList`, dynamic movie cards, genre filters & sorting, connected via `useDispatch` & `useSelector` | 5 pts | ✅ Complete |
| **6. Movie Details Content** | Displays Title, Poster, Spoken Languages, Description/Overview, Rating with star badges | 5 pts | ✅ Complete |
| **7. Movie Search** | `searchMovies` thunk in `MovieSearch` with dynamic real-time updates as user types (debounced) & quick-search suggestion tags | 5 pts | ✅ Complete |
| **8. Displaying Movie Details** | `fetchMovieDetails` thunk in `MovieDetails` with Cast list, Genres, Release Date, Runtime, Tagline & backdrop hero | 5 pts | ✅ Complete |
| **9. Loading & Error Handling** | Bootstrap spinner indicators, custom error banners with retry triggers, graceful fallback | 5 pts | ✅ Complete |
| **10. User Authentication** | Simple auth mechanism with demo sign-in, genre preference customization, persistent Watchlist & Favorites saved in Redux & localStorage | 5 pts | ✅ Complete |
| **11. Responsive Navbar** | Responsive Bootstrap 5 navbar with brand logo, links to Popular, Search, Watchlist, Favorites, Profile, API modal, and Sign In / Out | - | ✅ Complete |
| **12. Bootstrap Styling** | Modern dark cinematic theme with cards, badges, buttons, modals, hover transitions & responsive grid | 5 pts | ✅ Complete |

---

## 📁 Project Structure

```
c:\Users\Himu\Desktop\exam\
├── public/
│   └── index.html                # HTML template with Google Fonts and Bootstrap dark theme
├── src/
│   ├── components/
│   │   ├── MovieList.js          # Popular movies catalog with filters, sorting & pagination
│   │   ├── MovieDetails.js       # Detailed movie view (cast, languages, runtime, overview)
│   │   ├── MovieSearch.js        # Dynamic real-time movie search as user types
│   │   ├── MovieCard.js          # Reusable movie card with ratings, languages, and quick actions
│   │   ├── Navbar.js             # Responsive navigation with auth & API key config modal
│   │   ├── PrivateRoute.js       # Route protection for user profile and preferences
│   │   ├── Login.js              # Authentication with preferences selection & demo credentials
│   │   ├── Profile.js            # User profile, custom genre preferences, saved collections
│   │   └── SavedMoviesView.js    # Dedicated views for Watchlist & Favorites
│   ├── redux/
│   │   ├── actions/
│   │   │   ├── movieActions.js   # Async thunks: fetchPopularMovies, fetchMovieDetails, searchMovies
│   │   │   └── authActions.js    # Async thunks: login, logout, addToFavorites, addToWatchlist
│   │   ├── reducers/
│   │   │   ├── movieReducer.js   # State slice for popular movies, details, search & filters
│   │   │   ├── authReducer.js    # State slice for auth, user preferences, favorites & watchlist
│   │   │   └── index.js          # Combined rootReducer
│   │   ├── store.js              # Redux store configured with redux-thunk middleware
│   │   └── types.js              # Action type constants
│   ├── services/
│   │   ├── movieApi.js           # Axios TMDb API client with error handling & offline fallback
│   │   └── mockMovieData.js      # Curated fallback catalog of top movies for offline reliability
│   ├── App.css                   # Custom cinematic theme, hover transitions & typography
│   ├── App.js                    # Route configuration & layout wrapper
│   ├── App.test.js               # Redux reducers, thunk actions & store unit tests
│   └── index.js                  # React 18 createRoot with Redux Provider & Bootstrap
├── package.json
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Start Development Server
```bash
npm start
```
The application will open at [http://localhost:3000](http://localhost:3000).

### 2. Run Test Suite
```bash
npm test -- --watchAll=false
```
Runs 9 comprehensive unit tests covering Redux reducers, action creators, and store slices.

### 3. Production Build
```bash
npm run build
```
Creates an optimized, production-ready static build in the `build/` folder.

---

## 🔑 External API & Offline Fallback

- The app is configured with a default working **TMDb v3 API** key.
- You can provide your own TMDb API key anytime:
  1. Click the **"API Config"** button in the top navigation bar.
  2. Enter your key and click **Save & Apply**.
  3. Alternatively, set `REACT_APP_TMDB_API_KEY=your_key` in a `.env` file.
- If no internet connection is available or if TMDb rate-limits requests, the application automatically activates its **built-in curated movie catalog**, ensuring the app remains 100% testable and never shows a broken screen.

---

## 👤 Demo Authentication

- Click **"Sign In"** in the top navigation bar.
- Click **"Autofill Demo Credentials"** (or enter any username).
- Pick your favorite genres (e.g. Action, Sci-Fi, Drama) to customize your recommendations.
- Click **"Sign In"**. You can now add movies to your **Favorites** and **Watchlist** and edit your profile!


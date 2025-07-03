import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import LikedMovies from "./components/pages/LikedMovies";
import SavedMovies from "./components/pages/SavedMovies";
import SearchPage from "./components/pages/SearchPage";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import Footer from "./components/Footer";
import like from "./assets/like.svg";
import liked from "./assets/liked.svg";
import save from "./assets/save-svg.svg";
import saved from "./assets/saved.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const API_KEY = import.meta.env.VITE_API_KEY;
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer, toast, Bounce } from "react-toastify";

function App() {
  const [movie, setMovie] = useState(null);
  const [banner, setBanner] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const getMovies = async (query = "") => {
  setLoading(true);

  try {
    let res;
    if (query) {
      res = await fetch(`${baseURL}/tmdb/search?query=${query}`);
    } else {
      let page = Math.floor(Math.random() * 500) + 1;
      res = await fetch(`${baseURL}/tmdb/popular?page=${page}`);
    }

    const data = await res.json();

    if (query && data.results?.length > 0) {
      setBanner(data.results[0]);
    } else if (!query && data.results?.length > 0) {
      setBanner(data.results[Math.floor(Math.random() * data.results.length)]);
    }

    setMovie(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    toast.error("Failed to fetch movies.");
  } finally {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
};

  const fetchLikedData = async () => {
    if (!user) return;
    const res = await fetch(`${baseURL}/movies/liked?uid=${user.uid}`);
    const data = await res.json();
    setLikedMovies(data);
  };
  const fetchSavedData = async () => {
    if (!user) return;
    const res = await fetch(`${baseURL}/movies/saved?uid=${user.uid}`);
    const data = await res.json();
    setSavedMovies(data);
  };

  const toggleLike = async (movie) => {
    if (!user) return toast.warn("Please sign in to like movies");
    const exists = likedMovies.some((m) => m.id === movie.id);

    if (exists) {
      await fetch(`${baseURL}/movies/liked/${movie.id}?uid=${user.uid}`, {
        method: "DELETE",
      });
      toast.success("Movie removed from liked list");
    } else {
      await fetch(`${baseURL}/movies/liked`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          movie: movie,
        }),
      });
      toast.success("Added to liked movies");
    }

    fetchLikedData();
  };

  const toggleSave = async (movie) => {
    if (!user) return toast.warn("Please sign in to save movies");
    const exists = savedMovies.some((m) => m.id === movie.id);

    if (exists) {
      await fetch(`${baseURL}/movies/saved/${movie.id}?uid=${user.uid}`, {
        method: "DELETE",
      });
      toast.success("Movie removed from saved list");
    } else {
      await fetch(`${baseURL}/movies/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          movie: movie,
        }),
      });
      toast.success("Added to saved movies");
    }

    fetchSavedData();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchLikedData();
      fetchSavedData();
    } else {
      setLikedMovies([]);
      setSavedMovies([]);
    }
  }, [user]);
  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              likedMovies={likedMovies}
              savedMovies={savedMovies}
              toggleLike={toggleLike}
              toggleSave={toggleSave}
              like={like}
              liked={liked}
              save={save}
              saved={saved}
              movie={movie}
              banner={banner}
              loading={loading}
              getMovies={getMovies}
              user={user}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchPage
              likedMovies={likedMovies}
              savedMovies={savedMovies}
              toggleLike={toggleLike}
              toggleSave={toggleSave}
              like={like}
              liked={liked}
              save={save}
              saved={saved}
            />
          }
        />

        <Route
          path="/movies/liked"
          element={
            <PrivateRoute>
              <LikedMovies
                likedMovies={likedMovies}
                savedMovies={savedMovies}
                toggleLike={toggleLike}
                toggleSave={toggleSave}
                like={like}
                liked={liked}
                save={save}
                saved={saved}
                user={user}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/movies/saved"
          element={
            <PrivateRoute>
              <SavedMovies
                savedMovies={savedMovies}
                likedMovies={likedMovies}
                toggleLike={toggleLike}
                toggleSave={toggleSave}
                like={like}
                liked={liked}
                save={save}
                saved={saved}
                user={user}
              />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      <Footer/>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        toastClassName="neon-toast"
      />
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import Collapse from "../Collapse";
import { useLocation, useNavigate } from "react-router-dom";
import altBanner from "../../assets/alt-banner.svg";
import altBanner2 from "../../assets/alt-banner2.svg";
import altBanner3 from "../../assets/alt-banner3.svg";
import altBanner4 from "../../assets/alt-banner4.svg";
import altBanner5 from "../../assets/alt-banner5.jpg";
import altBanner6 from "../../assets/alt-banner6.svg";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Home = ({
  likedMovies,
  savedMovies,
  toggleLike,
  toggleSave,
  like,
  liked,
  save,
  saved,
  loading,
  banner,
  movie,
  getMovies,
  user,
}) => {
  const [value, setValue] = useState("");
  const [allMovies, setAllMovies] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [showmenu, setShowMenu] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [indianMovies, setIndianMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [mixedRecommendations, setMixedRecommendations] = useState([]);

  let randomVal = Math.floor(Math.random() * 6);

  const handleChange = (e) => setValue(e.target.value);

  const handlekeyPress = async (e) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleShowMenu = async (movie) => {
    setSelectedMovie(movie);
    setShowMenu(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${
          import.meta.env.VITE_API_KEY
        }`
      );
      const data = await res.json();
      const video = data.results.find(
        (vid) => vid.site.toLowerCase() === "youtube"
      );

      setTrailerKey(video?.key || null);
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setTrailerKey(null);
    }
  };

  const fetchMovieDetails = async (title) => {
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        title
      )}&api_key=${import.meta.env.VITE_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      // return first matched result (can be refined later)
      return data.results?.[0] || null;
    } catch (err) {
      console.error("Failed to fetch movie details for:", title, err);
      return null;
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && (!movie || !banner)) {
      getMovies();
    }
  }, [location.pathname]);

  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchAllMovies = async () => {
      let pagesToFetch = 7;
      let totalPages = 20;
      let randomStart =
        Math.floor(Math.random() * (totalPages - pagesToFetch)) + 1;
      let combinedArray = [];

      for (let page = randomStart; page < randomStart + pagesToFetch; page++) {
        try {
          const url = `https://api.themoviedb.org/3/movie/popular?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&page=${page}`;

          const response = await fetch(url);
          const data = await response.json();

          combinedArray = combinedArray.concat(data.results || []);
        } catch (err) {
          console.warn(`❌ Failed to fetch page ${page}:`, err);
        }

        await delay(300); // to avoid rate limit
      }

      // Shuffle for randomness
      const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
      setAllMovies(shuffleArray(combinedArray));
    };

    fetchAllMovies();
  }, [location.pathname]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        );
        const data = await res.json();
        setTrendingMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
      }
    };

    const fetchIndianMovies = async () => {
      try {
        const indianLangs = [
          "hi",
          "te",
          "ta",
          "ml",
          "kn",
          "mr",
          "bn",
          "gu",
          "pa",
          "ur",
        ];
        let allIndianMovies = [];

        for (let lang of indianLangs) {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?with_original_language=${lang}&sort_by=popularity.desc&api_key=${
              import.meta.env.VITE_API_KEY
            }&page=1`
          );
          const data = await res.json();
          allIndianMovies = allIndianMovies.concat(data.results || []);
        }

        setIndianMovies(allIndianMovies);
      } catch (err) {
        console.error("Failed to fetch Indian movies:", err);
      }
    };

    const fetchRecent = async () => {
      const today = new Date();
      const prior = new Date();
      prior.setDate(today.getDate() - 90); // last 90 days

      const formatDate = (date) => date.toISOString().split("T")[0];

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${formatDate(
            prior
          )}&primary_release_date.lte=${formatDate(
            today
          )}&sort_by=release_date.desc&api_key=${import.meta.env.VITE_API_KEY}`
        );
        const data = await res.json();
        setRecentMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching recent movies:", err);
      }
    };

    const fetchTVShows = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&page=1`
        );
        const data = await res.json();
        setPopularTVShows(data.results || []);
      } catch (err) {
        console.error("Error fetching TV shows:", err);
      }
    };
    fetchIndianMovies()
    fetchTVShows();
    fetchRecent();
    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchMixedRecommendations = async () => {
      try {
        const res = await fetch("/movies/recommend/mixed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likedMovies, savedMovies }),
        });

        const data = await res.json();
        const movieDetails = await Promise.all(
          data.recommendations.map((title) => fetchMovieDetails(title))
        );

        const filtered = movieDetails.filter(
          (m) =>
            m &&
            m.poster_path &&
            m.title &&
            typeof m.vote_average !== "undefined" &&
            m.release_date
        );

        setMixedRecommendations(filtered);
      } catch (err) {
        toast.error("⚠️ Couldn't fetch AI recommendations");
      }
    };

    if (user?.uid) fetchMixedRecommendations();
  }, [likedMovies, savedMovies]);

  const renderMovieCard = (item, index) => (
    <motion.div
      key={item.id || `${item.title}-${index}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="card bg-black text-white flex flex-col gap-1 items-center pb-2 hover:bg-gray-900 ease-in-out hover:border border-gray-600 rounded-lg py-5 hover:scale-105 hover:shadow-lg transition-transform duration-300"
      onClick={() => handleShowMenu(item)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.title}
        loading="lazy"
        onError={(e) => (e.currentTarget.src = altBanner2)}
        className="h-auto w-full"
      />
      <div className="flex flex-col w-full justify-center items-center gap-y-5 p-2">
        <h2 className="text-2xl font-bold text-orange-100">{item.title}</h2>
        {item.original_language !== "en" && (
          <h2 className="font-light text-orange-100">
            Original Name: {item.original_title}
          </h2>
        )}
        <div className="info flex w-full justify-around gap-8">
          <div className="col1 flex flex-col items-start">
            <span>Language: {item.original_language}</span>
            <span>Release year: {item.release_date?.slice(0, 4)}</span>
          </div>
          <div className="col2 flex flex-col items-start">
            <span>Adult: {item.adult ? "Yes" : "No"}</span>
            <span>Rating: {item.vote_average.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex w-full justify-around">
          <span
            className="cursor-pointer flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(item);
            }}
          >
            {likedMovies.some((movie) => movie.id === item.id) ? (
              <>
                <img src={liked} alt="like" className="h-5" />
                Unlike
              </>
            ) : (
              <>
                <img src={like} alt="unlike" className="invert-100 h-5" />
                Like
              </>
            )}
          </span>
          <span
            className="cursor-pointer flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(item);
            }}
          >
            {savedMovies.some((movie) => movie.id === item.id) ? (
              <>
                <img src={saved} alt="save" className="invert-100 h-5" />
                Unsave
              </>
            ) : (
              <>
                <img src={save} alt="save" className="invert-100 h-5" />
                Save
              </>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );

  // Defensive for movie.results
  const yourMovies = movie?.results || [];
  const topRatedMovies = allMovies.filter((item) => item.vote_average > 8);
  const indianLanguages = ["hi", "te", "ta", "ml", "kn", "mr", "bn"];
  const popularMovies = allMovies.filter((item) => item.popularity > 30);

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  return (
    <>
      {loading ? (
        <section className="flex items-center justify-center bg-black text-white min-h-screen w-full">
          <div className="loader z-10"></div>
          <div className="text-6xl font-bold text-orange-400 z-50">
            <span>Cine</span>
            <span>AI</span>
          </div>
        </section>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Banner and Search Section */}
          <section className="relative flex items-center justify-center bg-black text-white min-h-[80vh] w-full">
            <div className="absolute inset-0 w-full h-full mt-[5rem]">
              {banner ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${banner.backdrop_path}`}
                  loading="lazy"
                  alt="Banner"
                  onError={(e) => (e.currentTarget.src = altBanner5)}
                  className="w-full h-full object-cover opacity-50"
                />
              ) : (
                <>
                  <span className="absolute p-5 text-3xl text-red-500 z-8 top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md rounded-xl">
                    👎Error Fetching Banner
                  </span>
                  <img
                    src={
                      randomVal === 0
                        ? altBanner
                        : randomVal === 1
                        ? altBanner2
                        : randomVal === 2
                        ? altBanner3
                        : randomVal === 3
                        ? altBanner4
                        : randomVal === 4
                        ? altBanner5
                        : altBanner6
                    }
                    alt="altBanner"
                    loading="lazy"
                    className="relative w-full h-[100%] object-contain opacity-50"
                  />
                </>
              )}
            </div>
            <input
              type="text"
              value={value}
              placeholder="Search..."
              onChange={handleChange}
              onKeyDown={handlekeyPress}
              className="text-xl z-10 backdrop-blur-md py-3 px-10 w-1/2 rounded-bl-full rounded-tr-full border-1 border-gray-400"
            />
          </section>

          {/* Explore Movies Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start mt-[5rem]"
          >
            <div>
              <h2 className="text-3xl">🎞️ Explore Movies</h2>
            </div>
            <Collapse
              items={yourMovies}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {mixedRecommendations.length > 0 && (
            <motion.section
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
            >
              <div>
                <h2 className="text-3xl">🤖 Recommended For You</h2>
              </div>
              <Collapse
                items={mixedRecommendations}
                limit={5}
                renderItem={renderMovieCard}
              />
            </motion.section>
          )}

          {/* Trending Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
          >
            <div>
              <h2 className="text-3xl">🔥 Trending Now</h2>
            </div>
            <Collapse
              items={shuffleArray(trendingMovies)}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {/* Rating Above 8 Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
          >
            <div>
              <h2 className="text-3xl">⭐ Top Rated Movies</h2>
            </div>
            <Collapse
              items={shuffleArray(topRatedMovies)}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {/* Indian Movies Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
          >
            <div>
              <h2 className="text-3xl"> 🇮🇳 Indian Cinema</h2>
            </div>
            <Collapse
              items={shuffleArray(indianMovies)}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {/* Recent Released Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
          >
            <div>
              <h2 className="text-3xl">🆕 Recently Released</h2>
            </div>
            <Collapse
              items={shuffleArray(recentMovies)}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {/* Popular Movies Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
          >
            <div>
              <h2 className="text-3xl">💥 Popular Hits</h2>
            </div>
            <Collapse
              items={shuffleArray(popularMovies)}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {/* Popular Web-Series */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-auto bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start"
          >
            <h2 className="text-3xl">📺 Popular Web Series</h2>
            <Collapse
              items={shuffleArray(popularTVShows)}
              limit={5}
              renderItem={renderMovieCard}
            />
          </motion.section>

          {showmenu && selectedMovie && (
            <>
              {/* Overlay */}
              <div
                className="overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
                onClick={() => setShowMenu(false)}
              />

              {/* Movie Info Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="menu text-white w-[90%] max-w-2xl max-h-[90%] overflow-y-auto bg-gray-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center rounded-lg p-6 gap-4 shadow-xl"
              >
                <h2 className="text-4xl font-bold text-orange-300 mb-4">
                  🎬 Movie Info
                </h2>

                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="w-[30%] max-w-s rounded-lg shadow-md overflow-ellipsis"
                  onError={(e) => (e.currentTarget.src = altBanner6)}
                />

                <h3 className="text-2xl font-semibold text-center mt-4">
                  {selectedMovie.title}
                </h3>

                {selectedMovie.original_language !== "en" && (
                  <p className="italic text-sm text-gray-300 mb-2">
                    Original Name: {selectedMovie.original_title}
                  </p>
                )}

                <p className="text-md text-center px-4">
                  {selectedMovie.overview}
                </p>

                {trailerKey ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailerKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  >
                    🎬 Watch Trailer on YouTube
                  </a>
                ) : (
                  <p className="text-center italic text-sm mt-2">
                    No trailer available
                  </p>
                )}

                <div className="flex gap-10 text-sm text-gray-300 mt-4">
                  <div className="flex flex-col items-start">
                    <span>Language: {selectedMovie.original_language}</span>
                    <span>
                      Release Year: {selectedMovie.release_date?.slice(0, 4)}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span>Adult: {selectedMovie.adult ? "Yes" : "No"}</span>
                    <span>Rating: {selectedMovie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex w-full justify-around mt-4">
                  <span
                    className="cursor-pointer flex flex-col items-center"
                    onClick={() => toggleLike(selectedMovie)}
                  >
                    {likedMovies.some((m) => m.id === selectedMovie.id) ? (
                      <>
                        <img src={liked} alt="like" className="h-5" />
                        Unlike
                      </>
                    ) : (
                      <>
                        <img
                          src={like}
                          alt="unlike"
                          className="invert-100 h-5"
                        />
                        Like
                      </>
                    )}
                  </span>
                  <span
                    className="cursor-pointer flex flex-col items-center"
                    onClick={() => toggleSave(selectedMovie)}
                  >
                    {savedMovies.some((m) => m.id === selectedMovie.id) ? (
                      <>
                        <img
                          src={saved}
                          alt="save"
                          className="invert-100 h-5"
                        />
                        Unsave
                      </>
                    ) : (
                      <>
                        <img src={save} alt="save" className="invert-100 h-5" />
                        Save
                      </>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="absolute top-3 right-4 text-white text-xl hover:text-red-500 cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

export default Home;

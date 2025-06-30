import React, { useState, useEffect } from "react";
import altBanner2 from "../../assets/alt-banner2.svg";
import { motion } from "framer-motion";

const SavedMovies = ({
  savedMovies,
  likedMovies,
  toggleLike,
  toggleSave,
  like,
  liked,
  save,
  saved,
  user,
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [showmenu, setShowMenu] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

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
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          title
        )}&api_key=${import.meta.env.VITE_API_KEY}`
      );

      const data = await res.json();
      const bestMatch = data.results?.[0];

      if (!bestMatch) {
        console.warn(`⚠️ No match found for title: ${title}`);
        return null;
      }

      return bestMatch;
    } catch (err) {
      console.error("❌ Failed to fetch movie details:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!savedMovies || savedMovies.length === 0) {
        console.warn("⚠️ No saved movies available for recommendation.");
        return;
      }

      try {
        const res = await fetch("/recommend/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ savedMovies }),
        });

        const data = await res.json();

        if (!Array.isArray(data.recommendations)) {
          console.error("❌ Recommendation response is not an array:", data);
          return;
        }

        // 👉 Fetch detailed movie data for each recommendation
        const fetchedDetails = await Promise.all(
          data.recommendations.map((title) => fetchMovieDetails(title))
        );

        const filtered = fetchedDetails.filter(
          (m) =>
            m &&
            m.poster_path &&
            m.title &&
            typeof m.vote_average !== "undefined" &&
            m.release_date
        );

        setRecommendations(filtered);
      } catch (err) {
        console.error("❌ Recommendation fetch failed:", err);
      }
    };

    if (user?.uid) fetchRecommendations();
  }, [savedMovies]);

  return (
    <div className="px-5 py-20 bg-gray-950 text-white min-h-screen">
      <h1 className="text-3xl mb-5">Saved Movies</h1>
      {savedMovies.length === 0 ? (
        <p>No movies saved yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-gray-950 h-full w-full gap-5">
            {savedMovies.map((movie,index) => (
              <div
                key={movie.id || `${movie.title}-${index}`}
                className="bg-black text-white flex flex-col gap-1 items-center pb-2 hover:bg-gray-900 hover:scale-103 transition-transform duration-300 ease-in-out hover:border border-gray-600 rounded-lg py-5"
                onClick={() => handleShowMenu(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = altBanner2)}
                />
                <div className="flex flex-col w-full justify-center items-center gap-y-5 p-2">
                  <h2 className="text-2xl font-bold text-orange-100">
                    {movie.title}
                  </h2>
                  {movie.original_language !== "en" && (
                    <h2 className="font-light text-orange-100">
                      Original Name: {movie.original_title}
                    </h2>
                  )}
                  <div className="info flex w-full justify-around gap-8">
                    <div className="col1 flex flex-col items-start">
                      <span>Language: {movie.original_language}</span>
                      <span>
                        Release year: {movie.release_date?.slice(0, 4)}
                      </span>
                    </div>
                    <div className="col2 flex flex-col items-start">
                      <span>Adult: {movie.adult ? "Yes" : "No"}</span>
                      <span>Rating: {movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex w-full justify-around">
                    <span
                      className="cursor-pointer flex flex-col items-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(movie)}}
                    >
                      {likedMovies.some((m) => m.id === movie.id) ? (
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
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSave(movie)}}
                    >
                      {savedMovies.some((m) => m.id === movie.id) ? (
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
                          <img
                            src={save}
                            alt="save"
                            className="invert-100 h-5"
                          />
                          Save
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                  onError={(e) => (e.currentTarget.src = altBanner2)}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(selectedMovie)}}
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

          {recommendations.length > 0 && (
            <>
              <h1 className="text-3xl mb-5 mt-5">You may also like</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-gray-950 h-full w-full gap-5">
                {recommendations.map((movie, index) => (
                  <div
                    key={movie.id || `${movie.title}-${index}`}
                    className="bg-black text-white flex flex-col gap-1 items-center pb-2 hover:bg-gray-900 hover:scale-103 transition-transform duration-300 ease-in-out hover:border border-gray-600 rounded-lg py-5"
                    onClick={() => handleShowMenu(movie)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto"
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = altBanner2)}
                    />
                    <div className="flex flex-col w-full justify-center items-center gap-y-5 p-2">
                      <h2 className="text-2xl font-bold text-orange-100">
                        {movie.title}
                      </h2>
                      {movie.original_language !== "en" && (
                        <h2 className="font-light text-orange-100">
                          Original Name: {movie.original_title}
                        </h2>
                      )}
                      <div className="info flex w-full justify-around gap-8">
                        <div className="col1 flex flex-col items-start">
                          <span>Language: {movie.original_language}</span>
                          <span>
                            Release year: {movie.release_date?.slice(0, 4)}
                          </span>
                        </div>
                        <div className="col2 flex flex-col items-start">
                          <span>Adult: {movie.adult ? "Yes" : "No"}</span>
                          <span>
                            Rating: {movie.vote_average?.toFixed(1) ?? "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full justify-around">
                        <span
                          className="cursor-pointer flex flex-col items-center"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(movie)}}
                        >
                          {likedMovies.some((m) => m.id === movie.id) ? (
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
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSave(movie)}}
                        >
                          {savedMovies.some((m) => m.id === movie.id) ? (
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
                              <img
                                src={save}
                                alt="save"
                                className="invert-100 h-5"
                              />
                              Save
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SavedMovies;

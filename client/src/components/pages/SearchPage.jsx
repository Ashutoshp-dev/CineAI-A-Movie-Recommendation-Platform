import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Collapse from "../Collapse";

const SearchPage = ({
  likedMovies,
  savedMovies,
  toggleLike,
  toggleSave,
  like,
  liked,
  save,
  saved,
}) => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const query = new URLSearchParams(location.search).get("query");
  useEffect(() => {
    if (query) {
      fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/tmdb/search?query=${encodeURIComponent(query)}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results);
          setSearchResults(data.results);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [query]);

  const renderMovieCard = (item) => (
    <div
      key={item.id}
      className="card bg-black text-white flex flex-col gap-1 items-center pb-2 hover:bg-gray-900 hover:scale-103 transition-transform duration-300 ease-in-out hover:border border-gray-600 rounded-lg py-5"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.title}
        loading="lazy"
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
            onClick={() => toggleLike(item)}
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
            onClick={() => toggleSave(item)}
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
    </div>
  );

  return (
    <section className="bg-gray-950 text-white py-10 px-5 gap-7 flex flex-col items-start">
      <div>
        <h2 className="text-3xl pt-10">
          Search Results for:{" "}
          <span className="text-orange-400">{query?.toUpperCase()}</span>
        </h2>
      </div>
      {searchResults.length === 0 && query && (
        <p className="text-gray-400">No results found for "{query}"</p>
      )}
      <Collapse items={searchResults} limit={5} renderItem={renderMovieCard} />
    </section>
  );
};

export default SearchPage;

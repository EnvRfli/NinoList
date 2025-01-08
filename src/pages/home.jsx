import React, { useEffect, useState, useRef } from "react";
import {
  fetchTopAnimeList,
  fetchThisSeason,
  getAnimeSearch,
} from "../service/jikan_api_fetch";
import "../assets/styles/global.css";

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [animeThisSeason, setAnimeThisSeason] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const [results, setResults] = useState([]);


  const handleSearch = async (query) => {
    if (!query.trim()) return; // Skip if query is empty or contains only whitespace

    setSearchLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const data = await getAnimeSearch(query, signal);
      if (data) {
        setResults(data.data); // Ensure to set the correct data structure
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setSearchLoading(false);
    }
  };


  useEffect(() => {
    if (search === "") {
      setResults([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleSearch(search);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search]);

  useEffect(() => {
  }, [results]);

  //after search fetch
  const preloadImages = async (data) => {
    const limitedData = data.slice(0, 10);
    const imagePromises = limitedData.map((anime) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = anime.images.jpg.image_url;
        img.onload = resolve;
        img.onerror = resolve;
      })
    );
    return Promise.all(imagePromises);
  };

  const fetchData = async (fetchFunction, setState) => {
    try {
      const data = await fetchFunction();
      setState(data);
      await preloadImages(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(() => fetchTopAnimeList(1), setAnimeList),
        fetchData(fetchThisSeason, setAnimeThisSeason),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="w-3/4 pt-8 align-middle mx-auto mb">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-200 rounded-md w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-6"></div>

          <div className="h-6 bg-blue-200 rounded-md w-1/3 mt-8 mb-4"></div>
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-md h-40 w-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 pt-8 align-middle mx-auto mb">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to NinoList</h1>
      <p className="mt-2 text-gray-700">Explore your favorite anime here!</p>

      <div className="w-full flex">
        <div className="flex justify-start mt-4 w-1/2 items-center bg-white p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>

          <input
            type="text"
            placeholder="Search anime..."
            className="w-full ml-2 bg-transparent focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-1/2 justify-end mt-4 flex items-center">
          <a
            href="/advance-search"
            className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:from-pink-500 hover:to-yellow-400 text-white font-bold py-2 px-4 rounded ml-2 shadow-lg transform transition-transform duration-300 hover:scale-105 animate-pulse"
          >
            Advanced Search
          </a>

        </div>
      </div>

      {searchLoading && (
        <div className="w-full mt-4 bg-gray-200 p-2 rounded-lg animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-gray-300 rounded-md h-60 w-full animate-pulse">
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="w-full mt-4 bg-gray-200 p-2 rounded-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <h1 className="text-2xl font-bold text-blue-600 col-span-full">
            Search Results:
          </h1>
          {results.map((anime) => (
            <a
              key={anime.mal_id}
              href={`/details/${anime.mal_id}/overview`}
              className="relative bg-white shadow-md rounded-lg overflow-hidden group"
            >
              <div
                key={anime.mal_id}
                className="relative bg-white shadow-md rounded-lg overflow-hidden group"
              >
                <div className="relative card_img">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer mt-auto py-6 px-3">
                    <div className="text-white text-lg font-bold">
                      {anime.title}
                    </div>
                    <div className="text-white text-lg font-bold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                      </svg>
                      {anime.score === null ? "N/A" : anime.score}
                    </div>
                    <div className="text-white text-sm mt-2">
                      {anime.genres.map((genre) => genre.name).join(", ")}
                    </div>
                    <div className="text-white text-sm mt-2">
                      Status : {anime.status}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-white text-sm">
                    Rating : {anime.score === null ? "N/A" : anime.score}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      <h2 className="text-xl font-bold text-blue-600 mt-4 mb-2">
        Anime This Season
      </h2>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Baris 1 */}
        {animeThisSeason.slice(0, 3).map((anime) => (
          <a
            key={anime.mal_id}
            href={`/details/${anime.mal_id}/overview`} // Tautan menuju halaman detail
            className="relative bg-white shadow-md rounded-lg overflow-hidden group"
          >
            <div
              key={anime.mal_id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden group"
            >
              <div className="relative card_img">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer mt-auto py-6 px-3">
                  <div className="text-white text-lg font-bold">
                    {anime.title}
                  </div>
                  <div className="text-white text-lg font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                    {anime.score === null ? "N/A" : anime.score}
                  </div>
                  <div className="text-white text-sm mt-2">
                    {anime.genres.map((genre) => genre.name).join(", ")}
                  </div>
                  <div className="text-white text-sm mt-2">
                    Status : {anime.status}
                  </div>
                </div>
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-white text-sm">
                  Rating : {anime.score === null ? "N/A" : anime.score}
                </div>
              </div>
            </div>
          </a>
        ))}

        <div className="col-span-1 lg:col-span-2 bg-gray-100 row-span-2">
          <div className="text-gray-700 p-4 flex flex-col">
            <h2 className="text-xl font-bold text-center flex-none mb-4">
              Top 10 Rated Anime
            </h2>
            <div className="flex w-full gap-2 h-full">
              <div className="flex flex-wrap gap-2 w-1/2">
                {animeList.slice(0, 5).map((anime) => (
                  <a href={`/details/${anime.mal_id}/overview`} key={anime.mal_id} className="cursor-pointer w-full transition-opacity hover:bg-opacity-50">
                    <div
                      key={anime.mal_id}
                      className="flex bg-white rounded shadow w-full h-20 cursor-pointer"
                    >
                      <div className="w-1/3 bg-white rounded-l overflow-hidden p-1">
                        <img
                          src={anime.images.jpg.image_url}
                          alt={anime.title}
                          className="w-full h-full object-cover border-r-2 border-b-2 cursor-pointer bg-opacity-50 hover:bg-opacity-100 transition-opacity duration-300 rounded-l"
                        />
                      </div>
                      <div className="w-2/3 p-1">
                        <div className="text-sm font-bold text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis">
                          {anime.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="18" height="18" className="text-yellow-500">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                          {anime.score === null ? "N/A" : anime.score}
                        </div>
                        <div className="text-xs">
                          {anime.genres.map((genre) => genre.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 w-1/2">
                {animeList.slice(5, 10).map((anime) => (
                  <a href={`/details/${anime.mal_id}/overview`} key={anime.mal_id} className="cursor-pointer w-full transition-opacity hover:bg-opacity-50">
                    <div
                      key={anime.mal_id}
                      className="flex bg-white rounded shadow w-full h-20"
                    >
                      <div className="w-1/3 bg-white rounded-l overflow-hidden p-1">
                        <img
                          src={anime.images.jpg.image_url}
                          alt={anime.title}
                          className="w-full h-full object-cover  cursor-pointer bg-opacity-50 hover:bg-opacity-100 transition-opacity duration-300 rounded-l border-r-2 border-b-2"
                        />
                      </div>
                      <div className="w-2/3 p-1">
                        <div className="text-sm font-bold text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis">
                          {anime.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="18" height="18" className="text-yellow-500">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                          {anime.score === null ? "N/A" : anime.score}
                        </div>
                        <div className="text-xs">
                          {anime.genres.map((genre) => genre.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <a href="/top-anime-list" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">More Top Anime List...</a>
            </div>
            <p className="text-sm text-gray-500 align-middle justify-center mt-4 text-center">
              Rated anime based on user score from MyAnimeList.net
            </p>
          </div>
        </div>

        {/* Baris Selanjutnya */}
        {animeThisSeason.slice(3).map((anime) => (

          <a
            key={anime.mal_id}
            href={`/details/${anime.mal_id}/overview`}
            className="relative bg-white shadow-md rounded-lg overflow-hidden group"
          >
            <div
              key={anime.mal_id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden group"
            >
              <div className="relative card_img">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer mt-auto py-6 px-3">
                  <div className="text-white text-lg font-bold">
                    {anime.title}
                  </div>
                  <div className="text-white text-lg font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                    {anime.score === null ? "N/A" : anime.score}
                  </div>
                  <div className="text-white text-sm mt-2">
                    {anime.genres.map((genre) => genre.name).join(", ")}
                  </div>
                  <div className="text-white text-sm mt-2">
                    Status : {anime.status}
                  </div>
                </div>
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-white text-sm">
                  Rating : {anime.score === null ? "N/A" : anime.score}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Home;

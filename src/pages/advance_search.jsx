import React, { useEffect, useState } from "react";
import { getAnimeFilter, fetchAnimeCategory } from "../service/jikan_api_fetch";
import { type } from './mapping';


function AdvanceSearch() {
    const [anime, setAnime] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenres, setSelectedGenres] = useState("");
    const [minScore, setMinScore] = useState(1);
    const [tempMinscore, setTempMinScore] = useState(minScore);
    const [timeoutId2, setTimeoutId2] = useState(null);
    const [latestMinScore, setLatestMinScore] = useState(minScore);
    const [maxScore, setMaxScore] = useState(10);
    const [tempScore, setTempScore] = useState(maxScore);
    const [timeoutId, setTimeoutId] = useState(null);
    const [latestMaxScore, setLatestMaxScore] = useState(maxScore);
    const [selectedType, setSelectedType] = useState([]);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [page, setPage] = useState(1);



    const handleCheckboxChange = (e, id) => {
        setSelectedGenres((prev) => {
            // Split the previous genres into an array, or initialize as an empty array
            const genresArray = prev ? prev.split(",") : [];

            if (e.target.checked) {
                // Add the new genre ID if it's checked
                return [...genresArray, id.toString()].join(","); // Ensure id is a string
            } else {
                // Remove the genre ID if it's unchecked
                return genresArray.filter((genreId) => genreId !== id.toString()).join(","); // Ensure id is a string
            }
        });
    };
    const handleMinScoreChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setTempMinScore(newValue);

        if (timeoutId2) {
            clearTimeout(timeoutId2);
        }

        const id = setTimeout(() => {
            setMinScore(newValue);
            setLatestMinScore(newValue);
        }, 500);

        setTimeoutId2(id);
    };

    useEffect(() => {
        return () => {
            if (timeoutId2) {
                clearTimeout(timeoutId2);
            }
        };
    }, [timeoutId2]);

    const handleMaxScoreChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setTempScore(newValue);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const id = setTimeout(() => {
            setMaxScore(newValue);
            setLatestMaxScore(newValue);
        }, 500);

        setTimeoutId(id);
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const handleTypeChange = (e) => {
        if (selectedType === e.target.value) {
            setSelectedType(null);
        } else {
            setSelectedType(e.target.value);
        }
    };

    useEffect(() => {
        fetchAnimeCategory()
            .then((data) => {
                setGenreList(data);
            });
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    useEffect(() => {
        setLoading(true);
        getAnimeFilter(selectedGenres, latestMinScore, latestMaxScore, selectedType, debouncedQuery, page)
            .then((data) => {
                setAnime(data);
                setLoading(false);
                console.log(data);
            });
    }, [selectedGenres, latestMinScore, latestMaxScore, selectedType, debouncedQuery, page]);
    return (
        <div className="w-full h-full align-middle mx-auto bg-gray-50">
            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4">
                <div className="w-full justify-center bg-white p-4 shadow-md rounded-lg">
                    <h1 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
                        Genres
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {genreList.map(
                            (genre) =>
                                genre.count > 500 && (
                                    <div key={genre.mal_id} className="p-0.5">
                                        <label
                                            className={`flex items-center cursor-pointer px-2 py-1 rounded text-gray-800 font-medium text-xs transition-colors duration-200 ${selectedGenres.split(",").includes(genre.mal_id.toString())
                                                ? "bg-yellow-300 text-gray-900"
                                                : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                value={genre.mal_id}
                                                onChange={(e) => handleCheckboxChange(e, genre.mal_id)}
                                                checked={selectedGenres.split(",").includes(genre.mal_id.toString())} // Ensure checkbox reflects the correct state
                                            />
                                            <p className="leading-none">{genre.name}</p>
                                        </label>
                                    </div>
                                )
                        )}
                    </div>
                    <h1 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6 mb-4">
                        Min Score
                    </h1>
                    <div className="flex flex-col items-center">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.01"
                            value={tempMinscore}
                            onChange={handleMinScoreChange}
                            className="w-full"
                        />
                        <p className="text-gray-700 font-bold mt-2">Score: {tempMinscore.toFixed(2)}</p>
                    </div>

                    <h1 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6 mb-4">
                        Max Score
                    </h1>
                    <div className="flex flex-col items-center">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.01"
                            value={tempScore}
                            onChange={handleMaxScoreChange}
                            className="w-full"
                        />
                        <p className="text-gray-700 font-bold mt-2">Score: {tempScore.toFixed(2)}</p>
                    </div>

                    <h1 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6 mb-4">
                        Type
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {type.map((typeItem) => (
                            <div key={typeItem.value} className="p-0.5">
                                <label
                                    className={`flex items-center cursor-pointer px-2 py-1 rounded text-gray-800 font-medium text-xs transition-colors duration-200 ${selectedType === typeItem.value ? "bg-yellow-300 text-gray-900" : "bg-gray-200 hover:bg-gray-300"}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        value={typeItem.value}
                                        checked={selectedType === typeItem.value} // Check if the value is selected
                                        onChange={handleTypeChange}
                                    />
                                    <p className="leading-none">{typeItem.display}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full p-2">
                    <div className="flex justify-start mt-4 w-full items-center bg-gray-200 p-2 rounded-lg shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="text-gray-600"
                        >
                            <path d="M15.5 14h-.79l-.28-.27a 6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search anime..."
                            className="w-full ml-2 bg-gray-200 text-gray-800 font-medium text-sm focus:outline-none placeholder-gray-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <h1 className="text-lg font-bold text-gray-600 mt-4">
                        Filtered Result :
                    </h1>
                    {selectedGenres.includes("12") && (
                        <h1 className="text-gray-500 font-bold">Here's your Hentai result you Perfert bastard</h1>
                    )}
                    <div className="w-full p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                        {loading ? (
                            Array.from({ length: 20 }).map((_, index) => (
                                <div key={index} className="w-full">
                                    <div className="w-full bg-white p-2 rounded-lg shadow-lg h-72 animate-pulse">
                                        <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
                                        <div className="w-full h-5 bg-gray-300 rounded-lg mt-2"></div>
                                        <div className="w-full h-3 bg-gray-300 rounded-lg mt-1"></div>
                                        <div className="w-full h-3 bg-gray-300 rounded-lg mt-1"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            anime?.length === 0 ? (
                                <div className="w-full h-full flex justify-center items-center">
                                    <h1 className="text-gray-500 font-bold">No results found</h1>
                                </div>
                            ) :
                                anime.map((anime) => (
                                    <a
                                        href={`/details/${anime.mal_id}/overview`}
                                        key={anime.mal_id}
                                        className="w-full group" // Add group class here
                                    >
                                        <div className="w-full bg-white p-2 rounded-lg shadow-lg h-72 relative overflow-hidden">
                                            <img
                                                src={anime.images.jpg.large_image_url}
                                                alt={anime.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <h1 className="text-gray-800 font-bold text-sm mt-2 line-clamp-2">{anime.title}</h1>
                                            <p className="text-yellow-500 text-xs">{anime.score}</p>
                                            <p className="text-gray-500 text-xs line-clamp-1">
                                                {anime.genres.map((genre) => (
                                                    genre.name + (anime.genres.indexOf(genre) === anime.genres.length - 1 ? "" : ", ")
                                                ))}
                                            </p>
                                            {/* Overlay for darkening effect */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer mt-auto py-6 px-3"></div>
                                        </div>
                                    </a>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AdvanceSearch;
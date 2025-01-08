import React, { useEffect, useState } from "react";
import { useParams, Outlet, useLocation, Link } from "react-router-dom";
import { getAnimeDetails } from "../service/jikan_api_fetch";

function AnimeDetails() {
    const { id } = useParams(); // Get ID from the URL
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        getAnimeDetails(id)
            .then((data) => {
                setAnime(data);
                const imagePromises = [
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = data.trailer?.images?.maximum_image_url || "";
                        img.onload = resolve;
                        img.onerror = resolve;
                    }),
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = data.images?.jpg?.large_image_url || "";
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                ];

                // Tunggu semua gambar dimuat
                Promise.all(imagePromises).then(() => setLoading(false));
            })
            .catch((error) => {
                console.error("Error fetching anime details:", error);
                setLoading(false); // Hentikan loading meskipun ada error
            });
    }, [id]);


    // Update activeTab based on location
    useEffect(() => {
        const path = location.pathname.split("/").pop();
        setActiveTab(path === id ? "overview" : path);
    }, [location, id]);

    if (loading) {
        return <div className="w-full mx-auto align-middle bg-white">
            {/* Skeleton Loader for Trailer Image */}
            <div className="w-full mx-auto h-80 border-r-2 border-gray-400 overflow-hidden relative bg-gray-200 animate-pulse">
                <div className="absolute inset-0 w-full h-full bg-gray-300"></div>
            </div>

            {/* Skeleton Loader for Title */}
            <div className="p-2 text-center w-full bg-blue-400 items-center justify-center mx-auto left-0 right-0 sticky animate-pulse">
                <div className="h-6 w-1/2 bg-gray-300 mx-auto rounded"></div>
            </div>

            <div className="w-3/4 mx-auto flex">
                {/* Left Section Skeleton */}
                <div className="w-1/4 p-2 border-r-2 border-l-2 border-gray-400 h-auto shadow-r-2 flex-grow">
                    {/* Skeleton for Image */}
                    <div className="w-full h-40 bg-gray-300 mb-2 rounded animate-pulse"></div>

                    {/* Alternate Title Skeleton */}
                    <div className="border-t-2 border-gray-400 p-2">
                        <div className="h-4 w-1/3 bg-gray-300 rounded mb-1 animate-pulse"></div>
                        <div className="h-4 w-2/3 bg-gray-300 rounded mb-1 animate-pulse"></div>
                    </div>

                    {/* Information Skeleton */}
                    <div className="border-t-2 border-gray-400 p-2">
                        {Array(10)
                            .fill(0)
                            .map((_, idx) => (
                                <div key={idx} className="h-4 w-full bg-gray-300 rounded mb-1 animate-pulse"></div>
                            ))}
                    </div>

                    {/* Statistics Skeleton */}
                    <div className="border-t-2 border-gray-400 p-2">
                        {Array(5)
                            .fill(0)
                            .map((_, idx) => (
                                <div key={idx} className="h-4 w-3/4 bg-gray-300 rounded mb-1 animate-pulse"></div>
                            ))}
                    </div>

                    {/* Footer Note Skeleton */}
                    <div className="border-t-2 border-gray-400 p-2">
                        <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Right Section Skeleton */}
                <div className="w-full">
                    {/* Synopsis Skeleton */}
                    <div className="p-2">
                        <div className="h-4 w-1/3 bg-gray-300 rounded mb-2 animate-pulse"></div>
                        {Array(5)
                            .fill(0)
                            .map((_, idx) => (
                                <div key={idx} className="h-4 w-full bg-gray-300 rounded mb-1 animate-pulse"></div>
                            ))}
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="border-t-2 border-b-2 border-gray-400 p-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center items-center">
                        {Array(6)
                            .fill(0)
                            .map((_, idx) => (
                                <div key={idx} className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                            ))}
                    </div>

                    {/* Nested Route Skeleton */}
                    <div className="p-2">
                        <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    }

    const tabs = [
        { name: "Overview", path: "overview" },
        { name: "Characters & Staff", path: "characters" },
        { name: "Episodes", path: "episodes" },
        { name: "Reviews", path: "reviews" },
        { name: "Pictures", path: "pictures" },
        { name: "Simmiliar", path: "related" },
    ];

    return (
        <div className="w-full mx-auto align-middle bg-white">
            <div className="w-full mx-auto h-80 border-r-2 border-gray-400 overflow-hidden relative">
                <img
                    src={anime.trailer.images.maximum_image_url}
                    alt={anime.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            </div>
            <div className="p-2 text-center w-full bg-blue-400 items-center justify-center mx-auto left-0 right-0 sticky">
                <h1 className="text-2xl font-bold text-white">{anime.title}</h1>
            </div>
            <div className="w-3/4 mx-auto flex">
                <div className="w-1/4 p-2 border-r-2 border-l-2 border-gray-400 h-auto shadow-r-2 flex-grow">
                    <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full mb-2" />
                    <div className="border-t-2 border-gray-400 p-2">
                        <h2 className="text-2xs font-bold">Alternate Title</h2>
                        <p className="text-xs">{anime.titles[1]?.title}</p>
                        <p className="text-xs">{anime.titles[2]?.title}</p>
                    </div>
                    <div className="border-t-2 border-gray-400 p-2">
                        <h2 className="text-2xs font-bold">Information</h2>
                        <p className="text-xs mt-1">Type: {anime.type}</p>
                        <p className="text-xs mt-1">Episodes: {anime.episodes}</p>
                        <p className="text-xs mt-1">Status: {anime.status}</p>
                        <p className="text-xs mt-1">Aired: {anime.aired.string}</p>
                        <p className="text-xs mt-1">Premiered: {anime.season} {anime.year}</p>
                        <p className="text-xs mt-1">Broadcast: {anime.broadcast.day} at {anime.broadcast.time}</p>
                        <p className="text-xs mt-1">
                            Producers:{" "}
                            {anime.producers.length > 0 ? (
                                anime.producers
                                    .map((producer) => (
                                        <a
                                            key={producer.mal_id}
                                            href={`/details/producer/${producer.mal_id}/${producer.name.replace(/ /g, "_").replace(/,/g, "")}`}
                                            className="text-blue-400 hover:underline"
                                        >
                                            {producer.name}
                                        </a>
                                    ))
                                    .reduce((prev, curr, index) => [prev, index > 0 && ", ", curr])
                            ) : (
                                <span className="text-gray-500">No producers available</span>
                            )}
                        </p>

                        <p className="text-xs mt-1">
                            Licensors:{" "}
                            {anime.licensors.length > 0 ? (
                                anime.licensors
                                    .map((licensor) => (
                                        <a
                                            key={licensor.mal_id}
                                            href={`/details/producer/${licensor.mal_id}/${licensor.name.replace(/ /g, "_").replace(/,/g, "")}`}
                                            className="text-blue-400 hover:underline"
                                        >
                                            {licensor.name}
                                        </a>
                                    ))
                                    .reduce((prev, curr, index) => [prev, index > 0 && ", ", curr])
                            ) : (
                                <span className="text-gray-500">No licensors available</span>
                            )}
                        </p>

                        <p className="text-xs mt-1">
                            Studios:{" "}
                            {anime.studios.length > 0 ? (
                                anime.studios
                                    .map((studio) => (
                                        <a
                                            key={studio.mal_id}
                                            href={`/details/producer/${studio.mal_id}/${studio.name.replace(/ /g, "_").replace(/,/g, "")}`}
                                            className="text-blue-400 hover:underline"
                                        >
                                            {studio.name}
                                        </a>
                                    ))
                                    .reduce((prev, curr, index) => [prev, index > 0 && ", ", curr])
                            ) : (
                                <span className="text-gray-500">No studios available</span>
                            )}
                        </p>


                        <p className="text-xs mt-1">Source: {anime.source}</p>
                        <p className="text-xs mt-1">Genres: {anime.genres.map((genre) => genre.name).join(", ")}</p>
                        <p className="text-xs mt-1">Duration: {anime.duration}</p>
                        <p className="text-xs mt-1">Rating: {anime.rating}</p>
                    </div>
                    <div className="border-t-2 border-gray-400 p-2">
                        <h2 className="text-2xs font-bold">Statistic</h2>
                        <p className="text-xs mt-1">Score: {anime.score} scored by {anime.scored_by} users</p>
                        <p className="text-xs mt-1">Rank: {anime.rank}</p>
                        <p className="text-xs mt-1">Popularity: #{anime.popularity}</p>
                        <p className="text-xs mt-1">Members: {anime.members}</p>
                        <p className="text-xs mt-1">Favorites: {anime.favorites}</p>
                    </div>
                    <div className="border-t-2 border-gray-400 p-2">
                        <p className="text-xs mt-1 italic">
                            All information, including characters, images, and other media, is based on data from MyAnimelist.net
                        </p>
                    </div>
                </div>
                <div className="w-full">
                    <div className="p-2">
                        <h2 className="text-2xs font-bold">Synopsis</h2>
                        <p className="text-xs mt-1">
                            {anime.synopsis.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                    {/* Tabs */}
                    <div className="border-t-2 border-b-2 border-gray-400 p-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center items-center">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.path}
                                to={`/details/${id}/${tab.path}`}
                                onClick={(e) => activeTab === tab.path && e.preventDefault()}
                                className={`text-center ${activeTab === tab.path ? "cursor-pointer text-gray-400" : "text-blue-400 hover:underline"
                                    }`}
                            >
                                <p className="text-xs mt-1">{tab.name}</p>
                            </Link>
                        ))}
                    </div>
                    {/* Outlet for nested routes */}
                    <div>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeDetails;

import React, { useEffect, useState } from "react";
import { fetchTopAnimeList } from "../service/jikan_api_fetch";

function TopAnimeList() {
    const [topAnimeList, setTopAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchAnime = async (pageNumber) => {
        setLoading(true);
        const data = await fetchTopAnimeList(pageNumber);
        if (pageNumber === 1) {
            setTopAnimeList(data); // Reset the list for the first page
        } else {
            setTopAnimeList((prev) => [...prev, ...data]); // Append new data for subsequent pages
        }
        setHasMore(data.length > 0); // Check if more data is available
        setLoading(false);
    };

    useEffect(() => {
        fetchAnime(page);
    }, [page]);

    const loadMore = () => {
        if (hasMore && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="container mx-auto p-2">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-4">Top Anime List</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 animate-pulse">
                    {[...Array(20)].map((_, index) => (
                        <div key={index} className="bg-gray-300 rounded-lg overflow-hidden">
                            <div className="h-48 bg-gray-400"></div>
                            <div className="h-8 bg-gray-400 mt-2"></div>
                            <div className="h-6 bg-gray-400 mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-2">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-4">Top Anime List</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                {topAnimeList.map((anime) => (
                    <a
                        key={anime.mal_id}
                        href={`/details/${anime.mal_id}/overview`}
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
                    </a>
                ))}
            </div>
            {loading && <div className="container mx-auto p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 animate-pulse">
                    {[...Array(20)].map((_, index) => (
                        <div key={index} className="bg-gray-300 rounded-lg overflow-hidden">
                            <div className="h-48 bg-gray-400"></div>
                            <div className="h-8 bg-gray-400 mt-2"></div>
                            <div className="h-6 bg-gray-400 mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>}
            {hasMore && !loading && (
                <div className="text-center mt-4">
                    <button
                        onClick={loadMore}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}

export default TopAnimeList;
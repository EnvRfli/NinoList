import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeEpisodes } from "../../service/jikan_api_fetch";

function Episodes() {
    const { id } = useParams();
    const [episodes, setEpisodes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnimeEpisodes(id).then((data) => {
            setEpisodes(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {Array(10) // Tampilkan 10 skeleton sebagai placeholder
                    .fill(0)
                    .map((_, index) => (
                        <div
                            key={index}
                            className="w-full h-16 flex items-center bg-gray-200 p-2 rounded-md shadow-md animate-pulse"
                        >
                            <div className="w-10 bg-gray-300 text-white text-center rounded-md h-full flex items-center justify-center"></div>
                            <div className="w-1/2 flex items-center">
                                <div className="ml-2 text-left items-center mb-auto w-full">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-end">
                                <div className="mr-2 text-right items-center mt-auto">
                                    <div className="h-4 bg-gray-300 rounded w-12 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-8"></div>
                                </div>
                                <div className="mr-2 text-right items-center mt-auto">
                                    <div className="h-4 bg-gray-300 rounded w-12 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-8"></div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
            ;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };

    return (
        <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {episodes.map((episode, index) => (
                    <a href={episode.url} target="_blank" rel="noreferrer">
                        <div className="w-full h-16 flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300">
                            <div className="w-10 bg-blue-400 text-white text-center rounded-md h-full flex items-center justify-center">
                                {index + 1}
                            </div>
                            <div className="w-1/2 flex items-center">
                                <div className="ml-2 text-left items-center mb-auto">
                                    <p className="text-xs font-bold line-clamp-2 overflow-hidden">
                                        {episode.title}
                                    </p>
                                    <p className="text-xs">{formatDate(episode.aired)}</p>
                                </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-end">
                                <div className="mr-2 text-right items-center mt-auto">
                                    <p className="text-xs font-bold">Filler</p>
                                    <p className="text-xs">{episode.filler ? "Yes" : "No"}</p>
                                </div>
                                <div className="mr-2 text-right items-center mt-auto">
                                    <p className="text-xs font-bold">Recap</p>
                                    <p className="text-xs">{episode.recap ? "Yes" : "No"}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
export default Episodes;
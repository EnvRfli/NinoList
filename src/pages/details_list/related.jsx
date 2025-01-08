import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeRecomendation } from "../../service/jikan_api_fetch";

function Related() {
    const { id } = useParams();
    const [related, setRelated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnimeRecomendation(id).then((data) => {
            setRelated(data);

            const imagePromises = data.slice(0, 20).map((anime) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = anime.entry.images.jpg.large_image_url;
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );
            Promises = Promise.all(imagePromises).then(() => setLoading(false));
        });
    }, [id]);

    if (loading) {
        return <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {Array(6) // Tampilkan 6 placeholder anime
                    .fill(0)
                    .map((_, index) => (
                        <div
                            key={index}
                            className="w-full flex items-center bg-gray-200 p-2 rounded-md shadow-md animate-pulse"
                        >
                            <div className="w-16 h-24 bg-gray-300 border border-gray-300"></div>
                            <div className="ml-2 text-left items-center mb-auto w-full">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
            ;
    }

    return (
        <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {related.map((anime) => (
                    <a href={`/details/${anime.entry.mal_id}/overview`}>
                        <div className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300">
                            <img src={anime.entry.images.jpg.large_image_url} alt={anime.title} className="w-16 h-24 border border-gray-300" />
                            <div className="ml-2 text-left items-center mb-auto">
                                <p className="text-xs font-bold">{anime.entry.title}</p>
                                <p className="text-xs">{anime.votes} people Vote</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default Related;
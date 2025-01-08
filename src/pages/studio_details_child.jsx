import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThatProducerProduce } from "../service/jikan_api_fetch";

function StudioDetailsChild({ keyOrder }) {
    const { id } = useParams();
    const [productions, setProductions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const displayedYears = new Set();
    const groupedProductions = (productions || []).reduce((acc, production) => {
        acc[production.aired.prop.from.year] = acc[production.aired.prop.from.year] || [];
        acc[production.aired.prop.from.year].push(production);
        return acc;
    }, {});

    const sortedYears = Object.entries(groupedProductions)
        .sort(([yearA], [yearB]) => {
            if (yearA === "null") return -1;
            if (yearB === "null") return 1;

            return Number(yearB) - Number(yearA);
        });

    useEffect(() => {
        if (page > 1) {
            setLoading2(true);
        } else {
            setLoading(true);
        }

        getThatProducerProduce(id, keyOrder, page).then((data) => {

            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            if (page > 1) {
                setProductions((prev) => [...prev, ...data]);
                const imagePromises = data.map((production) =>
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = production.images.jpg.image_url;
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                );
                Promise.all(imagePromises).then(() => setLoading2(false));
            } else {
                setProductions(data);
                const imagePromises = data.map((production) =>
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = production.images.jpg.image_url;
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                );
                Promise.all(imagePromises).then(() => setLoading(false));
            }

        });
    }, [id, keyOrder, page]);

    if (loading) {
        return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
            {Array(10).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="relative bg-white shadow-md rounded-lg overflow-hidden"
                >
                    <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
                </div>
            ))}
        </div>
            ;
    }

    return (
        <div className="p-2 w-full h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
                {["start_date", "end_date"].includes(keyOrder) ? (

                    sortedYears.map(([year, items], index) => (
                        <div
                            key={index}
                            className="relative bg-white overflow-hidden md:text-left col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5"
                        >
                            <h1 className="text-2xl font-bold text-gray-500 p-2">{year === "null" ? "TBA" : year}</h1>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
                                {items.map((item, idx) => (
                                    <a
                                        href={`/details/${item.mal_id}/overview`}
                                        key={idx}
                                        className="w-full flex items-center bg-white rounded-md shadow-md"
                                    >
                                        <div
                                            key={item.mal_id}
                                            className="relative bg-white shadow-md rounded-lg overflow-hidden group"
                                        >
                                            <div className="relative card_img">
                                                <img
                                                    src={item.images.jpg.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer mt-auto py-6 px-3">
                                                    <div className="text-white text-2xs font-bold">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-white text-lg font-bold flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                                                        </svg>
                                                        {item.score === null ? "N/A" : item.score}
                                                    </div>
                                                    <div className="text-white text-sm mt-2">
                                                        {item.genres.map((genre) => genre.name).join(", ")}
                                                    </div>
                                                    <div className="text-white text-sm mt-2">
                                                        Status : {item.status}
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-white text-sm">
                                                    Rating : {item.score === null ? "N/A" : item.score}
                                                </div>
                                            </div>
                                        </div>
                                    </a>

                                ))}
                            </div>
                        </div>
                    ))


                ) : (
                    productions.map((production) => (
                        <a
                            href={`/details/${production.mal_id}/overview`}
                            key={production.mal_id}
                            className="w-full flex items-center bg-white rounded-md shadow-md"
                        >
                            <div
                                key={production.mal_id}
                                className="relative bg-white shadow-md rounded-lg overflow-hidden group"
                            >
                                <div className="relative card_img">
                                    <img
                                        src={production.images.jpg.image_url}
                                        alt={production.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer mt-auto py-6 px-3">
                                        <div className="text-white text-2xs font-bold">
                                            {production.title}
                                        </div>
                                        <div className="text-white text-lg font-bold flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                                            </svg>
                                            {production.score === null ? "N/A" : production.score}
                                        </div>
                                        <div className="text-white text-sm mt-2">
                                            {production.genres.map((genre) => genre.name).join(", ")}
                                        </div>
                                        <div className="text-white text-sm mt-2">
                                            Status : {production.status}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-white text-sm">
                                        Rating : {production.score === null ? "N/A" : production.score}
                                    </div>
                                </div>
                            </div>

                        </a>
                    ))
                )}
            </div>

            {loading2 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
                    {Array(10).fill(0).map((_, index) => (
                        <div
                            key={index}
                            className="relative bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center items-center">
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                    Load More
                </button>
            </div>
        </div>
    );
}

export default StudioDetailsChild;

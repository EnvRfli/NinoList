import React, { useEffect, useState, useRef } from "react";
import { useParams, } from "react-router-dom";
import { getAnimePictures } from "../../service/jikan_api_fetch";

function Pictures() {
    const { id } = useParams();
    const [pictures, setPictures] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data
        getAnimePictures(id).then((data) => {
            setPictures(data);

            const imagePromises = data.map((picture) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = picture.jpg.large_image_url;
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );

            Promise.all(imagePromises).then(() => setLoading(false));
        });
    }, [id]);

    if (loading) {
        return (
            <div className="p-2 w-full h-full">
                <h2 className="text-2xs font-bold border-b-2 border-gray-300">Pictures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
                    {Array(8)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="w-30 h-50 flex items-center bg-gray-200 p-2 rounded-md shadow-md animate-pulse flex-shrink-0" style={{ width: '10rem', height: '12.5rem' }}
                            >
                                <div className="w-30 h-50 bg-gray-300 rounded border border-gray-300"></div>
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Pictures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
                {pictures.map((picture) => (
                    <div key={picture.mal_id} className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300">
                        <img src={picture.jpg.large_image_url} alt={picture.title} className="w-30 h-50 border border-gray-300" />
                        <div className="ml-2 text-left items-center mb-auto">
                            <p className="text-xs font-bold">{picture.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pictures;
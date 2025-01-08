import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThatProducer } from "../service/jikan_api_fetch";
import ProductionsList from "./studio_details_child";

function StudioDetails() {
    const { id } = useParams();
    const [studio, setStudio] = useState(null);
    const [keyOrder, setKeyOrder] = useState("score");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getThatProducer(id)
            .then((data) => {
                setStudio(data);
                setLoading(false);
            });
    }, [id]);


    if (loading) {
        return <div>
            <div className="w-full align-middle mx-auto mb animate-pulse">
                <div className="h-36 bg-gray-300 flex items-center p-2"></div>
                <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4 -mt-32">
                    <div className="w-full justify-center">
                        <div className="w-40 h-60 bg-gray-300 shadow-2xl mx-auto md:mx-none rounded-lg"></div>
                        <div className="flex justify-center mt-2">
                            <div className="bg-gray-500 mt-1 rounded-lg text-white h-8 px-4 w-auto flex items-center justify-center">
                                <p className="ml-2 text-center">0</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:ml-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="bg-gray-300 h-4 w-full mt-4">
                                <div className="bg-gray-300 h-4 w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-2/3 pt-8 align-middle mx-auto">
                    <div className="h-6 w-1/3 bg-gray-300 rounded-md mb-4"></div>
                </div>
                <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="w-full h-full flex items-center bg-gray-200 p-2 rounded-md shadow-md">
                            <div className="w-full flex items-center">
                                <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 rounded-md"></div>
                                <div className="ml-2 flex-1">
                                    <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>;
    }

    return (
        <div className="w-full align-middle mx-auto bg-white">
            <div className="w-full mx-auto h-80 border-r-2 border-gray-400 overflow-hidden relative">
                <img
                    src={studio.images.jpg.image_url}
                    alt={studio.titles[0].title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            </div>
            <div className="p-2 text-center w-full bg-blue-400 items-center justify-center mx-auto left-0 right-0 sticky">
                <h1 className="text-2xl font-bold text-white">{studio.titles[0].title}</h1>
            </div>
            <div className="w-3/4 mx-auto flex">
                <div className="w-1/4 p-2 border-r-2 border-l-2 border-gray-400 h-auto shadow-r-2 flex-grow">
                    <img src={studio.images.jpg.image_url} alt={studio.titles[0].title} className="w-full mb-2" />
                    <div className="border-t-2 border-gray-400 p-2">
                        <h2 className="text-2xs font-bold">Alternate Name</h2>
                        <p className="text-xs">{studio.titles[1]?.title}</p>
                        <p className="text-xs">{studio.titles[2]?.title}</p>
                    </div>
                    <div className="border-t-2 border-gray-400 p-2">
                        <h2 className="text-2xs font-bold">Information</h2>
                        <p className="text-xs">
                            {studio.about ?
                                studio.about.split("\n").map((paragraph, index) => (
                                    <span key={index}>
                                        {paragraph}
                                        <br />
                                    </span>
                                ))
                                : "No information available"}
                        </p>
                    </div>
                </div>
                <div className="w-full">
                    <div className="w-full p-2 h-10 flex">
                        <div className="w-1/2 mx-auto flex justify-start items-center">
                            <h2 className="text-2xs font-bold">Productions</h2>
                        </div>
                        <div className="w-1/2 mx-auto flex justify-end items-center">
                            <p className="text-sm mr-1">
                                Sort By:
                            </p>
                            <select name="" id="" className="w-32 border-2 border-yellow-500 rounded right-0 bg-white text-sm justify-end focus:bg-gray-100"
                                onChange={(e) => setKeyOrder(e.target.value)} value={keyOrder}>
                                <option value="score">Score</option>
                                <option value="start_date">Start_Date</option>
                                <option value="end_date">End Date</option>
                                <option value="members">Members</option>
                                <option value="favorites">Favorites</option>
                                <option value="popularity">Popularity</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <ProductionsList keyOrder={keyOrder} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudioDetails;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThatStaff } from "../service/jikan_api_fetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function StaffDetails() {

    const { id } = useParams();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getThatStaff(id)
            .then((data) => {
                setStaff(data);

                const limitedData = data.anime.slice(0, 15);
                const imagePromises = limitedData.map((stf) =>
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = stf.anime.images.jpg.large_image_url;
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                );
                Promise.all(imagePromises).then(() => setLoading(false));
            });
    }, [id]);

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    if (loading) {
        return (
            <div className="w-full align-middle mx-auto mb animate-pulse">
                {/* Header Skeleton */}
                <div className="h-36 bg-blue-200 rounded-md"></div>

                {/* Main Content Skeleton */}
                <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4 -mt-32">
                    <div className="w-full flex justify-center">
                        {/* Image Skeleton */}
                        <div className="w-40 h-60 bg-blue-200 shadow-2xl rounded-lg"></div>
                        {/* Heart Icon Skeleton */}
                        <div className="mt-2 w-16 h-8 bg-red-300 rounded-lg"></div>
                    </div>
                    <div>
                        {/* Text Skeleton */}
                        <div className="w-full">
                            <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded-md mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded-md mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>

                {/* Staff Works Header Skeleton */}
                <div className="w-2/3 pt-8 align-middle mx-auto">
                    <div className="h-6 w-1/3 bg-gray-300 rounded-md mb-4"></div>
                </div>

                {/* Staff Works List Skeleton */}
                <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="w-full h-full flex items-center bg-gray-200 p-2 rounded-md shadow-md">
                            <div className="w-full flex items-center">
                                {/* Image Skeleton */}
                                <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 rounded-md"></div>
                                {/* Text Skeleton */}
                                <div className="ml-2 flex-1">
                                    <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="w-full align-middle mx-auto mb">
            <div className="h-36 bg-blue-200 flex items-center p-2"></div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4 -mt-32">
                <div className="w-full justify-center">
                    <div className="w-40 h-60 bg-blue-200 shadow-2xl mx-auto md:mx-none rounded-lg">
                        <img
                            src={staff.images.jpg.image_url}
                            alt={staff.name}
                            className="w-full h-full rounded-lg"
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="bg-red-500 mt-1 rounded-lg text-white h-8 px-4 w-auto flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} />
                            <p className="ml-2">{staff.favorites}</p>

                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="w-full p-2">
                        <h1 className="text-2xl font-bold text-gray-500 text-center md:text-left">{staff.name}</h1>
                        <p className="text-sm text-gray-600 text-center md:text-left">{staff.given_name}</p>

                        <p className="text-xs mt-14 text-center md:text-left">
                            Birthday : {formatDate(staff.birthday)}
                        </p>
                        <p className="text-xs text-center md:text-left">
                            {staff.about ?
                                staff.about.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))
                                : "No information available"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-2/3 pt-8 align-middle mx-auto">
                <h2 className="text-2xs font-bold border-b-2 border-gray-300">Staf Works</h2>
            </div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {staff.anime.map((stf) => (
                    <div className="w-full h-full flex items-center bg-white p-2 rounded-md shadow-md">
                        <div className="w-full flex items-center">
                            <img src={stf.anime.images.jpg.large_image_url} alt={stf.anime.title} className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300" />
                            <div className="ml-2 text-left items-center mb-auto">
                                <a
                                    key={stf.anime.mal_id}
                                    href={`/details/${stf.anime.mal_id}/overview`}>
                                    <p className="text-xs text-blue-500 hover:underline">{stf.anime.title}</p>
                                </a>
                                <p className="text-xs mt-2">{stf.position}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default StaffDetails;
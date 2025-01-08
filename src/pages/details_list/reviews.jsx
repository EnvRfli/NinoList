import React, { useEffect, useState, useRef } from "react";
import { useParams, } from "react-router-dom";
import { getAnimeReviews } from "../../service/jikan_api_fetch";

function Reviews() {
    const { id } = useParams();
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedReview, setExpandedReview] = useState(null);
    const reviewRefs = useRef({});

    useEffect(() => {
        getAnimeReviews(id).then((data) => {
            setReviews(data);

            const imagePromises = data.map((review) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = review.user.images.jpg.image_url;
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );
            Promise.all(imagePromises).then(() => setLoading(false));
        });
    }, [id]);

    if (loading) {
        return (
            <>
                {Array(5).fill(0).map((_, idx) => (
                    <div
                        key={idx} // Tambahkan properti `key` yang unik
                        className="w-full flex bg-gray-200 p-2 rounded-md shadow-md animate-pulse"
                    >
                        <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 rounded border border-gray-300 mb-2"></div>
                        <div className="ml-2 flex-1">
                            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
                            <div className="h-2 bg-gray-300 rounded w-full mb-1"></div>
                            <div className="h-2 bg-gray-300 rounded w-5/6 mb-1"></div>
                            <div className="h-2 bg-gray-300 rounded w-4/5 mb-1"></div>
                            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </>
        );

    }

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    const toggleReview = (id) => {
        setExpandedReview(expandedReview === id ? null : id);
    };

    return (
        <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Reviews</h2>
            <div className="p-2">
                {reviews.map((review) => (
                    <div
                        key={review.mal_id}
                        className="w-full flex bg-white p-2 rounded-md shadow-md"
                    >
                        <img
                            src={review.user.images.jpg.image_url}
                            alt={review.user.username}
                            className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300"
                        />
                        <div className="ml-2 text-left items-center mb-auto">
                            <div className="flex items-center">
                                <p className="text-2xs font-bold justify-start">
                                    {review.user.username}
                                </p>
                                <p className="text-xs justify-end ml-auto">
                                    {formatDate(review.date)}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div
                                    className={
                                        review.tags == "Recommended"
                                            ? "bg-blue-400 text-white text-center px-2 h-full flex items-center justify-center text-xs"
                                            : review.tags == "Mixed Feelings" ? "bg-gray-400 px-2 text-white text-center h-full flex items-center justify-center text-xs"
                                                : "bg-red-400 px-2 text-white text-center h-full flex items-center justify-center text-xs"
                                    }
                                >
                                    {review.tags}
                                </div>
                            </div>
                            <div
                                ref={(el) => (reviewRefs.current[review.mal_id] = el)}
                                className={`overflow-hidden transition-max-height duration-500 ${expandedReview === review.mal_id ? "max-h-[1000px]" : "max-h-[115px]"
                                    }`}
                            >
                                <p className="text-xs mt-1">
                                    {review.review.split("\n").map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                            {/* Tentukan batas panjang teks, misalnya 300 karakter */}
                            {expandedReview !== review.mal_id && review.review.length > 750 && (
                                <button
                                    onClick={() => toggleReview(review.mal_id)}
                                    className="text-blue-500 underline text-xs mt-1"
                                >
                                    Continue reading
                                </button>
                            )}
                            {expandedReview === review.mal_id && (
                                <button
                                    onClick={() => toggleReview(review.mal_id)}
                                    className="text-blue-500 underline text-xs mt-1"
                                >
                                    Show less
                                </button>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Reviews;
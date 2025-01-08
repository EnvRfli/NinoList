import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVoiceActor } from "../service/jikan_api_fetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function VoiceActorsDetails() {

    const { id } = useParams();
    const [va, setVa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedAbout, setExpandedAbout] = useState(null);

    useEffect(() => {
        getVoiceActor(id)
            .then((data) => {
                if (!data) {
                    throw new Error("Voice Actor not found");
                }

                setVa(data);

                const dataSlice = data.voices.slice(0, 10);

                const imagePromises = dataSlice.map((va) =>
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = va.anime.images.jpg.large_image_url;
                        img.src = va.character.images.jpg.image_url;
                        img.onload = resolve;
                        img.onerror = resolve;
                    })
                );

                Promise.all(imagePromises).then(() => setLoading(false));
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>
    }

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    return (
        <div className="w-full align-middle mx-auto mb">
            <div className="h-36 bg-blue-200 flex items-center p-2"></div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4 -mt-32">
                <div className="w-full justify-center">
                    <div className="w-40 h-60 bg-blue-200 shadow-2xl mx-auto md:mx-none rounded-lg">
                        <img
                            src={va.images?.jpg?.image_url}
                            alt={va.name}
                            className="w-full h-full rounded-lg"
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="bg-red-500 mt-1 rounded-lg text-white h-8 px-4 w-auto flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} />
                            <p className="ml-2">{va.favorites}</p>
                        </div>
                    </div>
                </div>
                <div className="md:ml-4">
                    <h1 className="text-2xl font-bold text-gray-500 text-center md:text-left">{va.name}</h1>
                    <p className="text-sm text-gray-600 text-center md:text-left">{va.given_name}</p>

                    <div
                        className={`overflow-hidden transition-max-height duration-500 ${expandedAbout ? "max-h-[1000px]" : "max-h-[210px]"
                            }`}
                    >
                        <p className="text-xs mt-12 text-center md:text-left">
                            Birthday : {formatDate(va.birthday)}
                        </p>
                        <p className="text-xs text-center md:text-left">
                            {va.about.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                    {va.about.length > 750 && (
                        <button
                            onClick={() => setExpandedAbout((prev) => !prev)}
                            className="text-blue-500 underline text-xs mt-1"
                        >
                            {expandedAbout ? "Read Less" : "Read More"}
                        </button>
                    )}
                </div>
            </div>
            <div className="w-2/3 pt-8 align-middle mx-auto">
                <h2 className="text-2xs font-bold border-b-2 border-gray-300">Anime & Characters</h2>
            </div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {va.voices.map((va_anime) => (
                    <div className="w-full h-full flex items-center bg-white p-2 rounded-md shadow-md">
                        <div className="w-1/2 flex items-center">
                            <img src={va_anime.character.images.jpg.image_url} alt={va_anime.character.images.jpg.large_image_url} className="w-10 h-14 md:w-12 md:h-16 lg:w-14 lg:h-18 xl:w-16 xl:h-20 border border-gray-300" />
                            <div className="ml-2 text-left items-center mb-auto">
                                <a
                                    key={va_anime.character.mal_id}
                                    href={`/details/character/${va_anime.character.mal_id}/${va_anime.character.name.replace(/ /g, "_").replace(/,/g, "")}`}>
                                    <p className="text-xs text-blue-500 hover:underline">{va_anime.character.name}</p>
                                </a>
                                <p className="text-xs">{va_anime.role}</p>
                            </div>
                        </div>
                        <div className="w-1/2 flex items-center justify-end">
                            <div className="mr-2 text-right items-center mt-auto">
                                <a
                                    key={va_anime.anime.mal_id}
                                    href={`/details/${va_anime.anime.mal_id}/overview`}>
                                    <p className="text-xs text-blue-500 hover:underline cursor-pointer overflow-hidden line-clamp-2">
                                        {va_anime.anime.title}</p>
                                </a>
                                <p className="text-xs">{va_anime.anime.type}</p>
                            </div>
                            <img src={va_anime.anime.images.jpg.large_image_url} alt={va_anime.anime.title} className="w-10 h-14 md:w-12 md:h-16 lg:w-14 lg:h-18 xl:w-16 xl:h-20 border border-gray-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default VoiceActorsDetails; 
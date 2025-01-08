import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThatAnimeCharacter } from "../service/jikan_api_fetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
function CharacterDetails() {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedAbout, setExpandedAbout] = useState(null);

    useEffect(() => {
        getThatAnimeCharacter(id)
            .then((data) => {
                if (!data) {
                    throw new Error("Character not found");
                }

                setCharacter(data);

                // Preload image
                const imagePromises = [
                    new Promise((resolve) => {
                        const img = new Image();
                        if (data.images?.jpg?.image_url) {
                            img.src = data.images.jpg.image_url;
                        }
                        img.onload = resolve;
                        img.onerror = resolve;
                    }),
                ];

                return Promise.all(imagePromises);
            })
            .then(() => setLoading(false))
            .catch((error) => {
                console.error("Error fetching character details:", error.message);
                setLoading(false); // Hentikan loading meskipun ada error
            });
    }, [id]);

    if (loading) {
        return <div className="w-full align-middle mx-auto mb animate-pulse">
            <div className="h-36 bg-gray-300 flex items-center p-2"></div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4 -mt-32">
                <div className="w-full justify-center">
                    <div className="w-40 h-60 bg-gray-300 shadow-2xl mx-auto md:mx-none rounded-lg"></div>
                    <div className="flex justify-center mt-2">
                        <div className="bg-gray-500 mt-1 rounded-lg text-white h-8 px-4 w-auto flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} />
                            <p className="ml-2 text-center">0</p>
                        </div>
                    </div>
                </div>
                <div className="md:ml-4">
                    {
                        [...Array(5)].map((_, index) => (
                            <div key={index} className="bg-gray-300 h-4 w-full mt-4">
                                <div className="bg-gray-300 h-4 w-3/4"></div>
                            </div>

                        ))
                    }
                </div>
            </div>
            <div className="w-2/3 pt-8 align-middle mx-auto">
                <div className="bg-gray-300 h-4 w-1/2 mt-4"></div>
                {
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="bg-gray-300 h-4 w-full mt-4">
                            <div className="bg-gray-300 h-4 w-3/4"></div>
                        </div>

                    ))
                }
            </div>


        </div>;
    }

    return (
        <div className="w-full align-middle mx-auto mb">
            <div className="h-36 bg-blue-200 flex items-center p-2"></div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-4 -mt-32">
                <div className="w-full justify-center">
                    <div className="w-40 h-60 bg-blue-200 shadow-2xl mx-auto md:mx-none rounded-lg">
                        <img
                            src={character.images?.jpg?.image_url}
                            alt={character.name}
                            className="w-full h-full rounded-lg"
                        />
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="bg-red-500 mt-1 rounded-lg text-white h-8 px-4 w-auto flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} />
                            <p className="ml-2 text-center">{character.favorites}</p>
                        </div>
                    </div>
                </div>
                <div className="md:ml-4">
                    <h1 className="text-2xl font-bold text-gray-500 text-center md:text-left">
                        {character.name}</h1>
                    <p className="text-sm text-gray-600 text-center md:text-left">{character.name_kanji}</p>
                    <div
                        className={`overflow-hidden transition-max-height duration-500 ${expandedAbout ? "max-h-[1000px]" : "max-h-[210px]"
                            }`}
                    >
                        <p className="text-xs mt-12 text-center md:text-left">
                            {character.about
                                ? character.about.split("\n").map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))
                                : "No information available."}
                        </p>

                    </div>
                    {character.about
                        ? character.about.length > 750 && (
                            <button
                                onClick={() => setExpandedAbout((prev) => !prev)}
                                className="text-blue-500 underline text-xs mt-1"
                            >
                                {expandedAbout ? "Read Less" : "Read More"}
                            </button>
                        )
                        : null
                    }
                </div>
            </div>
            <div className="w-2/3 pt-8 align-middle mx-auto">
                <h2 className="text-2xs font-bold border-b-2 border-gray-300">Anime Appearances</h2>
            </div>
            <div className="w-2/3 pt-8 align-middle mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {character.anime.map((anime) => (
                    <a
                        key={anime.anime.mal_id}
                        href={`/details/${anime.anime.mal_id}/overview`}
                        className="flex flex-col items-center rounded-md"
                    >
                        <div className="relative w-full h-50 border border-gray-300 rounded-md cursor-pointer transition duration-300">
                            {/* Gambar */}
                            <img
                                src={anime.anime.images.jpg.large_image_url}
                                alt={anime.anime.title}
                                className="w-full h-full object-cover rounded-md"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md opacity-0 hover:opacity-100 transition duration-300"></div>
                        </div>
                        <p className="text-xs text-center">{anime.anime.title}</p>
                    </a>
                ))}

            </div>
        </div >
    );
}


export default CharacterDetails; 
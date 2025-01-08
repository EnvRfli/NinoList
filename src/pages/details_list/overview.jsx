import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAnimeCharacters, getAnimeStaff, getAnimeRelation } from "../../service/jikan_api_fetch";

function Overview() {
    const id = useParams().id;
    const [characters, setCharacters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState(null);
    const [relation, setRelation] = useState([]);
    const [relatedImages, setRelatedImages] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [charData, staffData, relationData] = await Promise.all([
                    getAnimeCharacters(id),
                    getAnimeStaff(id),
                    getAnimeRelation(id),
                ]);
                setCharacters(charData);
                setStaff(staffData);
                setRelation(relationData);

                // Function to fetch related images
                const fetchInBatches = async (relations, batchSize = 5, delay = 500) => {
                    const fetchedImages = {};
                    for (let i = 0; i < relations.length; i += batchSize) {
                        const batch = relations.slice(i, i + batchSize);
                        await Promise.all(
                            batch.map(async (related) => {
                                if (Array.isArray(related.entry)) {
                                    for (const entry of related.entry) {
                                        try {
                                            let response;
                                            if (["Sequel", "Prequel", "Parent Story", "Side Story", "Alternative Version", "Summary", "Other"].includes(related.relation)) {
                                                response = await axios.get(`https://api.jikan.moe/v4/anime/${entry.mal_id}`);
                                            } else if (related.relation === "Adaptation") {
                                                response = await axios.get(`https://api.jikan.moe/v4/manga/${entry.mal_id}`);
                                            } else {
                                                console.warn("Skipping unsupported related entry:", entry);
                                                continue;
                                            }
                                            fetchedImages[entry.mal_id] = response.data.data.images.jpg.large_image_url;
                                        } catch (error) {
                                            console.error(`Failed to fetch image for ID: ${entry.mal_id}`, error);
                                        }
                                    }
                                }
                            })
                        );
                        // Add delay between batches
                        await new Promise((resolve) => setTimeout(resolve, delay));
                    }
                    return fetchedImages;
                };

                // Fetch images and wait for all images to be loaded
                const images = await fetchInBatches(relationData, 5, 500); // Adjust delay as needed
                setRelatedImages(images);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    if (loading) {
        return <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Characters and Voice Actors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {loading
                    ? Array(8)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="w-full flex items-center bg-gray-200 p-2 rounded-md shadow-md"
                            >
                                <div className="w-1/2 flex items-center">
                                    <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 animate-pulse"></div>
                                    <div className="ml-2">
                                        <div className="w-24 h-4 bg-gray-300 animate-pulse mb-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-end">
                                    <div className="mr-2">
                                        <div className="w-24 h-4 bg-gray-300 animate-pulse mb-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                                    </div>
                                    <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 animate-pulse"></div>
                                </div>
                            </div>
                        ))
                    : characters.slice(0, 8).map((character) => (
                        <div
                            key={character.mal_id}
                            className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300"
                        >
                            <div className="w-1/2 flex items-center">
                                <img
                                    src={character.character.images.jpg.image_url}
                                    alt={character.name}
                                    className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300"
                                />
                                <div className="ml-2 text-left items-center mb-auto">
                                    <p className="text-xs font-bold">
                                        {character.character.name}
                                    </p>
                                    <p className="text-xs">{character.role}</p>
                                </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-end">
                                <div className="mr-2 text-right items-center mt-auto">
                                    <p className="text-xs font-bold">
                                        {character.voice_actors[0]?.person.name}
                                    </p>
                                    <p className="text-xs">
                                        {character.voice_actors[0]?.language}
                                    </p>
                                </div>
                                <img
                                    src={
                                        character.voice_actors[0]?.person.images.jpg
                                            .image_url
                                    }
                                    alt={
                                        character.voice_actors[0]?.person.name
                                    }
                                    className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300"
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>;
        ;
    }

    return (
        <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Characters and Voice Actors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {characters.slice(0, 8).map((character) => (
                    <div
                        key={character.mal_id}
                        className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300"
                    >
                        <div className="w-1/2 flex items-center">
                            <img src={character.character.images.jpg.image_url} alt={character.name} className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300" />
                            <div className="ml-2 text-left items-center mb-auto">
                                <a
                                    key={character.character.mal_id}
                                    href={`/details/character/${character.character.mal_id}/${character.character.name.replace(/ /g, "_").replace(/,/g, "")}`}
                                    className="text-xs text-blue-500 hover:underline">
                                    {character.character.name}
                                </a>
                                <p className="text-xs">{character.role}</p>
                            </div>
                        </div>
                        <div className="w-1/2 flex items-center justify-end">
                            <div className="mr-2 text-right items-center mt-auto">
                                <a
                                    key={character.voice_actors[0]?.person.mal_id}
                                    href={`/details/va/${character.voice_actors[0]?.person.mal_id}/${character.voice_actors[0]?.person.name.replace(/ /g, "_").replace(/,/g, "")}`}
                                    className="text-xs text-blue-500 hover:underline">{character.voice_actors[0]?.person.name}</a>


                                <p className="text-xs">{character.voice_actors[0]?.language}</p>
                            </div>
                            <img src={character.voice_actors[0]?.person.images.jpg.image_url} alt={character.voice_actors[0]?.person.name} className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300" />
                        </div>
                    </div>
                ))}
            </div>
            <a href={`/details/${id}/characters`}>
                <div className="justify-end text-right text-blue-400 text-sm mt-2 pr-2">
                    See All Characters...
                </div>
            </a>
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {staff.slice(0, 4).map((staff) => (
                    <div
                        key={staff.person.mal_id}
                        className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300"
                    >
                        <img src={staff.person.images.jpg.image_url} alt={staff.person.name} className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300" />
                        <div className="ml-2 text-left items-center mb-auto">
                            <a
                                href={`/details/staff/${staff.person.mal_id}/${staff.person.name.replace(/ /g, "_").replace(/,/g, "")}`}
                                key={staff.person.mal_id}
                                className="text-xs text-blue-500 hover:underline">{staff.person.name}</a>
                            <p className="text-xs">{staff.positions}</p>
                        </div>
                    </div>
                ))}
            </div>
            <a href={`/details/${id}/characters/#staff`}>
                <div className="justify-end text-right text-blue-400 text-sm mt-2 pr-2">
                    See All Staff...
                </div>
            </a>
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Related</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {relation
                    .filter((related) => related.relation !== "Character")
                    .map((related) => (
                        <div key={related.relation} className="w-full">
                            <p className="font-bold mb-2">{related.relation}</p>
                            {related.entry.slice(0, 2).map((entry) => (
                                <div
                                    key={entry.mal_id}
                                    className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300"
                                >
                                    {!relatedImages[entry.mal_id] ? (
                                        <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582a2.5 2.5 0 014.576 0H12a2 2 0 100 4h3.5a2.5 2.5 0 014.5 0H20v5h-3v1a2 2 0 11-4 0v-1h-6v1a2 2 0 11-4 0v-1H4v-5h.5a2.5 2.5 0 014.5 0H12a2 2 0 100-4H9a2.5 2.5 0 01-4.5 0H4V4z"
                                                />
                                            </svg>
                                        </div>
                                    ) : (
                                        <img
                                            src={relatedImages[entry.mal_id]}
                                            alt={entry.name}
                                            className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300"
                                        />
                                    )}
                                    <div className="ml-2 text-left items-center mb-auto">
                                        <p className="text-xs font-bold">{entry.name}</p>
                                        <p className="text-xs">{related.relation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </div >
    );
}

export default Overview;
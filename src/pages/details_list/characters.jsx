import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeCharacters, getAnimeStaff } from "../../service/jikan_api_fetch";

function Characters() {
    const { id } = useParams();
    const [chara, setChara] = useState(null);
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vaLanguage, setVaLanguage] = useState("Japanese");

    useEffect(() => {
        getAnimeCharacters(id).then((data) => {
            setChara(data);

            // Ambil hanya 20 karakter pertama
            const limitedData = data.slice(0, 20);

            const imagePromises = limitedData.map((char) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = char.character.images.jpg.image_url;
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );

            Promise.all(imagePromises).then(() => setLoading(false));
        });
    }, [id]);

    useEffect(() => {
        getAnimeStaff(id).then((data) => {
            setStaff(data);

            // Ambil hanya 20 staf pertama
            const limitedData = data.slice(0, 20);

            const imagePromises = limitedData.map((stf) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = stf.person.images.jpg.image_url;
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );

            Promise.all(imagePromises).then(() => setLoading(false));
        });
    }, [id]);


    if (loading) {
        return <div className="p-2 w-full h-full">
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Characters</h2>
            <div className="flex justify-end text-center items-center">
                <p className="text-sm mt-1 mr-1">Select VA Language :</p>
                <select className="w-32 border-2 border-gray-300 rounded mt-2 right-0 bg-gray-100 text-sm" disabled>
                    <option value="Japanese">Japanese</option>
                    <option value="English">English</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                        <div
                            key={idx}
                            className="w-full flex items-center bg-gray-200 p-2 rounded-md shadow-md animate-pulse"
                        >
                            <div className="w-1/2 flex items-center">
                                <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 rounded border border-gray-300"></div>
                                <div className="ml-2 text-left items-center mb-auto w-full">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-end">
                                <div className="mr-2 text-right items-center mt-auto w-full">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                                <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 rounded border border-gray-300"></div>
                            </div>
                        </div>
                    ))}
            </div>
            <h2 className="text-2xs font-bold border-t-2 border-gray-300">Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                        <div
                            key={idx}
                            className="w-full flex items-center bg-gray-200 p-2 rounded-md shadow-md animate-pulse"
                        >
                            <div className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 bg-gray-300 rounded border border-gray-300"></div>
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
            <h2 className="text-2xs font-bold border-b-2 border-gray-300">Characters</h2>
            <div className="flex justify-end text-center items-center">
                <p className="text-sm mt-1 mr-1">Select VA Language : </p>
                <select className="w-32 border-2 border-gray-300 rounded mt-2 right-0 bg-gray-100 text-sm"
                    onChange={(e) => setVaLanguage(e.target.value)}
                >
                    <option value="Japanese" defaultValue={true}>Japanese</option>
                    <option value="English">English</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {chara.map((char) => {
                    const firstVA = char.voice_actors.find((va) => va.language === vaLanguage);

                    return (
                        <div
                            key={char.character.mal_id}
                            className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300"
                        >
                            <div className="w-1/2 flex items-center">
                                <img
                                    src={char.character.images.jpg.image_url}
                                    alt={char.name}
                                    className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300"
                                />
                                <div className="ml-2 text-left items-center mb-auto">
                                    <a
                                        key={char.character.mal_id}
                                        href={`/details/character/${char.character.mal_id}/${char.character.name
                                            .replace(/ /g, "_")
                                            .replace(/,/g, "")}`}
                                    >
                                        <p className="text-xs text-blue-500 hover:underline">
                                            {char.character.name}
                                        </p>
                                    </a>
                                    <p className="text-xs">{char.role}</p>
                                </div>
                            </div>
                            {firstVA && (
                                <div
                                    className="w-1/2 flex items-center justify-end"
                                    key={firstVA.person.mal_id}
                                >
                                    <div className="mr-2 text-right items-center mt-auto">
                                        <a
                                            href={`/details/va/${firstVA.person.mal_id}/${firstVA.person.name
                                                .replace(/ /g, "_")
                                                .replace(/,/g, "")}`}
                                        >
                                            <p className="text-xs text-blue-500 hover:underline">
                                                {firstVA.person.name}
                                            </p>
                                        </a>
                                        <p className="text-xs">{firstVA.language}</p>
                                    </div>
                                    <img
                                        src={firstVA.person.images.jpg.image_url}
                                        alt={firstVA.person.name}
                                        className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <a href="#staff">
                <h2 className="text-2xs font-bold border-t-2 border-gray-300">Staff</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                    {staff.map((stf) => (
                        <div key={stf.person.mal_id} className="w-full flex items-center bg-white p-2 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-gray-300">
                            <div className="w-full flex items-center">
                                <img src={stf.person.images.jpg.image_url} alt={stf.person.name} className="w-10 h-16 md:w-16 md:h-24 lg:w-20 lg:h-32 xl:w-16 xl:h-20 border border-gray-300" />
                                <div className="ml-2 text-left items-center mb-auto">
                                    <p className="text-xs font-bold">{stf.person.name}</p>
                                    <p className="text-xs">{stf.positions}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </a>
        </div>
    );
}

export default Characters;

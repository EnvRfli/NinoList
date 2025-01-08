function About() {
    return (
        <div className="container mx-auto">
            <div className="w-3/4 mx-auto gap-4">
                <div className="p-4 w-3/4 mx-auto">

                    <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4"
                        id="about">About</h1>

                    <p className="text-gray-800">
                        NinoList is a simple web application that displays information about anime, manga, characters, and staff. The data is fetched from the Jikan API, which is an unofficial MyAnimeList API. The application is built using React and Tailwind CSS.
                    </p>

                    <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4"
                        id="why">Why Author Chose This Project</h1>

                    <p className="text-gray-800">
                        The author chose this project to learn more about React and Tailwind CSS. The author also wanted to practice fetching data from an API and displaying it on a webpage. The author is a fan of anime and manga, so building an application related to anime and manga seemed like a fun project to work on.
                    </p>

                    <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4"
                        id="features">Features</h1>

                    <ul className="list-disc list-inside text-gray-800">
                        <li>View top anime list</li>
                        <li>Search for anime based on title, genre, type, query, and score</li>
                        <li>View details of anime, manga, characters, and staff</li>
                        <li>View anime recommendations</li>
                        <li>View anime reviews</li>
                        <li>View anime characters</li>
                        <li>View staff works</li>
                        <li>View studio works</li>
                        <li>View anime episodes</li>
                    </ul>

                    <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4"
                        id="technologies">Technologies</h1>

                    <ul className="list-disc list-inside text-gray-800">
                        <li>React</li>
                        <li>Tailwind CSS</li>
                        <li>Jikan API</li>
                    </ul>

                    <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4"
                        id="author">Author</h1>

                    <p className="text-gray-800">
                        This project was created by <a href="https://www.linkedin.com/in/rafli-rizalfa" target="_blank" rel="noreferrer"
                            className="text-blue-500 hover:underline">Nino</a>.
                    </p>

                    <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4"
                        id="source">Source Code</h1>

                    <p className="text-gray-800">
                        The source code for this project is available on <a href="https://www.github.com/EnvRfli/ninolist" target="_blank" rel="noreferrer"
                            className="text-blue-500 hover:underline">GitHub</a>.
                    </p>
                </div>
            </div>
        </div >
    );
}

export default About;
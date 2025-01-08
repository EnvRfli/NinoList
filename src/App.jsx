import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/home";
import Footer from "./components/footer";
import AnimeDetails from "./pages/anime_details";
import Overview from "./pages/details_list/overview";
import Characters from "./pages/details_list/Characters";
import Episodes from "./pages/details_list/episodes";
import Related from "./pages/details_list/related";
import Reviews from "./pages/details_list/reviews";
import Pictures from "./pages/details_list/pictures";
import CharacterDetails from "./pages/character_details";
import VoiceActorsDetails from "./pages/va_details";
import StudioDetails from "./pages/studio_details";
import StaffDetails from "./pages/staff_details";
import AdvanceSearch from "./pages/advance_search";
import TopAnimeList from "./pages/top_animelist";
import About from "./pages/about";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebook, faGithub, faInstagram, faLinkedin, faWhatsapp, faMailchimp } from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

library.add(faFacebook, faGithub, faInstagram, faLinkedin, faWhatsapp, faMailchimp, faHeart);

function App() {
  return (
    <Router>
      <Header />
      <div className="h-16"></div>
      <div className="bg-gray-200 min-h-screen w-full pb-8">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/details/:id" element={<AnimeDetails />}>
            <Route index path="overview" element={<Overview />} />
            <Route path="characters" element={<Characters />} />
            <Route path="episodes" element={<Episodes />} />
            <Route path="related" element={<Related />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="pictures" element={<Pictures />} />
          </Route>

          <Route path="/details/character/:id/:charName" element={<CharacterDetails />} />
          <Route path="/details/va/:id/:VaName" element={<VoiceActorsDetails />} />
          <Route path="/details/producer/:id/:studioName" element={<StudioDetails />} />
          <Route path="/details/staff/:id/:staffName" element={<StaffDetails />} />
          <Route path="/advance-search" element={<AdvanceSearch />} />
          <Route path="/top-anime-list" element={<TopAnimeList />} />
          <Route path="/about" element={<About />} />

        </Routes>
      </div>
      <Footer />
    </Router >
  );
}

export default App;

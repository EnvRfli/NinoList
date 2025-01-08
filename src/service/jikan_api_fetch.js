const cache = new Map();

const fetchWithCacheAndRetry = async (url, retries = 3, delay = 5000) => {
  // Check if data is in the cache
  if (cache.has(url)) {
    console.log("Serving from cache:", url);
    return cache.get(url);
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      // Save response to cache
      cache.set(url, data.data);
      return data.data;
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Retrying... (${i + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Max retries reached for:", url);
        throw error;
      }
    }
  }
};

// Fetch top anime list with caching and retry
const fetchTopAnimeList = async (page) => {
  try {
    return await fetchWithCacheAndRetry(`https://api.jikan.moe/v4/top/anime?page=${page}`);
  } catch (error) {
    console.error("Error fetching top anime list:", error);
    return [];
  }
};

// Fetch anime categories with caching and retry
const fetchAnimeCategory = async () => {
  try {
    return await fetchWithCacheAndRetry("https://api.jikan.moe/v4/genres/anime");
  } catch (error) {
    console.error("Error fetching anime categories:", error);
    return [];
  }
};

const fetchThisSeason = async () => {
  try {
    return await fetchWithCacheAndRetry("https://api.jikan.moe/v4/seasons/now");
  } catch (error) {
    console.error("Error fetching anime categories:", error);
    return [];
  }
};

const getAnimeDetails = async (id) => { // Terima parameter id
  const url = `https://api.jikan.moe/v4/anime/${id}/full`; // Masukkan id ke dalam URL
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null; // Kembalikan null jika terjadi kesalahan
  }
};

const getAnimeCharacters = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/characters`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime characters:", error);
    return null;
  }
};

const getAnimeStaff = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/staff`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime staff:", error);
    return null;
  }
}

const getAnimeRelation = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/relations`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime relations:", error);
    return null;
  }
}

const getAnimeRecomendation = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/recommendations`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime recomendations:", error);
    return null;
  }
}

const getAnimeEpisodes = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/episodes`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime episodes:", error);
    return null;
  }
}

const getAnimeReviews = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/reviews`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime reviews:", error);
    return null;
  }
}

const getAnimePictures = async (id) => {
  const url = `https://api.jikan.moe/v4/anime/${id}/pictures`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime pictures:", error);
    return null;
  }
}

const getThatAnimeCharacter = async (id) => {
  const url = `https://api.jikan.moe/v4/characters/${id}/full`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching character details:", error);
    return null;
  }
}

const getVoiceActor = async (id) => {
  const url = `https://api.jikan.moe/v4/people/${id}/full`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching voice actor:", error);
    return null;
  }
}

const getThatProducer = async (id) => {
  const url = `https://api.jikan.moe/v4/producers/${id}/full`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime studio:", error);
    return null;
  }
}

const getThatProducerProduce = async (id, keyOrder, page) => {
  const url = `https://api.jikan.moe/v4/anime?producers=${id}&order_by=${keyOrder}&sort=desc&page=${page}`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime studio:", error);
    return null;
  }
}

const getThatStaff = async (id) => {
  const url = `https://api.jikan.moe/v4/people/${id}/full`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching staff details:", error);
    return null;
  }
}

const getAnimeFilter = async (genres, minScore, maxScore, type, query, page) => {
  const url = `https://api.jikan.moe/v4/anime?q=${query}&genres=${genres}&min_score=${minScore}&max_score=${maxScore}&type=${type}&sort=desc&page=${page}`;
  try {
    return await fetchWithCacheAndRetry(url);
  } catch (error) {
    console.error("Error fetching anime filter:", error);
    return null;
  }
}

const getAnimeSearch = async (query, controller) => {
  const url = `https://api.jikan.moe/v4/anime?q=${query}`;
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was aborted");
    } else {
      console.error("Error fetching anime search:", error);
    }
    return null;
  }
};

export { fetchTopAnimeList, fetchAnimeCategory, fetchThisSeason, getAnimeDetails, getAnimeCharacters, getAnimeStaff, getAnimeRelation, getAnimeRecomendation, getAnimeEpisodes, getAnimeReviews, getAnimePictures, getThatAnimeCharacter, getVoiceActor, getThatProducer, getThatProducerProduce, getThatStaff, getAnimeFilter, getAnimeSearch };


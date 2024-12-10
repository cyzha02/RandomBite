import axios from 'axios';

const GOOGLE_PLACES_API_KEY = "AIzaSyAQPS9PZlHMf8L9iZrvw9DTMZZ9T02o8jM";
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

export async function getRestaurantsNearby(location, filters) {
    const params = {
        key: GOOGLE_PLACES_API_KEY,
        location: `${location.lat},${location.lng}`,
        radius: filters.radius || 1500,
        type: 'restaurant',
        opennow: filters.openNow || false,
        minprice: filters.minprice !== undefined ? filters.minprice : 0,
        maxprice: filters.maxprice !== undefined ? filters.maxprice : 4
    };

    if (filters.cuisine && filters.cuisine.trim() !== '') {
        // Use 'keyword' param for cuisine
        params.keyword = filters.cuisine.trim();
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data.results || [];
}



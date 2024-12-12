import axios from 'axios';

const GOOGLE_PLACES_API_KEY = "AIzaSyAQPS9PZlHMf8L9iZrvw9DTMZZ9T02o8jM";
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

export async function getRestaurantsNearby(location, filters) {
    const DEFAULT_RADIUS_METERS = 160934;

    const params = {
        key: GOOGLE_PLACES_API_KEY,
        location: `${location.lat},${location.lng}`,
        radius: filters.radius || DEFAULT_RADIUS_METERS,
        type: 'restaurant',
        opennow: filters.openNow || false,
    };

    if (filters.radius === null) {
        params.radius = DEFAULT_RADIUS_METERS;
    } else {
        params.radius = filters.radius;
    }

    if (filters.selectedCuisine && filters.selectedCuisine.length > 0) {
        // join multiple cuisines with OR operator
        params.keyword = filters.selectedCuisine.join('|');
    }

    if (filters.selectedPrice && filters.selectedPrice.length > 0) {
        params.minprice = filters.selectedPrice.join('|');
    }

    const response = await axios.get(BASE_URL, { params });
    return response.data.results || [];
}



import axios from 'axios';
import { PLACES_API_KEY } from '@env';

const GOOGLE_PLACES_API_KEY = PLACES_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

export async function getRestaurantsNearby(location, filters) {
    const DEFAULT_RADIUS_METERS = 50000;//approx 31 miles, 50km by API limit

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



import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { getRestaurantsNearby } from '../api/placesApi';
import RestaurantCard from '../components/RestaurantCard';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
    const [location, setLocation] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);

    const { filters } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }
            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                lat: userLocation.coords.latitude,
                lng: userLocation.coords.longitude
            });
        })();
    }, []);

    const generateRestaurant = async () => {
        if (!location) {
            Alert.alert('Location Not Ready', 'Location not available yet.');
            return;
        }
        setLoading(true);
        try {
            const results = await getRestaurantsNearby(location, filters);
            // Apply min rating filter client-side since Places API doesn't support it directly
            const filtered = results.filter(r => {
                const rating = r.rating || 0;
                return rating >= filters.minRating;
            });

            if (filtered.length > 0) {
                const randomIndex = Math.floor(Math.random() * filtered.length);
                const chosenRestaurant = filtered[randomIndex];
                setRestaurant(chosenRestaurant);
            } else {
                setRestaurant(null);
                Alert.alert('No Results', 'No restaurants found matching the filters.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch restaurants.');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Find a Random Bite</Text>
            <Button title="Generate Restaurant" onPress={generateRestaurant} />
            {loading && <ActivityIndicator style={{ margin: 20 }} />}
            {restaurant && <RestaurantCard restaurant={restaurant} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex:1, padding:20 },
    header: { fontSize:24, marginBottom:20 }
});

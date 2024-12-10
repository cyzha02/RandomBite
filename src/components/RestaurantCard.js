// src/components/RestaurantCard.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { saveVisitedRestaurant } from '../services/restaurantService';

export default function RestaurantCard({ restaurant }) {
    const { user } = useContext(AuthContext);

    const { name, rating, vicinity, price_level } = restaurant;

    const onSaveToHistory = async () => {
        if (!user) {
            alert("You must be logged in to save history.");
            return;
        }
        try {
            await saveVisitedRestaurant(user.uid, {
                name,
                rating: rating || 'N/A',
                vicinity: vicinity || 'N/A',
                price_level: price_level !== undefined ? price_level : 'N/A',
                timestamp: new Date().toISOString()
            });
            alert(`${name} has been saved to history.`);
        } catch (error) {
            console.log('Error saving visited restaurant:', error);
            alert('Error saving to history.');
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{name}</Text>
            <Text>Rating: {rating || 'N/A'}</Text>
            <Text>Address: {vicinity}</Text>
            <Text>Price Level: {price_level !== undefined ? price_level : 'N/A'}</Text>
            <View style={{ height:10 }}/>
            <Button title="Mark as Visited" onPress={onSaveToHistory} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        borderRadius: 5
    },
    title: {
        fontSize: 20,
        marginBottom: 5
    }
});

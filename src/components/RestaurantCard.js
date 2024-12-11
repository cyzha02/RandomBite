// src/components/RestaurantCard.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { saveVisitedRestaurant } from '../services/restaurantService';
import { COLORS } from '../styles/theme';

export default function RestaurantCard({ restaurant }) {
    const { user } = useContext(AuthContext);

    const { name, rating, vicinity, price_level } = restaurant;

    const getPriceLevel = (level) => {
        if (level === undefined) return 'N/A';
        return '$'.repeat(level);
    }

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
            {/* Restaurant Info */}
            <View style={styles.restaurantInfo}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Rating: </Text>
                    <Text style={styles.value}>{rating || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Address: </Text>
                    <Text style={styles.value}>{vicinity}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Price Level: </Text>
                    <Text style={styles.value}>{getPriceLevel(price_level)}</Text>
                </View>
            </View>
            <View style={{ height:10 }}/>

            {/* Button Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onSaveToHistory}>
                    <Text style={styles.buttonText}>Mark as Visited</Text>
                </TouchableOpacity>

                {/* TODO: Blacklist Button */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Blacklist</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: COLORS.background
    },
    restaurantInfo: {
        width: '100%',
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
        color: COLORS.primary,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    label: {
        color: COLORS.primary,
        fontWeight: '600',
        marginRight: 8, 
        fontSize: 16
    },
    value: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 5
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        width: '48%'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    }
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const CUISINES = [
    'American',
    'Chinese', 
    'Italian',
    'Mexican',
    'Japanese',
    'Indian',
    'French',
    'Thai',
    'Greek',
    'Burger',
    'Pizza',
    'Seafood',
    'Steak',
    'Sushi',
    'Vegetarian',
    'Vegan'
]

export default function CuisineSelector({ selectedCuisine, onCuisineToggle }) {
    const toggleCuisine = (cuisine) => {
        if (selectedCuisine.includes(cuisine)) {
            onCuisineToggle(selectedCuisine.filter(c => c !== cuisine));
        } else {
            onCuisineToggle([...selectedCuisine, cuisine]);
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Cuisine:</Text>
            <View style={styles.buttonContainer}>
                
                {/* Map through the CUISINES array and create a button for each cuisine */}
                {CUISINES.map((cuisine) => (
                    <TouchableOpacity 
                        key={cuisine} 
                        style={[
                            styles.cuisineButton, 
                            selectedCuisine.includes(cuisine) && styles.selectedButton
                        ]} 
                        onPress={() => toggleCuisine(cuisine)}
                    >
                        <Text style={[
                            styles.cuisineText,
                            selectedCuisine.includes(cuisine) && styles.selectedText
                        ]}>
                            {cuisine}
                        </Text>
                    </TouchableOpacity>
                ))}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cuisineButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.text,
        marginBottom: 8,
    },
    selectedButton: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    cuisineText: {
        color: COLORS.primary,
        fontSize: 14,
    },
    selectedText: {
        color: '#fff',
    },
});
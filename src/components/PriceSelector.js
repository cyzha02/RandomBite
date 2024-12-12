import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const PRICES = [
    { label: '$', value: 1 },
    { label: '$$', value: 2 },
    { label: '$$$', value: 3 },
    { label: '$$$$', value: 4 },
]

export default function PriceSelector({ selectedPrice, onPriceToggle }) {
    const togglePrice = (price) => {
        if (selectedPrice.includes(price)) {
            onPriceToggle(selectedPrice.filter(p => p !== price)); 
        } else {
            onPriceToggle([...selectedPrice, price]); 
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Price:</Text>
            <View style={styles.buttonContainer}>
                {PRICES.map((price) => (
                    <TouchableOpacity 
                        key={price.value} 
                        style={[
                            styles.priceButton, 
                            selectedPrice.includes(price.value) && styles.selectedButton
                        ]} 
                        onPress={() => togglePrice(price.value)}
                    >
                        <Text style={[
                            styles.priceText, 
                            selectedPrice.includes(price.value) && styles.selectedText
                        ]}>
                            {price.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
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
    priceButton: {
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
    priceText: {
        color: COLORS.primary,
        fontSize: 14,
    },
    selectedText: {
        color: '#fff',
    },
});
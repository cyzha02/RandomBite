import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import Filters from '../components/Filters';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../styles/theme';
export default function FilterScreen() {
    const { filters, setFilters } = useContext(AuthContext);

    const clearFilters = () => {
        setFilters({
            radius: null,
            selectedPrice: [],
            selectedCuisine: [],
            minRating: 0,
            openNow: false
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.header}>Set Your Filters</Text>
                <Filters filters={filters} setFilters={setFilters} />

                <TouchableOpacity style={styles.button} onPress={clearFilters}>
                    <Text style={styles.buttonText}>Clear Filters</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    Adjust the filters above. You can set distance, price range, 
                    cuisine keyword, and a minimum rating. The Home screen will 
                    use these filters to find a random restaurant.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: { 
        fontSize: 25,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    scrollContent: {
        paddingBottom: 40
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: COLORS.background,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    note: { 
        marginTop: 20, 
        fontStyle: 'italic',
        color: COLORS.text,
        textAlign: 'center',
    }
});


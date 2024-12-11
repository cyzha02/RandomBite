import React, { useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity,
    ActivityIndicator, 
    StyleSheet, 
    Alert,
    SafeAreaView,
    Image,
    Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import { getRestaurantsNearby } from '../api/placesApi';
import RestaurantCard from '../components/RestaurantCard';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [location, setLocation] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);

    const clearRestaurant = () => {
        setRestaurant(null);
    }

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
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.logoText}>Generate a Random Restaurant</Text>
                    <Text style={styles.subtitle}>Discover a new place to eat</Text>
                </View>

                {/* Main Content Section */}
                <View style={styles.mainContent}>
                    {!restaurant && !loading && (
                        <View style={styles.emptyStateContainer}>
                            <Ionicons 
                                name="restaurant-outline" 
                                size={80} 
                                color={COLORS.primary} 
                            />
                        </View>
                    )}

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator 
                                size="large" 
                                color={COLORS.primary} 
                            />
                            <Text style={styles.loadingText}>
                                Finding the perfect spot...
                            </Text>
                        </View>
                    )}

                    {restaurant && !loading && (
                        <View style={styles.cardContainer}>
                            <TouchableOpacity
                                style={styles.closeButton}
                            onPress={clearRestaurant}
                            >
                                <Ionicons 
                                    name="close-circle-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <RestaurantCard restaurant={restaurant} />
                        </View>
                    )}
                </View>

                {/* Generate Button Section */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.generateButton}
                        onPress={generateRestaurant}
                        disabled={loading}
                    >
                        <Ionicons 
                            name="shuffle" 
                            size={24} 
                            color="#fff" 
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.generateButtonText}>
                            {loading ? 'Generating...' : 'Generate Restaurant'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        padding: 20
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'center'
    },
    logoText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyStateText: {
        marginTop: 20,
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    buttonContainer: {
        paddingVertical: 20,
        width: '100%',
    },
    generateButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonIcon: {
        marginRight: 8,
    },
    cardContainer: {
        width: '100%',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: -5,
        top: -5,
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});

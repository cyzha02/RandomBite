import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    PanResponder,
    Dimensions
} from 'react-native';
import { COLORS } from '../styles/theme';
import CuisineSelector from './CuisineSelector';
import PriceSelector from './PriceSelector';
import Slider from '@react-native-community/slider';

const milesToMeters = (miles) => miles * 1609.34;
const metersToMiles = (meters) => meters / 1609.34;

export default function Filters({ filters, setFilters }) {
    const [localRadius, setLocalRadius] = useState(
        filters.radius == null ? 31.0 : parseFloat(metersToMiles(filters.radius).toFixed(1))
    );
    const [displayRadius, setDisplayRadius] = useState(localRadius);

    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 40;
    const STAR_COUNT = 5;
    const STAR_SIZE = 50;
    const TOTAL_STAR_WIDTH = Math.min(screenWidth - containerPadding, STAR_COUNT * STAR_SIZE);

    const updateRating = useCallback((rating) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            minRating: rating
        }));
    }, [setFilters]);

    const calculateRating = useCallback((x) => {
        const clampedX = Math.max(0, Math.min(x, TOTAL_STAR_WIDTH));
        const rating = (clampedX / TOTAL_STAR_WIDTH) * 5;
        return Math.round(rating * 10) / 10;
    }, [TOTAL_STAR_WIDTH]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const rating = calculateRating(evt.nativeEvent.locationX);
                updateRating(rating);
            },
            onPanResponderMove: (evt) => {
                const rating = calculateRating(evt.nativeEvent.locationX);
                updateRating(rating);
            },
            onPanResponderRelease: (evt) => {
                const rating = calculateRating(evt.nativeEvent.locationX);
                updateRating(rating);
            }
        })
    ).current;

    const handleRadiusChange = useCallback((value) => {
        setDisplayRadius(value);
    }, []);

    const handleRadiusComplete = useCallback((value) => {
        setDisplayRadius(value);
        setLocalRadius(value);
        setFilters(prevFilters => ({
            ...prevFilters,
            radius: milesToMeters(value)
        }));
    }, []);

    const currentRating = filters.minRating || 0;
    const goldOverlayWidth = (currentRating / 5) * TOTAL_STAR_WIDTH;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                <View style={styles.row}>
                    <Text style={styles.label}>Open Now Only:</Text>
                    <Switch
                        value={filters.openNow || false}
                        onValueChange={(val) => setFilters({ ...filters, openNow: val })}
                    />
                </View>

                <Text style={styles.label}>Distance (miles): {displayRadius.toFixed(1)}</Text>
                <Slider
                    style={{width: '100%', height: 40}}
                    minimumValue={1.0}
                    maximumValue={31.0}
                    step={0.1}
                    value={localRadius}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor="#000000"
                    onValueChange={handleRadiusChange}
                    onSlidingComplete={handleRadiusComplete}
                />

                <PriceSelector
                    selectedPrice={filters.selectedPrice}
                    onPriceToggle={(prices) =>
                        setFilters({ ...filters, selectedPrice: prices })
                    }
                />

                <CuisineSelector 
                    selectedCuisine={filters.selectedCuisine}
                    onCuisineToggle={(cuisines) => 
                        setFilters({ ...filters, selectedCuisine: cuisines })
                    }
                />

                <Text style={styles.label}>Minimum Rating: {currentRating.toFixed(1)}</Text>
                <View style={styles.ratingContainer}>
                    <View style={[styles.starsOuterContainer, { width: TOTAL_STAR_WIDTH }]}>
                        <View style={styles.starsRow}>
                            {[...Array(STAR_COUNT)].map((_, i) => (
                                <Text key={i} style={[styles.star, { color: '#ccc', width: STAR_SIZE }]}>★</Text>
                            ))}
                        </View>

                        <View style={[styles.goldOverlay, { width: goldOverlayWidth }]}>
                            <View style={styles.starsRow}>
                                {[...Array(STAR_COUNT)].map((_, i) => (
                                    <Text key={i} style={[styles.star, { color: 'gold', width: STAR_SIZE }]}>★</Text>
                                ))}
                            </View>
                        </View>
                    </View>
                    <View
                        style={[styles.panResponderOverlay, { width: TOTAL_STAR_WIDTH }]}
                        {...panResponder.panHandlers}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10,
        padding: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        justifyContent: 'space-between'
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16
    },
    ratingContainer: {
        position: 'relative',
        height: 60,
        marginTop: -5,
        marginBottom: 10,
    },
    starsOuterContainer: {
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
    },
    star: {
        fontSize: 50,
        textAlign: 'center',
        lineHeight: 60,
    },
    goldOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        overflow: 'hidden',
    },
    panResponderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        zIndex: 1,
    }
});
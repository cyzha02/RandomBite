import React from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Switch, 
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '../styles/theme';
import CuisineSelector from './CuisineSelector';
import PriceSelector from './PriceSelector';

const milesToMeters = (miles) => miles * 1609.34;
const metersToMiles = (meters) => meters / 1609.34;

export default function Filters({ filters, setFilters }) {
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

                <Text style={styles.label}>Distance (miles):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={filters.radius === null ? '' : String(metersToMiles(filters.radius))}
                    onChangeText={(val) => {
                        if (val === '') {
                            // allow empty val 
                            setFilters({
                                ...filters,
                                radius: null 
                            })
                        } else {
                            const miles = parseFloat(val);
                            if (!isNaN(miles)) {
                                setFilters({
                                    ...filters,
                                    radius: milesToMeters(miles)
                                })
                            }
                        }
                    }}
                    placeholder="Enter distance (default: 100 miles)"
                    placeholderTextColor="#666"
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

                <Text style={styles.label}>Minimum Rating (0-5):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(filters.minRating)}
                    onChangeText={(val) => {
                        let r = parseFloat(val);
                        if (isNaN(r) || r < 0) r = 0;
                        if (r > 5) r = 5;
                        setFilters({ ...filters, minRating: r });
                    }}
                />
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
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
        borderRadius: 10,
        borderColor: COLORS.text,
        color: COLORS.primary
    },
    row: {
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5,
        justifyContent:'space-between'
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16
    }
});
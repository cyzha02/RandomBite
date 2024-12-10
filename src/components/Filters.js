import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';

export default function Filters({ filters, setFilters }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Distance (meters):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(filters.radius)}
                onChangeText={(val) => setFilters({ ...filters, radius: parseInt(val) || 1500 })}
            />

            <View style={styles.row}>
                <Text>Open Now Only:</Text>
                <Switch
                    value={filters.openNow || false}
                    onValueChange={(val) => setFilters({ ...filters, openNow: val })}
                />
            </View>

            <Text style={styles.label}>Min Price Level (0-4):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(filters.minprice)}
                onChangeText={(val) => {
                    let mp = parseInt(val);
                    if (isNaN(mp) || mp < 0) mp = 0;
                    if (mp > filters.maxprice) mp = filters.maxprice;
                    setFilters({ ...filters, minprice: mp });
                }}
            />

            <Text style={styles.label}>Max Price Level (0-4):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(filters.maxprice)}
                onChangeText={(val) => {
                    let mxp = parseInt(val);
                    if (isNaN(mxp) || mxp > 4) mxp = 4;
                    if (mxp < filters.minprice) mxp = filters.minprice;
                    setFilters({ ...filters, maxprice: mxp });
                }}
            />

            <Text style={styles.label}>Cuisine (keyword):</Text>
            <TextInput
                style={styles.input}
                value={filters.cuisine}
                onChangeText={(val) => setFilters({ ...filters, cuisine: val })}
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
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 5
    },
    row: {
        flexDirection:'row',
        alignItems:'center',
        marginVertical:5,
        justifyContent:'space-between'
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold'
    }
});

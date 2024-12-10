import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Filters from '../components/Filters';
import { AuthContext } from '../context/AuthContext';

export default function FilterScreen() {
    const { filters, setFilters } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Set Your Filters</Text>
            <Filters filters={filters} setFilters={setFilters} />
            <Text style={styles.note}>Adjust the filters above. You can set distance, price range, cuisine keyword, and a minimum rating. The Home screen will use these filters to find a random restaurant.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, marginBottom: 20 },
    note: { marginTop: 20, fontStyle: 'italic' }
});

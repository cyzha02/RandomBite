import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../api/firebase';
import { updateProfile } from 'firebase/auth';
import { logOut } from '../services/authService';
import { getVisitedRestaurants, deleteVisitedRestaurant } from '../services/restaurantService';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen() {
    const { user } = useContext(AuthContext);
    const [newUsername, setNewUsername] = useState(user?.displayName || '');
    const [history, setHistory] = useState([]);

    const isFocused = useIsFocused();

    const fetchHistory = useCallback(async () => {
        if (user) {
            const visited = await getVisitedRestaurants(user.uid);
            setHistory(visited);
        }
    }, [user]);

    useEffect(() => {
        if (isFocused) {
            fetchHistory();
        }
    }, [isFocused, fetchHistory]);

    const updateUserName = async () => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: newUsername });
            Alert.alert('Success', 'Username updated');
        }
    };

    const handleLogOut = async () => {
        await logOut();
    };

    const handleDelete = async (id) => {
        if (!user) return;
        try {
            await deleteVisitedRestaurant(user.uid, id);
            Alert.alert('Deleted', 'The visited record has been deleted.');
            fetchHistory();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete the visited record.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Rating: {item.rating}</Text>
            <Text>Address: {item.vicinity}</Text>
            <Text>Price: {item.price_level}</Text>
            <Text style={styles.timestamp}>Visited on: {new Date(item.timestamp).toLocaleString()}</Text>
            <View style={{ height:10 }}/>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>
            <Text style={styles.info}>Current Username: {user?.displayName || 'N/A'}</Text>
            <TextInput
                style={styles.input}
                value={newUsername}
                onChangeText={setNewUsername}
            />
            <Button title="Update Username" onPress={updateUserName} />
            <View style={{height:10}}/>
            <Button title="Log Out" onPress={handleLogOut} />

            <Text style={[styles.header, {marginTop:20}]}>Visited History</Text>
            {history.length === 0 ? (
                <Text>No visited restaurants yet.</Text>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex:1, padding:20 },
    header: { fontSize:24 },
    info: { marginVertical:10 },
    input: { borderWidth:1, marginBottom:10, padding:5 },
    item: {
        borderWidth:1,
        borderRadius:5,
        padding:10,
        marginBottom:10,
        marginTop:10
    },
    name: { fontSize:18, fontWeight:'bold' },
    timestamp: { marginTop:5, fontSize:12, color:'gray' }
});

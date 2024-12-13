import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    FlatList, 
    Alert, 
    SafeAreaView, 
    ScrollView 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../api/firebase';
import { updateProfile } from 'firebase/auth';
import { logOut } from '../services/authService';
import { 
    getVisitedRestaurants, 
    deleteVisitedRestaurant, 
    getBlacklistedRestaurants, 
    deleteBlacklistedRestaurant, 
    toggleFavoriteRestaurant 
} from '../services/restaurantService';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { user } = useContext(AuthContext);
    const [visitedRestaurants, setVisitedRestaurants] = useState([]);
    const [blacklistedRestaurants, setBlacklistedRestaurants] = useState([]);
    const [activeTab, setActiveTab] = useState('visited');
    const isFocused = useIsFocused();
    
    useEffect(() => {
        if (user && isFocused) {
            loadRestaurants();
        }
    }, [user, isFocused]);

    const loadRestaurants = async () => {
        try {
            const visited = await getVisitedRestaurants(user.uid);
            const blacklisted = await getBlacklistedRestaurants(user.uid);
            setVisitedRestaurants(visited);
            setBlacklistedRestaurants(blacklisted);
        } catch (error) {
            console.log('Error loading restaurants:', error);
        }
    };

    const handleLogOut = async () => {
        await logOut();
    };

    const handleDelete = async (id) => {
        if (!user) return;
        try {
            if (activeTab === 'visited') {
                await deleteVisitedRestaurant(user.uid, id);
                Alert.alert('Deleted', 'The visited record has been deleted.');
            } else {
                await deleteBlacklistedRestaurant(user.uid, id);
                Alert.alert('Deleted', 'The blacklisted record has been deleted.');
            }
            loadRestaurants();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete the restaurant record.');
        }
    };

    const handleToggleFavorite = async (id, isFavorited) => {
        if (!user) return; 
        try {
            await toggleFavoriteRestaurant(user.uid, id, isFavorited);
            loadRestaurants();
        } catch (error) {
            Alert.alert('Error', 'Failed to toggle favorite status.');
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>


            <View>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{item.name}</Text>

                <TouchableOpacity
                    onPress={() => handleToggleFavorite(item.id, item.isFavorited)}
                    style={styles.favoriteButton}
                >
                    <MaterialIcons
                        name={item.isFavorited ? "star" : "star-border"}
                        size={40} 
                        color="#ffe234"
                    />
                </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Rating: </Text>
                    <Text style={styles.value}>{item.rating}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Address: </Text>
                    <Text style={styles.value}>{item.vicinity}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Price: </Text>
                    <Text style={styles.value}>
                        {item.price_level === 'N/A' ? 'N/A' : '$'.repeat(item.price_level)}
                    </Text>
                </View>
            </View>
            <Text style={styles.timestamp}>Visited on: {new Date(item.timestamp).toLocaleString()}</Text>
            <View style={{ height:10 }}/>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.scrollView}
            >
                <View style={styles.content}>
                    <Text style={styles.header}>Profile</Text>

                <Text style={[styles.subheader, {marginTop:20}]}>Email: {user?.email || 'N/A'}</Text>
                <View style={{height:10}}/>

                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                    style={[
                        styles.tab, 
                        activeTab === 'visited' && styles.activeTab
                    ]} 
                    onPress={() => setActiveTab('visited')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'visited' && styles.activeTabText
                    ]}>
                        Visited History
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.tab, 
                        activeTab === 'blacklisted' && styles.activeTab
                    ]} 
                    onPress={() => setActiveTab('blacklisted')}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === 'blacklisted' && styles.activeTabText
                    ]}>
                        Blacklisted
                    </Text>
                </TouchableOpacity>
                </View>

                <FlatList
                    data={activeTab === 'visited' ? visitedRestaurants : blacklistedRestaurants}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No {activeTab} restaurants yet.</Text>}
                />
            </View>
            </View>

            <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background
    },
    scrollView: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    favoriteButton: {
        padding: 5,
    }, 
    scrollContent: {
        padding: 20,
        paddingBottom: 40, 
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        color: '#666',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    listContainer: {
        padding: 15,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: { 
        fontSize:25, 
        fontWeight:'bold',
        color: COLORS.primary
    },
    subheader: {
        fontSize:20,
        fontWeight:'bold',
        color: COLORS.text
    },
    info: { 
        marginVertical:10,
        color: COLORS.text
    },
    input: { 
        borderWidth:1, 
        marginBottom:10, 
        padding:5,
        color: COLORS.text
    },
    item: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: COLORS.background
    },
    name: { 
        fontSize: 20,
        marginBottom: 15,
        color: COLORS.primary,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    timestamp: { 
        marginTop:5, 
        fontSize:12, 
        color:'gray' 
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
        alignItems: 'center',
        marginTop: 5
    },
    logoutContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    logoutButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
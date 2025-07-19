import { db } from '../api/firebase';
import { collection, addDoc, getDocs, updateDoc, orderBy, query, doc, deleteDoc } from 'firebase/firestore';

export async function saveVisitedRestaurant(userId, restaurantData) {
    const colRef = collection(db, 'users', userId, 'visitedRestaurants');
    await addDoc(colRef, restaurantData);
}

export async function getVisitedRestaurants(userId) {
    const colRef = collection(db, 'users', userId, 'visitedRestaurants');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const visited = [];
    snapshot.forEach(docSnap => {
        visited.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Sort the restaurants: favorite first, then by timestamp
    return visited.sort((a, b) => {
        if (a.isFavorited === b.isFavorited) {
            // If both are favorite or both are not favorite, sort by timestamp
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
        // If one is favorited and the other is not, put the favorite one first
        return b.isFavorited ? 1 : -1;
    });
}

export async function deleteVisitedRestaurant(userId, restaurantId) {
    const docRef = doc(db, 'users', userId, 'visitedRestaurants', restaurantId);
    await deleteDoc(docRef);
}

export const saveBlacklistedRestaurant = async (userId, restaurantData) => {
    const colRef = collection(db, 'users', userId, 'blacklistedRestaurants');
    await addDoc(colRef, restaurantData);
}

export const toggleFavoriteRestaurant = async (userId, restaurantId, currentFavorited) => {
    const docRef = doc(db, 'users', userId, 'visitedRestaurants', restaurantId);
    await updateDoc(docRef, { isFavorited: !currentFavorited });
}

export const getBlacklistedRestaurants = async (userId) => {
    if (!userId) {
        console.log('No userId provided to getBlacklistedRestaurants');
        return [];
    }
    
    // check if blacklistedRestaurants collection exists
    const blacklistRef = collection(db, 'users', userId, 'blacklistedRestaurants');
    const snapshot = await getDocs(blacklistRef);
    if (snapshot.empty) {
        return [];
    }

    try {
        const blacklistRef = collection(db, 'users', userId, 'blacklistedRestaurants');
        const q = query(blacklistRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error in getBlacklistedRestaurants:', error);
        throw error;
    }
};

export const deleteBlacklistedRestaurant = async (userId, restaurantId) => {
    const docRef = doc(db, 'users', userId, 'blacklistedRestaurants', restaurantId);
    await deleteDoc(docRef);
}
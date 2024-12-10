import { db } from '../api/firebase';
import { collection, addDoc, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore';

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
    return visited;
}

export async function deleteVisitedRestaurant(userId, restaurantId) {
    const docRef = doc(db, 'users', userId, 'visitedRestaurants', restaurantId);
    await deleteDoc(docRef);
}

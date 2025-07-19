import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDOai8MpVg1UqeZqKYBUZ-xApQcWIOB39c",
    authDomain: "randombite-backend.firebaseapp.com",
    projectId: "randombite-backend",
    storageBucket: "randombite-backend.firebrasestorage.app",
    messagingSenderId: "740790425318",
    appId: "1:740790425318:web:0f3e310ef133f8d9d60d27",
    measurementId: "G-R7WDKYLYPJ"
};

const app = initializeApp(firebaseConfig);

let auth; 
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (error) {
    auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };

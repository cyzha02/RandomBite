import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { auth, db };

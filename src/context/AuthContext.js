import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../api/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [filters, setFilters] = useState({
        radius: 1500,
        openNow: false,
        minprice: 0,
        maxprice: 4,
        cuisine: '',
        minRating: 0
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, filters, setFilters }}>
            {children}
        </AuthContext.Provider>
    );
};

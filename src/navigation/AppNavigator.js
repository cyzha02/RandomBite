import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import FilterScreen from '../screens/FilterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import AuthNavigator from './AuthNavigator';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <NavigationContainer>
                <AuthNavigator />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{ headerShown: false }}>

                <Tab.Screen name="Filter" component={FilterScreen} />

                <Tab.Screen name="Home" component={HomeScreen} />

                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

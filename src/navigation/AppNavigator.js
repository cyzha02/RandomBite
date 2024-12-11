import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';

// Screens
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
            <Tab.Navigator screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Filter') {
                        iconName = focused ? 'options' : 'options-outline';
                    } else if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return (
                        <View style={focused ? StyleSheet.activeIconContainer : StyleSheet.iconContainer}>
                            <Ionicons name={iconName} size={size} color={color} />
                        </View>
                    )
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: '#666',
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
            })}>

                <Tab.Screen 
                    name="Filter" 
                    component={FilterScreen} 
                    options={{
                        tabBarLabel: 'Filter',
                    }}
                />

                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{
                        tabBarLabel: 'Home',
                    }}
                />

                <Tab.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{
                        tabBarLabel: 'Profile',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#fff',
        height: Platform.OS === 'ios' ? 85 : 65,
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 0,
        marginBottom: Platform.OS === 'ios' ? 0 : 5,
    },
    tabBarItem: {
        padding: 4,
    },
    activeIconContainer: {
        backgroundColor: `${COLORS.primary}15`,
        padding: 8,
        borderRadius: 12,
        marginTop: 5,
    },
    iconContainer: {
        padding: 8,
        marginTop: 5,
    },
});

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {LoginScreen, OnbroadingScreen} from '../screens'; // Corrected typo here

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  // Auth calls Onboarding and Login screens
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnboardingScreen" component={OnbroadingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

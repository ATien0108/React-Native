import {StyleSheet} from 'react-native';
import React from 'react';
import Home from './src/Home/Home';
import Introduce from './src/Introduce/Introduce';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import {enableScreens} from 'react-native-screens';

enableScreens();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Introduce"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Introduce" component={Introduce} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({});
export default App;

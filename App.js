/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { Suspense, useState } from 'react';
 import { StyleSheet, Button, View, Alert} from 'react-native';
 import { NavigationContainer } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 

 // component
 import deeplinking from './src/linking';

 

 // helper
 import { checkConnected } from './src/helpers/common.helper';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
 
 const App =() => {
  const Stack = createNativeStackNavigator(); // Stack contains Screen & Navigator properties
 
   return (
    <NavigationContainer linking={deeplinking}>
      
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      
    </NavigationContainer>
    
           
   );
 };
 
 const styles = StyleSheet.create({
 });
 
 
 export default App;
 
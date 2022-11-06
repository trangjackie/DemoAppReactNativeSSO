/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { Suspense, useState } from 'react';
 import { StyleSheet, Button, View, Alert} from 'react-native';


 // component
 import deeplinking from './src/linking';

 

 // helper
 import { checkConnected } from './src/helpers/common.helper';
import LoginScreen from './src/screens/LoginScreen';
 
 const App =() => {
   const [connectStatus, setConnectStatus] = useState(false);
   checkConnected().then(res => {
     setConnectStatus(res);
   });
 
   return (
    <LoginScreen linking={deeplinking}/>
    
           
   );
 };
 
 const styles = StyleSheet.create({
 });
 
 
 export default App;
 
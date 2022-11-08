//import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { StyleSheet, Text, Image, View, TouchableOpacity, ImageBackground } from 'react-native'

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const PushScreen = () => {
    console.log('HOME')

  }
  

  return (
    <>
      <View style={styles.container}>
        
            <View style={styles.header}>
                    
              </View>
              
              <Text style={styles.des}>Welcome!</Text>

              <TouchableOpacity style={styles.buttonLogin}
                onPress={PushScreen}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
        
      </View>
    </>
  )
}

export default HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1511c8',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },

  textColor_White: {
    color: 'white'
  },
  buttonText: {
    fontSize: 20,
    color: '#1511c8',
    fontWeight: 'bold',
  },
  buttonLogin: {
    alignItems: 'center',
    padding: 5,
    margin: 5,
    width: '40%',
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  des: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 18,
    margin: 10,
    fontWeight: 'bold',
    fontFamily: "AvertaStdCY-BoldItalic"
  },
  textBox: {
    margin: 10,
    flexDirection: 'row',
  },

  tinyLogo: {
    width: 300,
    height: 150,
  },
})


import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, Button, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import React, { useContext, useState  } from 'react'


// heler

import { SSOVinorSoftFE } from '../../helpers/sso';

const LoginScreen = () => {
  
  const handleSSO = async () => {
    const x = new SSOVinorSoftFE({
      realmUrl: 'http://117.4.247.68:10825/realms/demo',
      clientId: 'testApp1',
      callbackUrl: 'testsso://app/login'
    });
    try {
      //await InAppBrowser.open(x.getLoginUrl());

      Linking.openURL(x.getLoginUrl())
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
       
              <View
                style={styles.formWrapper}
              >
                  <Text style={styles.des}>Phần mềm demo SSO</Text>
                  <Button
                    title="Login via SSO"
                    onPress={
                     handleSSO
                    }
                  />

              </View>

    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1511c8',
    alignContent: 'center',
    justifyContent: 'center',
  },
  keyboard: {
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  contentLabel: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  title: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10
  },
  des: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 16,
    margin: 10,
  },
  formWrapper: {
    width: '100%',
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 100,
    height: 50,
  },
  input: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  inputText: {
    height: 40,
    width: '85%',
    margin: 10,
    paddingHorizontal: 5,
    marginBottom: 36,
    borderRadius: 5,
    borderColor: 'white',
    borderBottomWidth: 1,
    color: 'white',
    backgroundColor: 'transparent'
  },
  inputOTP: {
    height: 40,
    width: "50%",
    margin: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    backgroundColor: 'transparent'
  },
  placeholderStyle: {
    color: 'white'
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonGetOTP: {
    justifyContent: 'center',
    height: 42,
    width: "50%",
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#00A2FD',
  },

  buttonLogin: {
    textAlign: 'center',
    alignItems: 'center',
    margin: 20,
    width: '85%',
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#00A2FD',
    justifyContent: 'center',
    height: 48
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  styleButton: {
    backgroundColor: 'white',
    color: 'red'
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    textAlignVertical: "center",
    textAlign: "center"
  },

  ViewRegister: {
    width: '80%',
    flexDirection: 'row',
  },

  FogotPassText: {
    flex: 1,
    color: 'white',
    textAlign: 'left',
    fontSize: 14,
    textTransform: 'uppercase',
    textDecorationLine: 'underline'
  },

  RegisterText: { 
    flex: 1,
    color: 'white',
    textAlign: 'right',
    fontSize: 14,
    textTransform: 'uppercase',
    textDecorationLine: 'underline'
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  colorWhite: {
    color: 'white'
  }
})
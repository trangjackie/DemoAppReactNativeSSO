import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, Button, Linking } from 'react-native';

import React, { useContext, useState  } from 'react'

import jwt_decode from "jwt-decode";


// heler

import { SSOVinorSoftFE } from '../../helpers/sso';

const LoginScreen = ({route}) => {
  //const code = route.params.code;
 
  const apath = route.path;

  // Trong trường hợp params chứa thông tin về authentication code (do SSO trả về sau khi login thành công)
  // Ví dụ: testsso://app/login?state=afce6ddd-d151-466f-123456786b2-a0bf63bc6574&session_state=278f62d5-d822-4b86-91c7-65d208aa3b29&code=14212c9a-813b-48b7-8365-c7ef67529a05.278f62d5-d822-4b86-91c7-65d208aa3b29.6db14839-3f08-43d5-8b10-4df756fac855
  // cắt lấy phần code
  
  //let have_code = text.includes("code");
  // Tách chuỗi để lấy authencation code
    const strlist = String(route.path).split('code=');
    const acode = strlist[1];
    var atoken = '';

  
    // Gọi hàm sinh SSO Login URL để thực hiện xác thực trên SSO
    // Hàm getLoginUrl trong file sso.js đã được đính kèm thông tin username và password
    // thông tin này cần lấy từ màn hình login của ứng dụng. Trong sample project này đang hardcode
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

  // Mô phỏng Backend của ứng dụng, thực hiện gửi code đến SSO để lấy access token
  const sendCodeToSSO = async () => {
    const realmUrl= 'http://117.4.247.68:10825/realms/demo/';
    const subpath = 'protocol/openid-connect/token';
    var details = {
      'code': acode,
      'client_id': 'testApp1',
      'grant_type': 'authorization_code',
      'client_secret': 'Jue7RnRsDZxVzpkuTk0c5iHws4SYq05o',
      'scope':'openid email profile',
      'redirect_uri':'testsso://app/login'
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log(formBody);
    try {
       await fetch(
        realmUrl+subpath, 
        { // request option
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }, 
          body: formBody
        })
        .then(responseData => {
          //console.log(responseData);
          responseData.json()
              .then(_bodyBlob => {
                  console.log(_bodyBlob.access_token);
                  var decoded = jwt_decode(_bodyBlob.access_token);
                  console.log(decoded);
                
              });
              
        })
        .catch(function (error) {
          console.log(`API error: ${error}`);
          return Promise.reject(error);
      });
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
                  <Text style={styles.contentLabel}>Code: {acode}</Text>

                  <Button
                    title="Send code to get access token"
                    onPress={
                     sendCodeToSSO
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
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

 // Trường hợp App được SuperApp gọi bằng cách gọi deeplink+id_token thì cắt lấy id_token
  const deeplink_app2 = 'testsso2://app/login';
  const strlist2 = String(route.path).split('id_token=');
  const exchange_id_token = strlist[1];

    var access_token = '';
    var id_token = "";
    var refresh_token = "";

    var access_token_1 = '';
    var id_token_1 = "";
    var refresh_token_1 = "";

    var access_token_2 = '';
    var id_token_2 = "";
    var refresh_token_2 = "";

  //////////////// ĐĂNG NHẬP THÔNG QUA WEB //////////////////////////////////////
    // Gọi hàm sinh SSO Login URL để thực hiện xác thực trên SSO
    // Hàm getLoginUrl trong file sso.js đã được đính kèm thông tin username và password
    // thông tin này cần lấy từ màn hình login của ứng dụng. Trong sample project này đang hardcode
  const handleSSO = async () => {
    const x = new SSOVinorSoftFE({
      //realmUrl: 'http://172.21.180.110:8080/realms/master', // Local sso
      realmUrl: 'https://192.168.91.78:9000/realms/demo', // Vinorsoft sso uat
      clientId: 'testApp1',
      callbackUrl: 'testsso://app/login',
    });
    try {
      //await InAppBrowser.open(x.getLoginUrl());

      Linking.openURL(x.getLoginUrl())
    } catch (error) {
      console.log(error);
    }
  };

 
  
  const logoutSSO = async () => {
    try {
      const realmUrl= 'https://192.168.91.78:9000/realms/demo/'; // Vinorsoft sso uat
      var logoutCallbackUrl= 'testsso://app/login';
      var url = realmUrl+'protocol/openid-connect/logout'+'?post_logout_redirect_uri='+encodeURIComponent(logoutCallbackUrl)
      +'&id_token_hint='+ id_token;
      console.log(url);
      Linking.openURL(url)
    } catch (error) {
      console.log(error);
    }
  };

  // Mô phỏng Backend của ứng dụng, thực hiện gửi code đến SSO để lấy access token
  const sendCodeToSSO = async () => {
    //const realmUrl= 'http://172.21.180.110:8080/realms/master/'; // local sso
    const realmUrl= 'https://192.168.91.78:9000/realms/demo/'; // Vinorsoft sso uat
    const subpath = 'protocol/openid-connect/token';
    var details = {
      'code': acode,
      'client_id': 'testApp1',
      'grant_type': 'authorization_code',
      'client_secret': 'mEO8KhVmS5fKng0MYJjF8lyWuFGD9xKJ', // local sso
      //'client_secret': 'Jue7RnRsDZxVzpkuTk0c5iHws4SYq05o', // Vinorsoft sso uat
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
                
                  // Lấy ID token để dành cho hàm logout
                  id_token = _bodyBlob.id_token;
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


  ///////////////// ĐĂNG NHẬP TRỰC TIẾP /////////////////////
// hàm đăng nhập trực tiếp vào SSO bằng username và password
// Lệnh curl để kiểm tra việc lấy token bằng direct accesss
//  curl -L -X POST 'http://192.168.91.78:9001/realms/demo/protocol/openid-connect/token' 
// -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=testApp1' 
// --data-urlencode 'grant_type=password' --data-urlencode 'client_secret=mEO8KhVmS5fKng0MYJjF8lyWuFGD9xKJ' 
// --data-urlencode 'scope=openid' --data-urlencode 'username=user1' --data-urlencode 'password=123456'
const handleSSOdirect = async () => {
  //const realmUrl= 'http://172.21.180.110:8080/realms/master/'; // local sso
  const realmUrl= 'http://192.168.91.78:9001/realms/demo/'; // local sso
  const subpath = 'protocol/openid-connect/token';
  var details = {
    'client_id': 'SuperApp',
    'grant_type': 'password',
    'client_secret': 'MKpdeW6MTxI3D9VVB4Uvixma7V59JZUc', 
    'scope':'openid',
    'username':'user1', // Do FE gửi lên
    'password': '123456' // Do FE gửi lên
  };
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
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
        console.log(responseData);
        responseData.json()
            .then(_bodyBlob => {
                //console.log(_bodyBlob.access_token);
                //var decoded = jwt_decode(_bodyBlob.access_token);
                //console.log(decoded);
              
                // Lấy  token gửi cho FE
                id_token = _bodyBlob.id_token; 
                refresh_token = _bodyBlob.refresh_token;
                access_token = _bodyBlob.access_token;
                //console.log(id_token);
                var decoded = jwt_decode(_bodyBlob.id_token);
                console.log(decoded);
            });   
      })
      .catch(function (error) {
        console.log(`Login API error: ${error}`);
        return Promise.reject(error);
    });
  } catch (error) {
    console.log(error);
  }
};


// Hàm logout direct: Hàm này chỉ logout của chính ứng dụng thôi, không logout all
// Muốn logout all phải lấy logout token sau đó gọi backchannel-logout, cái này yêu cầu https mới lấy được
const logoutSSOdirect = async () => {
  //const realmUrl= 'http://172.21.180.110:8080/realms/master/'; // local sso
  const realmUrl= 'http://192.168.91.78:9001/realms/demo/'; // local sso
  const subpath = 'protocol/openid-connect/logout';
  //console.log("access_token = ",access_token);
  var details = {
    'client_id': 'SuperApp',
    'client_secret': 'MKpdeW6MTxI3D9VVB4Uvixma7V59JZUc', 
    'refresh_token': refresh_token
  };
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  try {
     await fetch(
      realmUrl+subpath, 
      { // request option
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //'Authorization':'bearer ' + access_token,
        }, 
        body: formBody
      })
      .then(responseData => {
        console.log(responseData);           
      })
      .catch(function (error) {
        console.log(`Logout API error: ${error}`);
        return Promise.reject(error);
    });
  } catch (error) {
    console.log(error);
  }
};

const openApp1 = async() => {
  try {
    url = 'testsso1://app/login&refresh_token='+refresh_token_1;
    console.log(url);
    await Linking.openURL(url);
  }
  catch(error)
  {
    console.log(error);
  }

};

// Superapp thực hiện đăng nhập các ứng dụng con
// bằng bộ username password của superapp, nếu ok thì nó nhận được refresh token
// refresh token này được gửi tới app con thông qua deeplink
// Trên superapp, khi người dùng click vào một app con, FE sẽ gọi tới api này

// Trường hợp bộ user password không giống, FE sẽ yêu cầu người dùng nhập user mk của app con kia
// có kèm theo OTP

// Như vậy super app cần lưu các bộ user mk tương ứng với app con
// SSO sẽ lưu bộ AD con trong từng realm riêng, nếu như app con nào dùng AD nào thì app đó sẽ là client của realm đấy

const loginSSO_App1 = async () => {
  const realmUrl= 'http://192.168.91.78:9001/realms/demo/'; // local sso
  const subpath = 'protocol/openid-connect/token';
  var details = {
    'client_id': 'testApp1',
    'grant_type': 'password',
    'client_secret': 'eoO5J1gf52EHcUnDdvnC3Jj6ihcb4Cm8', 
    'scope':'openid',
    'username':'user1', // Do FE gửi lên
    'password': '123456' // Do FE gửi lên
  };
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
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
      .then(responseData1 => {
        console.log(responseData1);
        responseData1.json()
            .then(_bodyBlob => {
              console.log(_bodyBlob)
                // Lấy  refresh_token gửi cho FE, FE gắn vào deeplink mở App1
                id_token_1 = _bodyBlob.id_token;  // cái này để cho superapp dùng khi logout app 1
                refresh_token_1 = _bodyBlob.refresh_token; // cái này gắn vào deeplink cho ông app 1 dùng
                //access_token_1 = _bodyBlob.access_token;
                var decoded2 = jwt_decode( _bodyBlob.id_token);
                console.log("refresh_token_1: "+refresh_token_1);
            });   
      })
      .catch(function (error) {
        console.log(`Login API app 1 error: ${error}`);
        return Promise.reject(error);
    });
  } catch (error) {
    console.log(error);
  }
};

// Khi App 1 nhận được refresh token từ deeplink (superapp tạo ra)
// App 1 thực hiện gọi lên SSO để lấy access token
const handleSSO_App1 = async () => {
  const realmUrl= 'http://192.168.91.78:9001/realms/demo/'; // local sso
  const subpath = 'protocol/openid-connect/token';
  var details = {
    'client_id': 'testApp1',
    'grant_type': 'refresh_token',
    'client_secret': 'eoO5J1gf52EHcUnDdvnC3Jj6ihcb4Cm8', 
    'scope':'openid',
    'refresh_token':refresh_token_1, // Do Superapp truyền cho
  };
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
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
      .then(responseData3 => {
        //console.log(responseData);
        responseData3.json()
            .then(_bodyBlob => {
                console.log("App 1: "+_bodyBlob.refresh_token)
                //id_token_1 = _bodyBlob.id_token; 
                //refresh_token_1 = _bodyBlob.refresh_token;
                access_token_1 = _bodyBlob.access_token;
                var decoded = jwt_decode(_bodyBlob.access_token);
                console.log("access_token_1: "+access_token_1);
            });   
      })
      .catch(function (error) {
        console.log(`Login API app 1 error: ${error}`);
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
                  <Text style={styles.des}>Phần mềm demo SSO 1</Text>
                  <Button
                    title="Login SuperApp"
                    onPress={
                     //handleSSO
                     handleSSOdirect
                    }
                  />
                  {/* <Text style={styles.contentLabel} selectable >Code: {acode}</Text> */}

                  {/* <Button
                    title="Send code to get access token"
                    onPress={
                     sendCodeToSSO
                    }
                  /> */}
                  
                  <Button
                    title="Logout"
                    onPress={
                     //logoutSSO
                     logoutSSOdirect
                    }
                  />


                  <Button
                    title="Login App1"
                    onPress={
                     loginSSO_App1
                    }
                  />
                  <Button
                    title="Open App1"
                    onPress={
                     //openApp1
                     handleSSO_App1
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
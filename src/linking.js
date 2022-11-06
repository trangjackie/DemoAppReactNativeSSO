const config = {
  screens: {
    Login: {
      path: "login",
    },
    Home: {
      path: 'home',
    }
  
  },
};

const linking = {
  prefixes: ["testsso://app", 'http://testsso.com'],
  config,
};
  

// Test deeplinking by
// ./adb.exe shell am start -a android.intent.action.VIEW -d "testsso://app/login" com.testproject
export default linking;
  
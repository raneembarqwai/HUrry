import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import homeScreen from './homeScreen'; 
import loginScreen from './loginScreen'; 
import signupScreen from './signupScreen';
import operatorScreen from './operatorScreen';
import driver from './driver';
import updateschedule from './updateschedule';
import profilestudent from './profilestudent';
import profileoperator from './profileoperator';
import busSchedule from './busSchedule';
import updateBus from './updateBus';
import BusDetails from './BusDetails';
import notification from './notification';
import feedback from './feedback';


const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
      <Stack.Navigator
       initialRouteName="Home"
       screenOptions={{ headerShown: true,
        headerBackTitle:"back",
        headerTitle:"",

        }}
      >
        <Stack.Screen name="Home" component={homeScreen} />
        <Stack.Screen name="Login" component={loginScreen} />
        <Stack.Screen name="signup" component={signupScreen} />
        <Stack.Screen name="operator" component={operatorScreen} />
        <Stack.Screen name="driver" component={driver} />
        <Stack.Screen name="updateschedule" component={updateschedule} />
        <Stack.Screen name="profilest" component={profilestudent} />
        <Stack.Screen name="profileop" component={profileoperator} />
        <Stack.Screen name="busSchedule" component={busSchedule} />
        <Stack.Screen name="updateBus" component={updateBus} />
        <Stack.Screen name="BusDetails" component={BusDetails} />
        <Stack.Screen name="notification" component={notification} />
        <Stack.Screen name="feedback" component={feedback} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
    
    

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
    backgroundColor: '#f8ffff', 
  },
});

export default App;




import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// استيراد الشاشات
import homeScreen from './homeScreen'; 
import loginScreen from './loginScreen'; 
import signupScreen from './signupScreen';
import studentScreen from './studentScreen';
import operatorScreen from './operatorScreen';
import driver from './driver';
import updateschedule from './updateschedule';
import updatescheduleZarqa from './updatescheduleZarqa';
import state from './state';
import stateOperator from './stateOperator';
import profilestudent from './profilestudent';
import profileoperator from './profileoperator';
import busSchedule from './busSchedule';
import busScheduleZarqa from './busScheduleZarqa';
import updateBus from './updateBus';
import updateBusZarqa from './updateBusZarqa';
import BusDetails from './BusDetails';
import BusDetailsZarqa from './BusDetailsZarqa';

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
        <Stack.Screen name="student" component={studentScreen} />
        <Stack.Screen name="operator" component={operatorScreen} />
        <Stack.Screen name="driver" component={driver} />
        <Stack.Screen name="updateschedule" component={updateschedule} />
        <Stack.Screen name="updatescheduleZarqa" component={updatescheduleZarqa} />
        <Stack.Screen name="state" component={state} />
        <Stack.Screen name="stateOperator" component={stateOperator} />
        <Stack.Screen name="profilest" component={profilestudent} />
        <Stack.Screen name="profileop" component={profileoperator} />
        <Stack.Screen name="busSchedule" component={busSchedule} />
        <Stack.Screen name="busScheduleZarqa" component={busScheduleZarqa} />
        <Stack.Screen name="updateBus" component={updateBus} />
        <Stack.Screen name="updateBusZarqa" component={updateBusZarqa} />
        <Stack.Screen name="BusDetails" component={BusDetails} />
        <Stack.Screen name="BusDetailsZarqa" component={BusDetailsZarqa} />
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




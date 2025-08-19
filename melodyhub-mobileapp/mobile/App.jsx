import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


//Auth
import LoginScreen from './screens/appScreen/Auth/LoginScreen';
import RegisterScreen from './screens/appScreen/Auth/RegisterScreen';
//Client
import AppNavigator from './navigation/AppNavigator';
//Admin
import AdminNavigator from './navigation/AdminNavigator'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AppHome" component={AppNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminHome" component={AdminNavigator} options={{ headerShown: false }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

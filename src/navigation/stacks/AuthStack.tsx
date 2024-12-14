import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../screens/auth/SignInScreen';
import SignUpScreen from '../../screens/auth/SignUpScreen';
import VerifyCodeScreen from '../../screens/auth/VerifyCodeScreen';
import { AuthStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;

// src/types/navigation.ts
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
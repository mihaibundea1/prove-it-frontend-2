import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";

// Root Stack (Top level)
export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
};

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  VerifyCode: undefined;
};

// Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  FeedTab: undefined;
  ProfileTab: undefined;
};

// Individual Stack Params for each tab
export type HomeStackParamList = {
  HomeScreen: undefined;
};

export type FeedStackParamList = {
  FeedScreen: undefined;
};

export type ProfileStackParamList = {
  MyProfileScreen: undefined;
};

// Screen Props Types
export type RootStackScreenProps<Screen extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, Screen>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type TabScreenProps<Screen extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, Screen>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Global declaration for type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
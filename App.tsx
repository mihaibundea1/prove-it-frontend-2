// App.tsx
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Constants from 'expo-constants';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import { tokenCache } from './src/utils/tokenCache';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="SignIn"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'white' }
            }}
          >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
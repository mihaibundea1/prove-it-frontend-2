// App.tsx
import React from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { tokenCache } from './src/utils/tokenCache';
import AppNavigator from './src/navigation/AppNavigator';
// Cache database - sqlite

export default function App() {
  const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

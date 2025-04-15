import React, { useState } from 'react';
import { Text, TouchableOpacity, Image, View, Alert } from 'react-native';
import { useOAuth, useSession } from '@clerk/clerk-expo';
import { useUserContext } from '@/contexts/UserContext';
import { useWarmUpBrowser } from "../../hooks/auth/useWarmUpBrowser";

export function OAuthButtons() {
  useWarmUpBrowser();
  const userService = useUserContext();
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const sanitizeUsername = (username: string): string => {
    return username.replace(/[^a-zA-Z0-9_-]/g, '');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      if (!startOAuthFlow) {
        throw new Error("OAuth flow is not available. Please try again later.");
      }

      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        if (typeof setActive === 'function') {
          await setActive({ session: createdSessionId });
        } else {
          throw new Error("setActive is undefined");
        }

        const userId = signIn?.id || signUp?.createdUserId || session?.user?.id;
        if (!userId) {
          throw new Error("Missing user ID after authentication");
        }

        console.log("Checking if user exists with ID:", userId);

        try {
          let user = await userService.fetchUserProfile(userId);

          if (!user) {
            console.log("User not found, registering...");
            const registrationResult = await userService.registerUser(userId);
            if (!registrationResult) {
              Alert.alert("Warning", "Authentication succeeded, but profile setup failed.");
            } else {
              // Fetch the newly registered user and store in context
              user = await userService.fetchUserProfile(userId);
            }
          }

          if (user) {
            console.log("User exists, proceeding...");
          }
        } catch (fetchError) {
          console.error("Error fetching user profile:", fetchError);
          Alert.alert("Error", "Failed to verify user profile.");
          return;
        }

        Alert.alert("Success", "Logged in with Google successfully!");
        return;
      }

      if (signUp && signUp.status === "missing_requirements") {
        const email = signUp.emailAddress;
        const defaultUsername = email ? email.split("@")[0] : "user";
        const sanitizedUsername = sanitizeUsername(defaultUsername) || "user";

        const updatedSignUp = await signUp.update({ username: sanitizedUsername });

        if (updatedSignUp.createdSessionId && typeof setActive === 'function') {
          await setActive({ session: updatedSignUp.createdSessionId });

          const userId = updatedSignUp.createdUserId || signIn?.id || session?.user?.id;
          if (!userId) throw new Error("Missing user ID after sign-up update");

          try {
            let user = await userService.fetchUserProfile(userId);
            if (!user) {
              console.log("User not found, registering...");
              const registrationResult = await userService.registerUser(userId);
              if (!registrationResult) {
                Alert.alert("Warning", "Profile setup failed.");
              } else {
                user = await userService.fetchUserProfile(userId);
              }
            }

            if (user) {
              console.log("User saved in context after sign-up.");
            }
          } catch (fetchError) {
            console.error("Error checking user existence:", fetchError);
            Alert.alert("Error", "Failed to verify user profile.");
            return;
          }

          Alert.alert("Success", "Logged in with Google successfully after completing sign-up requirements!");
          return;
        } else {
          console.error("After updating missing requirements, no session was created:", updatedSignUp);
          Alert.alert("Error", "Failed to complete sign-up after missing requirements.");
          return;
        }
      }

      console.error("OAuth flow result does not contain a session ID:", { createdSessionId, signIn, signUp });
      Alert.alert("Error", "The account could not be created. Please try again.");
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      Alert.alert("Error", err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full space-y-3">
      <TouchableOpacity
        className={`w-full h-12 border border-gray-200 rounded-lg flex-row items-center justify-center space-x-2 bg-white ${
          isLoading ? 'opacity-70' : ''
        }`}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Image 
          source={{ uri: 'https://www.google.com/favicon.ico' }}
          className="w-5 h-5"
        />
        <Text className="text-gray-700 font-medium">
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

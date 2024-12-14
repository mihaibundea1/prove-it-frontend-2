import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, Image, View } from "react-native";
import { useOAuth, useSession } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/auth/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  useWarmUpBrowser();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { session } = useSession();

  const onGooglePress = React.useCallback(async () => {
    try {
      const result = await googleAuth();
      if (!result) return;
      
      const { createdSessionId, setActive } = result;
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        console.log("OAuth successful, session created:", createdSessionId);
      } else {
        console.log("No session created from OAuth");
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, [googleAuth]);

  const onApplePress = React.useCallback(async () => {
    try {
      const result = await appleAuth();
      if (!result) return;
      
      const { createdSessionId, setActive } = result;
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        console.log("OAuth successful, session created:", createdSessionId);
      } else {
        console.log("No session created from OAuth");
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, [appleAuth]);

  // Rest of your component remains the same
  return (
    <View className="w-full space-y-3">
      <TouchableOpacity
        className="w-full h-12 border border-gray-200 rounded-lg flex-row items-center justify-center space-x-2 bg-white"
        onPress={onGooglePress}
      >
        <Image 
          source={{ uri: 'https://www.google.com/favicon.ico' }}
          className="w-5 h-5"
        />
        <Text className="text-gray-700 font-medium">Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full h-12 border border-gray-200 rounded-lg flex-row items-center justify-center space-x-2 bg-white"
        onPress={onApplePress}
      >
        <Image 
          source={{ uri: 'https://www.apple.com/favicon.ico' }}
          className="w-5 h-5"
        />
        <Text className="text-gray-700 font-medium">Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}
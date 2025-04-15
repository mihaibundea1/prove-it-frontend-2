import React, { useState, useEffect } from "react";
import { useSession } from "@clerk/clerk-expo";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./stacks/AuthStack";
import TabNavigator from "./TabNavigator";
import IntroScreen from "@/screens/intro/IntroScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoaded, session } = useSession();
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcomeVisible(false);
    }, 2500); // WelcomeScreen va fi vizibil 2.5 secunde

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || isWelcomeVisible) {
    return <IntroScreen />;
  }

  const initialRoute = session ? "MainTabs" : "AuthStack";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {session ? (
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ animation: "none" }}
        />
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ animation: "none" }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

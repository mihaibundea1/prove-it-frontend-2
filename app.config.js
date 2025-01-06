// app.config.js
module.exports = {
  expo: {
    name: "prove-it-frontend2",
    slug: "prove-it-frontend2",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    scheme: "your-app-scheme",
    plugins: [
      [
        "expo-sqlite", // Plugin name
        {
          enableFTS: true,
          useSQLCipher: true,
          android: {
            enableFTS: false, // Android-specific configuration
            useSQLCipher: false
          },
          ios: {
            customBuildFlags: [
              "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1" // iOS-specific configuration
            ]
          }
        }
      ]
    ]
  }
};

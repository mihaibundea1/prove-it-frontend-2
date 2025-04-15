import 'dotenv/config';  // Import dotenv


// console.log("Clerk Key:", process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);
// console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);


module.exports = {
  expo: {
    name: "FitverseHub",
    slug: "fitversehub",
    sdkVersion: "52.0.0",
    version: "1.0.2",
    minSdkVersion: 28,
    targetSdkVersion: 35,
    orientation: "portrait",
    icon: "./assets/images/logo512.png",
    userInterfaceStyle: "automatic",
    jsEngine: 'hermes',
    splash: {
      image: "./assets/images/logo512.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    notification: {
      icon: "./assets/images/logo512.png",
      color: "#E63600"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["audio"]
      },
      usesNonExemptEncryption: false
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo512.png",
        backgroundColor: "#ffffff"
      },
      newArchitecture: {
        enabled: true,
      },
      hermes: true,
      package: "com.fitversehub.app", // updated identifier previously mihaibundea1
      versionCode: 1,
      softwareKeyboardLayoutMode: "pan",
      permissions: [
        "INTERNET",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
	extra: {
	  eas: {
		projectId: "d6207999-1515-4bab-aa13-5f7954b096cf"
	  },
	  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
	  apiUrl: process.env.EXPO_PUBLIC_API_URL || ""
	},
    scheme: "fitversehub",
    plugins: [
      [
        "expo-file-system",
        {
          filePermissions: true
        }
      ],
      [
        "expo-sqlite",
        {
          enableFTS: true,
          useSQLCipher: true,
          android: {
            enableFTS: false,
            useSQLCipher: false
          },
          ios: {
            customBuildFlags: [
              "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1"
            ]
          }
        }
      ]
    ],
    owner: "fitversehub",
  }
};

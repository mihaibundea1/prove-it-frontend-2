import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const EditProfileScreen = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize user data when available
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
      setProfileImage(user.imageUrl || "");
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSave = async () => {
    if (!user) {
      console.error("No user found");
      return;
    }

    setIsUpdating(true);
    setShowSuccess(false);

    try {
      const [firstName, lastName] = fullName.split(" ", 2);


      await user.update({
        firstName: firstName || "",
        lastName: lastName || "",
        username: username || "",
      });

      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImagePick = async () => {
    if (!user) {
      console.error("No user found");
      return;
    }

    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Use MediaTypeOptions instead of MediaType
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      try {
        const response = await fetch(pickerResult.assets[0].uri);
        const blob = await response.blob();

        await user.setProfileImage({ file: blob });
        setProfileImage(user.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {showSuccess && (
          <View className="mb-4 bg-green-100 border border-green-400 rounded-lg p-3">
            <Text className="text-green-700 text-center">
              Profile updated successfully!
            </Text>
          </View>
        )}

        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={{
                uri: profileImage || "https://placeholder.com/150",
              }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-[#e63600] p-2 rounded-full"
              onPress={handleImagePick}
            >
              <Camera color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            className="bg-gray-100 p-3 rounded-lg text-black"
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="bg-gray-100 p-3 rounded-lg text-black"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`py-3 px-6 rounded-lg items-center ${
            isUpdating ? "bg-gray-400" : "bg-[#e63600]"
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {isUpdating ? "Updating..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

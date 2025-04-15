import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Image as ImageIcon, Send } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useFeed } from "@/contexts/FeedContext";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import LoadingOverlay from "@/components/shared/LoadingOverlay";

const NewPostScreen = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState("");
  const { createPost: handleCreatePost } = useFeed();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { user } = useUser();
  const userId = user?.id;
  const username = user?.username;

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!description.trim() || !imageUri || !userId || !username) {
      Alert.alert("Error", "Please provide a description and image.");
      return;
    }

    const formData = new FormData();
    formData.append("credentials_id", userId);
    formData.append("username", username);
    formData.append("description", description);

    const filename = imageUri.split("/").pop() || "image.jpg";
    const fileType = filename.split(".").pop()?.toLowerCase() || "jpg";

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
    } as any);

    try {
      await handleCreatePost(formData);
      navigation.goBack();
    } catch (error) {
      console.error("Error uploading post:", error);
      Alert.alert("Upload Failed", "Something went wrong while creating the post.");
    } finally {
    }
  };

  return (
    <LinearGradient colors={["#FF512F", "#DD2476"]} className="flex-1">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-4 py-6" style={{ marginTop: hp(5) }}>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft size={wp(6)} color="white" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-white">New Post</Text>
              <TouchableOpacity onPress={handlePost}>
                <Send size={wp(6)} color="white" />
              </TouchableOpacity>
            </View>

            {/* Image Picker */}
            <TouchableOpacity
              onPress={handleImagePick}
              className="bg-white/20 rounded-3xl p-4 items-center justify-center mb-6"
              style={{ height: hp(30) }}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <ImageIcon size={wp(12)} color="white" />
                  <Text className="text-white mt-2 text-lg">Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Description Input */}
            <View className="bg-white/20 rounded-3xl p-4 mb-6">
              <TextInput
                className="text-white text-lg"
                placeholder="Write a caption..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      <LoadingOverlay />
    </LinearGradient>
  );
};

export default NewPostScreen;

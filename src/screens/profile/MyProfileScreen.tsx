import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/types/navigationTypes";
import { LogOut, Mail, Phone } from "lucide-react-native";

type Props = NativeStackScreenProps<ProfileStackParamList, "MyProfileScreen">;

export default function SafeMyProfileScreen(props: Props) {
  return (
    <>
      <SignedIn>
        <MyProfileScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Unauthorized</Text>
        </View>
      </SignedOut>
    </>
  );
}

function MyProfileScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const { user } = useUser();

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err: any) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <View className="items-center mb-8">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-32 h-32 rounded-full"
        />
        <Text className="text-2xl font-bold mt-4">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-gray-500">@{user?.username}</Text>
      </View>

      <View className="space-y-4">
        <View className="flex-row items-center space-x-3">
          <Mail size={20} color="#4B5563" />
          <Text className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        {user?.phoneNumbers?.[0] && (
          <View className="flex-row items-center space-x-3">
            <Phone size={20} color="#4B5563" />
            <Text className="text-gray-600">{user.phoneNumbers[0].phoneNumber}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={onSignOutPress}
        className="flex-row items-center justify-center space-x-2 bg-red-500 px-6 py-3 rounded-lg mt-8"
      >
        <LogOut size={20} color="white" />
        <Text className="text-white font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
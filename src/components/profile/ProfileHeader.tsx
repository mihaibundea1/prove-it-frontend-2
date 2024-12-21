import React from 'react';
import { View, Text, Image } from 'react-native';

interface ProfileHeaderProps {
  imageUrl: string;
  fullName: string;
  emailAddress: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ imageUrl, fullName, emailAddress }) => {
  return (
    <View className="flex items-center mb-4 pt-4">  
      <View className="w-24 h-24 rounded-full border-2 border-[#e63600] mb-4">
        <Image 
          source={{ uri: imageUrl }} 
          className="w-full h-full rounded-full"
        />
      </View>
      <Text className="text-2xl font-bold text-black">{fullName}</Text>
      <Text className="text-gray-500 mb-4">{emailAddress}</Text>
    </View>
  );
};

export default ProfileHeader;

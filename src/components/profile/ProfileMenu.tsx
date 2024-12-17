import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, LogOut, Target, Calendar } from 'lucide-react-native';

interface ProfileMenuProps {
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const profileMenuItems = [
    { 
      label: 'Fitness Goals', 
      icon: <Target color="#e63600" size={24} />, 
      onPress: () => {/* Navigate to Goals */}
    },
    { 
      label: 'Workout Calendar', 
      icon: <Calendar color="#e63600" size={24} />, 
      onPress: () => {/* Navigate to Calendar */}
    },
    { 
      label: 'Logout', 
      icon: <LogOut color="#e63600" size={24} />, 
      onPress: onLogout
    }
  ];

  return (
    <View className="w-full mt-4">
      {profileMenuItems.map((item, index) => (
        <TouchableOpacity 
          key={index}
          onPress={item.onPress}
          className="flex-row justify-between items-center p-4 border-b border-gray-200"
        >
          <View className="flex-row items-center">
            {item.icon}
            <Text className="ml-4 text-black text-base">{item.label}</Text>
          </View>
          <ChevronRight color="#666" size={24} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProfileMenu;

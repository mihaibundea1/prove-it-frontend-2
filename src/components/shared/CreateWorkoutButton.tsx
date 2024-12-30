// CreateWorkoutButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface CreateWorkoutButtonProps {
  selectedCount: number;
  onPress: () => void;
}

export const CreateWorkoutButton: React.FC<CreateWorkoutButtonProps> = ({ 
  selectedCount, 
  onPress 
}) => {
  if (selectedCount === 0) return null;

  return (
    <TouchableOpacity
      className="absolute bottom-8 left-4 right-4 bg-[#E63600] py-4 rounded-lg flex-row justify-center items-center shadow-lg"
      onPress={onPress}
    >
      <Dumbbell color="white" size={hp(3)} className="mr-2" />
      <Text className="text-white font-bold" style={{ fontSize: hp(2) }}>
        Create Workout ({selectedCount})
      </Text>
    </TouchableOpacity>
  );
};
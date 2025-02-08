import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  // Define your navigation params here
};

type WorkoutHeaderProps = {
  onSave: () => void;
  isSaving: boolean;
};

export const WorkoutHeader = ({ onSave, isSaving }: WorkoutHeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View
      className="flex-row justify-between items-center border-b border-gray-300"
      style={{ padding: wp(4), paddingTop: hp(1.5) }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className={`text-black text-[${hp(2.2)}px]`}>Cancel</Text>
      </TouchableOpacity>

      <Text className={`text-[${hp(2.2)}px] font-bold`}>Create Routine</Text>

      <TouchableOpacity
        onPress={onSave}
        disabled={isSaving}
        className={`${isSaving ? 'bg-gray-500' : 'bg-orange-600'} py-2 px-4 rounded-lg justify-center items-center`}
        style={{ elevation: 3 }}
      >
        <Text className={`text-white text-[${hp(2.2)}px] font-medium`}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};
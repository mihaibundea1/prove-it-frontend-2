// components/ActionButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ActionButtonProps {
  isSelected: boolean;
  onPress: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ isSelected, onPress }) => (
  <TouchableOpacity
    style={{
      position: 'absolute',
      bottom: hp(2),
      left: wp(4),
      right: wp(4),
      backgroundColor: isSelected ? '#4CAF50' : '#E63600',
      paddingVertical: hp(2),
      borderRadius: wp(2),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}
    onPress={onPress}
  >
    <Feather
      name={isSelected ? "check-circle" : "plus-circle"}
      size={hp(3)}
      color="white"
      style={{ marginRight: wp(2) }}
    />
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: hp(2) }}>
      {isSelected ? 'Remove from Workout' : 'Add to Workout'}
    </Text>
  </TouchableOpacity>
);
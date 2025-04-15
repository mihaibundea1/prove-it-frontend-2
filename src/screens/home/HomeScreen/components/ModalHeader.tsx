// ModalHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ModalHeaderProps {
  onClose: () => void;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose, slideAnim, fadeAnim }) => {
  const insets = useSafeAreaInsets();
  
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      slideAnim.setValue(0);
    });
  };
  
  return (
    <View 
      className="flex-row items-center justify-between px-5 border-b border-gray-200" 
      style={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
    >
      <TouchableOpacity
        onPress={handleClose}
        className="p-1"
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Text className="text-2xl text-gray-500 leading-6">✕</Text>
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center">
        <Text className="text-base font-semibold text-black">Workouts</Text>
      </View>
      
      {/* Empty view for layout balance */}
      <View className="w-6" />
    </View>
  );
};

export default ModalHeader;
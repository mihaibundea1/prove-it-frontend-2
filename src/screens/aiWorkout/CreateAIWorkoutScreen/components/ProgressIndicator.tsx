import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current; // Animation value for progress

  // Animate the progress bar when `currentStep` changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / totalSteps) * 100, // Calculate percentage progress
      duration: 300, // Animation duration
      easing: Easing.ease, // Smooth easing
      useNativeDriver: false, // `width` animation doesn't support native driver
    }).start();
  }, [currentStep, totalSteps]);

  return (
    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <Animated.View
        className="h-full bg-[#E63600] rounded-full"
        style={{
          width: progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'], // Animate from 0% to 100%
          }),
        }}
      />
    </View>
  );
};

export default ProgressIndicator;
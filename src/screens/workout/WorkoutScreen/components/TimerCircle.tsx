// TimerCircle.tsx
import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface TimerCircleProps {
  duration: number;
  isActive: boolean;
  formatDuration: (duration: number) => string;
  pulseAnim: Animated.Value;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({ 
  duration, 
  formatDuration, 
  pulseAnim 
}) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: duration / 60,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [duration]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View className="items-center justify-center mt-8">
      <Animated.View 
        style={{
          transform: [{ scale: pulseAnim }],
          shadowColor: '#E63600',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        }}
      >
        <Svg height="160" width="160">
          <Circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#EEE"
            strokeWidth="8"
            fill="transparent"
          />
          <AnimatedCircle
            cx="80"
            cy="80"
            r={radius}
            stroke="#E63600"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="80, 80"
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-3xl font-bold text-gray-900">
            {formatDuration(duration)}
          </Text>
          <Text className="text-gray-500 mt-1">Duration</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
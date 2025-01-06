import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronRightIcon } from 'lucide-react-native';
import { styles } from './styles';
import { ExerciseCardProps } from '@/types/exercise.types';

const logoImage = require('../../../../../assets/logo_with_background_rounded.png');

export const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(({ 
  exercise, 
  onPress, 
  onInfoPress, 
  isSelected 
}) => {
  const isHighlightedRef = useRef(false); // Ref for tracking highlight state without causing re-renders
  const [imageLoadError, setImageLoadError] = useState(false);

  const translateXAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  const capitalizedTitle = useMemo(() => {
    if (!exercise.title) return '';
    return exercise.title.charAt(0).toUpperCase() + exercise.title.slice(1);
  }, [exercise.title]);

  // Memoize image source to avoid recomputing on each render
  const imageSource = useMemo(() => {
    if (imageLoadError) return logoImage;
    if (exercise.thumbnail) return { uri: exercise.thumbnail };
    if (exercise.images?.[0]) return { uri: exercise.images[0] };
    return logoImage;
  }, [exercise.thumbnail, exercise.images, imageLoadError]);

  // Combine the animations and memoize it
  const animation = useMemo(() => {
    return Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isSelected || isHighlightedRef.current ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(widthAnim, {
        toValue: isSelected || isHighlightedRef.current ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      })
    ]);
  }, [isSelected, fadeAnim, widthAnim]);

  // Trigger animation when selection or highlight changes
  useEffect(() => {
    animation.start();
  }, [animation]);

  const handlePressIn = useCallback(() => {
    isHighlightedRef.current = true;
    Animated.timing(translateXAnim, {
      toValue: wp(1),
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [translateXAnim]);

  const handlePressOut = useCallback(() => {
    isHighlightedRef.current = false;
    Animated.timing(translateXAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [translateXAnim]);

  const handleImageError = useCallback(() => {
    if (!imageLoadError) {
      setImageLoadError(true);
    }
  }, [imageLoadError]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="relative"
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX: translateXAnim }] }]}
      >
        <Animated.View
          style={[
            styles.selectionIndicator,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['1.2%', '2%'],
              }),
              opacity: fadeAnim,
            }
          ]}
        />
        <Image
          source={imageSource}
          className="w-[15%] h-[15%] rounded-full mr-4 bg-gray-100"
          onError={handleImageError}
          defaultSource={logoImage}
        />
        <View className="flex-1">
          <Text
            className="text-black font-bold"
            style={{ fontSize: hp(2) }}
            numberOfLines={2}
          >
            {capitalizedTitle}
          </Text>
        </View>
        <TouchableOpacity onPress={onInfoPress} className="p-2">
          <ChevronRightIcon size={hp(4)} color="gray" />
        </TouchableOpacity>
      </Animated.View>
    </Pressable>
  );
});

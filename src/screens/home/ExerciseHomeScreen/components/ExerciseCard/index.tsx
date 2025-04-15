import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronRightIcon } from 'lucide-react-native';
import { styles } from './styles';
import { ExerciseCardProps } from '@/types/exercise.types';

const logoImage = require('../../../../../assets/logo_with_background_rounded.png');

const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(({ 
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
  
    if (typeof exercise.thumbnail === "string") {
      return { uri: `data:image/jpeg;base64,${exercise.thumbnail}` };
    }
  
    if (exercise.thumbnail && typeof exercise.thumbnail === "object") {
      return { uri: exercise.thumbnail.uri };
    }
  
    if (exercise.images?.length) {
      return { uri: exercise.images[0] };
    }
  
    return logoImage;
  }, [exercise.thumbnail, exercise.images, imageLoadError]);
  
  

  // Combine the animations and memoize it
  const animation = useMemo(() => {
    return Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isSelected ? 1 : 0,  // Remove isHighlightedRef.current
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(widthAnim, {
        toValue: isSelected ? 1 : 0,  // Remove isHighlightedRef.current
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
      style={{ position: 'relative' }}
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
        
        {/* Image section */}
        <Image
          source={imageSource}
          style={{
            width: hp(8), // Adjust the size of the image
            height: hp(8), // Adjust the size of the image
            borderRadius: hp(4), // Make the image circular
            marginRight: wp(4),
            backgroundColor: 'gray', // fallback color when loading
          }}
          onError={handleImageError}
        />
        
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: hp(2),
              fontWeight: 'bold',
              color: 'black',
            }}
            numberOfLines={2}
          >
            {capitalizedTitle}
          </Text>
        </View>
        
        <TouchableOpacity onPress={onInfoPress} style={{ padding: wp(2) }}>
          <ChevronRightIcon size={hp(4)} color="gray" />
        </TouchableOpacity>
      </Animated.View>
    </Pressable>
  );
});
export { ExerciseCard };

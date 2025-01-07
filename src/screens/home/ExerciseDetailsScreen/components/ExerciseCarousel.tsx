// components/ExerciseCarousel.tsx
import React from 'react';
import { Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ExerciseCarouselProps {
  images: string[];
  carouselHeight: number;
}

export const ExerciseCarousel: React.FC<ExerciseCarouselProps> = ({ images, carouselHeight }) => {
  if (!images.length) return null;

  return (
    <Carousel
      loop
      width={wp(100)}
      height={carouselHeight}
      autoPlay={true}
      data={images}
      scrollAnimationDuration={1500}
      renderItem={({ item }: { item: string }) => (
        <Image
          source={{ uri: item }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain'
          }}
        />
      )}
    />
  );
};
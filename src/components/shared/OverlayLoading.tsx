import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface OverlayLoadingProps {
  loading?: boolean;
}

export const OverlayLoading: React.FC<OverlayLoadingProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <View className="absolute inset-0 justify-center items-center z-50">
      <View className="bg-black/50 rounded-lg p-5">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
};
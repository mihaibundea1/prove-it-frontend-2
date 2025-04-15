import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { emitter } from '@/services/api/core/events';

const LoadingOverlay: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const handleEnd = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setLoading(false));
    };

    emitter.on('loading:start', handleStart);
    emitter.on('loading:end', handleEnd);

    return () => {
      emitter.off('loading:start', handleStart);
      emitter.off('loading:end', handleEnd);
    };
  }, [opacity]);

  if (!loading) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ee4444" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default LoadingOverlay;

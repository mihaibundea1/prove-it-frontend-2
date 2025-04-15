import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

type ScheduleOptionButtonProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  variant?: 'default' | 'ai';
};

const ScheduleOptionButton = ({
  icon,
  title,
  subtitle,
  onPress,
  variant = 'default',
}: ScheduleOptionButtonProps) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'default' && styles.defaultButton,
      variant === 'ai' && styles.aiButton,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.content}>
      <View style={[
        styles.iconContainer,
        variant === 'default' && styles.defaultIconContainer,
        variant === 'ai' && styles.aiIconContainer
      ]}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, variant === 'ai' && styles.aiTitle]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, variant === 'ai' && styles.aiSubtitle]}>
          {subtitle}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  defaultButton: {
    borderWidth: 1,
    borderColor: '#eee',
  },
  aiButton: {
    borderWidth: 0,
    backgroundColor: 'transparent', // Make sure the AI button doesn't overlay the gradient
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconContainer: {
    backgroundColor: 'rgba(238, 68, 68, 0.05)',
    borderRadius: 20,
  },
  aiIconContainer: {
    // No background for the AI icon to let gradient show through
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  aiTitle: {
    color: 'white',
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  aiSubtitle: {
    color: 'rgba(255,255,255,0.9)',
  },
});

export default ScheduleOptionButton;
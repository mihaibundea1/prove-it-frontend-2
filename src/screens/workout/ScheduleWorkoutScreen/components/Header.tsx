import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle: string;
};

const Header = ({ title, subtitle }: HeaderProps) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold', // Different font weight naming for iOS/Android
    color: '#2D2D2D',
    marginBottom: 8,
    letterSpacing: -0.5, // Slightly tighter letter spacing for modern look
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
  },
});

export default Header;
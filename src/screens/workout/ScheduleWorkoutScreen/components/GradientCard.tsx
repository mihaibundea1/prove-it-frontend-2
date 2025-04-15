import React, { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Platform } from 'react-native';

type GradientCardProps = {
    children: ReactNode;
};

const GradientCard = ({ children }: GradientCardProps) => (
    <LinearGradient
        colors={['#ee4444', '#ff7033']} // Back to red gradient but more vibrant
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
    >
        {children}
    </LinearGradient>
);

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#ee4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // Enhanced for Android
        ...Platform.select({
            ios: {
                shadowColor: '#ee4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});

export default GradientCard;
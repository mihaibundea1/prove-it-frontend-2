import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, style, className }) => {
  return (
    <View 
      className={`bg-white rounded-t-3xl overflow-hidden flex-1 ${className || ''}`} 
      style={style}
    >
      {children}
    </View>
  );
};

export default Card;
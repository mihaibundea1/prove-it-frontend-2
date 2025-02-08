// TimerPicker Component
import React from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export type TimerOption = {
  label: string;
  value: string;
};

type TimerPickerProps = {
  visible: boolean;
  onClose: () => void;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options?: TimerOption[];
};

const generateTimerOptions = (): TimerOption[] => {
  const options: TimerOption[] = [{ label: 'OFF', value: 'OFF' }];
  for (let i = 5; i <= 60; i += 5) {
    options.push({ label: `${i} sec`, value: `${i} sec` });
  }
  for (let i = 75; i <= 300; i += 15) {
    options.push({ label: `${i} sec`, value: `${i} sec` });
  }
  return options;
};

export const TimerPicker = ({ 
  visible,
  onClose,
  selectedValue,
  onValueChange,
  options = generateTimerOptions()
}: TimerPickerProps) => (
  <Modal visible={visible} transparent animationType="slide">
    <SafeAreaView className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white p-5 rounded-xl w-80">
        <Text className="text-lg mb-2">Select Rest Timer</Text>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          {options.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
        <TouchableOpacity onPress={onClose} className="mt-2">
          <Text className="text-blue-500 text-center text-lg">Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </Modal>
);

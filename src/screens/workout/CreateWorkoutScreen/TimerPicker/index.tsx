// TimerPicker.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
  const options: TimerOption[] = [{ label: "OFF", value: "OFF" }];
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
  options = generateTimerOptions(),
}: TimerPickerProps) => (
  <Modal visible={visible} transparent animationType="slide">
    <SafeAreaView className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-3xl">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-[#ee4444] font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold">Rest Timer</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-[#ee4444] font-semibold text-lg">Done</Text>
          </TouchableOpacity>
        </View>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          itemStyle={{ height: 150, color: "#000" }}
        >
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </SafeAreaView>
  </Modal>
);

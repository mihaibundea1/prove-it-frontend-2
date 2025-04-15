import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

interface MeasurementFormProps {
  onUpdate: (data: { height: number; weight: number; measurement_system: 'imperial' | 'metric' }) => void;
  initialData?: { height: number; weight: number; measurement_system: 'imperial' | 'metric' };
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onUpdate, initialData }) => {
  const [measurementSystem, setMeasurementSystem] = useState<'imperial' | 'metric'>(initialData?.measurement_system || 'metric');
  const [height, setHeight] = useState(initialData?.height || 170);
  const [weight, setWeight] = useState(initialData?.weight || 70);

  useEffect(() => {
    onUpdate({
      height: measurementSystem === 'metric' ? height : Math.round(height * 2.54),
      weight: measurementSystem === 'metric' ? weight : Math.round(weight * 0.453592),
      measurement_system: measurementSystem
    });
  }, [height, weight, measurementSystem]);

  // System selector buttons
  const SystemButton = ({ system, label }: { system: 'metric' | 'imperial', label: string }) => (
    <TouchableOpacity
      className={`flex-1 py-3 rounded-full mx-1 ${measurementSystem === system ? 'bg-[#E63600]' : 'bg-gray-100'}`}
      onPress={() => setMeasurementSystem(system)}
    >
      <Text className={`text-center font-semibold ${measurementSystem === system ? 'text-white' : 'text-gray-600'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#f8f9fa', '#ffffff']}
      className="p-6 rounded-2xl shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10
      }}
    >
      <View className="mb-6">
        {/* System Selector */}
        <View className="flex-row justify-between">
          <SystemButton system="metric" label="METRIC" />
          <SystemButton system="imperial" label="IMPERIAL" />
        </View>
      </View>

      {/* Height Input */}
      <View className="mb-8">
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg text-gray-600">
            {measurementSystem === 'metric' ? 'Height (cm)' : 'Height'}
          </Text>
          <Text className="text-lg font-semibold text-[#E63600]">
            {measurementSystem === 'metric' 
              ? `${height}cm`
              : `${Math.floor(height/30.48)}'${Math.round((height%30.48)/2.54)}"`}
          </Text>
        </View>
        <Slider
          minimumValue={measurementSystem === 'metric' ? 100 : 48}
          maximumValue={measurementSystem === 'metric' ? 250 : 96}
          step={1}
          value={measurementSystem === 'metric' ? height : height/2.54}
          onValueChange={val => setHeight(measurementSystem === 'metric' ? val : val * 2.54)}
          minimumTrackTintColor="#E63600"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#E63600"
        />
      </View>

      {/* Weight Input */}
      <View className="mb-8">
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg text-gray-600">
            {measurementSystem === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
          </Text>
          <Text className="text-lg font-semibold text-[#E63600]">
            {measurementSystem === 'metric' ? weight : Math.round(weight / 0.453592)}
            {measurementSystem === 'metric' ? 'kg' : 'lbs'}
          </Text>
        </View>
        <Slider
          minimumValue={measurementSystem === 'metric' ? 30 : 66}
          maximumValue={measurementSystem === 'metric' ? 200 : 440}
          step={1}
          value={measurementSystem === 'metric' ? weight : weight / 0.453592}
          onValueChange={val => setWeight(measurementSystem === 'metric' ? val : val * 0.453592)}
          minimumTrackTintColor="#E63600"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#E63600"
        />
      </View>
    </LinearGradient>
  );
};

export default MeasurementForm;
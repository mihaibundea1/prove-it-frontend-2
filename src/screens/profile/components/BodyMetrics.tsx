import React from "react"
import { View, Text, TouchableOpacity } from "react-native"

interface BodyMetricsProps {
  weight: number
  height: number
  bmi: number
  onUpdatePress: () => void
}

const BodyMetrics: React.FC<BodyMetricsProps> = ({ weight, height, bmi, onUpdatePress }) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">Body Metrics</Text>
        <TouchableOpacity onPress={onUpdatePress}>
          <Text className="text-[#E63600] font-medium">Update</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <View className="flex-row justify-between mb-4">
          <View className="items-center">
            <Text className="text-sm text-gray-500 mb-1">Weight</Text>
            <Text className="text-xl font-bold text-gray-800">{weight} kg</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-500 mb-1">Height</Text>
            <Text className="text-xl font-bold text-gray-800">{height} cm</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-gray-500 mb-1">BMI</Text>
            <Text className="text-xl font-bold text-gray-800">{bmi}</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-gray-100 rounded-lg p-3 flex-row items-center justify-center">
          <Text className="text-[#E63600] font-medium">View Detailed Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default BodyMetrics

import { View, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

type RootStackParamList = {
  // Define your navigation params here
}

type WorkoutHeaderProps = {
  onSave: () => void
  isSaving: boolean
}

export const WorkoutHeader = ({ onSave, isSaving }: WorkoutHeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <View className="flex-row justify-between items-center bg-white px-4 py-3 border-b border-gray-200">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <Text className="text-gray-600 text-base">Cancel</Text>
      </TouchableOpacity>

      <View className="flex-1 items-center">
        <Text className="text-xl font-bold">Create Routine</Text>
      </View>

      <TouchableOpacity
        onPress={onSave}
        disabled={isSaving}
        className={`bg-[#ee4444] px-3 py-2 rounded-lg ${isSaving ? "opacity-50" : ""}`}
      >
        <Text className="text-white text-base font-semibold">{isSaving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  )
}


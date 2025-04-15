import { TextInput, View, Text } from "react-native"

type WorkoutTitleProps = {
  routineName: string
  setRoutineName: (text: string) => void
}

export const WorkoutTitle = ({ routineName, setRoutineName }: WorkoutTitleProps) => (
  <View className="mb-6">
    <Text className="text-sm font-medium text-gray-500 mb-1">Routine Name</Text>
    <TextInput
      placeholder="Enter Routine Title"
      value={routineName}
      onChangeText={setRoutineName}
      className="py-2 px-4 rounded-lg bg-gray-100 text-base font-medium"
      placeholderTextColor="#999"
    />
  </View>
)


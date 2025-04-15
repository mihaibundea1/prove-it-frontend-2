import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Using Expo icons instead of SVG

interface GenderPromptProps {
  selectedGender: 'male' | 'female' | null;
  onSelect: (gender: 'male' | 'female') => void;
}


const GenderPrompt: React.FC<GenderPromptProps> = ({ selectedGender, onSelect }) => {
    return (
    <View className="mt-8 px-4">
      <Text className="text-xl font-semibold text-center mb-6 text-gray-800">
        Select your gender
      </Text>
      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity
          onPress={() => onSelect('male')}
          className={`
            py-4 px-6 rounded-full flex-row items-center justify-center space-x-2
            ${selectedGender === 'male' 
              ? 'bg-indigo-600' 
              : 'bg-gray-100'
            }
          `}
          style={{
            width: 130,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedGender === 'male' ? 0.3 : 0,
            shadowRadius: 8,
            elevation: selectedGender === 'male' ? 4 : 0,
          }}
        >
          <Ionicons 
            name="male" 
            size={24} 
            color={selectedGender === 'male' ? 'white' : '#6B7280'} 
          />
          <Text 
            className={`font-medium text-base ${
              selectedGender === 'male' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Male
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onSelect('female')}
          className={`
            py-4 px-6 rounded-full flex-row items-center justify-center space-x-2
            ${selectedGender === 'female' 
              ? 'bg-purple-600' 
              : 'bg-gray-100'
            }
          `}
          style={{
            width: 130,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedGender === 'female' ? 0.3 : 0,
            shadowRadius: 8,
            elevation: selectedGender === 'female' ? 4 : 0,
          }}
        >
          <Ionicons 
            name="female" 
            size={24} 
            color={selectedGender === 'female' ? 'white' : '#6B7280'} 
          />
          <Text 
            className={`font-medium text-base ${
              selectedGender === 'female' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GenderPrompt;
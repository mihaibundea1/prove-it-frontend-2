import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
const logoImage = require("@/assets/logo_with_background_rounded.png");
import { Exercise } from "@/types/exercise.types";

export type ExerciseItemProps = {
  index: number;
  item: Exercise;
  drag: () => void;
  isActive: boolean;
  onDelete: (exerciseIndex: number) => void;
  onTimerPress: (exerciseIndex: number) => void;
  onInputChange: (
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveAllSets: (exerciseIndex: number) => void;
};

export const ExerciseItem = ({
  index,
  item,
  drag,
  isActive,
  onDelete,
  onTimerPress,
  onInputChange,
  onAddSet,
  onRemoveAllSets,
}: ExerciseItemProps) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageError = useCallback(() => {
    if (!imageLoadError) {
      setImageLoadError(true);
    }
  }, [imageLoadError]);

  const imageSource = useMemo(() => {
    if (imageLoadError) return logoImage;

    if (typeof item.thumbnail === "string") {
      return { uri: `data:image/jpeg;base64,${item.thumbnail}` };
    }

    if (item.thumbnail && typeof item.thumbnail === "object") {
      return { uri: item.thumbnail.uri };
    }

    if (item.images?.length) {
      return { uri: item.images[0] };
    }

    return logoImage;
  }, [item.thumbnail, item.images, imageLoadError]);

  return (
    <TouchableOpacity
      onLongPress={drag}
      delayLongPress={150}
      className={`bg-white rounded-2xl shadow-sm mb-6 ${isActive ? "border-2 border-[#ee4444]" : ""}`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onLongPress={drag} className="p-2">
          <Text className="text-2xl">≡</Text>
        </TouchableOpacity>

        <Image
          source={imageSource}
          style={{
            width: hp(8),
            height: hp(8),
            borderRadius: hp(4),
            marginRight: wp(4),
            backgroundColor: "gray",
          }}
          onError={handleImageError}
        />

        <Text className="text-lg font-semibold flex-1 ml-4">{item.title}</Text>
        <TouchableOpacity onPress={() => onDelete(index)} className="p-2">
          <Text className="text-2xl text-[#ee4444]">×</Text>
        </TouchableOpacity>
      </View>

      {/* Expand/Collapse Button */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="p-3 bg-gray-200 rounded-b-2xl flex-row justify-center items-center"
      >
        <Text className="text-gray-700 font-medium">{isExpanded ? "Hide Details ▲" : "Show Details ▼"}</Text>
      </TouchableOpacity>

      {/* Details (Hidden by Default) */}
      {isExpanded && (
        <>
          {/* Sets */}
          <View className="p-4">
            {(item.sets ?? []).map((set, setIndex) => (
              <View key={setIndex} className="flex-row items-center mb-3">
                <Text className="w-10 text-gray-500 font-medium">{setIndex + 1}</Text>
                <TextInput
                  value={set.weight}
                  onChangeText={(value) => onInputChange(index, setIndex, "weight", value)}
                  placeholder="Weight"
                  keyboardType="numeric"
                  className="flex-1 mr-2 py-2 px-3 bg-gray-100 rounded-lg font-medium text-center"
                />
                <TextInput
                  value={set.reps}
                  onChangeText={(value) => onInputChange(index, setIndex, "reps", value)}
                  placeholder="Reps"
                  keyboardType="numeric"
                  className="flex-1 py-2 px-3 bg-gray-100 rounded-lg font-medium text-center"
                />
              </View>
            ))}
          </View>

          {/* Footer */}
          <View className="flex-row justify-between items-center p-4 border-t border-gray-200">
            <TouchableOpacity onPress={() => onTimerPress(index)} className="flex-row items-center">
              <Text className="text-lg mr-2">⏱</Text>
              <Text className="text-[#ee4444] font-medium">{item.restTimer}</Text>
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity onPress={() => onAddSet(index)} className="bg-[#ee4444] py-2 px-4 rounded-lg mr-2">
                <Text className="text-white font-medium">Add Set</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemoveAllSets(index)} className="bg-gray-200 py-2 px-4 rounded-lg">
                <Text className="text-gray-700 font-medium">Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

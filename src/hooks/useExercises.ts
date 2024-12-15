import { useContext } from "react";
import { ExerciseContext, ExerciseProvider } from "@/contexts/ExerciseContext";
import { ExerciseContextType } from "@/types/exercise.types";

export const useExercises = (): ExerciseContextType => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExercises must be used within an ExerciseProvider');
    }
    return context;
};

export default ExerciseProvider;
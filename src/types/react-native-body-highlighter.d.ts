// types/react-native-body-highlighter.d.ts
declare module '@teambuildr/react-native-body-highlighter' {
    import { ComponentType } from 'react';
    import { ViewProps } from 'react-native';
  
    type BodyPartSlug = 
      | 'trapezius' | 'triceps' | 'forearm' | 'obliques' | 'adductors' 
      | 'calves' | 'head' | 'neck' | 'chest' | 'biceps' | 'abs' 
      | 'upper-back' | 'lower-back' | 'hamstring' | 'gluteal' 
      | 'deltoids' | 'hands' | 'feet' | 'ankles' | 'tibialis';
  
    interface BodyPart {
      slug: BodyPartSlug;
      intensity: number;
    }
  
    interface BodyProps extends ViewProps {
      data: ReadonlyArray<BodyPart>;
      colors?: string[];
      side?: 'front' | 'back';
      gender?: 'male' | 'female';
      scale?: number;
      onBodyPartPress?: (bodyPart: BodyPart) => void;
    }
  
    const Body: ComponentType<BodyProps>;
    export default Body;
  }
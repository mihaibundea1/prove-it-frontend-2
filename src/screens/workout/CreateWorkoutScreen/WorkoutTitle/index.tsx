import React from 'react';
import { TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type WorkoutTitleProps = {
  routineName: string;
  setRoutineName: (text: string) => void;
};

export const WorkoutTitle = ({ routineName, setRoutineName }: WorkoutTitleProps) => (
  <TextInput
    placeholder="Enter Routine Title"
    value={routineName}
    onChangeText={setRoutineName}
    className='py-1 px-4 rounded-lg bg-gray-200 mb-2'
    style={[
        { fontSize: hp(2) }
    ]}
  />
);
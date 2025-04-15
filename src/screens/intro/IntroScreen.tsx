import React, { useEffect } from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const IntroScreen: React.FC = () => {
    const navigation = useNavigation();
    const ring1padding = useSharedValue(0);
    const ring2padding = useSharedValue(0);
    const colorScheme = useColorScheme();


    useEffect(() => {
        console.log('WelcomeScreen mounted');
        ring1padding.value = 0;
        ring2padding.value = 0;
        setTimeout(() => ring1padding.value = withSpring(hp(2)), 100);
        setTimeout(() => ring2padding.value = withSpring(hp(4)), 100);

        return () => {
            console.log('WelcomeScreen unmounting');
        };
    }, [navigation, ring1padding, ring2padding]);

    return (
        <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'} justify-between items-center pb-4`}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <View className="flex-1 justify-center">
                <Image
                    source={require('assets/images/logo512.png')}
                    style={{ width: hp(15), height: hp(15) }}
                    resizeMode="contain"
                />
            </View>

            {/* Display API URL */}
            <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-[#E63600]">FitverseHub</Text>
                <Text className="text-base font-semibold text-[#E63600]">Change The way you exercise.</Text>

                {/* Display environment variables
                <Text className="text-sm mt-4">
                    API URL: {process.env.EXPO_PUBLIC_API_URL ?? 'Not Set'}{"\n"}
                    Clerk Publishable Key: {process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? 'Not Set'}
                </Text> */}
            </View>
        </View>
    );
};

export default IntroScreen;

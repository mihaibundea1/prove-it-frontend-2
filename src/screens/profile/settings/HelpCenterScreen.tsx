import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Search, ChevronRight, Mail, Phone, MessageCircle, HelpCircle, FileText, Book } from 'lucide-react-native';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <View className="mb-4 border-b border-gray-200 pb-4">
      <TouchableOpacity
        className="flex-row justify-between items-center"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">{question}</Text>
        <Animated.View style={{ transform: [{ rotate: animatedHeight.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg']
        }) }] }}>
          <ChevronRight size={24} color="#e63600" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={{
        maxHeight: animatedHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1000]
        }),
        opacity: animatedHeight,
        overflow: 'hidden'
      }}>
        <Text className="mt-2 text-gray-600">{answer}</Text>
      </Animated.View>
    </View>
  );
};

const HelpCenterScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login screen and tap on 'Forgot Password'. Follow the instructions sent to your email to create a new password."
    },
    {
      question: "Can I sync my workouts across devices?",
      answer: "Yes, your workouts are automatically synced across all devices where you're logged into your account."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "To cancel your subscription, go to Settings > Manage Subscription and follow the cancellation process. Please note that you'll continue to have access until the end of your current billing period."
    },
    {
      question: "Is my personal data secure?",
      answer: "We take data security very seriously. All your personal information and workout data is encrypted and stored securely. We never share your data with third parties without your explicit consent."
    },
  ];

  const quickLinks = [
    { icon: <FileText size={24} color="#e63600" />, title: "User Guide", screen: "UserGuideScreen" },
    { icon: <Book size={24} color="#e63600" />, title: "Terms of Service", screen: "TermsOfServiceScreen" },
    { icon: <HelpCircle size={24} color="#e63600" />, title: "Privacy Policy", screen: "PrivacyPolicyScreen" },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        
        <View className="flex-row items-center bg-gray-100 rounded-full p-4 mb-8 shadow-sm">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-900 text-lg"
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="bg-gray-50 rounded-3xl p-6 mb-8 shadow-md">
          <Text className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</Text>
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        <View className="bg-gray-50 rounded-3xl p-6 mb-8 shadow-md">
          <Text className="text-2xl font-semibold text-gray-900 mb-4">Quick Links</Text>
          {quickLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-gray-200 last:border-b-0"
              onPress={() => console.log(`Navigate to ${link.screen}`)}
            >
              <View className="bg-gray-200 rounded-full p-2 mr-3">
                {link.icon}
              </View>
              <Text className="flex-1 text-lg text-gray-800">{link.title}</Text>
              <ChevronRight size={24} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-gray-50 rounded-3xl p-6 shadow-md">
          <Text className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</Text>
          <View className="space-y-4">
            <TouchableOpacity className="flex-row items-center bg-white rounded-full p-4 shadow-sm">
              <View className="bg-red-100 rounded-full p-2 mr-3">
                <Mail size={24} color="#e63600" />
              </View>
              <Text className="flex-1 text-lg text-gray-800">Email Support</Text>
              <ChevronRight size={24} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-white rounded-full p-4 shadow-sm">
              <View className="bg-green-100 rounded-full p-2 mr-3">
                <Phone size={24} color="#22c55e" />
              </View>
              <Text className="flex-1 text-lg text-gray-800">Call Us</Text>
              <ChevronRight size={24} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-white rounded-full p-4 shadow-sm">
              <View className="bg-blue-100 rounded-full p-2 mr-3">
                <MessageCircle size={24} color="#3b82f6" />
              </View>
              <Text className="flex-1 text-lg text-gray-800">Live Chat</Text>
              <ChevronRight size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HelpCenterScreen;


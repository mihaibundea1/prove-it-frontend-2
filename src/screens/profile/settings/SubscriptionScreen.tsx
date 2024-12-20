import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { CreditCard, CheckCircle, X, ChevronRight } from "lucide-react-native";

// Type Definitions
type Feature = { included: boolean; text: string };
type Plan = {
  name: string;
  price: number | null;
  buttonText: string;
  popular?: boolean;
  features: Feature[];
  action: () => void;
};

// Helper for price rendering
const renderPrice = (price: number | null, isYearly: boolean) => {
  if (price === null) return <Text className="text-2xl font-bold">Custom Pricing</Text>;

  const yearlyPrice = price * 12;
  const adjustedYearlyPrice = price * 12 * 0.8; // Yearly price with 20% discount
  const adjustedMonthlyPrice = price * 0.8; // Monthly price without any discount

  return (
    <View className="flex-col items-start">
      {isYearly ? (
        <>
          <Text className="text-4xl font-bold text-[#e63600]">${adjustedYearlyPrice.toFixed(2)}</Text>
          <Text className="text-gray-500 ml-1">/year (Save 20%)</Text>
          <Text className="text-gray-500 ml-1 text-sm">(${adjustedMonthlyPrice.toFixed(2)} per month)</Text>
        </>
      ) : (
        <>
          <Text className="text-4xl font-bold text-[#e63600]">${price.toFixed(2)}</Text>
          <Text className="text-gray-500 ml-1">/month</Text>
          <Text className="text-gray-500 ml-1 text-sm">(${yearlyPrice.toFixed(2)} per year)</Text>
        </>
      )}
    </View>
  );
};

// Component to render the features
const FeaturesList: React.FC<{ features: Feature[] }> = ({ features }) => (
  <>
    {features.map((feature, index) => (
      <View key={index} className="flex-row items-center mb-2">
        {feature.included ? (
          <CheckCircle color="#22c55e" size={18} className="mr-3" />
        ) : (
          <X color="#ef4444" size={18} className="mr-3" />
        )}
        <Text className={feature.included ? "text-gray-900" : "text-gray-500"}>
          {feature.text}
        </Text>
      </View>
    ))}
  </>
);

// Pricing Toggle Component
const PricingToggle: React.FC<{ isYearly: boolean; setIsYearly: (value: boolean) => void }> = ({
  isYearly,
  setIsYearly,
}) => (
  <View className="flex-row justify-center space-x-4 mb-6">
    <TouchableOpacity
      className={`px-6 py-2 rounded-lg ${!isYearly ? "bg-[#e63600]" : "bg-gray-100"}`}
      onPress={() => setIsYearly(false)}
    >
      <Text className={`font-semibold ${!isYearly ? "text-white" : "text-gray-600"}`}>Monthly</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className={`px-6 py-2 rounded-lg ${isYearly ? "bg-[#e63600]" : "bg-gray-100"}`}
      onPress={() => setIsYearly(true)}
    >
      <Text className={`font-semibold ${isYearly ? "text-white" : "text-gray-600"}`}>
        Yearly (Save 20%)
      </Text>
    </TouchableOpacity>
  </View>
);

// Main SubscriptionScreen Component
const SubscriptionScreen: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);

  const subscriptionPlans: Plan[] = [
    {
      name: "Basic",
      price: 9.99,
      buttonText: "Subscribe",
      features: [
        { included: true, text: "Access to basic workouts" },
        { included: true, text: "Limited meal plans" },
        { included: true, text: "Community support" },
        { included: false, text: "Personal coach" },
        { included: false, text: "Custom workout plans" },
      ],
      action: () => console.log("Basic plan selected"),
    },
    {
      name: "Pro",
      price: 19.99,
      buttonText: "Subscribe",
      popular: true,
      features: [
        { included: true, text: "Access to all workouts" },
        { included: true, text: "Personalized meal plans" },
        { included: true, text: "Priority support" },
        { included: true, text: "Progress tracking" },
        { included: true, text: "AI workout recommendations" },
      ],
      action: () => console.log("Pro plan selected"),
    },
    {
      name: "Elite",
      price: 29.99,
      buttonText: "Subscribe",
      features: [
        { included: true, text: "All Pro features" },
        { included: true, text: "Personal coach" },
        { included: true, text: "Custom workout plans" },
        { included: true, text: "Nutrition consultation" },
        { included: true, text: "Exclusive content access" },
      ],
      action: () => console.log("Elite plan selected"),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-3xl font-extrabold text-black mb-6">Manage Subscription</Text>

        <View className="bg-gray-100 rounded-lg p-6 mb-6 shadow-lg">
          <Text className="text-lg font-semibold text-black mb-2">Current Plan: Pro</Text>
          <Text className="text-gray-600 mb-4">Your next billing date is July 15, 2023</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-black font-medium">Auto-renew</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#e63600" }}
              thumbColor={autoRenew ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setAutoRenew(!autoRenew)}
              value={autoRenew}
            />
          </View>
        </View>

        <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <Text className="text-2xl font-semibold text-black mb-6">Available Plans</Text>

        {subscriptionPlans.map((plan, index) => (
          <View
            key={index}
            className={`border rounded-lg p-6 mb-6 shadow-lg transition-all duration-300 ${
              plan.popular ? "bg-yellow-50 border-yellow-500" : "bg-white border-gray-200"
            }`}
          >
            {plan.popular && (
              <View className="bg-[#e63600] px-3 py-1 rounded-full self-start mb-2">
                <Text className="text-white text-xs font-semibold">Most Popular</Text>
              </View>
            )}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold text-black">{plan.name}</Text>
              {renderPrice(plan.price, isYearly)}
            </View>

            <FeaturesList features={plan.features} />

            <TouchableOpacity
              className={`mt-4 py-3 px-6 rounded-lg items-center ${
                plan.name === "Pro" ? "bg-gray-300" : "bg-[#e63600]"
              }`}
              onPress={plan.action}
              disabled={plan.name === "Pro"}
            >
              <Text className={`font-semibold ${plan.name === "Pro" ? "text-gray-600" : "text-white"}`}>
                {plan.name === "Pro" ? "Current Plan" : plan.buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity className="flex-row justify-between items-center py-4 border-t border-gray-200">
          <View className="flex-row items-center">
            <CreditCard color="#e63600" size={24} className="mr-4" />
            <Text className="text-black font-medium">Payment Method</Text>
          </View>
          <ChevronRight color="#666" size={24} />
        </TouchableOpacity>

        <TouchableOpacity className="mt-6">
          <Text className="text-[#e63600] text-center font-semibold">Cancel Subscription</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SubscriptionScreen;

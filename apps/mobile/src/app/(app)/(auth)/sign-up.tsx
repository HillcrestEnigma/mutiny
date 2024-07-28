import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function SignUp() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign In",
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Sign Up</Text>
      </View>
    </>
  );
}

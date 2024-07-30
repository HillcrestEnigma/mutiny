import { useStyle } from "@/lib/hooks/style";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        height: "100%",
      },
    }),
  });

  return (
    <View style={stylesheet.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(form)" />
      </Stack>
    </View>
  );
}

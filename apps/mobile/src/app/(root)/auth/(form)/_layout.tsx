import { useStyle } from "@/lib/hooks/style";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthFormLayout() {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        flexGrow: 1,
      },
      main: {
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
      },
    }),
  });

  return (
    <View style={stylesheet.container}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "Inter_700Bold",
          },
          contentStyle: stylesheet.main,
        }}
      >
        <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
        <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      </Stack>
    </View>
  );
}
import { Stack } from "expo-router";
import { useAuthenticatedSession } from "@repo/hook/query";
import { StyleSheet } from "react-native";

export default function AppLayout() {
  const { isLoading, isSuccess: isSignedIn } = useAuthenticatedSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/index" />
      </Stack>
    );
  } else {
    return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    );
  }
}

StyleSheet.create({
  header: {
    elevation: 0,
    shadowOpacity: 0,
  },
});

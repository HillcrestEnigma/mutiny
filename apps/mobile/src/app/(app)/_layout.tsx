import { Stack } from "expo-router";
import { useAuthenticatedSession } from "@repo/hook/query";

export default function AppLayout() {
  const { isLoading, isSuccess: isSignedIn } = useAuthenticatedSession();

  if (isLoading) {
    return null;
  }

  const headerScreenOptions = { headerShown: false };

  return (
    <>
      {isSignedIn ? (
        <Stack screenOptions={headerScreenOptions}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      ) : (
        <Stack screenOptions={headerScreenOptions}>
          <Stack.Screen name="(auth)" />
        </Stack>
      )}
    </>
  );
}

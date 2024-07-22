import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import { SplashScreen } from "expo-router";
import { useReactNavigationTheme } from "@/lib/hooks/theme";
import { ThemeProvider } from "@react-navigation/native";
import { MutinyProvider } from "@repo/hook/provider";
import * as SecureStore from "expo-secure-store";
import { config } from "@/lib/config";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useReactNavigationTheme();

  const [fontsLoaded, fontsError] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <MutinyProvider
      config={{
        baseURL: config.endpoints.api,
        sessionGetter: async () => SecureStore.getItemAsync("session"),
        sessionSetter: async (session) =>
          session
            ? SecureStore.setItemAsync("session", session)
            : SecureStore.deleteItemAsync("session"),
      }}
    >
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </MutinyProvider>
  );
}

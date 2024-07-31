import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Inter_100Thin,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SplashScreen } from "expo-router";
import { useColorScheme } from "@/lib/hooks/color";
import { reactNavigationTheme } from "@/lib/color";
import { ThemeProvider } from "@react-navigation/native";
import { MutinyProvider } from "@repo/hook/provider";
import * as SecureStore from "expo-secure-store";
import { config } from "@/lib/config";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorscheme = useColorScheme();

  const [fontsLoaded, fontsError] = useFonts({
    Inter_100Thin,
    Inter_400Regular,
    Inter_700Bold,
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
      <ThemeProvider value={reactNavigationTheme[colorscheme]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
        </Stack>
      </ThemeProvider>
    </MutinyProvider>
  );
}

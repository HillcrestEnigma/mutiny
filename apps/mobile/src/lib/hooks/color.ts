import { useColorScheme as useColorSchemeUnsafe } from "react-native";
import { getTheme, type Theme } from "../color";

export function useColorScheme() {
  return useColorSchemeUnsafe() ?? "light";
}

export function useTheme(): Theme {
  const colorscheme = useColorScheme();

  return getTheme(colorscheme);
}

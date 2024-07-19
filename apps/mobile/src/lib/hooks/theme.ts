import materialTheme from "@/assets/material-theme.json";
import { useColorScheme } from "react-native";

type ColorScheme = "light" | "dark";
type Theme = (typeof materialTheme.schemes)["light"];

const themes: { [key: string]: Theme } = materialTheme.schemes;

const getTheme = (themeName: ColorScheme): Theme => themes[themeName];

const getReactNavigationColors = (themeName: ColorScheme) => ({
  primary: getTheme(themeName).primary,
  background: getTheme(themeName).background,
  card: getTheme(themeName).primaryContainer,
  text: getTheme(themeName).onPrimaryContainer,
  border: getTheme(themeName).onSurface,
  notification: getTheme(themeName).error,
});

const reactNavigationTheme = {
  light: {
    dark: false,
    colors: getReactNavigationColors("light"),
  },
  dark: {
    dark: true,
    colors: getReactNavigationColors("dark"),
  },
};

function useColorSchemeSafe() {
  return useColorScheme() ?? "light";
}

export function useTheme() {
  const colorscheme = useColorSchemeSafe();

  return getTheme(colorscheme);
}

export function useReactNavigationTheme() {
  const colorscheme = useColorSchemeSafe();

  return reactNavigationTheme[colorscheme];
}

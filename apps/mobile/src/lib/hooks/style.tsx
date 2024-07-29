import { StyleSheet, type TextStyle } from "react-native";
import { useInsets, type Insets } from "./insets";
import { useTheme } from "./color";
import type { Theme, AccentColor } from "../color";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export type StyleSheetFn<T extends StyleSheet.NamedStyles<T>> = (constants: {
  theme: Theme;
  style: Required<Style>;
  insets: Insets;
}) => T & StyleSheet.NamedStyles<T>;

export interface FontStyle {
  family?: TextStyle["fontFamily"];
  weight?: TextStyle["fontWeight"];
}

export interface Style {
  accent?: AccentColor;
  font?: FontStyle;
}

function mergeStyles(
  styles: Array<Style | undefined>,
  options?: {
    inherit: boolean;
  },
) {
  function merge<T>(previousValue: T, currentValue: T) {
    if (options?.inherit) {
      return previousValue ?? currentValue;
    } else {
      return currentValue ?? previousValue;
    }
  }

  return styles.reduce<Style>(
    (result, style) => ({
      accent: merge(result?.accent, style?.accent),
      font: {
        family: merge(result?.font?.family, style?.font?.family),
        weight: merge(result?.font?.weight, style?.font?.weight),
      },
    }),
    {},
  );
}

const StyleContext = createContext<Style>({});

export function useStyle<T extends StyleSheet.NamedStyles<T>>({
  stylesheet: stylesheetFn = () => ({}) as T,
  style: styleGiven,
}: {
  stylesheet?: StyleSheetFn<T>;
  style?: Style;
}): { theme: Theme; style: Required<Style>; insets: Insets; stylesheet: T } {
  const theme = useTheme();
  const insets = useInsets();

  const style = mergeStyles([
    {
      accent: theme.primary,
      font: { family: "Inter", weight: "400" },
    },
    useContext(StyleContext),
    styleGiven,
  ]) as Required<Style>;

  const stylesheet = useMemo(
    () => StyleSheet.create(stylesheetFn({ theme, style, insets })),
    [theme, style, insets, stylesheetFn],
  );

  return {
    theme,
    style,
    insets,
    stylesheet,
  };
}

export function Style({
  accent,
  fontFamily,
  fontWeight,
  style: styleGiven,
  inherit = false,
  reset = false,
  children,
}: {
  accent?: AccentColor;
  fontFamily?: FontStyle["family"];
  fontWeight?: FontStyle["weight"];
  style?: Style;
  inherit?: boolean;
  reset?: boolean;
  children: ReactNode;
}) {
  let style: Style;

  const styleContext = useContext(StyleContext);

  if (reset) {
    style = {};
  } else {
    style = mergeStyles(
      [
        styleContext,
        {
          accent,
          font: {
            family: fontFamily,
            weight: fontWeight,
          },
        },
        styleGiven,
      ],
      {
        inherit,
      },
    );
  }

  return (
    <StyleContext.Provider value={style}>{children}</StyleContext.Provider>
  );
}

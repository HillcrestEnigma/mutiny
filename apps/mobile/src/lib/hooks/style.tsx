import { StyleSheet, type TextStyle } from "react-native";
import { useInsets, type Insets } from "./insets";
import { useTheme } from "./color";
import type { Theme, AccentColor, AccentColorRole } from "@/lib/color";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export type StyleSheetFn<T extends StyleSheet.NamedStyles<T>> = (constants: {
  theme: Theme;
  rawstyle: Style;
  style: Required<Style>;
  insets: Insets;
}) => T & StyleSheet.NamedStyles<T>;

export interface FontStyle {
  family?: TextStyle["fontFamily"];
  weight?: TextStyle["fontWeight"];
  size?: TextStyle["fontSize"];
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

  return styles.reduce<Style>((result, style) => {
    const resultFont = result?.font;
    const styleFont = style?.font;

    const fontStyle = {
      family: merge(resultFont?.family, styleFont?.family),
      weight: merge(resultFont?.weight, styleFont?.weight),
      size: merge(resultFont?.size, styleFont?.size),
    };

    return {
      accent: merge(result?.accent, style?.accent),
      font: fontStyle,
    };
  }, {});
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

  const rawstyle = mergeStyles([useContext(StyleContext), styleGiven]);

  const style = mergeStyles([
    {
      accent: theme.primary,
      font: { family: "Inter", weight: "400", size: 16 },
    },
    rawstyle,
  ]) as Required<Style>;

  const stylesheet = useMemo(
    () => StyleSheet.create(stylesheetFn({ theme, rawstyle, style, insets })),
    [theme, rawstyle, style, insets, stylesheetFn],
  );

  return {
    theme,
    style,
    insets,
    stylesheet,
  };
}

export function Style({
  accent: accentRole,
  fontFamily,
  fontWeight,
  fontSize,
  style: styleGiven,
  inherit = false,
  reset = false,
  children,
}: {
  accent?: AccentColorRole;
  fontFamily?: FontStyle["family"];
  fontWeight?: FontStyle["weight"];
  fontSize?: FontStyle["size"];
  style?: Style;
  inherit?: boolean;
  reset?: boolean;
  children: ReactNode;
}) {
  let style: Style;

  const styleContext = useContext(StyleContext);

  const theme = useTheme();
  const accent = accentRole ? theme[accentRole] : undefined;

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
            size: fontSize,
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

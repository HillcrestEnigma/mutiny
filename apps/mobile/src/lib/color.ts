import materialTheme from "@/assets/material-theme.json";

type ColorScheme = "light" | "dark";

export type ColorHex = string;

interface BaseColor {
  hex: ColorHex;
}

export interface AccentColor extends BaseColor {
  on: BaseColor;
  container: BaseColor & {
    on: BaseColor;
  };
}

interface SurfaceColor extends BaseColor {
  variant: BaseColor;
  on: BaseColor & {
    variant: BaseColor;
  };
  container: BaseColor & {
    lowest: BaseColor;
    low: BaseColor;
    high: BaseColor;
    highest: BaseColor;
  };
}

interface InverseColor extends BaseColor {
  on: BaseColor;
  primary: BaseColor;
}

interface OutlineColor extends BaseColor {
  variant: BaseColor;
}

export interface Theme {
  primary: AccentColor;
  secondary: AccentColor;
  tertiary: AccentColor;
  error: AccentColor;
  surface: SurfaceColor;
  inverse: InverseColor;
  outline: OutlineColor;
}

function createTheme(themeName: ColorScheme): Theme {
  const theme = materialTheme.schemes[themeName];
  return {
    primary: {
      hex: theme.primary,
      on: {
        hex: theme.onPrimary,
      },
      container: {
        hex: theme.primaryContainer,
        on: {
          hex: theme.onPrimaryContainer,
        },
      },
    },
    secondary: {
      hex: theme.secondary,
      on: {
        hex: theme.onSecondary,
      },
      container: {
        hex: theme.secondaryContainer,
        on: {
          hex: theme.onSecondaryContainer,
        },
      },
    },
    tertiary: {
      hex: theme.tertiary,
      on: {
        hex: theme.onTertiary,
      },
      container: {
        hex: theme.tertiaryContainer,
        on: {
          hex: theme.onTertiaryContainer,
        },
      },
    },
    error: {
      hex: theme.error,
      on: {
        hex: theme.onError,
      },
      container: {
        hex: theme.errorContainer,
        on: {
          hex: theme.onErrorContainer,
        },
      },
    },
    surface: {
      hex: theme.surface,
      variant: {
        hex: theme.surfaceVariant,
      },
      on: {
        hex: theme.onSurface,
        variant: {
          hex: theme.onSurfaceVariant,
        },
      },
      container: {
        hex: theme.surfaceContainer,
        lowest: {
          hex: theme.surfaceContainerLowest,
        },
        low: {
          hex: theme.surfaceContainerLow,
        },
        high: {
          hex: theme.surfaceContainerHigh,
        },
        highest: {
          hex: theme.surfaceContainerHighest,
        },
      },
    },
    inverse: {
      hex: theme.inverseSurface,
      on: {
        hex: theme.inverseOnSurface,
      },
      primary: {
        hex: theme.inversePrimary,
      },
    },
    outline: {
      hex: theme.outline,
      variant: {
        hex: theme.outlineVariant,
      },
    },
  };
}

const themes = {
  light: createTheme("light"),
  dark: createTheme("dark"),
};

export const getTheme = (themeName: ColorScheme): Theme => themes[themeName];

const getReactNavigationColors = (themeName: ColorScheme) => {
  const theme = getTheme(themeName);

  return {
    primary: theme.primary.hex,
    background: theme.surface.hex,
    card: theme.surface.container.hex,
    text: theme.surface.on.hex,
    border: theme.surface.on.hex,
    notification: theme.error.hex,
  };
};

export const reactNavigationTheme = {
  light: {
    dark: false,
    colors: getReactNavigationColors("light"),
  },
  dark: {
    dark: true,
    colors: getReactNavigationColors("dark"),
  },
};

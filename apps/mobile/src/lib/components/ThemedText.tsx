import { useTheme } from "@/lib/hooks/theme";
import { type TextProps } from "react-native";
import { Text } from "react-native";

export type ThemedTextProps = TextProps;

export function ThemedText({ style, ...rest }: ThemedTextProps) {
  const color = useTheme();

  return <Text style={[{ color: color.onSurface }, style]} {...rest} />;
}

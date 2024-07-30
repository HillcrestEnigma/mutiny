import { View } from "react-native";
import { Style, useStyle } from "@/lib/hooks/style";
import { Text } from "@/lib/components/text";
import type { ReactNode } from "react";
import type { ColorHex } from "@/lib/color";

export function Pill({
  color,
  padding = 0,
  children,
}: {
  color?: ColorHex;
  padding?: number;
  children: ReactNode;
}) {
  const { stylesheet } = useStyle({
    stylesheet: ({ rawstyle, style }) => ({
      errorPill: {
        paddingHorizontal: 8 + padding,
        paddingVertical: padding,
        minHeight: 20,
        backgroundColor: color ?? style.accent.hex,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 90,
      },
      errorText: {
        fontSize: rawstyle?.font?.size ?? 12,
      },
    }),
  });

  return (
    <Style inherit>
      <View style={stylesheet.errorPill}>
        <Text style={stylesheet.errorText}>{children}</Text>
      </View>
    </Style>
  );
}

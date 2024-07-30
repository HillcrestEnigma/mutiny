import { View, type DimensionValue } from "react-native";
import { type ReactNode } from "react";
import { Style, useStyle } from "@/lib/hooks/style";
import { Text } from "./text";

interface CardProps {
  children: ReactNode;
  height?: DimensionValue;
  gap?: number;
  style?: Style;
}

export function Card({ children, height, gap = 10 }: CardProps) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style }) => ({
      card: {
        height,
        gap,
        margin: 20,
        padding: 30,
        borderRadius: 45,
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: style.accent.container.hex,
      },
    }),
  });

  return <View style={stylesheet.card}>{children}</View>;
}

interface CardTitleProps {
  title: ReactNode;
  flex?: number;
  fontSize?: number;
}

export function CardTitle({ title, flex, fontSize = 30 }: CardTitleProps) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style }) => ({
      container: {
        minHeight: 20,
        flex,
      },
      title: {
        fontSize,
        fontFamily: "Inter_700Bold",
        color: style.accent.hex,
      },
    }),
  });

  return (
    <View style={stylesheet.container}>
      <Text style={stylesheet.title}>{title}</Text>
    </View>
  );
}

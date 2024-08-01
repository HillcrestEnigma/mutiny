import { View, type DimensionValue, type ViewStyle } from "react-native";
import { type ReactNode } from "react";
import { Style, useStyle } from "@/lib/hooks/style";
import { Text } from "./text";

interface CardProps {
  children: ReactNode;
  height?: DimensionValue;
  gap?: number;
}

export function Card({ children, height, gap = 20 }: CardProps) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style }) => ({
      card: {
        height,
        gap,
        margin: style.spacing.gap,
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

interface CardSectionProps {
  flex?: number;
  gap?: number;
  children: ReactNode;
}

export function CardSection({ flex, gap, children }: CardSectionProps) {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        flex,
        gap,
      },
    }),
  });

  return <View style={stylesheet.container}>{children}</View>;
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

interface CardListProps {
  flex?: number;
  gap?: number;
  style?: ViewStyle;
  children: ReactNode;
}

export function CardList({
  flex,
  gap,
  style: stylesheetGiven,
  children,
}: CardListProps) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style }) => ({
      container: {
        width: "100%",
        height: "100%",
        flex,
        gap: gap ?? style.spacing.gap,
        padding: style.spacing.gap,
        justifyContent: "space-around",
      },
    }),
  });

  return (
    <View style={[stylesheet.container, stylesheetGiven]}>
      <Style gap={0}>{children}</Style>
    </View>
  );
}

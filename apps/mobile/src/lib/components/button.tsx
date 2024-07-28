import {
  Pressable,
  View,
  type DimensionValue,
  type PressableProps,
} from "react-native";
import { forwardRef, type ReactNode } from "react";
import { Style, useStyle } from "../hooks/style";
import { Text } from "./text";

interface ButtonProps extends PressableProps {
  title: string;
  flex?: number;
}

export const Button = forwardRef<View, ButtonProps>(
  ({ title, onPress, flex = 100 }, ref) => {
    const { stylesheet } = useStyle({
      stylesheet: ({ style }) => ({
        button: {
          flex,
          minHeight: 30,
          maxHeight: 80,
          backgroundColor: style.accent.hex,
          borderRadius: 90,
        },
        buttonText: {
          flexGrow: 1,
          textAlign: "center",
          textAlignVertical: "center",
          fontSize: 20,
          color: style.accent.on.hex,
        },
      }),
    });

    return (
      <Pressable onPress={onPress} style={stylesheet.button} ref={ref}>
        <Style fontWeight="bold" inherit>
          <Text style={stylesheet.buttonText}>{title}</Text>
        </Style>
      </Pressable>
    );
  },
);

interface ButtonDrawerFixedProps {
  children: ReactNode;
  height?: DimensionValue;
}

export function ButtonDrawerFixed({
  children,
  height = "30%",
}: ButtonDrawerFixedProps) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style, insets }) => ({
      container: {
        padding: insets.max,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        // flex: 1,
        height,
        width: "100%",
        gap: 30,
        justifyContent: "space-between",
        alignContent: "center",
        backgroundColor: style.accent.container.hex,
        // position: "absolute",
        // bottom: 0,
      },
    }),
  });

  return <View style={stylesheet.container}>{children}</View>;
}

Button.displayName = "Button";

import { Text as ReactNativeText, type TextProps } from "react-native";
import { useStyle, type FontStyle } from "@/lib/hooks/style";

function resolveFontFamily({ family, weight }: FontStyle) {
  switch (family) {
    case "Inter":
      switch (weight) {
        case 100:
        case "thin":
          return "Inter_100Thin";
        case 700:
        case "bold":
          return "Inter_700Bold";
        case 400:
        case "regular":
        default:
          return "Inter_400Regular";
      }
    default:
      return "Inter_400Regular";
  }
}

export function Text({ children, style: styleProp, ...props }: TextProps) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style }) => ({
      text: {
        fontFamily: resolveFontFamily(style.font),
        fontSize: style.font.size,
        color: style.accent.on.hex,
      },
    }),
  });

  return (
    <ReactNativeText style={[stylesheet.text, styleProp]} {...props}>
      {children}
    </ReactNativeText>
  );
}

import { Text as ReactNativeText, type TextProps } from "react-native";
import { useStyle, type FontStyle } from "../hooks/style";

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
      regular: {
        fontFamily: resolveFontFamily(style.font),
      },
    }),
  });

  return (
    <ReactNativeText style={[stylesheet.regular, styleProp]} {...props}>
      {children}
    </ReactNativeText>
  );
}

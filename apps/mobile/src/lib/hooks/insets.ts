import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useInsets() {
  const insets = useSafeAreaInsets();

  return {
    ...insets,
    max: Math.max(insets.top, insets.bottom, insets.left, insets.right),
  };
}

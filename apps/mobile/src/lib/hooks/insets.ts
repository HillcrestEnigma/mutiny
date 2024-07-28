import {
  useSafeAreaInsets,
  type EdgeInsets,
} from "react-native-safe-area-context";

export interface Insets extends EdgeInsets {
  max: number;
}

export function useInsets() {
  const insets = useSafeAreaInsets();

  return {
    ...insets,
    max: Math.max(insets.top, insets.bottom, insets.left, insets.right),
  };
}

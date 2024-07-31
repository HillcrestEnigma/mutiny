import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";

export function useRouterNavigate() {
  const router = useRouter();

  return {
    navigateAbsolutely: (href: ExpoRouter.Href) => {
      while (router.canGoBack()) {
        router.back();
      }

      router.replace(href);
    },
  };
}

import { useStyle } from "@/lib/hooks/style";
import { View } from "react-native";
import { Link, Redirect } from "expo-router";
import { Button } from "@/lib/components/button";
import { Card } from "@/lib/components/card";
import { useAuthenticatedSession } from "@repo/hook/query";

export default function Index() {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-end",
      },
    }),
  });

  const { isLoading, isSuccess: isLoggedIn } = useAuthenticatedSession();

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return <Redirect href="/auth/create-profile" />;
  }

  return (
    <View style={stylesheet.container}>
      <Card>
        <Link href="/auth/sign-in" asChild>
          <Button title="Sign In" />
        </Link>
        <Link href="/auth/sign-up" asChild>
          <Button title="Sign Up" />
        </Link>
      </Card>
    </View>
  );
}

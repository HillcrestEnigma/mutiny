import { useStyle } from "@/lib/hooks/style";
import { Link, Redirect } from "expo-router";
import { Button } from "@/lib/components/button";
import { Card, CardList } from "@/lib/components/card";
import { useAuthenticatedSession } from "@repo/hook/query";

export default function Index() {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      cardList: {
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
    <CardList style={stylesheet.cardList}>
      <Card>
        <Link href="/auth/sign-in" asChild>
          <Button title="Sign In" />
        </Link>
        <Link href="/auth/sign-up" asChild>
          <Button title="Sign Up" />
        </Link>
      </Card>
    </CardList>
  );
}

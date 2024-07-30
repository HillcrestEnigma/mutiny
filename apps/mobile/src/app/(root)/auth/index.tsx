import { useStyle } from "@/lib/hooks/style";
import { Text } from "react-native";
import { Link } from "expo-router";
import { Button, ButtonDrawerFixed } from "@/lib/components/button";

export default function Index() {
  const { stylesheet } = useStyle({
    stylesheet: ({ theme, insets }) => ({
      title: {
        marginTop: insets.top + 20,
        paddingHorizontal: Math.max(insets.left, insets.top / 2),
        fontSize: 40,
        fontFamily: "Inter_700Bold",
        color: theme.surface.on.hex,
        // flex: 1,
        flexGrow: 3,
        height: "10%",
      },
    }),
  });

  return (
    <>
      <Text style={stylesheet.title}>Mutiny</Text>
      <ButtonDrawerFixed>
        <Link href="/auth/sign-in" asChild>
          <Button title="Sign In" />
        </Link>
        <Link href="/auth/sign-up" asChild>
          <Button title="Sign Up" />
        </Link>
      </ButtonDrawerFixed>
    </>
  );
}
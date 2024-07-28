import { useStyle } from "@/lib/hooks/style";
import { Text } from "react-native";
import { Link, Stack } from "expo-router";
import { Button, ButtonDrawerFixed } from "@/lib/components/button";

export default function Index() {
  const { stylesheet } = useStyle({
    stylesheet: ({ theme, insets }) => ({
      // main: {
      //   paddingTop: insets.top + 20,
      //   flexGrow: 1,
      //   justifyContent: "space-between",
      //   height: "100%",
      // },
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
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text style={stylesheet.title}>Mutiny</Text>
      <ButtonDrawerFixed>
        <Link href="/sign-in" asChild>
          <Button title="Sign In" />
        </Link>
        <Link href="/sign-up" asChild>
          <Button title="Sign Up" />
        </Link>
      </ButtonDrawerFixed>
    </>
  );
}

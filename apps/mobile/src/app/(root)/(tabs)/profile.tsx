import { Button } from "@/lib/components/button";
import { useDeleteAuthenticatedSession } from "@repo/hook/query";
import { View, Text } from "react-native";
import { router } from "expo-router";

export default function Profile() {
  const { mutate: deleteAuthenticatedSession } =
    useDeleteAuthenticatedSession();

  const signOut = () => {
    deleteAuthenticatedSession(undefined, {
      onSuccess: () => {
        router.replace("/auth");
      },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

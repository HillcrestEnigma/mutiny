import { useAuthenticatedUser } from "@repo/hook/query";
import { View, Text } from "react-native";

export default function Index() {
  const { isSuccess, data } = useAuthenticatedUser();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isSuccess ? (
        <Text>hi {data.username}</Text>
      ) : (
        <Text>Not successful</Text>
      )}
    </View>
  );
}

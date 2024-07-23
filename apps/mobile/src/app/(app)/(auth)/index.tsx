import { useInsets } from "@/lib/hooks/insets";
import { useStyle } from "@/lib/hooks/theme";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  const insets = useInsets();

  const styles = useStyle((theme) => ({
    main: {
      paddingTop: insets.top + 20,
      flexGrow: 1,
    },
    title: {
      paddingHorizontal: Math.max(insets.left, insets.top / 2),
      fontSize: 40,
      fontWeight: "bold",
      color: theme.onBackground,
      flex: 10,
    },
    buttonContainer: {
      padding: insets.max,
      borderTopLeftRadius: 45,
      borderTopRightRadius: 45,
      flex: 3,
      gap: 30,
      justifyContent: "space-between",
      alignContent: "center",
      backgroundColor: theme.primaryContainer,
    },
    button: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.primary,
      borderRadius: 90,
    },
    buttonText: {
      flexGrow: 1,
      textAlign: "center",
      textAlignVertical: "center",
      fontSize: 20,
      color: theme.onPrimary,
      fontWeight: "bold",
    },
  }));

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Mutiny</Text>
      <View style={styles.buttonContainer}>
        <Link href="/sign-in" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        </Link>
        <Link href="/sign-up" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useStyle } from "@/lib/hooks/style";
import { Stack } from "expo-router";
import { Button } from "@/lib/components/button";
import { TextInput } from "@/lib/components/form/textinput";
import { Card, CardTitle } from "@/lib/components/card";
import { Form } from "@/lib/components/form";

interface FormValues {
  usernameOrEmail: string;
  password: string;
}

export default function SignIn() {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        margin: 20,
      },
    }),
  });

  const form = useForm({
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });
  const { handleSubmit } = form;

  return (
    <View style={stylesheet.container}>
      <Stack.Screen
        options={{
          title: "Sign In",
        }}
      />
      <Card height={400} gap={20}>
        <CardTitle title="Sign In to Mutiny" />

        <Form<FormValues> form={form}>
          <TextInput
            name="usernameOrEmail"
            label="Username or Email"
            rules={{
              required: true,
            }}
          />

          <TextInput
            name="password"
            label="Password"
            rules={{
              maxLength: 10,
            }}
            secureTextEntry={true}
          />

          <Button
            title="Sign In"
            flex={20}
            onPress={handleSubmit((data) => console.log(data))}
          />
        </Form>
      </Card>
    </View>
  );
}

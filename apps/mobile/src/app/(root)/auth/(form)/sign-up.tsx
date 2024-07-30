import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/lib/components/button";
import { TextInput } from "@/lib/components/form/textinput";
import { Card, CardTitle } from "@/lib/components/card";
import { Form } from "@/lib/components/form";
import { UserCreateForm } from "@repo/schema";
import { useCreateUser } from "@repo/hook/query";
import { handleMutationError } from "@/lib/utils/error";
import { router } from "expo-router";

export default function SignUp() {
  const form = useForm<UserCreateForm>({
    resolver: zodResolver(UserCreateForm),
  });

  const { mutate: createUser } = useCreateUser();

  const onSubmit = form.handleSubmit(async (data: UserCreateForm) =>
    createUser(data, {
      onError: handleMutationError(form.setError),
      onSuccess: () => {
        router.replace("/");
      },
    }),
  );

  return (
    <>
      <Card gap={20}>
        <CardTitle title="Sign Up for Mutiny" />

        <Form<UserCreateForm> form={form}>
          <TextInput name="username" label="Username" />
          <TextInput name="email" label="Email Address" />
          <TextInput name="password" label="Password" secureTextEntry={true} />
          <TextInput
            name="passwordConfirmation"
            label="Password Again"
            secureTextEntry={true}
          />
        </Form>

        <Button title="Sign Up" onPress={onSubmit} />
      </Card>
    </>
  );
}

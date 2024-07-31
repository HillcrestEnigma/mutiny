import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/lib/components/button";
import { TextInput } from "@/lib/components/form/input/text";
import { Card, CardTitle } from "@/lib/components/card";
import { Form } from "@/lib/components/form";
import { SessionCreateForm } from "@repo/schema";
import { useCreateSession } from "@repo/hook/query";
import { handleMutationError } from "@/lib/utils/error";
import { router } from "expo-router";
import { useMutinyClient } from "@repo/hook";
import { useRouterNavigate } from "@/lib/utils/navigate";

export default function SignIn() {
  const { navigateAbsolutely } = useRouterNavigate();

  const form = useForm<SessionCreateForm>({
    resolver: zodResolver(SessionCreateForm),
  });

  const client = useMutinyClient();

  const { mutate: createSession } = useCreateSession();

  const onSubmit = form.handleSubmit(async (data: SessionCreateForm) =>
    createSession(data, {
      onError: handleMutationError(form.setError, {
        unauthorized: "Invalid username, email, or password",
      }),
      onSuccess: async () => {
        try {
          await client.getAuthenticatedProfile();

          router.replace("/");
        } catch {
          navigateAbsolutely("/auth/create-profile");
        }
      },
    }),
  );

  return (
    <>
      <Card>
        <CardTitle title="Sign In to Mutiny" />

        <Form<SessionCreateForm> form={form}>
          <TextInput name="usernameOrEmail" label="Username or Email" />
          <TextInput name="password" label="Password" secureTextEntry={true} />
        </Form>

        <Button title="Sign In" onPress={onSubmit} />
      </Card>
    </>
  );
}

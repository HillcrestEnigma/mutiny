import { Card, CardTitle } from "@/lib/components/card";
import { handleMutationError } from "@/lib/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthenticatedProfile, useUpsertProfile } from "@repo/hook/query";
import { ProfileUpsertForm } from "@repo/schema";
import { Redirect, router } from "expo-router";
import { useForm } from "react-hook-form";
import { Form } from "@/lib/components/form";
import { TextInput } from "@/lib/components/form/textinput";
import { Button } from "@/lib/components/button";

export default function CreateProfile() {
  const form = useForm<ProfileUpsertForm>({
    resolver: zodResolver(ProfileUpsertForm),
  });

  const { isSuccess: profileExists } = useAuthenticatedProfile();
  const { mutate: createProfile } = useUpsertProfile();

  if (profileExists) {
    return <Redirect href="/" />;
  }

  const onSubmit = form.handleSubmit(async (data: ProfileUpsertForm) =>
    createProfile(data, {
      onError: handleMutationError(form.setError),
      onSuccess: () => {
        router.replace("/");
      },
    }),
  );

  return (
    <>
      <Card gap={20}>
        <CardTitle title="Create Your Profile" />

        <Form<ProfileUpsertForm> form={form}>
          <TextInput name="name" label="Name" />
          <TextInput name="birthday" label="Birthday" />
          <TextInput name="bio" label="Bio" />
        </Form>

        <Button title="Sign Up" onPress={onSubmit} />
      </Card>
    </>
  );
}

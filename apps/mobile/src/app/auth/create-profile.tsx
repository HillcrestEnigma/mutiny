import { Card, CardList, CardSection, CardTitle } from "@/lib/components/card";
import { handleMutationError } from "@/lib/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAuthenticatedUser,
  useDeleteAuthenticatedSession,
  useUpsertProfile,
} from "@repo/hook/query";
import { ProfileUpsertForm } from "@repo/schema";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Form } from "@/lib/components/form";
import { TextInput } from "@/lib/components/form/input/text";
import { DateInput } from "@/lib/components/form/input/date";
import { Button } from "@/lib/components/button";
import { ScrollView } from "react-native";
import { useStyle } from "@/lib/hooks/style";

export default function CreateProfile() {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        width: "100%",
      },
    }),
  });

  const form = useForm<ProfileUpsertForm>({
    resolver: zodResolver(ProfileUpsertForm),
  });

  const { data: user } = useAuthenticatedUser();

  const { mutate: createProfile } = useUpsertProfile();

  const { mutate: deleteAuthenticatedSession } =
    useDeleteAuthenticatedSession();

  if (!user) {
    return null;
  }

  const onSubmit = form.handleSubmit(async (data: ProfileUpsertForm) =>
    createProfile(data, {
      onError: handleMutationError(form.setError),
      onSuccess: () => {
        router.replace("/");
      },
    }),
  );

  const signOut = () => {
    deleteAuthenticatedSession(undefined, {
      onSuccess: () => {
        router.replace("/auth");
      },
    });
  };

  return (
    <ScrollView style={stylesheet.container}>
      <CardList>
        <Card>
          <CardSection>
            <CardTitle title="Create Your Profile" />
            <CardTitle
              title={`Tell us about you, ${user.username}!`}
              fontSize={18}
            />
          </CardSection>

          <Form<ProfileUpsertForm> form={form}>
            <TextInput name="name" label="Name" />
            <DateInput name="birthday" label="Birthday" />
            <TextInput
              name="bio"
              label="Bio"
              multiline={true}
              numberOfLines={6}
            />
          </Form>

          <Button title="Submit" onPress={onSubmit} />
        </Card>
        <Card>
          <CardTitle title={`Not ${user?.username}?`} fontSize={24} />
          <Button title="Sign Out" onPress={signOut} />
        </Card>
      </CardList>
    </ScrollView>
  );
}

import { Style, useStyle } from "@/lib/hooks/style";
import type { ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { View } from "react-native";
import { Pill } from "@/lib/components/pill";
import { ErrorMessage } from "@hookform/error-message";

interface FormProps<FormInputs extends FieldValues> {
  children: ReactNode;
  form: UseFormReturn<FormInputs>;
}

export function Form<FormInputs extends FieldValues>({
  children,
  form,
}: FormProps<FormInputs>) {
  const { stylesheet } = useStyle({
    stylesheet: () => ({
      container: {
        gap: 20,
      },
      error: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 10,
      },
    }),
  });

  const rootError = form.formState.errors.root;
  return (
    <FormProvider {...form}>
      <View style={stylesheet.container}>
        {children}
        {rootError ? (
          <Style accent="error" fontSize={14}>
            <View style={stylesheet.error}>
              <ErrorMessage
                name="root"
                render={({ message }) => <Pill>{message}</Pill>}
              />
            </View>
          </Style>
        ) : null}
      </View>
    </FormProvider>
  );
}

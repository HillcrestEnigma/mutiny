import type { ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

interface FormProps<FormValues extends FieldValues> {
  children: ReactNode;
  form: UseFormReturn<FormValues>;
}

export function Form<FormValues extends FieldValues>({
  children,
  form,
}: FormProps<FormValues>) {
  return <FormProvider {...form}>{children}</FormProvider>;
}

import { View } from "react-native";
import { Style, useStyle } from "@/lib/hooks/style";
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Text } from "@/lib/components/text";
import { ErrorMessage } from "@hookform/error-message";
import { Pill } from "@/lib/components/pill";

export interface InputProps<FormInputs extends FieldValues> {
  name: Path<FormInputs>;
  label: string;
}

export function Input<FormInputs extends FieldValues>({
  name,
  label,
  render,
}: InputProps<FormInputs> & {
  render: ControllerProps<FormInputs>["render"];
}) {
  const { stylesheet } = useStyle({
    stylesheet: ({ style }) => ({
      container: {
        gap: 10,
        minHeight: 100,
      },
      textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        justifyItems: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 5,
      },
      label: {
        color: style.accent.hex,
        fontSize: 20,
      },
    }),
  });

  const form = useFormContext<FormInputs>();

  const error = form.formState.errors?.[name];

  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.textContainer}>
        <View>
          <Text style={stylesheet.label}>{label}</Text>
        </View>
        {error ? (
          <Style accent="error">
            <ErrorMessage
              name={name}
              render={({ message }) => <Pill>{message}</Pill>}
            />
          </Style>
        ) : null}
      </View>
      <Controller name={name} control={form.control} render={render} />
    </View>
  );
}

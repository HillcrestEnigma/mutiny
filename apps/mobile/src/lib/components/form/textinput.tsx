import {
  TextInput as ReactNativeTextInput,
  View,
  type TextInputProps as ReactNativeTextInputProps,
} from "react-native";
import { Style, useStyle } from "@/lib/hooks/style";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Text } from "@/lib/components/text";
import { ErrorMessage } from "@hookform/error-message";
import { Pill } from "@/lib/components/pill";

export function TextInput<FormInputs extends FieldValues>({
  name,
  label,
  flex,
  ...props
}: ReactNativeTextInputProps & {
  name: Path<FormInputs>;
  label: string;
  flex?: number;
}) {
  const { stylesheet, style } = useStyle({
    stylesheet: ({ theme, style }) => ({
      container: {
        flex,
        gap: 10,
        maxHeight: 100,
      },
      textContainer: {
        // flex: 3,
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
      textInput: {
        // flex: 5,
        minHeight: 50,
        paddingHorizontal: 20,
        fontSize: 20,
        backgroundColor: style.accent.container.hex,
        color: style.accent.container.on.hex,
        borderColor: theme.outline.hex,
        borderWidth: 1,
        borderRadius: 20,
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
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <ReactNativeTextInput
            style={stylesheet.textInput}
            placeholderTextColor={style.accent.container.on.hex}
            selectionColor={style.accent.hex}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            value={field.value}
            {...props}
          />
        )}
      />
    </View>
  );
}

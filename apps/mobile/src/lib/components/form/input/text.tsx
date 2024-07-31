import {
  TextInput as ReactNativeTextInput,
  type TextInputProps as ReactNativeTextInputProps,
} from "react-native";
import { useStyle } from "@/lib/hooks/style";
import type { FieldValues } from "react-hook-form";
import { Input, type InputProps } from ".";

export function TextInput<FormInputs extends FieldValues>({
  name,
  label,
  ...props
}: ReactNativeTextInputProps & InputProps<FormInputs>) {
  const { stylesheet, style } = useStyle({
    stylesheet: ({ theme, style }) => ({
      textInput: {
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

  return (
    <Input<FormInputs>
      name={name}
      label={label}
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
  );
}

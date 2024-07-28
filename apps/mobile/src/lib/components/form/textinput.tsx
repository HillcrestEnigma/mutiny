import {
  TextInput as ReactNativeTextInput,
  View,
  type TextInputProps as ReactNativeTextInputProps,
} from "react-native";
import { useStyle } from "../../hooks/style";
import type { AccentColor } from "../../color";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Text } from "../text";

export function TextInput<FormValues extends FieldValues>({
  name,
  label,
  rules,
  flex = 100,
  ...props
}: ReactNativeTextInputProps & {
  name: Path<FormValues>;
  label: string;
  rules?: Record<string, unknown>;
  flex?: number;
  color?: AccentColor;
}) {
  const { stylesheet, style } = useStyle({
    stylesheet: ({ theme, style }) => ({
      container: {
        flex,
        gap: 10,
        maxHeight: 100,
      },
      textContainer: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      label: {
        color: style.accent.hex,
        fontSize: 20,
      },
      errorPill: {
        paddingHorizontal: 8,
        minHeight: 21,
        backgroundColor: theme.error.hex,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 90,
      },
      errorText: {
        color: theme.error.on.hex,
        fontSize: 12,
      },
      textInput: {
        flex: 5,
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

  const {
    control,
    formState: { errors },
  } = useFormContext();

  let error: string | null = null;

  switch (errors?.[name]?.type) {
    case "required":
      error = "Required";
      break;
    case "maxLength":
      error = "Too Long";
      break;
  }

  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.textContainer}>
        <View>
          <Text style={stylesheet.label}>{label}</Text>
        </View>
        {error && (
          <View style={stylesheet.errorPill}>
            <Text style={stylesheet.errorText}>{error}</Text>
          </View>
        )}
      </View>
      <Controller
        name={name}
        control={control}
        rules={rules}
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

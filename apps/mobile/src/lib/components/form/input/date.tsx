import { Pressable, View } from "react-native";
import { useStyle } from "@/lib/hooks/style";
import type { FieldValues } from "react-hook-form";
import { Input, type InputProps } from ".";
import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Text } from "@/lib/components/text";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year} / ${month} / ${day}`;
}

// TODO: add support for IOS
export function DateInput<FormInputs extends FieldValues>({
  name,
  label,
}: InputProps<FormInputs>) {
  const { stylesheet } = useStyle({
    stylesheet: ({ theme, style }) => ({
      dateInput: {
        minHeight: 50,
        paddingHorizontal: 20,
        backgroundColor: style.accent.container.hex,
        borderColor: theme.outline.hex,
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "flex-start",
      },
      date: {
        fontSize: 20,
        color: style.accent.container.on.hex,
      },
    }),
  });

  return (
    <Input<FormInputs>
      name={name}
      label={label}
      render={({ field }) => {
        const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
          field.onChange(selectedDate);
          field.onBlur();
        };

        const showDatePicker = () => {
          DateTimePickerAndroid.open({
            value: field.value ?? new Date(),
            onChange,
            mode: "date",
          });
        };

        return (
          <Pressable onPress={showDatePicker}>
            <View style={stylesheet.dateInput}>
              <Text style={stylesheet.date}>
                {field.value ? formatDate(field.value) : "---- / -- / --"}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

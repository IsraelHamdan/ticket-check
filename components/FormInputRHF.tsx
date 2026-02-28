import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormTrigger,
} from "react-hook-form";

import {
  dateMask,
  cepMask,
  cpfMask,
  unMaskPrice,
  unmaskCep,
  unmaskCpf,
} from "@/lib/utils/masks";
import {
  formatCurrencyBR,
  formatDateToBR,
  formatPhoneInput,
  formatTimeOnly,
} from "@/lib/utils/formarters";

export type InputType =
  | "text"
  | "phone"
  | "cpf"
  | "cep"
  | "email"
  | "password"
  | "price"
  | "date"
  | "time";

type ManagedInputProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onBlur" | "editable"
>;

type FormInputRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  type?: InputType;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  disabled?: boolean;
  readOnly?: boolean;
  inputProps?: ManagedInputProps;
  onValueChange?: (value: string | number) => void;
  showErrorMessage?: boolean;
  trigger?: UseFormTrigger<TFieldValues>;
  wrapperStyle?: ViewStyle;
  errorText?: string;
};

const formatTimeInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

const toDisplayValue = (type: InputType, value: unknown): string => {
  if (value === null || value === undefined) return "";

  switch (type) {
    case "phone":
      return formatPhoneInput(String(value));
    case "cpf":
      return cpfMask(String(value));
    case "cep":
      return cepMask(String(value));
    case "price": {
      if (typeof value === "number") {
        return formatCurrencyBR(value / 100);
      }

      const cents = unMaskPrice(String(value));
      return formatCurrencyBR(cents / 100);
    }
    case "date": {
      if (value instanceof Date || typeof value === "number") {
        return formatDateToBR(value);
      }

      const raw = String(value);
      if (!raw) return "";
      if (raw.includes("/")) return raw;
      return dateMask(raw);
    }
    case "time": {
      if (value instanceof Date || typeof value === "number") {
        return formatTimeOnly(value) ?? "";
      }

      return formatTimeInput(String(value));
    }
    default:
      return String(value);
  }
};

const toStoredValue = (
  type: InputType,
  text: string
): string | number => {
  switch (type) {
    case "phone":
      return text.replace(/\D/g, "").slice(0, 11);
    case "cpf":
      return unmaskCpf(text).slice(0, 11);
    case "cep":
      return unmaskCep(text);
    case "price":
      return unMaskPrice(text);
    case "date":
      return text.replace(/\D/g, "").slice(0, 8);
    case "time":
      return text.replace(/\D/g, "").slice(0, 4);
    default:
      return text;
  }
};

const getDefaultKeyboardType = (
  type: InputType
): TextInputProps["keyboardType"] => {
  switch (type) {
    case "phone":
      return "phone-pad";
    case "email":
      return "email-address";
    case "price":
    case "cpf":
    case "cep":
    case "date":
    case "time":
      return "number-pad";
    default:
      return "default";
  }
};

const resolveSecureEntry = (
  type: InputType,
  secureTextEntry?: boolean
): boolean => {
  if (typeof secureTextEntry === "boolean") {
    return secureTextEntry;
  }

  return type === "password";
};

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : null;
  }

  return null;
};

/**
 * RHF input wrapper for React Native that keeps form state unmasked
 * while rendering a formatted value in the TextInput.
 */
export function FormInputRHF<TFieldValues extends FieldValues>({
  name,
  control,
  type = "text",
  placeholder,
  secureTextEntry,
  keyboardType,
  disabled = false,
  readOnly = false,
  inputProps,
  onValueChange,
  showErrorMessage = true,
  trigger,
  wrapperStyle,
  errorText,
}: FormInputRHFProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const displayValue = toDisplayValue(type, field.value);
        const hasError = Boolean(fieldState.error);
        const shouldShowError =
          hasError && (fieldState.isTouched || formState.isSubmitted);
        const resolvedErrorText =
          errorText ?? getErrorMessage(fieldState.error);

        const handleBlur = async () => {
          field.onBlur();

          if (trigger) {
            await trigger(name);
          }
        };

        const handleChangeText = (text: string) => {
          const nextValue = toStoredValue(type, text) as PathValue<
            TFieldValues,
            FieldPath<TFieldValues>
          >;

          field.onChange(nextValue);
          onValueChange?.(nextValue as string | number);
        };

        return (
          <View style={[styles.wrapper, wrapperStyle]}>
            <TextInput
              {...inputProps}
              value={displayValue}
              placeholder={placeholder}
              secureTextEntry={resolveSecureEntry(type, secureTextEntry)}
              keyboardType={keyboardType ?? getDefaultKeyboardType(type)}
              editable={!(disabled || readOnly)}
              onBlur={handleBlur}
              onChangeText={handleChangeText}
              aria-invalid={shouldShowError || undefined}
              accessibilityState={{ disabled: disabled || readOnly }}
            />

            {showErrorMessage && shouldShowError && resolvedErrorText ? (
              <Text style={styles.errorText}>{resolvedErrorText}</Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 6,
    marginBottom: 10,
  },
});

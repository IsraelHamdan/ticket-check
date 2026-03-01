import React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormTrigger,
} from "react-hook-form";
import { Text, TextInput, View, useColorScheme, type TextInputProps } from "react-native";

import {
  formatCurrencyBR,
  formatDateToBR,
  formatPhoneInput,
  formatTimeOnly,
} from "@/lib/utils/formarters";
import {
  cepMask,
  cpfMask,
  dateMask,
  unMaskPrice,
  unmaskCep,
  unmaskCpf,
} from "@/lib/utils/masks";

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
  | "value"
  | "onChangeText"
  | "onBlur"
  | "editable"
  | "secureTextEntry"
  | "keyboardType"
  | "placeholderTextColor"
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
};

const PLACEHOLDER_COLOR = {
  light: "#94a3b8",
  dark: "#64748b",
} as const;

const styles = {
  wrapper: "mb-4",
  input:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white",
  inputReadOnly:
    "border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50",
  inputError: "border-red-500 dark:border-red-400",
  error: "mt-1.5 text-xs font-medium text-red-500 dark:text-red-400",
} as const;

const joinClasses = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

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

const toStoredValue = (type: InputType, text: string): string | number => {
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
  if (typeof secureTextEntry === "boolean") return secureTextEntry;
  return type === "password";
};

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown; }).message;
    return typeof message === "string" ? message : null;
  }
  return null;
};

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
}: FormInputRHFProps<TFieldValues>) {
  const colorScheme = useColorScheme();
  const placeholderColor = PLACEHOLDER_COLOR[colorScheme ?? "light"];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const displayValue = toDisplayValue(type, field.value);
        const hasError = Boolean(fieldState.error);
        const shouldShowError =
          hasError && (fieldState.isTouched || formState.isSubmitted);
        const resolvedErrorText = getErrorMessage(fieldState.error);

        const inputClassName = joinClasses(
          styles.input,
          readOnly && styles.inputReadOnly,
          inputProps?.className,
          shouldShowError && styles.inputError
        );

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
          <View className={styles.wrapper}>
            <TextInput
              {...inputProps}
              value={displayValue}
              className={inputClassName}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor}
              secureTextEntry={resolveSecureEntry(type, secureTextEntry)}
              keyboardType={keyboardType ?? getDefaultKeyboardType(type)}
              editable={!(disabled || readOnly)}
              onBlur={handleBlur}
              onChangeText={handleChangeText}
              aria-invalid={shouldShowError || undefined}
              accessibilityState={{ disabled: disabled || readOnly }}
            />

            {showErrorMessage && shouldShowError && resolvedErrorText ? (
              <Text className={styles.error}>{resolvedErrorText}</Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}
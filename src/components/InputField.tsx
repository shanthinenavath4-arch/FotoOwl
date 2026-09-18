import React from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TextInputProps,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function InputField({
  label,
  error,
  ...props
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E1E1E8",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FAFAFC",
  },

  inputError: {
    borderColor: "#E74C3C",
  },

  error: {
    color: "#E74C3C",
    fontSize: 12,
    marginTop: 5,
  },
});
import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
}

export default function LoadingSpinner({
  size = "large",
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#6C5CE7" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
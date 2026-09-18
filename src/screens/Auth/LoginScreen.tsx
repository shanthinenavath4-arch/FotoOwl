import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
import useAuthStore from "../../store/useAuthStore";
import { validateEmail } from "../../utils/validation";

export default function LoginScreen({ navigation }: any) {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError("Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const result = await login(
        email.trim(),
        password
      );

      if (!result.success) {
        Alert.alert(
          "Login Failed",
          result.message
        );
        return;
      }
    } catch (error) {
      console.error("Login error:", error);

      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* TOP BRAND AREA */}

        <View style={styles.brandSection}>

          <View style={styles.logoWrapper}>
            <View style={styles.logoGlow} />

            <View style={styles.logoCircle}>
              <Text style={styles.owlEmoji}>
                🦉
              </Text>
            </View>
          </View>

          <Text style={styles.appName}>
            FotoOwl
          </Text>

          <Text style={styles.tagline}>
            Capture • Discover • Inspire
          </Text>
        </View>

        {/* LOGIN CARD */}

        <View style={styles.loginCard}>

          <View style={styles.headingRow}>
            <View>
              <Text style={styles.welcome}>
                Welcome back
              </Text>

              <Text style={styles.heading}>
                Sign in to continue
              </Text>
            </View>

            <View style={styles.sparkle}>
              <Text style={styles.sparkleText}>
                ✦
              </Text>
            </View>
          </View>

          <Text style={styles.description}>
            Access your favorite photos and
            personal gallery.
          </Text>

          {/* EMAIL */}

          <View style={styles.fieldWrapper}>
            <InputField
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);

                if (emailError) {
                  setEmailError("");
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
            />
          </View>

          {/* PASSWORD */}

          <View style={styles.fieldWrapper}>
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);

                if (passwordError) {
                  setPasswordError("");
                }
              }}
              secureTextEntry
              error={passwordError}
            />
          </View>

          {/* LOGIN */}

          <View style={styles.loginButtonWrapper}>
            <Button
              title={
                isLoading
                  ? "Signing in..."
                  : "Sign In"
              }
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>

          {/* DIVIDER */}

          <View style={styles.dividerRow}>
            <View style={styles.divider} />

            <Text style={styles.orText}>
              OR
            </Text>

            <View style={styles.divider} />
          </View>

          {/* REGISTER */}

          <View style={styles.registerBox}>
            <Text style={styles.registerText}>
              New to FotoOwl?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register")
              }
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}>
                Create an account →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECURITY */}

        <View style={styles.securityRow}>
          <View style={styles.securityIcon}>
            <Text style={styles.lock}>
              🔒
            </Text>
          </View>

          <Text style={styles.securityText}>
            Your account is securely stored
            on this device.
          </Text>
        </View>

        <Text style={styles.footer}>
          FotoOwl · Your visual world
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4FA",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },

  /* BRAND */

  brandSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoWrapper: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },

  logoGlow: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#DED9FF",
    opacity: 0.55,
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",

    elevation: 8,

    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  owlEmoji: {
    fontSize: 38,
  },

  appName: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "900",
    color: "#20202A",
    letterSpacing: -1,
  },

  tagline: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#96949F",
  },

  /* CARD */

  loginCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingVertical: 24,

    elevation: 5,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },

  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcome: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6C5CE7",
    marginBottom: 4,
  },

  heading: {
    fontSize: 23,
    fontWeight: "900",
    color: "#24232D",
    letterSpacing: -0.4,
  },

  sparkle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F0EEFF",
    alignItems: "center",
    justifyContent: "center",
  },

  sparkleText: {
    fontSize: 23,
    color: "#6C5CE7",
  },

  description: {
    marginTop: 8,
    marginBottom: 21,
    fontSize: 12,
    lineHeight: 18,
    color: "#9997A2",
  },

  fieldWrapper: {
    marginBottom: 2,
  },

  loginButtonWrapper: {
    marginTop: 7,
  },

  /* DIVIDER */

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEEEF3",
  },

  orText: {
    marginHorizontal: 12,
    fontSize: 9,
    fontWeight: "800",
    color: "#B0AEB8",
  },

  /* REGISTER */

  registerBox: {
    alignItems: "center",
  },

  registerText: {
    fontSize: 12,
    color: "#888691",
    marginBottom: 7,
  },

  registerLink: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6C5CE7",
  },

  /* SECURITY */

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 19,
    paddingHorizontal: 15,
  },

  securityIcon: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#E9F7EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  lock: {
    fontSize: 12,
  },

  securityText: {
    fontSize: 10,
    color: "#92909A",
  },

  footer: {
    marginTop: 17,
    textAlign: "center",
    fontSize: 9,
    color: "#B5B3BC",
    letterSpacing: 0.4,
  },
});
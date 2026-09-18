import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import InputField from "../../components/InputField";
import Button from "../../components/Button";
import useAuthStore from "../../store/useAuthStore";
import {
  RegisterErrors,
  validateRegisterForm,
} from "../../utils/validation";
import { User } from "../../types/auth";

export default function RegisterScreen({ navigation }: any) {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<
    "Male" | "Female" | "Other"
  >("Male");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleRegister = async () => {
    const formData = {
      fullName,
      email,
      gender,
      mobile,
      address,
      city,
      password,
      confirmPassword,
    };

    const validationErrors = validateRegisterForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const user: User = {
      fullName: fullName.trim(),
      email: email.trim(),
      gender,
      mobile: mobile.trim(),
      address: address.trim(),
      city: city.trim(),
      password,
    };

    try {
      await register(user);

      Alert.alert(
        "Account Created 🎉",
        "Your FotoOwl account has been created successfully.",
        [
          {
            text: "Continue to Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);

      Alert.alert(
        "Registration Failed",
        "Something went wrong. Please try again."
      );
    }
  };

  const updateField = (
    setter: (value: string) => void,
    value: string,
    errorKey: keyof RegisterErrors
  ) => {
    setter(value);

    if (errors[errorKey]) {
      setErrors((current) => ({
        ...current,
        [errorKey]: undefined,
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BRAND */}

        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.owlEmoji}>🦉</Text>
          </View>

          <Text style={styles.appName}>FotoOwl</Text>

          <Text style={styles.tagline}>
            Capture • Discover • Inspire
          </Text>
        </View>

        {/* FORM CARD */}

        <View style={styles.formCard}>
          <View style={styles.headingRow}>
            <View style={styles.headingContent}>
              <Text style={styles.smallHeading}>GET STARTED</Text>

              <Text style={styles.title}>
                Create your account
              </Text>
            </View>

            <View style={styles.sparkle}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Create your account and start exploring beautiful
            photography.
          </Text>

          {/* FULL NAME */}

          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(value) =>
              updateField(setFullName, value, "fullName")
            }
            error={errors.fullName}
          />

          {/* EMAIL */}

          <InputField
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={(value) =>
              updateField(setEmail, value, "email")
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />

          {/* GENDER */}

          <Text style={styles.label}>Gender</Text>

          <View style={styles.genderContainer}>
            {["Male", "Female", "Other"].map((item) => {
              const selected = gender === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.genderOption,
                    selected && styles.genderOptionSelected,
                  ]}
                  onPress={() => {
                    setGender(
                      item as "Male" | "Female" | "Other"
                    );

                    if (errors.gender) {
                      setErrors((current) => ({
                        ...current,
                        gender: undefined,
                      }));
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioSelected,
                    ]}
                  >
                    {selected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.genderText,
                      selected && styles.genderTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {errors.gender && (
            <Text style={styles.error}>{errors.gender}</Text>
          )}

          {/* MOBILE */}

          <InputField
            label="Mobile Number"
            placeholder="Enter 10 digit mobile number"
            value={mobile}
            onChangeText={(value) =>
              updateField(setMobile, value, "mobile")
            }
            keyboardType="numeric"
            maxLength={10}
            error={errors.mobile}
          />

          {/* ADDRESS */}

          <InputField
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={(value) =>
              updateField(setAddress, value, "address")
            }
            multiline
            numberOfLines={3}
            style={styles.addressInput}
            error={errors.address}
          />

          {/* CITY DROPDOWN */}

          <Text style={styles.label}>City</Text>

          <TouchableOpacity
            style={[
              styles.cityDropdown,
              errors.city && styles.cityDropdownError,
            ]}
            onPress={() =>
              setShowCityDropdown((current) => !current)
            }
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.cityText,
                !city && styles.cityPlaceholder,
              ]}
            >
              {city || "Select your city"}
            </Text>

            <Text style={styles.dropdownArrow}>
              {showCityDropdown ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {showCityDropdown && (
            <View style={styles.cityOptions}>
              {[
                "Hyderabad",
                "Bengaluru",
                "Mumbai",
                "Chennai",
                "Pune",
                "Delhi",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.cityOption}
                  onPress={() => {
                    setCity(item);
                    setShowCityDropdown(false);

                    if (errors.city) {
                      setErrors((current) => ({
                        ...current,
                        city: undefined,
                      }));
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cityOptionText,
                      city === item &&
                        styles.cityOptionSelected,
                    ]}
                  >
                    {item}
                  </Text>

                  {city === item && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {errors.city && (
            <Text style={styles.error}>{errors.city}</Text>
          )}

          {/* PASSWORD */}

          <InputField
            label="Password"
            placeholder="Minimum 6 characters"
            value={password}
            onChangeText={(value) =>
              updateField(setPassword, value, "password")
            }
            secureTextEntry
            error={errors.password}
          />

          {/* CONFIRM PASSWORD */}

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(value) =>
              updateField(
                setConfirmPassword,
                value,
                "confirmPassword"
              )
            }
            secureTextEntry
            error={errors.confirmPassword}
          />

          {/* CREATE ACCOUNT */}

          <View style={styles.buttonWrapper}>
            <Button
              title={
                isLoading
                  ? "Creating Account..."
                  : "Create Account"
              }
              onPress={handleRegister}
              disabled={isLoading}
            />
          </View>

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Login →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}

        <View style={styles.securityRow}>
          <Text style={styles.securityIcon}>🔒</Text>

          <Text style={styles.securityText}>
            Your account details are stored securely on this
            device.
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 40,
  },

  /* BRAND */

  brandSection: {
    alignItems: "center",
    marginBottom: 22,
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
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },

  owlEmoji: {
    fontSize: 37,
  },

  appName: {
    marginTop: 9,
    fontSize: 29,
    fontWeight: "900",
    color: "#20202A",
    letterSpacing: -0.8,
  },

  tagline: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: "#96949F",
  },

  /* CARD */

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
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

  headingContent: {
    flex: 1,
  },

  smallHeading: {
    marginBottom: 5,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#6C5CE7",
  },

  title: {
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

  /* FORM */

  label: {
    marginBottom: 9,
    fontSize: 13,
    fontWeight: "800",
    color: "#33323D",
  },

  genderContainer: {
    flexDirection: "row",
    marginBottom: 14,
  },

  genderOption: {
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E4EB",
    backgroundColor: "#FAFAFC",
    flexDirection: "row",
    alignItems: "center",
  },

  genderOptionSelected: {
    backgroundColor: "#F2F0FF",
    borderColor: "#D8D2FF",
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#C4C3CB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  radioSelected: {
    borderColor: "#6C5CE7",
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#6C5CE7",
  },

  genderText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#777680",
  },

  genderTextSelected: {
    color: "#6C5CE7",
  },

  error: {
    marginTop: -5,
    marginBottom: 10,
    color: "#E74C3C",
    fontSize: 11,
    fontWeight: "600",
  },

  addressInput: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  /* CITY DROPDOWN */

  cityDropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E4EB",
    borderRadius: 14,
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  cityDropdownError: {
    borderColor: "#E74C3C",
  },

  cityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#33323D",
  },

  cityPlaceholder: {
    color: "#9997A2",
    fontWeight: "500",
  },

  dropdownArrow: {
    fontSize: 12,
    color: "#6C5CE7",
    fontWeight: "900",
  },

  cityOptions: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E4EB",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
  },

  cityOption: {
    minHeight: 45,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0EFF4",
  },

  cityOptionText: {
    fontSize: 13,
    color: "#55545F",
    fontWeight: "600",
  },

  cityOptionSelected: {
    color: "#6C5CE7",
    fontWeight: "800",
  },

  checkMark: {
    fontSize: 16,
    color: "#6C5CE7",
    fontWeight: "900",
  },

  buttonWrapper: {
    marginTop: 5,
  },

  /* LOGIN */

  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  loginText: {
    fontSize: 12,
    color: "#888691",
    marginRight: 5,
  },

  loginLink: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6C5CE7",
  },

  /* SECURITY */

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingHorizontal: 12,
  },

  securityIcon: {
    fontSize: 13,
    marginRight: 7,
  },

  securityText: {
    fontSize: 10,
    color: "#96949F",
  },

  footer: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 9,
    color: "#B4B2BC",
    letterSpacing: 0.4,
  },
});
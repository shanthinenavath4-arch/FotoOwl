import React, { useEffect, useState } from "react";
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

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore(
    (state) => state.updateProfile
  );
  const logout = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<
    "Male" | "Female" | "Other"
  >("Male");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setGender(user.gender);
      setMobile(user.mobile);
      setAddress(user.address);
      setCity(user.city);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setGender(user.gender);
      setMobile(user.mobile);
      setAddress(user.address);
      setCity(user.city);
    }

    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobile.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedMobile ||
      !trimmedAddress ||
      !trimmedCity
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill all required fields."
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    const mobileRegex = /^\d{10}$/;

    if (!mobileRegex.test(trimmedMobile)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Mobile number must contain exactly 10 digits."
      );
      return;
    }

    const updatedUser = {
      ...user,
      fullName: trimmedName,
      email: trimmedEmail,
      gender,
      mobile: trimmedMobile,
      address: trimmedAddress,
      city: trimmedCity,
    };

    try {
      await updateProfile(updatedUser);

      setIsEditing(false);

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      Alert.alert(
        "Update Failed",
        "Unable to update your profile."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.noUserIcon}>👤</Text>

        <Text style={styles.noUserTitle}>
          No Profile Found
        </Text>

        <Text style={styles.noUserText}>
          User information is currently unavailable.
        </Text>
      </View>
    );
  }

  const initial =
    user.fullName?.charAt(0).toUpperCase() || "?";

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
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              My Profile
            </Text>

            <Text style={styles.subtitle}>
              Manage your personal information
            </Text>
          </View>

          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Text style={styles.editIcon}>✎</Text>

              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Hero */}

        <View style={styles.profileHero}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initial}
              </Text>
            </View>

            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.profileName}>
            {user.fullName}
          </Text>

          <Text style={styles.profileEmail}>
            {user.email}
          </Text>

          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>
              FOTOOWL MEMBER
            </Text>
          </View>
        </View>

        {/* Information Card */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIcon}>
              <Text style={styles.cardHeaderIconText}>
                ✦
              </Text>
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Personal Information
              </Text>

              <Text style={styles.cardSubtitle}>
                Your account details
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {isEditing ? (
            <>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
              />

              <InputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>
                Gender
              </Text>

              <View style={styles.genderContainer}>
                {[
                  "Male",
                  "Female",
                  "Other",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.genderOption,
                      gender === item &&
                        styles.genderOptionActive,
                    ]}
                    onPress={() =>
                      setGender(
                        item as
                          | "Male"
                          | "Female"
                          | "Other"
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.radio,
                        gender === item &&
                          styles.radioActive,
                      ]}
                    >
                      {gender === item && (
                        <View
                          style={
                            styles.radioInner
                          }
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.genderText,
                        gender === item &&
                          styles.genderTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField
                label="Mobile Number"
                placeholder="Enter mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="numeric"
                maxLength={10}
              />

              <InputField
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                style={styles.addressInput}
              />

              <InputField
                label="City"
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
              />

              <View style={styles.saveButtonWrapper}>
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                />
              </View>
            </>
          ) : (
            <>
              <ProfileRow
                icon="👤"
                label="Full Name"
                value={user.fullName}
              />

              <ProfileRow
                icon="✉"
                label="Email"
                value={user.email}
              />

              <ProfileRow
                icon="⚥"
                label="Gender"
                value={user.gender}
              />

              <ProfileRow
                icon="☎"
                label="Mobile"
                value={user.mobile}
              />

              <ProfileRow
                icon="⌂"
                label="Address"
                value={user.address}
              />

              <ProfileRow
                icon="◉"
                label="City"
                value={user.city}
                last
              />
            </>
          )}
        </View>

        {/* Logout */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>
            ⇥
          </Text>

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          FotoOwl • Your personal photography space
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface ProfileRowProps {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}

function ProfileRow({
  icon,
  label,
  value,
  last,
}: ProfileRowProps) {
  return (
    <View
      style={[
        styles.profileRow,
        last && styles.profileRowLast,
      ]}
    >
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>
          {label}
        </Text>

        <Text
          style={styles.rowValue}
          numberOfLines={2}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 29,
    fontWeight: "900",
    color: "#20202A",
    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#92919B",
  },

  editButton: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 21,
    backgroundColor: "#EDEAFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  editIcon: {
    marginRight: 6,
    fontSize: 16,
    color: "#6C5CE7",
    fontWeight: "800",
  },

  editText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6C5CE7",
  },

  cancelButton: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 21,
    backgroundColor: "#F0F0F4",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#666570",
  },

  profileHero: {
    alignItems: "center",
    marginTop: 27,
    marginBottom: 24,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 13,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",

    elevation: 7,

    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
  },

  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#45C46A",
    borderWidth: 3,
    borderColor: "#F7F7FB",
  },

  profileName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#24232D",
  },

  profileEmail: {
    marginTop: 4,
    fontSize: 13,
    color: "#92919B",
  },

  memberBadge: {
    marginTop: 11,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#EDEAFF",
  },

  memberBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#6C5CE7",
  },

  card: {
    padding: 19,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",

    elevation: 4,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 11,
    backgroundColor: "#EDEAFF",
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeaderIconText: {
    fontSize: 20,
    color: "#6C5CE7",
    fontWeight: "900",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#292833",
  },

  cardSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#9998A2",
  },

  divider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: "#EEEEF3",
  },

  profileRow: {
    minHeight: 66,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F4",
    flexDirection: "row",
    alignItems: "center",
  },

  profileRowLast: {
    borderBottomWidth: 0,
  },

  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowIconText: {
    fontSize: 16,
    color: "#6C5CE7",
  },

  rowContent: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#A09FA8",
    marginBottom: 4,
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#292833",
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#33323D",
    marginBottom: 9,
  },

  genderContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },

  genderOption: {
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E5EB",
    backgroundColor: "#FAFAFC",
    flexDirection: "row",
    alignItems: "center",
  },

  genderOptionActive: {
    borderColor: "#D8D2FF",
    backgroundColor: "#F2F0FF",
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#C5C4CB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  radioActive: {
    borderColor: "#6C5CE7",
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#6C5CE7",
  },

  genderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777680",
  },

  genderTextActive: {
    color: "#6C5CE7",
  },

  addressInput: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  saveButtonWrapper: {
    marginTop: 4,
  },

  logoutButton: {
    height: 52,
    marginTop: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0C8CC",
    backgroundColor: "#FFF8F8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutIcon: {
    marginRight: 8,
    fontSize: 19,
    color: "#D94A5B",
    fontWeight: "800",
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D94A5B",
  },

  footerText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
    color: "#B0AFB8",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7FB",
    paddingHorizontal: 30,
  },

  noUserIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  noUserTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#292833",
  },

  noUserText: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 13,
    color: "#888790",
  },
});
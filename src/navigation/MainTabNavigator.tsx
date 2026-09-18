import React from "react";
import {
  Text,
  View,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Main/HomeScreen";
import FavoritesScreen from "../screens/Main/FavoritesScreen";
import ProfileScreen from "../screens/Main/ProfileScreen";
import ImageDetailsScreen from "../screens/Main/ImageDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
      />

      <Stack.Screen
        name="ImageDetails"
        component={ImageDetailsScreen}
      />
    </Stack.Navigator>
  );
}

function TabIcon({
  type,
  focused,
}: {
  type: "home" | "heart" | "profile";
  focused: boolean;
}) {
  if (type === "home") {
    return (
      <View
        style={{
          width: 40,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 23,
            color: focused ? "#6C5CE7" : "#A2A1AA",
            fontWeight: "800",
          }}
        >
          ⌂
        </Text>
      </View>
    );
  }

  if (type === "heart") {
    return (
      <View
        style={{
          width: 40,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 23,
            color: focused ? "#6C5CE7" : "#A2A1AA",
            fontWeight: "800",
          }}
        >
          {focused ? "♥" : "♡"}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: 40,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: focused ? "#6C5CE7" : "#A2A1AA",
          fontWeight: "800",
        }}
      >
        ●
      </Text>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "#A2A1AA",

        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,

          backgroundColor: "#FFFFFF",

          borderTopWidth: 1,
          borderTopColor: "#EEEEF3",

          elevation: 12,

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 1,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Explore",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              type="home"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favorites",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              type="heart"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",

          tabBarIcon: ({ focused }) => (
            <TabIcon
              type="profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
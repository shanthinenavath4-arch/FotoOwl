import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthStore from "../store/useAuthStore";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const loadSession = useAuthStore(
    (state) => state.loadSession
  );

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
        />
      )}
    </Stack.Navigator>
  );
}
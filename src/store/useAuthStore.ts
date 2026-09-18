import { create } from "zustand";

import {
  getData,
  removeData,
  saveData,
  STORAGE_KEYS,
} from "../utils/storage";

import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  register: (user: User) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (user) => {
    await saveData(STORAGE_KEYS.USER, user);

    set({
      user,
      isAuthenticated: false,
    });
  },

  login: async (email, password) => {
    const storedUser = await getData<User>(
      STORAGE_KEYS.USER
    );

    if (!storedUser) {
      return {
        success: false,
        message: "No registered account found.",
      };
    }

    if (
      storedUser.email.toLowerCase() !==
      email.trim().toLowerCase()
    ) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (storedUser.password !== password) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    await saveData(STORAGE_KEYS.SESSION, true);

    set({
      user: storedUser,
      isAuthenticated: true,
    });

    return {
      success: true,
      message: "Login successful.",
    };
  },

  logout: async () => {
    await removeData(STORAGE_KEYS.SESSION);

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  loadSession: async () => {
    try {
      const session = await getData<boolean>(
        STORAGE_KEYS.SESSION
      );

      const storedUser = await getData<User>(
        STORAGE_KEYS.USER
      );

      if (session && storedUser) {
        set({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(
        "Error loading authentication session:",
        error
      );

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates) => {
    const currentUser = await getData<User>(
      STORAGE_KEYS.USER
    );

    if (!currentUser) {
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      ...updates,
    };

    await saveData(
      STORAGE_KEYS.USER,
      updatedUser
    );

    set({
      user: updatedUser,
    });
  },
}));

export default useAuthStore;
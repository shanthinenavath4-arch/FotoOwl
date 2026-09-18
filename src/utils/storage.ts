import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  USER: "@fotowl_user",
  SESSION: "@fotowl_session",
  FAVORITES: "@fotowl_favorites",
};

export const saveData = async (
  key: string,
  value: unknown
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving data for ${key}:`, error);
  }
};

export const getData = async <T>(
  key: string
): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error reading data for ${key}:`, error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for ${key}:`, error);
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
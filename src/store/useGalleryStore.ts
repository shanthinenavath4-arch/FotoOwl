import { create } from "zustand";

import { GalleryImage, GalleryFilter } from "../types/gallery";
import { getData, saveData, STORAGE_KEYS } from "../utils/storage";

interface GalleryState {
  images: GalleryImage[];
  favorites: string[];
  searchQuery: string;
  filter: GalleryFilter;
  isLoading: boolean;

  setImages: (images: GalleryImage[]) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: GalleryFilter) => void;

  toggleFavorite: (imageId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;

  isFavorite: (imageId: string) => boolean;
}

const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  favorites: [],
  searchQuery: "",
  filter: "ALL",
  isLoading: false,

  setImages: (images) => {
    set({ images });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setFilter: (filter) => {
    set({ filter });
  },

  toggleFavorite: async (imageId) => {
    const currentFavorites = get().favorites;

    let updatedFavorites: string[];

    if (currentFavorites.includes(imageId)) {
      updatedFavorites = currentFavorites.filter(
        (id) => id !== imageId
      );
    } else {
      updatedFavorites = [...currentFavorites, imageId];
    }

    set({
      favorites: updatedFavorites,
    });

    await saveData(
      STORAGE_KEYS.FAVORITES,
      updatedFavorites
    );
  },

  loadFavorites: async () => {
    const storedFavorites =
      await getData<string[]>(STORAGE_KEYS.FAVORITES);

    set({
      favorites: storedFavorites || [],
    });
  },

  isFavorite: (imageId) => {
    return get().favorites.includes(imageId);
  },
}));

export default useGalleryStore;
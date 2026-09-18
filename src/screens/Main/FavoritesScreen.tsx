import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import useGalleryStore from "../../store/useGalleryStore";
import { GalleryImage } from "../../types/gallery";

export default function FavoritesScreen({ navigation }: any) {
  const images = useGalleryStore((state) => state.images);
  const favorites = useGalleryStore((state) => state.favorites);
  const toggleFavorite = useGalleryStore(
    (state) => state.toggleFavorite
  );
  const loadFavorites = useGalleryStore(
    (state) => state.loadFavorites
  );

  const [favoriteImages, setFavoriteImages] = useState<
    GalleryImage[]
  >([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved favorites from AsyncStorage
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Build complete favorite image list
  useEffect(() => {
    const loadFavoriteImages = async () => {
      setIsLoading(true);

      if (favorites.length === 0) {
        setFavoriteImages([]);
        setIsLoading(false);
        return;
      }

      const imageMap = new Map<string, GalleryImage>();

      // Images already loaded in the app
      images.forEach((image) => {
        imageMap.set(image.id, image);
      });

      // Fetch favorite images which are not currently loaded
      const missingIds = favorites.filter(
        (id) => !imageMap.has(id)
      );

      if (missingIds.length > 0) {
        const fetchedImages = await Promise.all(
          missingIds.map(async (id) => {
            try {
              const response = await fetch(
                `https://picsum.photos/id/${id}/info`
              );

              if (!response.ok) {
                return null;
              }

              const data = await response.json();

              return data as GalleryImage;
            } catch (error) {
              console.log(
                `Unable to load favorite ${id}`,
                error
              );

              return null;
            }
          })
        );

        fetchedImages.forEach((image) => {
          if (image) {
            imageMap.set(image.id, image);
          }
        });
      }

      // Keep the same order as saved favorite IDs
      const orderedFavorites = favorites
        .map((id) => imageMap.get(id))
        .filter(
          (image): image is GalleryImage =>
            Boolean(image)
        );

      setFavoriteImages(orderedFavorites);
      setIsLoading(false);
    };

    loadFavoriteImages();
  }, [favorites, images]);

  // Search inside favorites
  const filteredFavorites = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return favoriteImages;
    }

    return favoriteImages.filter((image) =>
      image.author.toLowerCase().includes(query)
    );
  }, [favoriteImages, searchQuery]);

  const handleRemoveFavorite = async (
    imageId: string
  ) => {
    await toggleFavorite(imageId);

    setFavoriteImages((current) =>
      current.filter(
        (image) => image.id !== imageId
      )
    );
  };

  const renderItem = ({
    item,
  }: {
    item: GalleryImage;
  }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("Home", {
              screen: "ImageDetails",
              params: {
                image: item,
              },
            })
          }
        >
          <Image
            source={{ uri: item.download_url }}
            style={styles.image}
          />

          <View style={styles.info}>
            <Text
              style={styles.author}
              numberOfLines={1}
            >
              {item.author}
            </Text>

            <Text style={styles.id}>
              ID: {item.id}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            handleRemoveFavorite(item.id)
          }
        >
          <Text style={styles.removeIcon}>
            ❤️
          </Text>

          <Text style={styles.removeText}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Favorites
          </Text>

          <Text style={styles.subtitle}>
            {favorites.length} saved image
            {favorites.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Search */}
      {favorites.length > 0 && (
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>
            🔎
          </Text>

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search favorites by author..."
            placeholderTextColor="#999999"
            style={styles.searchInput}
          />
        </View>
      )}

      {/* Loading */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#6C5CE7"
          />

          <Text style={styles.loadingText}>
            Loading favorites...
          </Text>
        </View>
      ) : filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>
            {favorites.length === 0
              ? "🤍"
              : "🔎"}
          </Text>

          <Text style={styles.emptyTitle}>
            {favorites.length === 0
              ? "No Favorites Yet"
              : "No Results"}
          </Text>

          <Text style={styles.emptyText}>
            {favorites.length === 0
              ? "Tap the heart icon on images you love."
              : "Try searching with a different author name."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#20202A",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#888888",
  },

  searchContainer: {
    height: 50,
    marginHorizontal: 18,
    marginBottom: 14,
    paddingHorizontal: 14,

    borderRadius: 14,
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E5EC",

    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
  },

  list: {
    padding: 18,
    paddingTop: 4,
    paddingBottom: 30,
  },

  card: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",

    elevation: 3,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#EEEEF2",
  },

  info: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 8,
  },

  author: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222222",
  },

  id: {
    marginTop: 4,
    fontSize: 12,
    color: "#888888",
  },

  removeButton: {
    height: 46,
    marginHorizontal: 15,
    marginBottom: 14,

    borderRadius: 12,
    backgroundColor: "#FFF4F5",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  removeIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  removeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D94A5B",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#888888",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#222222",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#888888",
  },
});
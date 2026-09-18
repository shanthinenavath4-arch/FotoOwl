import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ImageCard from "../../components/ImageCard";
import useFetchImages from "../../hooks/useFetchImages";
import useGalleryStore from "../../store/useGalleryStore";

export default function HomeScreen({ navigation }: any) {
  const {
    images,
    error,
    loadImages,
    refreshImages,
    loadMoreImages,
    hasMore,
  } = useFetchImages();

  const searchQuery = useGalleryStore(
    (state) => state.searchQuery
  );

  const setSearchQuery = useGalleryStore(
    (state) => state.setSearchQuery
  );

  const filter = useGalleryStore(
    (state) => state.filter
  );

  const setFilter = useGalleryStore(
    (state) => state.setFilter
  );

  const favorites = useGalleryStore(
    (state) => state.favorites
  );

  const toggleFavorite = useGalleryStore(
    (state) => state.toggleFavorite
  );

  const loadFavorites = useGalleryStore(
    (state) => state.loadFavorites
  );

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  // Initial loading
  useEffect(() => {
    const initializeHome = async () => {
      setInitialLoading(true);

      try {
        await Promise.all([
          loadImages(1, true),
          loadFavorites(),
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeHome();
  }, []);

  // Pull to refresh
  const handleRefresh = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      await refreshImages();
    } finally {
      setRefreshing(false);
    }
  };

  // Pagination
  const handleLoadMore = async () => {
    if (
      loadingMore ||
      !hasMore ||
      images.length === 0
    ) {
      return;
    }

    setLoadingMore(true);

    try {
      await loadMoreImages();
    } finally {
      setLoadingMore(false);
    }
  };

  // Search + filter
  const filteredImages = useMemo(() => {
    let result = [...images];

    const query = searchQuery
      .trim()
      .toLowerCase();

    // Search by author
    if (query) {
      result = result.filter((image) =>
        image.author
          .toLowerCase()
          .includes(query)
      );
    }

    // A-M filter
    if (filter === "A-M") {
      result = result.filter((image) => {
        const firstLetter = image.author
          .trim()
          .charAt(0)
          .toUpperCase();

        return (
          firstLetter >= "A" &&
          firstLetter <= "M"
        );
      });
    }

    // N-Z filter
    if (filter === "N-Z") {
      result = result.filter((image) => {
        const firstLetter = image.author
          .trim()
          .charAt(0)
          .toUpperCase();

        return (
          firstLetter >= "N" &&
          firstLetter <= "Z"
        );
      });
    }

    return result;
  }, [images, searchQuery, filter]);

  // Initial loading screen
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.owlCircle}>
          <Text style={styles.owlEmoji}>🦉</Text>
        </View>

        <Text style={styles.loadingTitle}>
          FotoOwl
        </Text>

        <Text style={styles.loadingSubtitle}>
          Discover beautiful photography
        </Text>

        <ActivityIndicator
          size="small"
          color="#6C5CE7"
          style={styles.loadingSpinner}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ImageCard
            imageUrl={item.download_url}
            author={item.author}
            imageId={item.id}
            isFavorite={favorites.includes(
              item.id
            )}
            onFavoritePress={() =>
              toggleFavorite(item.id)
            }
            onPress={() =>
              navigation.navigate(
                "ImageDetails",
                {
                  image: item,
                }
              )
            }
          />
        )}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.logo}>
                  FotoOwl
                </Text>

                <Text style={styles.subtitle}>
                  Explore beautiful photography
                </Text>
              </View>

              <View style={styles.favoriteBadge}>
                <Text
                  style={styles.favoriteBadgeText}
                >
                  ❤️ {favorites.length}
                </Text>
              </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>
                🔎
              </Text>

              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by author..."
                placeholderTextColor="#999999"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    setSearchQuery("")
                  }
                >
                  <Text style={styles.clearButton}>
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Filters */}
            <View style={styles.filterContainer}>
              <FilterButton
                title="All"
                active={filter === "ALL"}
                onPress={() =>
                  setFilter("ALL")
                }
              />

              <FilterButton
                title="A - M"
                active={filter === "A-M"}
                onPress={() =>
                  setFilter("A-M")
                }
              />

              <FilterButton
                title="N - Z"
                active={filter === "N-Z"}
                onPress={() =>
                  setFilter("N-Z")
                }
              />
            </View>

            {/* Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Explore
              </Text>

              <Text style={styles.resultCount}>
                {filteredImages.length} results
              </Text>
            </View>

            {/* Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>
                  ⚠️
                </Text>

                <View style={styles.errorContent}>
                  <Text style={styles.errorTitle}>
                    Something went wrong
                  </Text>

                  <Text
                    style={styles.errorMessage}
                  >
                    {error}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    loadImages(1, true)
                  }
                >
                  <Text style={styles.retryText}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6C5CE7"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                🔎
              </Text>

              <Text style={styles.emptyTitle}>
                No images found
              </Text>

              <Text style={styles.emptyMessage}>
                Try a different author or filter.
              </Text>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery("");
                  setFilter("ALL");
                }}
              >
                <Text style={styles.resetText}>
                  Reset Filters
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator
                size="small"
                color="#6C5CE7"
              />

              <Text style={styles.footerText}>
                Loading more images...
              </Text>
            </View>
          ) : !hasMore &&
            filteredImages.length > 0 ? (
            <Text style={styles.endText}>
              You've reached the end ✨
            </Text>
          ) : null
        }
      />
    </View>
  );
}

function FilterButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        active && styles.activeFilter,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  list: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  header: {
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#20202A",
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#888888",
  },

  favoriteBadge: {
    minWidth: 58,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#EDEAFF",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6C5CE7",
  },

  searchContainer: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EC",
    paddingHorizontal: 14,
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

  clearButton: {
    fontSize: 16,
    color: "#888888",
    padding: 4,
  },

  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  filterButton: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4EB",
    alignItems: "center",
    justifyContent: "center",
  },

  activeFilter: {
    backgroundColor: "#6C5CE7",
    borderColor: "#6C5CE7",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777777",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  sectionHeader: {
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#22222C",
  },

  resultCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999999",
  },

  errorContainer: {
    marginBottom: 14,
    padding: 13,
    borderRadius: 14,
    backgroundColor: "#FFF7E8",
    borderWidth: 1,
    borderColor: "#F3D99B",
    flexDirection: "row",
    alignItems: "center",
  },

  errorIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#684F18",
  },

  errorMessage: {
    marginTop: 2,
    fontSize: 11,
    color: "#856B2C",
  },

  retryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6C5CE7",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7FB",
  },

  owlCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EDEAFF",
    alignItems: "center",
    justifyContent: "center",
  },

  owlEmoji: {
    fontSize: 42,
  },

  loadingTitle: {
    marginTop: 18,
    fontSize: 23,
    fontWeight: "900",
    color: "#22222C",
  },

  loadingSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#999999",
  },

  loadingSpinner: {
    marginTop: 16,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 65,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 46,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#22222C",
  },

  emptyMessage: {
    marginTop: 7,
    fontSize: 13,
    textAlign: "center",
    color: "#999999",
  },

  resetButton: {
    marginTop: 18,
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
  },

  resetText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  footerText: {
    marginTop: 8,
    fontSize: 12,
    color: "#888888",
  },

  endText: {
    paddingVertical: 22,
    textAlign: "center",
    fontSize: 12,
    color: "#999999",
  },
});
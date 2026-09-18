import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library/legacy";

import useGalleryStore from "../../store/useGalleryStore";

export default function ImageDetailsScreen({
  route,
  navigation,
}: any) {
  const { image } = route.params;

  const favorites = useGalleryStore(
    (state) => state.favorites
  );

  const toggleFavorite = useGalleryStore(
    (state) => state.toggleFavorite
  );

  const [isDownloading, setIsDownloading] = useState(false);

  const isFavorite = favorites.includes(image.id);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Request gallery permission
      const permission =
        await MediaLibrary.requestPermissionsAsync(
          true,
          ["photo"]
        );

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo/gallery permission to save images."
        );
        return;
      }

      // Create file name with .jpg extension
      const fileName = `fotoowl_${image.id}_${Date.now()}.jpg`;

      // Create destination file
      const destination = new File(
        Paths.cache,
        fileName
      );

      // Download image
      const downloadedFile =
        await File.downloadFileAsync(
          image.download_url,
          destination
        );

      console.log(
        "Downloaded file:",
        downloadedFile.uri
      );

      // Save to gallery
      const asset =
        await MediaLibrary.createAssetAsync(
          downloadedFile.uri
        );

      // Create / use FotoOwl album
      try {
        const album =
          await MediaLibrary.getAlbumAsync(
            "FotoOwl"
          );

        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync(
            [asset],
            album,
            false
          );
        } else {
          await MediaLibrary.createAlbumAsync(
            "FotoOwl",
            asset,
            false
          );
        }
      } catch (albumError) {
        console.log(
          "Album handling skipped:",
          albumError
        );
      }

      Alert.alert(
        "Download Complete",
        "Image saved to your gallery."
      );
    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      Alert.alert(
        "Download Failed",
        "Unable to save the image. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={{
          uri: image.download_url,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Favorite */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() =>
          toggleFavorite(image.id)
        }
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite ? "❤️" : "🤍"}
        </Text>

        <Text style={styles.favoriteText}>
          {isFavorite
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </Text>
      </TouchableOpacity>

      {/* Details */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>
          Image Details
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Author
          </Text>

          <Text style={styles.value}>
            {image.author}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Image ID
          </Text>

          <Text style={styles.value}>
            {image.id}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Width
          </Text>

          <Text style={styles.value}>
            {image.width}px
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Height
          </Text>

          <Text style={styles.value}>
            {image.height}px
          </Text>
        </View>
      </View>

      {/* Download */}
      <TouchableOpacity
        style={[
          styles.downloadButton,
          isDownloading &&
            styles.disabledButton,
        ]}
        onPress={handleDownload}
        disabled={isDownloading}
      >
        <Text style={styles.downloadIcon}>
          {isDownloading ? "⏳" : "⬇️"}
        </Text>

        <Text style={styles.downloadText}>
          {isDownloading
            ? "Downloading..."
            : "Download Image"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  content: {
    padding: 16,
    paddingBottom: 50,
  },

  backButton: {
    marginTop: 35,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  backText: {
    color: "#6C5CE7",
    fontSize: 16,
    fontWeight: "700",
  },

  image: {
    width: "100%",
    height: 380,
    borderRadius: 20,
    backgroundColor: "#EEEEF2",
  },

  favoriteButton: {
    height: 52,
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  favoriteText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 16,

    elevation: 3,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#20202A",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 12,

    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F4",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888888",
  },

  value: {
    flex: 1,
    marginLeft: 20,
    textAlign: "right",

    fontSize: 14,
    fontWeight: "700",
    color: "#222222",
  },

  downloadButton: {
    height: 56,

    marginTop: 18,
    marginBottom: 30,

    borderRadius: 14,

    backgroundColor: "#6C5CE7",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    elevation: 3,
  },

  disabledButton: {
    opacity: 0.6,
  },

  downloadIcon: {
    fontSize: 21,
    marginRight: 8,
  },

  downloadText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
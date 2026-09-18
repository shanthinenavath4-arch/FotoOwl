import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ImageCardProps {
  imageUrl: string;
  author: string;
  imageId: string;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

export default function ImageCard({
  imageUrl,
  author,
  imageId,
  isFavorite,
  onPress,
  onFavoritePress,
}: ImageCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />

        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="small" color="#6C5CE7" />
          </View>
        )}

        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>#{imageId}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={(event) => {
            event.stopPropagation();
            onFavoritePress();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? "❤️" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {author?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>PHOTOGRAPHER</Text>

          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
        </View>

        <View style={styles.viewButton}>
          <Text style={styles.viewText}>View</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",

    elevation: 4,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  imageContainer: {
    width: "100%",
    height: 230,
    position: "relative",
    backgroundColor: "#EEEEF4",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageLoader: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F1F7",
  },

  idBadge: {
    position: "absolute",
    left: 14,
    top: 14,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(20, 20, 25, 0.65)",
  },

  idBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  favoriteButton: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",

    elevation: 3,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  favoriteButtonActive: {
    backgroundColor: "#FFF0F2",
  },

  favoriteIcon: {
    fontSize: 23,
  },

  info: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EDEAFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#6C5CE7",
    fontSize: 18,
    fontWeight: "900",
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  label: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#AAA8B3",
    marginBottom: 4,
  },

  author: {
    fontSize: 16,
    fontWeight: "800",
    color: "#24232D",
  },

  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#F4F2FF",
  },

  viewText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6C5CE7",
  },

  arrow: {
    marginLeft: 4,
    marginTop: -1,
    fontSize: 19,
    lineHeight: 19,
    fontWeight: "600",
    color: "#6C5CE7",
  },
});
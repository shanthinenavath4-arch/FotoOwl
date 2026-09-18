import { useCallback, useRef, useState } from "react";
import { fetchImages } from "../api/picsumApi";
import useGalleryStore from "../store/useGalleryStore";

export default function useFetchImages() {
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  const setImages = useGalleryStore(
    (state) => state.setImages
  );

  const images = useGalleryStore(
    (state) => state.images
  );

  const loadImages = useCallback(
    async (
      pageNumber = 1,
      refresh = false
    ) => {
      // Prevent duplicate API calls
      if (isFetching.current) {
        return;
      }

      try {
        isFetching.current = true;
        setError(null);

        const newImages = await fetchImages(
          pageNumber,
          50
        );

        if (newImages.length === 0) {
          setHasMore(false);
          return;
        }

        if (refresh || pageNumber === 1) {
          setImages(newImages);
        } else {
          // Remove duplicate image IDs
          const existingIds = new Set(
            images.map((image) => image.id)
          );

          const uniqueImages = newImages.filter(
            (image) => !existingIds.has(image.id)
          );

          setImages([
            ...images,
            ...uniqueImages,
          ]);
        }

        setPage(pageNumber);
      } catch (err) {
        console.error(
          "Gallery loading error:",
          err
        );

        setError(
          "Unable to load images. Please try again."
        );
      } finally {
        isFetching.current = false;
      }
    },
    [images, setImages]
  );

  const refreshImages = useCallback(
    async () => {
      setHasMore(true);

      await loadImages(1, true);
    },
    [loadImages]
  );

  const loadMoreImages = useCallback(
    async () => {
      if (isFetching.current || !hasMore) {
        return;
      }

      await loadImages(page + 1);
    },
    [hasMore, page, loadImages]
  );

  return {
    images,
    error,
    hasMore,
    loadImages,
    refreshImages,
    loadMoreImages,
    isFetching: isFetching.current,
  };
}
import { GalleryImage } from "../types/gallery";

const PICSUM_API =
  "https://picsum.photos/v2/list";

export const fetchImages = async (
  page: number = 1,
  limit: number = 20
): Promise<GalleryImage[]> => {
  const response = await fetch(
    `${PICSUM_API}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  const data: GalleryImage[] = await response.json();

  return data;
};
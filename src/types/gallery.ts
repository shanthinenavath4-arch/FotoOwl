export interface GalleryImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type GalleryFilter = "ALL" | "A-M" | "N-Z";
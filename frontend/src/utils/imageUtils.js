// API base URL'ini tanımla
const API_BASE_URL = "http://10.0.2.2:3000";

// Resim URL'sini tam URL'ye çeviren yardımcı fonksiyon
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

// Varsayılan resim URL'lerini tanımla
export const DEFAULT_IMAGES = {
  BUSINESS: "https://placehold.co/400x200?text=Business",
  PRODUCT: "https://placehold.co/400x300?text=No+Image",
}; 
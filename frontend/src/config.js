// API URL'si - Development için localhost, production için gerçek URL
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";

// Public API URL'si - Başkalarının kullanabileceği API
export const PUBLIC_API_URL = process.env.EXPO_PUBLIC_PUBLIC_API_URL || "https://your-api-domain.com";

// Supabase Configuration (artık gerekli değil, API üzerinden erişim)
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project-ref.supabase.co";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key";

// Diğer yapılandırma değişkenleri buraya eklenebilir 
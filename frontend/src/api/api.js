import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, PUBLIC_API_URL } from "../config";

// Private API (giriş gerekli)
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 5000,
});

// Public API (herkes erişebilir)
export const publicApi = axios.create({
  baseURL: `${PUBLIC_API_URL}/api/public`,
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

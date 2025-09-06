import { publicApi } from '../api/api';

// Public API servisleri - Herkes erişebilir
export const publicApiService = {
  // Tüm ürünleri getir
  async getProducts(params = {}) {
    try {
      const response = await publicApi.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Public API - Get products error:', error);
      throw error;
    }
  },

  // Ürün detayını getir
  async getProductById(id) {
    try {
      const response = await publicApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Public API - Get product error:', error);
      throw error;
    }
  },

  // Tüm işletmeleri getir
  async getBusinesses() {
    try {
      const response = await publicApi.get('/businesses/public');
      return response.data;
    } catch (error) {
      console.error('Public API - Get businesses error:', error);
      throw error;
    }
  },

  // Belirli işletmenin ürünlerini getir
  async getBusinessProducts(businessId) {
    try {
      const response = await publicApi.get(`/businesses/${businessId}/products/public`);
      return response.data;
    } catch (error) {
      console.error('Public API - Get business products error:', error);
      throw error;
    }
  },

  // API sağlık kontrolü
  async healthCheck() {
    try {
      const response = await publicApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('Public API - Health check error:', error);
      throw error;
    }
  }
};

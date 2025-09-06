import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../../api/api';

const AdminProductManagement = ({ onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/products');
      const productData = res.data.products || res.data || [];
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      setError('Ürünler yüklenemedi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 18 }}>
        <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', padding: 8, position: 'absolute', left: 0 }}>
          <Icon name="arrow-left" size={22} color="#1976d2" />
          <Text style={{ color: '#1976d2', fontSize: 16, marginLeft: 5, fontWeight: 'bold' }}>Geri</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222', textAlign: 'center' }}>Ürünler</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : products.length === 0 ? (
        <Text style={{ color: '#888', fontSize: 18, marginTop: 40, textAlign: 'center' }}>Hiç ürün yok</Text>
      ) : (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
          {products.map((product, idx) => (
            <View key={product.id || idx} style={styles.productCard}>
              {product.image ? (
                <Image 
                  source={{ uri: product.image.uri }} 
                  style={styles.productImage}
                />
              ) : (
                <View style={styles.defaultImageContainer}>
                  <Icon name="shopping-bag" size={40} color="#666" />
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name || 'İsim yok'}</Text>
                <Text style={styles.productPrice}>Fiyat: {product.price ? `${product.price} TL` : '-'}</Text>
                <Text style={styles.productCategory}>Kategori: {product.category || '-'}</Text>
                <Text style={styles.productQuantity}>Miktar: {product.quantity || '0'}</Text>
                {product.expiration_date && (
                  <Text style={styles.productExpiration}>
                    Son Kullanma: {new Date(product.expiration_date).toLocaleDateString('tr-TR')}
                  </Text>
                )}
                {product.Business?.name && (
                  <Text style={styles.productBusiness}>İşletme: {product.Business.name}</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 22,
    marginBottom: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
    minHeight: 140,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 24,
    backgroundColor: '#f7f7f7',
  },
  defaultImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 24,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginBottom: 4,
  },
  productPrice: {
    color: '#1976d2',
    fontSize: 16,
    marginBottom: 2,
  },
  productCategory: {
    color: '#666',
    fontSize: 16,
    marginBottom: 2,
  },
  productQuantity: {
    color: '#43a047',
    fontSize: 15,
    marginBottom: 2,
  },
  productExpiration: {
    color: '#f57c00',
    fontSize: 14,
    marginBottom: 2,
  },
  productBusiness: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

export default AdminProductManagement; 
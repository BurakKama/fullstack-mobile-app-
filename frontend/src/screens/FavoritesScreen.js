import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { getImageUrl, DEFAULT_IMAGES } from "../utils/imageUtils";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Kullanıcı ID'sini al
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
      }
    };
    getUserId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        loadFavorites();
      }
    }, [userId])
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await AsyncStorage.getItem('favorites');
      if (favoritesData) {
        const favoriteIds = JSON.parse(favoritesData);
        const response = await api.get('/products');
        const allProducts = response.data.products;
        const favoriteProducts = allProducts.filter(product => favoriteIds.includes(product.id));
        setFavorites(favoriteProducts);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
      Alert.alert('Hata', 'Favoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const updatedFavorites = favorites.filter((item) => item.id !== productId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Favori silme hatası:', error);
      Alert.alert('Hata', 'Ürün favorilerden çıkarılırken bir hata oluştu');
    }
  };

  const addToCart = async (product) => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartItems = cart ? JSON.parse(cart) : [];

      const existingItem = cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      Alert.alert('Başarılı', 'Ürün sepete eklendi');
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      Alert.alert('Hata', 'Ürün sepete eklenirken bir hata oluştu');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteItem}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image 
        source={{ uri: getImageUrl(item.imageUrl) || DEFAULT_IMAGES.PRODUCT }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {item.discounted_price ? (
            <>
              <Text style={styles.oldPrice}>{item.price}₺ </Text>
              <Text style={styles.discountedPrice}>{item.discounted_price}₺</Text>
            </>
          ) : (
            <Text>{item.price}₺</Text>
          )}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => addToCart(item)}
          >
            <Icon name="shopping-cart" size={20} color="#fff" />
            <Text style={styles.buttonText}>Sepete Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromFavorites(item.id)}
          >
            <Icon name="delete" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Henüz favori ürününüz yok</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  itemImage: {
    width: 120,
    height: 120,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 8,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 6,
  },
  discountedPrice: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  removeButton: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
}); 
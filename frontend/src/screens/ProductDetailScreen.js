import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getImageUrl, DEFAULT_IMAGES } from '../utils/imageUtils';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
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

  useEffect(() => {
    console.log('Product data:', product);
    console.log('Description:', product.description);
    checkFavorite();
    if (userId) {
    checkCartStatus();
    }

    const unsubscribe = navigation.addListener('focus', () => {
      checkFavorite();
      if (userId) {
        checkCartStatus();
      }
    });

    return unsubscribe;
  }, [navigation, userId]);

  const checkFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        setIsFavorite(parsedFavorites.some((item) => item.id === product.id));
      }
    } catch (error) {
      console.error("Favori kontrolü hatası:", error);
    }
  };

  const checkCartStatus = async () => {
    try {
      const cartKey = `cart_${userId}`;
      const cart = await AsyncStorage.getItem(cartKey);
      if (cart) {
        const cartArray = JSON.parse(cart);
        setIsInCart(cartArray.some(item => item.id === product.id));
      }
    } catch (error) {
      console.error('Sepet durumu kontrol hatası:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let parsedFavorites = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        parsedFavorites = parsedFavorites.filter((item) => item.id !== product.id);
        Alert.alert("Başarılı", "Ürün favorilerden kaldırıldı");
      } else {
        parsedFavorites.push(product);
        Alert.alert("Başarılı", "Ürün favorilere eklendi");
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(parsedFavorites));
      setIsFavorite(!isFavorite);
      
      // Profil sayfasındaki favorileri güncelle
      navigation.setParams({ refreshFavorites: true });
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
      Alert.alert("Hata", "Favori işlemi sırasında bir hata oluştu");
    }
  };

  const updateQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        console.error('No user data found');
        Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
        return;
      }

      const user = JSON.parse(userData);
      console.log('Adding to cart for user:', user);
      
      const cartKey = `cart_${user.id}`;
      console.log('Cart key:', cartKey);
      
      const cartData = await AsyncStorage.getItem(cartKey);
      console.log('Existing cart data:', cartData);
      
      let cartItems = cartData ? JSON.parse(cartData) : [];
      const existingItem = cartItems.find((item) => item.id === product.id);
      console.log('Existing item:', existingItem);

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cartItems.push({ ...product, quantity });
      }

      console.log('New cart items:', cartItems);
      await AsyncStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log('Cart saved successfully');
      Alert.alert('Başarılı', 'Ürün sepete eklendi');
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      Alert.alert('Hata', 'Ürün sepete eklenirken bir hata oluştu');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: getImageUrl(product.imageUrl) || DEFAULT_IMAGES.PRODUCT }}
        style={styles.image}
        resizeMode="contain"
        onError={(e) => {
          console.log('Resim yükleme hatası:', e.nativeEvent.error);
          console.log('Resim URL:', product.imageUrl);
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{product.name}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Icon 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={28} 
              color={isFavorite ? "#D32F2F" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.priceContainer}>
          {product.discounted_price ? (
            <>
              <Text style={styles.oldPrice}>{product.price}₺</Text>
              <Text style={styles.discountedPrice}>{product.discounted_price}₺</Text>
            </>
          ) : (
            <Text style={styles.price}>{product.price}₺</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Icon name="category" size={20} color="#666" />
          <Text style={styles.infoText}>{product.category}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="inventory" size={20} color="#666" />
          <Text style={styles.infoText}>Stok: {product.quantity}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="event" size={20} color="#666" />
          <Text style={styles.infoText}>
            Son Kullanma: {new Date(product.expiration_date).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Ürün Açıklaması</Text>
          <Text style={styles.description}>
            {product.description || 'Bu ürün için henüz açıklama eklenmemiş.'}
          </Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Adet:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(-1)}>
              <Icon name="remove" size={20} color="#666" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(1)}>
              <Icon name="add" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Icon name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  favoriteButton: {
    padding: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  oldPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  descriptionContainer: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 15,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getImageUrl, DEFAULT_IMAGES } from '../utils/imageUtils';

export default function CartScreen() {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        setCartItems([]);
        setTotal(0);
        return;
      }

      const user = JSON.parse(userData);
      const cartKey = `cart_${user.id}`;
      const cart = await AsyncStorage.getItem(cartKey);

      if (cart) {
        const items = JSON.parse(cart);
        setCartItems(items);
        calculateTotal(items);
      } else {
        setCartItems([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = async (id, change) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const cartKey = `cart_${user.id}`;
      const newItems = cartItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      await AsyncStorage.setItem(cartKey, JSON.stringify(newItems));
      setCartItems(newItems);
      calculateTotal(newItems);
    } catch (error) {
      console.error('Miktar güncelleme hatası:', error);
      Alert.alert('Hata', 'Miktar güncellenirken bir hata oluştu');
    }
  };

  const removeItem = async (id) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const cartKey = `cart_${user.id}`;
      const newItems = cartItems.filter(item => item.id !== id);

      await AsyncStorage.setItem(cartKey, JSON.stringify(newItems));
      setCartItems(newItems);
      calculateTotal(newItems);
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      Alert.alert('Hata', 'Ürün silinirken bir hata oluştu');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: getImageUrl(item.imageUrl) || DEFAULT_IMAGES.PRODUCT }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}₺</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
            <Icon name="remove-circle" size={24} color="#D32F2F" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Icon name="add-circle" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
        <Icon name="delete" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Icon name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyCartText}>Sepetiniz boş</Text>

          {/* Alışverişe yönlendiren buton */}
          <TouchableOpacity
            style={styles.emptyCartButton}
            onPress={() => navigation.navigate('Home')} // Route adını projendeki ana sayfa ismine göre güncelle
            activeOpacity={0.7}
          >
            <Text style={styles.emptyCartButtonText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Toplam: {total}₺</Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => Alert.alert('Bilgi', 'Ödeme işlemi yakında eklenecek!')}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutButtonText}>Ödeme Yap</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50,
  },
  list: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptyCartButton: {
    marginTop: 16,
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

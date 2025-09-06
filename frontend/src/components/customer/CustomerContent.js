import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AddressModal from "../profile/AddressModal";
import { getImageUrl, DEFAULT_IMAGES } from "../../utils/imageUtils";

const OrderCard = ({ order }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Text style={styles.orderNumber}>Sipariş #{order.id}</Text>
      <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
        {getStatusLabel(order.status)}
      </Text>
    </View>
    
    <View style={styles.orderInfo}>
      <Text style={styles.orderDate}>
        <Icon name="calendar" size={14} color="#6c757d" /> {order.date}
      </Text>
      <Text style={styles.orderTotal}>
        <Icon name="money" size={14} color="#6c757d" /> Toplam: {order.total} TL
      </Text>
    </View>

    <View style={styles.orderItems}>
      {order.items.map((item, index) => (
        <View key={index} style={styles.orderItem}>
          {item.image ? (
            <Image source={{ uri: item.image.uri }} style={styles.itemImage} />
          ) : (
            <View style={styles.defaultImageContainer}>
              <Icon name="shopping-bag" size={24} color="#666" />
            </View>
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Adet: {item.quantity}</Text>
            <Text style={styles.itemPrice}>{item.price} TL</Text>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.orderActions}>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="eye" size={20} color="#007bff" />
        <Text style={styles.actionText}>Detaylar</Text>
      </TouchableOpacity>
      {order.status === 'pending' && (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#dc3545' }]}>
          <Icon name="times" size={20} color="#fff" />
          <Text style={[styles.actionText, { color: '#fff' }]}>İptal Et</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Beklemede';
    case 'processing':
      return 'İşleniyor';
    case 'shipped':
      return 'Kargoda';
    case 'delivered':
      return 'Teslim Edildi';
    case 'cancelled':
      return 'İptal Edildi';
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return '#ffc107';
    case 'processing':
      return '#007bff';
    case 'shipped':
      return '#17a2b8';
    case 'delivered':
      return '#28a745';
    case 'cancelled':
      return '#dc3545';
    default:
      return '#6c757d';
  }
};

const CustomerContent = ({
  orders = [],
  activeTab,
  favorites,
  onFavoritePress,
  onRemoveFavorite,
  showAddressModal,
  setShowAddressModal,
  handleAddressSuccess,
  addresses = [],
  onEditAddress,
  onDeleteAddress
}) => {
  const navigation = useNavigation();

  const renderEmptyState = (icon, title, message, buttonText, onPress) => (
    <View style={styles.emptyStateContainer}>
      <Icon name={icon} size={50} color="#ccc" />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateMessage}>{message}</Text>
      {buttonText && onPress && (
        <TouchableOpacity style={styles.emptyStateButton} onPress={onPress}>
          <Text style={styles.emptyStateButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFavorites = () => {
    if (!favorites || favorites.length === 0) {
      return renderEmptyState(
        "heart",
        "Henüz favori ürününüz yok",
        "Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.",
        "Ürünleri Keşfet",
        () => navigation.navigate("Home")
      );
    }

    return (
      <ScrollView style={styles.favoritesList}>
        {favorites.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.favoriteItem}
            onPress={() => onFavoritePress(item)}
          >
            <View style={styles.favoriteImageContainer}>
              {item.imageUrl ? (
                <Image 
                  source={{ uri: getImageUrl(item.imageUrl) || DEFAULT_IMAGES.PRODUCT }} 
                  style={styles.favoriteImage}
                  resizeMode="cover"
                  onError={(e) => {
                    console.log('Resim yükleme hatası:', e.nativeEvent.error);
                    console.log('Resim URL:', item.imageUrl);
                  }}
                />
              ) : (
                <View style={styles.defaultImageContainer}>
                  <Icon name="shopping-bag" size={30} color="#ccc" />
                </View>
              )}
            </View>
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteName} numberOfLines={1}>{item.name}</Text>
              {item.description && (
                <Text style={styles.favoriteDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View style={styles.favoritePriceContainer}>
                {item.discounted_price ? (
                  <>
                    <Text style={styles.oldPrice}>{item.price} TL</Text>
                    <Text style={styles.favoritePrice}>{item.discounted_price} TL</Text>
                  </>
                ) : (
                  <Text style={styles.favoritePrice}>{item.price} TL</Text>
                )}
                {item.quantity && (
                  <Text style={styles.favoriteQuantity}>Stok: {item.quantity}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeFavorite}
              onPress={() => onRemoveFavorite(item.id)}
            >
              <Icon name="trash" size={20} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderOrders = () => {
    return renderEmptyState(
      "shopping-cart",
      "Henüz siparişiniz bulunmuyor",
      "Alışverişe başlayarak ilk siparişinizi oluşturabilirsiniz.",
      "Alışverişe Başla",
      () => navigation.navigate("Home")
    );
  };

  const renderAddresses = () => {
    console.log('CustomerContent - Adresler prop:', addresses);
    if (!addresses || addresses.length === 0) {
      console.log('Adres listesi boş veya undefined');
      return renderEmptyState(
        "map-marker",
        "Henüz adresiniz bulunmuyor",
        "Adres ekleyerek siparişlerinizi daha kolay verebilirsiniz.",
        "Adres Ekle",
        () => setShowAddressModal(true)
      );
    }
    console.log('Adres listesi dolu, adres sayısı:', addresses.length);
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {addresses.map((address) => {
          console.log('Adres:', address);
          return (
            <View key={address.id} style={{ backgroundColor: '#e3f2fd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{address.title}</Text>
              <Text>{address.full_address}</Text>
              <Text>{address.city}, {address.district}</Text>
              <Text>{address.postal_code}</Text>
              <Text>{address.phone}</Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {activeTab === "favorites" && renderFavorites()}
      {activeTab === "orders" && renderOrders()}
      {activeTab === "address" && renderAddresses()}
      
      <AddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSuccess={handleAddressSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  addressesContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  addressesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addressesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addAddressButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressList: {
    flex: 1,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginLeft: 8,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addressActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  addressContent: {
    padding: 16,
  },
  addressInfo: {
    gap: 12,
  },
  addressDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
  useAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  useAddressButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 15,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  favoritesList: {
    flex: 1,
    padding: 16,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  favoriteImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  favoriteImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  defaultImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  favoriteInfo: {
    flex: 1,
    justifyContent: "center",
    marginRight: 8,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 13,
    color: "#6c757d",
    marginBottom: 6,
    lineHeight: 18,
  },
  favoritePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoritePrice: {
    fontSize: 15,
    color: "#1976d2",
    fontWeight: "600",
  },
  oldPrice: {
    fontSize: 13,
    color: "#6c757d",
    textDecorationLine: 'line-through',
  },
  favoriteQuantity: {
    fontSize: 13,
    color: "#28a745",
    fontWeight: "500",
    marginLeft: 'auto',
  },
  removeFavorite: {
    padding: 12,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  orderTotal: {
    fontSize: 14,
    color: '#6c757d',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CustomerContent; 
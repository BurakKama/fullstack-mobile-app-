import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const OrderCard = ({ order, onViewDetails, onCancel }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Sipariş #{order.id}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
          {getStatusLabel(order.status)}
        </Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.date}>
          <Icon name="calendar" size={14} color="#6c757d" /> {order.date}
        </Text>
        <Text style={styles.total}>
          <Icon name="money" size={14} color="#6c757d" /> Toplam: {order.total} TL
        </Text>
      </View>

      <View style={styles.items}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.item}>
            {item.image ? (
              <Image
                source={{ uri: item.image.uri }}
                style={styles.itemImage}
              />
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

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onViewDetails(order)}>
          <Icon name="eye" size={20} color="#007bff" />
          <Text style={styles.actionText}>Detaylar</Text>
        </TouchableOpacity>
        {order.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#dc3545' }]} 
            onPress={() => onCancel(order)}
          >
            <Icon name="times" size={20} color="#fff" />
            <Text style={[styles.actionText, { color: '#fff' }]}>İptal Et</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  date: {
    fontSize: 14,
    color: '#6c757d',
  },
  total: {
    fontSize: 14,
    color: '#6c757d',
  },
  items: {
    padding: 15,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  defaultImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 10,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#007bff',
  },
});

export default OrderCard; 
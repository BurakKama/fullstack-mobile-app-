import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Kullanıcı rollerine göre menü öğelerini tanımla
const getMenuByRole = (userType) => {
  switch (userType) {
    case 'customer':
      return [
        { key: 'favorites', label: 'Favorilerim' },
        { key: 'orders', label: 'Siparişlerim' },
        { key: 'addresses', label: 'Adreslerim' },
      ];
    case 'business':
      return [
        { key: 'products', label: 'Ürünlerim' },
        { key: 'orders', label: 'Siparişler' },
        { key: 'profile', label: 'Profil' },
      ];
    case 'admin':
      return [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'users', label: 'Kullanıcılar' },
        { key: 'businesses', label: 'İşletmeler' },
        { key: 'products', label: 'Ürünler' },
      ];
    default:
      return [];
  }
};

const HorizontalMenu = ({ menu, activeTab, setActiveTab, isAdmin = false }) => {
  if (!menu || menu.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        {menu.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.menuItem,
              activeTab === item.key && styles.activeMenuItem
            ]}
            onPress={() => setActiveTab(item.key)}
          >
            <Text 
              style={[
                styles.menuText,
                activeTab === item.key && styles.activeMenuText
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    maxWidth: 120,
  },
  activeMenuItem: {
    backgroundColor: '#1976d2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
  },
  activeMenuText: {
    color: '#fff',
  },
});

export { getMenuByRole };
export default HorizontalMenu; 
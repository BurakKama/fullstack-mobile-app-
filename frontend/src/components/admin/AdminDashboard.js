import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StatCard = ({ title, value, icon, color, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.statCard, { borderLeftColor: color }]}>
    <Icon name={icon} size={24} color={color} style={styles.statIcon} />
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const AdminDashboard = ({ stats, onAddUser, onAddBusiness, onAddProduct, onEditProfile, onStatPress }) => {
  const {
    totalUsers = 0,
    totalBusinesses = 0,
    totalProducts = 0,
    totalOrders = 0,
  } = stats || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Paneli</Text>
      
      <View style={styles.statsContainer}>
        <StatCard
          title="Toplam Kullanıcı"
          value={totalUsers}
          icon="users"
          color="#007bff"
          onPress={() => onStatPress && onStatPress('user')}
        />
        <StatCard
          title="Toplam İşletme"
          value={totalBusinesses}
          icon="building"
          color="#28a745"
          onPress={() => onStatPress && onStatPress('business')}
        />
        <StatCard
          title="Toplam Ürün"
          value={totalProducts}
          icon="shopping-bag"
          color="#ffc107"
          onPress={() => onStatPress && onStatPress('product')}
        />
        <StatCard
          title="Toplam Sipariş"
          value={totalOrders}
          icon="shopping-cart"
          color="#dc3545"
          onPress={() => onStatPress && onStatPress('order')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionItem} onPress={onAddUser}>
            <Icon name="user-plus" size={24} color="#007bff" />
            <Text style={styles.quickActionText}>Kullanıcı Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={onAddBusiness}>
            <Icon name="building" size={24} color="#28a745" />
            <Text style={styles.quickActionText}>Şirket Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={onAddProduct}>
            <Icon name="shopping-bag" size={24} color="#ffc107" />
            <Text style={styles.quickActionText}>Ürün Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={onEditProfile}>
            <Icon name="cog" size={24} color="#6c757d" />
            <Text style={styles.quickActionText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default AdminDashboard; 
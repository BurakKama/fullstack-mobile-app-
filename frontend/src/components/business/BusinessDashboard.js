import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Icon name={icon} size={24} color={color} style={styles.statIcon} />
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const BusinessDashboard = ({ stats = {}, businessInfo = {}, onAddProduct, onEditProfile }) => {
  const {
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
    activeOrders = 0,
  } = stats;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{businessInfo?.name || "İşletme Paneli"}</Text>
        <Text style={styles.subtitle}>{businessInfo?.sector || "Sektör"}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <StatCard
          title="Toplam Ürün"
          value={totalProducts}
          icon="shopping-bag"
          color="#007bff"
        />
        <StatCard
          title="Toplam Sipariş"
          value={totalOrders}
          icon="shopping-cart"
          color="#28a745"
        />
        <StatCard
          title="Toplam Gelir"
          value={`${totalRevenue} TL`}
          icon="money"
          color="#ffc107"
        />
        <StatCard
          title="Aktif Siparişler"
          value={activeOrders}
          icon="clock-o"
          color="#dc3545"
        />
      </View>

      <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionItem} onPress={onAddProduct}>
          <Icon name="plus" size={24} color="#007bff" />
          <Text style={styles.quickActionText}>Ürün Ekle</Text>
        </TouchableOpacity>
        <View style={styles.quickActionItem}>
          <Icon name="list" size={24} color="#28a745" />
          <Text style={styles.quickActionText}>Siparişler</Text>
        </View>
        <TouchableOpacity style={styles.quickActionItem} onPress={onEditProfile}>
          <Icon name="edit" size={24} color="#ffc107" />
          <Text style={styles.quickActionText}>Profili Düzenle</Text>
        </TouchableOpacity>
        <View style={styles.quickActionItem}>
          <Icon name="cog" size={24} color="#6c757d" />
          <Text style={styles.quickActionText}>Ayarlar</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Siparişler</Text>
        <View style={styles.recentOrders}>
          <Text style={styles.emptyText}>Henüz sipariş bulunmuyor</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 5,
  },
  statsContainer: {
    padding: 15,
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
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  recentOrders: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6c757d',
    fontSize: 14,
  },
});

export default BusinessDashboard; 
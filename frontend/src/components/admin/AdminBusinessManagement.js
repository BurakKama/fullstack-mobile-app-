import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../../api/api';

const AdminBusinessManagement = ({ onBack }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/businesses');
      const businessData = res.data.businesses || res.data || [];
      setBusinesses(Array.isArray(businessData) ? businessData : []);
    } catch (err) {
      setError('Şirketler yüklenemedi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 18 }}>
        <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', padding: 8, position: 'absolute', left: 0 }}>
          <Icon name="arrow-left" size={22} color="#1976d2" />
          <Text style={{ color: '#1976d2', fontSize: 16, marginLeft: 5, fontWeight: 'bold' }}>Geri</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222', textAlign: 'center' }}>Şirketler</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : businesses.length === 0 ? (
        <Text style={{ color: '#888', fontSize: 18, marginTop: 40, textAlign: 'center' }}>Hiç şirket yok</Text>
      ) : (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
          {businesses.map((business, idx) => (
            <View key={business.id || idx} style={styles.businessCard}>
              {business.image ? (
                <Image 
                  source={{ uri: business.image.uri }} 
                  style={styles.businessImage}
                />
              ) : (
                <View style={styles.defaultImageContainer}>
                  <Icon name="building" size={40} color="#666" />
                </View>
              )}
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{business.name || 'İsim yok'}</Text>
                <Text style={styles.businessEmail}>E-posta: {business.email || '-'}</Text>
                <Text style={styles.businessAddress}>Adres: {business.address || '-'}</Text>
                <Text style={styles.businessPhone}>Telefon: {business.phone || '-'}</Text>
                {business.User?.full_name && (
                  <Text style={styles.businessManager}>Yönetici: {business.User.full_name}</Text>
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
  businessCard: {
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
  businessImage: {
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
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginBottom: 4,
  },
  businessEmail: {
    color: '#666',
    fontSize: 16,
    marginBottom: 2,
  },
  businessAddress: {
    color: '#1976d2',
    fontSize: 16,
    marginBottom: 2,
  },
  businessPhone: {
    color: '#43a047',
    fontSize: 15,
    marginBottom: 2,
  },
  businessManager: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

export default AdminBusinessManagement; 
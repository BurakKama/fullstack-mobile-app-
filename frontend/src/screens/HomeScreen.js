import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CampaignSlider from "../components/CampaignSlider";
import CategoryFilter from "../components/CategoryFilter";
import axios from "axios";
import { API_URL } from "../config";
import { getImageUrl, DEFAULT_IMAGES } from "../utils/imageUtils";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      console.log('API URL:', `${API_URL}/api/businesses/all`); // Debug için URL'yi yazdır
      const response = await axios.get(`${API_URL}/api/businesses/all`);
      console.log('Response:', response.data); // Debug için response'u yazdır
      setBusinesses(response.data.businesses);
      setError(null);
    } catch (err) {
      console.error("İşletme yükleme hatası:", err.response || err); // Detaylı hata bilgisi
      setError("İşletmeler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSearch = () => {
    if (searchText.trim().length > 0) {
      navigation.navigate("Search", { 
        screen: "SearchMain", 
        params: { query: searchText.trim() } 
      });
    }
  };

  const handleBusinessPress = (business) => {
    navigation.navigate("BusinessProducts", { business });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBusinesses().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#D32F2F"]}
        />
      }
      bounces={true}
      overScrollMode="never"
      showsVerticalScrollIndicator={true}
    >
      <CampaignSlider />
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Arama çubuğu */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="İşletme veya kategori ara"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={onSubmitSearch}
        />
        <TouchableOpacity onPress={onSubmitSearch} style={styles.searchButton}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#D32F2F" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.businessesContainer}>
        {businesses.map((business) => (
          <TouchableOpacity
            key={business.id}
            style={styles.businessCard}
            onPress={() => handleBusinessPress(business)}
          >
            <Image
              source={{ uri: getImageUrl(business.imageUrl) || DEFAULT_IMAGES.BUSINESS }}
              style={styles.businessImage}
              resizeMode="cover"
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{business.name}</Text>
              <Text style={styles.businessDescription} numberOfLines={2}>
                {business.description || "Açıklama bulunmuyor"}
              </Text>
              <View style={styles.businessDetails}>
                <Icon name="location-on" size={16} color="#666" />
                <Text style={styles.businessAddress} numberOfLines={1}>
                  {business.address || "Adres bilgisi yok"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
  },
  businessesContainer: {
    paddingBottom: 20,
  },
  businessCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  businessImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  businessInfo: {
    padding: 15,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  businessDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  businessDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  businessAddress: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
    flex: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

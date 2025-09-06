import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { API_URL } from "../config";
import { getImageUrl, DEFAULT_IMAGES } from "../utils/imageUtils";

const { width } = Dimensions.get("window");

export default function BusinessProductsScreen({ route, navigation }) {
  const { business } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('API URL:', `${API_URL}/api/businesses/${business.id}/products`);
      const response = await axios.get(`${API_URL}/api/businesses/${business.id}/products`);
      console.log('Response:', response.data);
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      console.error("Ürün yükleme hatası:", err.response || err);
      setError("Ürünler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <ScrollView style={styles.container}>
      {/* İşletme Başlığı */}
      <View style={styles.businessHeader}>
        <Image
          source={{ uri: getImageUrl(business.imageUrl) || DEFAULT_IMAGES.BUSINESS }}
          style={styles.businessImage}
          resizeMode="cover"
          onError={(e) => console.log('Business image loading error:', e.nativeEvent.error)}
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
      </View>

      {/* Ürünler */}
      <View style={styles.productsContainer}>
        <Text style={styles.sectionTitle}>Ürünler</Text>
        {loading && <ActivityIndicator size="large" color="#D32F2F" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleProductPress(product)}
          >
            <Image
              source={{ uri: getImageUrl(product.imageUrl) || DEFAULT_IMAGES.PRODUCT }}
              style={styles.productImage}
              resizeMode="cover"
              onError={(e) => console.log('Product image loading error:', e.nativeEvent.error)}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {product.description || "Açıklama bulunmuyor"}
              </Text>
              <View style={styles.priceContainer}>
                {product.discounted_price ? (
                  <>
                    <Text style={styles.originalPrice}>{product.price} TL</Text>
                    <Text style={styles.discountedPrice}>
                      {product.discounted_price} TL
                    </Text>
                  </>
                ) : (
                  <Text style={styles.price}>{product.price} TL</Text>
                )}
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
  },
  businessHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
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
    fontSize: 20,
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
  productsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  productCard: {
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
  productImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
}); 
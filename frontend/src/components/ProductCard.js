import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getImageUrl, DEFAULT_IMAGES } from "../utils/imageUtils";

export default function ProductCard({ product, style }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={handlePress} activeOpacity={0.8}>
      <Image 
        source={{ 
          uri: getImageUrl(product.imageUrl) || DEFAULT_IMAGES.PRODUCT
        }} 
        style={styles.image}
        resizeMode="cover"
        onError={(e) => console.log('Resim yükleme hatası:', e.nativeEvent.error)}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>
          {product.discounted_price ? (
            <>
              <Text style={styles.oldPrice}>{product.price}₺ </Text>
              <Text style={styles.discountedPrice}>{product.discounted_price}₺</Text>
            </>
          ) : (
            <Text>{product.price}₺</Text>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  info: {
    padding: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    marginRight: 6,
  },
  discountedPrice: {
    color: "#D32F2F",
    fontWeight: "700",
  },
});

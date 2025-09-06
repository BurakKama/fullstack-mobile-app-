import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

export default function SearchScreen({ route }) {
  const [query, setQuery] = useState(route.params?.query || "");
 const { products, loading, error } = useProducts({ search: query.length > 2 ? query : null });


  useEffect(() => {
    setQuery(route.params?.query || "");
  }, [route.params?.query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ürün, işletme veya kategori ara"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={() => {
    if (query.length > 2) {
      // Belki ek bir arama tetikleme ya da state güncelleme
    }
  }}
      />

      {loading && <ActivityIndicator size="large" color="#D32F2F" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => {}}
            style={{ flex: 1, margin: 5 }}
          />
        )}
        ListEmptyComponent={() =>
          !loading && <Text style={styles.emptyText}>Ürün bulunamadı.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 30,
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
});

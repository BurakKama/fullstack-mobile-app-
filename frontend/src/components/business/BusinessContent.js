import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProductModal from "../profile/ProductModal";

const ProductCard = ({ product, onEdit, onDelete }) => (
  <View style={styles.productCard}>
    {product.image ? (
      <Image source={{ uri: product.image.uri }} style={styles.productImage} />
    ) : (
      <View style={styles.defaultImageContainer}>
        <Icon name="shopping-bag" size={40} color="#666" />
      </View>
    )}
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productCategory}>{product.category}</Text>
      <Text style={styles.productPrice}>{product.price} TL</Text>
      <Text style={styles.productStock}>
        <Icon name="cube" size={14} color="#6c757d" /> Stok: {product.quantity}
      </Text>
      <Text style={styles.productExpiry}>
        <Icon name="calendar" size={14} color="#6c757d" /> Son Kullanma: {product.date}
      </Text>
    </View>
    <View style={styles.productActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(product)}>
        <Icon name="edit" size={20} color="#007bff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(product)}>
        <Icon name="trash" size={20} color="#dc3545" />
      </TouchableOpacity>
    </View>
  </View>
);

const BusinessContent = ({ products = [], onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      "Ürün Silme",
      `${product.name} ürününü silmek istediğinizden emin misiniz?`,
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => onDeleteProduct(product),
        },
      ]
    );
  };

  const handleSubmit = (productData) => {
    if (selectedProduct) {
      onEditProduct({ ...selectedProduct, ...productData });
    } else {
      onAddProduct(productData);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ürünlerim</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Yeni Ürün</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-bag" size={48} color="#dee2e6" />
            <Text style={styles.emptyText}>Henüz ürün eklenmemiş</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddProduct}>
              <Text style={styles.emptyButtonText}>Ürün Ekle</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        editData={selectedProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
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
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  defaultImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  productStock: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  productExpiry: {
    fontSize: 14,
    color: '#6c757d',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#6c757d',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default BusinessContent; 
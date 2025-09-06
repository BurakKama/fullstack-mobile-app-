import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, TextInput, Image, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

// Telefon maske fonksiyonu
const formatPhone = (text) => {
  let cleaned = text.replace(/\D/g, '');
  let formatted = '0';
  if (cleaned.length > 1) formatted += ' (' + cleaned.slice(1, 4);
  if (cleaned.length >= 4) formatted += ') ' + cleaned.slice(4, 7);
  if (cleaned.length >= 7) formatted += ' ' + cleaned.slice(7, 9);
  if (cleaned.length >= 9) formatted += ' ' + cleaned.slice(9, 11);
  return formatted.trim();
};

const ProductModal = ({ visible, onClose, onSubmit, editData }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && editData) {
      setName(editData.name || "");
      setCategory(editData.category || "");
      setPrice(editData.price ? String(editData.price) : "");
      setDesc(editData.description || "");
      setAddress(editData.address || "");
      setPhone(editData.phone || "");
      setQuantity(editData.quantity ? String(editData.quantity) : "");
      setDate(editData.expiration_date ? new Date(editData.expiration_date) : new Date());
      setImage(editData.imageUrl ? { uri: `http://10.0.2.2:3000${editData.imageUrl}` } : null);
    } else if (visible && !editData) {
      setName(""); setCategory(""); setPrice(""); setDesc(""); setAddress(""); setPhone(""); setQuantity(""); setDate(new Date()); setImage(null);
    }
  }, [visible, editData]);

  const handleSubmit = () => {
    setLoading(true);
    onSubmit({ name, desc, price, category, address, phone, quantity, expiration_date: date, image });
    setLoading(false);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Selected image:', result.assets[0]);
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Resim seçme hatası:', error);
      Alert.alert(
        'Hata',
        'Resim seçilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '90%' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Yeni Ürün Ekle</Text>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Ürün Görseli */}
            <TouchableOpacity 
              style={styles.imageUploadContainer} 
              onPress={pickImage}
            >
              {image ? (
                <Image 
                  source={{ uri: image.uri }} 
                  style={styles.productImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="camera" size={40} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Ürün Görseli Seç</Text>
                  <Text style={styles.imagePlaceholderSubtext}>Önerilen boyut: 800x600px</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Ürün Bilgileri */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ürün Adı *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ürün adını girin"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Açıklama *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={desc}
                onChangeText={setDesc}
                placeholder="Ürün açıklamasını girin"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Fiyat (TL) *</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={text => setPrice(text.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Stok *</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={text => setQuantity(text.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kategori *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  style={styles.picker}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  <Picker.Item label="Kategori Seçin" value="" />
                  <Picker.Item label="Yemek" value="yemek" />
                  <Picker.Item label="Tatlı" value="tatli" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Son Kullanma Tarihi *</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDate(true)}
              >
                <Text style={styles.datePickerText}>
                  {date ? date.toLocaleDateString('tr-TR') : "Tarih Seçin"}
                </Text>
                <Icon name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDate(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>İletişim Bilgileri</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Adres"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={phone}
                onChangeText={text => setPhone(formatPhone(text))}
                placeholder="Telefon"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={17}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name={editData ? "save" : "plus"} size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>{editData ? "Kaydet" : "Ürünü Ekle"}</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    padding: 15,
    paddingBottom: 30,
  },
  imageUploadContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePlaceholderSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
  },
  datePickerText: {
    fontSize: 15,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProductModal; 
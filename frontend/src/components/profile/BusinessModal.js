import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
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

const BusinessModal = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (visible) {
      setName("");
      setDesc("");
      setAddress("");
      setPhone("");
      setEmail("");
    }
  }, [visible]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!name || !desc || !address || !phone || !email) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }
    onSubmit({ name, desc, sector, address, phone, email, image });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Şirket Ekle</Text>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şirket Adı</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Şirket adını girin"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={styles.input}
                value={desc}
                onChangeText={setDesc}
                placeholder="Açıklama girin"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adres</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Adres girin"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Telefon girin"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="E-posta girin"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sektör</Text>
              <Picker
                selectedValue={sector}
                style={styles.input}
                onValueChange={(itemValue) => setSector(itemValue)}
              >
                <Picker.Item label="Gıda" value="gida" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Resim Seç</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Kaydet</Text>
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
    maxHeight: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  modalScroll: {
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  imageButton: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  imagePreview: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#1976d2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default BusinessModal; 
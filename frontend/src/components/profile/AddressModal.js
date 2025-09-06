import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../../api/api";

export default function AddressModal({ visible, onClose, onSuccess }) {
  const [address, setAddress] = useState({
    title: "",
    full_address: "",
    city: "",
    district: "",
    postal_code: "",
    phone: "",
  });

  const handleSubmit = async () => {
    try {
      // Validasyon
      if (!address.title || !address.full_address || !address.city || !address.district) {
        Alert.alert(
          "Eksik Bilgi",
          "Lütfen adres başlığı, tam adres, il ve ilçe bilgilerini doldurun.",
          [{ text: "Tamam", style: "default" }]
        );
        return;
      }

      const response = await api.post("/addresses", address);
      
      if (response.status === 201) {
        Alert.alert(
          "Başarılı",
          "Adres başarıyla eklendi.",
          [{ text: "Tamam", style: "default", onPress: () => {
            onSuccess(response.data);
            onClose();
          }}]
        );
      }
    } catch (error) {
      Alert.alert(
        "Hata",
        error.response?.data?.message || "Adres eklenirken bir hata oluştu.",
        [{ text: "Tamam", style: "default" }]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Adres Ekle</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Icon name="tag" size={16} color="#1976d2" />
                <Text style={styles.label}>Adres Başlığı *</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Örn: Ev, İş"
                value={address.title}
                onChangeText={(text) => setAddress({ ...address, title: text })}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Icon name="map-marker" size={16} color="#1976d2" />
                <Text style={styles.label}>Tam Adres *</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Sokak, mahalle, bina no vb."
                multiline
                numberOfLines={3}
                value={address.full_address}
                onChangeText={(text) => setAddress({ ...address, full_address: text })}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <View style={styles.labelContainer}>
                  <Icon name="building" size={16} color="#1976d2" />
                  <Text style={styles.label}>İl *</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="İl"
                  value={address.city}
                  onChangeText={(text) => setAddress({ ...address, city: text })}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <View style={styles.labelContainer}>
                  <Icon name="map" size={16} color="#1976d2" />
                  <Text style={styles.label}>İlçe *</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="İlçe"
                  value={address.district}
                  onChangeText={(text) => setAddress({ ...address, district: text })}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <View style={styles.labelContainer}>
                  <Icon name="envelope" size={16} color="#1976d2" />
                  <Text style={styles.label}>Posta Kodu</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Posta kodu"
                  keyboardType="numeric"
                  value={address.postal_code}
                  onChangeText={(text) => setAddress({ ...address, postal_code: text })}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <View style={styles.labelContainer}>
                  <Icon name="phone" size={16} color="#1976d2" />
                  <Text style={styles.label}>Telefon</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Telefon"
                  keyboardType="phone-pad"
                  value={address.phone}
                  onChangeText={(text) => setAddress({ ...address, phone: text })}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="times" size={18} color="#666" />
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Icon name="check" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "85%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976d2",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1976d2",
    elevation: 2,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
}); 
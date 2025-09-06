import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

const AdminUserModal = ({ visible, onClose, onSubmit, editData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  React.useEffect(() => {
    if (visible && editData) {
      setName(editData.name || "");
      setEmail(editData.email || "");
      setRole(editData.role || "");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
    }
  }, [visible, editData]);

  const handleSubmit = () => {
    if (!name || !email || (!editData && !password) || !role) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }
    onSubmit({ name, email, password, role });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editData ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          {!editData && (
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          )}
          
          <Picker
            selectedValue={role}
            style={styles.input}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Kullanıcı Tipi Seçin" value="" />
            <Picker.Item label="Müşteri" value="customer" />
            <Picker.Item label="İşletme" value="business" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>

          <View style={styles.modalBtnRow}>
            <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
              <Text>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalBtn, { backgroundColor: '#007bff' }]} 
              onPress={handleSubmit}
            >
              <Text style={{ color: '#fff' }}>{editData ? "Güncelle" : "Ekle"}</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#e9ecef',
  },
});

export default AdminUserModal; 
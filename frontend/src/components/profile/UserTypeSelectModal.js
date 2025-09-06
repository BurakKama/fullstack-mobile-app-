import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const UserTypeSelectModal = ({ visible, onClose, onSelect }) => {
  const userTypes = [
    { id: "customer", label: "Müşteri", icon: "user", color: "#1976d2" },
    { id: "business", label: "İşletme", icon: "building", color: "#28a745" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Kullanıcı Tipi Seçin</Text>
          
          <View style={styles.userTypeContainer}>
            {userTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.userTypeButton}
                activeOpacity={0.8}
                onPress={() => onSelect(type.id)}
              >
                <View style={[styles.iconCircle, { backgroundColor: type.color + '22' }]}> 
                  <Icon name={type.icon} size={36} color={type.color} />
                </View>
                <Text style={[styles.userTypeLabel, { color: type.color }]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
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
    borderRadius: 18,
    width: '90%',
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 28,
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e3e6ee',
    shadowColor: '#1976d2',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3e6ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  userTypeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default UserTypeSelectModal; 
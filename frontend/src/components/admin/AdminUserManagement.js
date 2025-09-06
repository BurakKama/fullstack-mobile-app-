import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from '../../api/api';
import AdminUserModal from "../profile/AdminUserModal";

const getRoleLabel = (role) => {
  switch (role) {
    case "admin": return "Admin";
    case "business": return "İşletme";
    case "customer": return "Müşteri";
    default: return role;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case "admin": return "#dc3545";
    case "business": return "#28a745";
    case "customer": return "#1976d2";
    default: return "#6c757d";
  }
};

const UserCard = ({ user, onEdit, onDelete }) => (
  <View style={styles.userCardRow}>
    <View style={styles.userInfoLeft}>
      <Icon name="user" size={30} color="#1976d2" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.userNameCompact}>{user.full_name || user.name}</Text>
        <Text style={styles.userEmailCompact}>{user.email}</Text>
        <Text style={{ color: getRoleColor(user.user_type), marginTop: 2, fontSize: 13 }}>
          {getRoleLabel(user.user_type)}
        </Text>
      </View>
    </View>
    <View style={styles.userActionsRight}>
      <TouchableOpacity style={styles.actionButtonCompact} onPress={() => onEdit(user)}>
        <Icon name="edit" size={16} color="#007bff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButtonCompact} onPress={() => onDelete(user)}>
        <Icon name="trash" size={16} color="#dc3545" />
      </TouchableOpacity>
    </View>
  </View>
);

const AdminUserManagement = ({ filterType, onAddUser, onEditUser, onDeleteUser, onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      let allUsers = res.data.users || [];
      if (filterType) {
        allUsers = allUsers.filter(u => u.user_type === filterType);
      }
      setUsers(allUsers);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterType]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      "Kullanıcı Silme",
      `${user.full_name || user.name} kullanıcısını silmek istediğinizden emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: () => onDeleteUser(user) },
      ]
    );
  };

  const handleSubmit = async (userData) => {
    if (selectedUser) {
      await onEditUser({ ...selectedUser, ...userData });
    } else {
      await onAddUser(userData);
    }
    setModalVisible(false);
    setTimeout(() => fetchUsers(), 300);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerBarRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonCompact}>
          <Icon name="arrow-left" size={20} color="#1976d2" />
          <Text style={styles.backTextCompact}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.titleCompact}>Kullanıcı Yönetimi</Text>
        <TouchableOpacity style={styles.addFabButton} onPress={handleAddUser}>
          <Icon name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainerCompact}>
          <Icon name="user" size={48} color="#e0e0e0" style={{ marginBottom: 10 }} />
          <Text style={styles.emptyText}>Hiç kullanıcı yok</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, idx) => (item.id ? item.id.toString() : idx.toString())}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        />
      )}
      <AdminUserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        editData={selectedUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    paddingTop: 18,
  },
  headerBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 600,
    marginBottom: 16,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  titleCompact: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
  addFabButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginVertical: 6,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userNameCompact: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  userEmailCompact: {
    fontSize: 13,
    color: '#6c757d',
  },
  userActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonCompact: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
  },
  emptyContainerCompact: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    color: '#1976d2',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
  backButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    marginRight: 8,
  },
  backTextCompact: {
    color: '#1976d2',
    fontSize: 15,
    marginLeft: 4,
    fontWeight: 'bold',
  },
});

export default AdminUserManagement;

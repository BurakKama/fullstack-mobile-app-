import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ProfileInfo = ({ user }) => (
  <View style={styles.profileInfo}>
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Icon name="user" size={60} color="#007bff" />
      </View>
    </View>
    <Text style={styles.profileName}>
      {user?.full_name || "Kullanıcı"}
    </Text>
    <Text style={styles.profileEmail}>
      {user?.email || "email@example.com"}
    </Text>
    <Text style={styles.profileRole}>
      {user?.user_type ? user.user_type.toUpperCase() : ""}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  profileInfo: {
    alignItems: "center",
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    color: "#666",
    fontSize: 15,
    textAlign: 'center',
  },
  profileRole: {
    color: "#007bff",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 2,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default ProfileInfo; 
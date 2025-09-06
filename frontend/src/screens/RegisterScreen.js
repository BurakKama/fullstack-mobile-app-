import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import api from "../api/api";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Icon from "react-native-vector-icons/FontAwesome";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Sign-in hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    // AsyncStorage'dan kayıtlı email varsa getir (opsiyonel)
    // Beni hatırla mantığı ekleyebilirsin
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [response]);

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      setLoading(true);
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await res.json();

      Alert.alert("Google ile giriş başarılı", `Hoşgeldiniz ${userInfo.name}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Google ile giriş hatası", error.message);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Eksik bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        user_type: "customer",
      });
      setLoading(false);
      Alert.alert("Başarılı", "Kayıt işlemi başarılı, lütfen giriş yapınız");
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      console.log("API Hata Detayı:", error);
      Alert.alert(
        "Kayıt hatası",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Yeni Hesap Oluştur</Text>

        <TextInput
          placeholder="Ad Soyad"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Şifre"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Bekleyiniz..." : "Kayıt Ol"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync()}
          style={[styles.button, styles.googleButton]}
        >
          <Icon name="google" size={22} color="#DB4437" />
          <Text style={[styles.buttonText, styles.googleButtonText]}>
            Google ile Giriş Yap
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.footerText, styles.link]}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
    color: "#D32F2F",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 18,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  rememberForgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
  },
  forgotText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    color: "#000",
    marginLeft: 10,
    fontWeight: "700",
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 16,
  },
  link: {
    color: "#D32F2F",
    fontWeight: "700",
  },
});

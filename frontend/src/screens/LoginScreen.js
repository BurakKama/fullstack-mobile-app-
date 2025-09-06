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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import CheckBox from "../components/Checkbox";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation, setUserToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("userEmail");
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch {}
    };
    loadEmail();
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Eksik bilgi", "Lütfen email ve şifrenizi girin.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      setLoading(false);

      if (rememberMe) {
        await AsyncStorage.setItem("userEmail", email);
      } else {
        await AsyncStorage.removeItem("userEmail");
      }

      // Token ve kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem("token", res.data.token);
      
      // Kullanıcı bilgilerini al ve kaydet
      const profileRes = await api.get("/auth/profile");
      const userData = {
        id: profileRes.data.id,
        email: profileRes.data.email,
        full_name: profileRes.data.full_name,
        user_type: profileRes.data.user_type
      };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      setUserToken(res.data.token);  // Burada state'i güncelle

      Alert.alert("Başarılı", "Giriş başarılı");
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Giriş hatası",
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
        <Text style={styles.title}>Giriş Yap</Text>

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

        <View style={styles.rememberForgotRow}>
          <View style={styles.rememberMeRow}>
            <CheckBox value={rememberMe} onValueChange={setRememberMe} />
            <Text style={styles.rememberMeText}>Beni Hatırla</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Şifre sıfırlama", "Şifre sıfırlama sayfasına yönlendir.")
            }
          >
            <Text style={styles.forgotText}>Şifreni mi unuttun?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Bekleyiniz..." : "Giriş Yap"}
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
          <Text style={styles.footerText}>Hesabın yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={[styles.footerText, styles.link]}>Kayıt Ol</Text>
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

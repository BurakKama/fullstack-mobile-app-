import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../api/api";
import ProfileInfo from "../components/profile/ProfileInfo";
import HorizontalMenu from "../components/profile/HorizontalMenu";
import { getMenuByRole } from "../components/profile/HorizontalMenu";
import ProductModal from "../components/profile/ProductModal";
import BusinessModal from "../components/profile/BusinessModal";
import UserTypeSelectModal from "../components/profile/UserTypeSelectModal";
import EditBusinessProfileModal from "../components/profile/EditBusinessProfileModal";
import AddressModal from "../components/profile/AddressModal";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUserManagement from "../components/admin/AdminUserManagement";
import AdminBusinessManagement from "../components/admin/AdminBusinessManagement";
import AdminProductManagement from "../components/admin/AdminProductManagement";
import BusinessDashboard from "../components/business/BusinessDashboard";
import CustomerContent from "../components/customer/CustomerContent";
import EditAdminProfileModal from "../components/admin/EditAdminProfileModal";
import AddUserModal from "../components/admin/AddUserModal";

// API base URL'ini tanımla
const API_BASE_URL = "http://10.0.2.2:3000";

// Resim URL'sini tam URL'ye çeviren yardımcı fonksiyon
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

export default function ProfileScreen({ navigation, setUserToken }) {
  const [activeTab, setActiveTab] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [userListType, setUserListType] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [showProductList, setShowProductList] = useState(false);
  const [showBusinessList, setShowBusinessList] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [businessProducts, setBusinessProducts] = useState([]);
  const [businessStats, setBusinessStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
  });
  const [businessInfo, setBusinessInfo] = useState(null);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Önce AsyncStorage'dan kullanıcı verilerini kontrol et
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          const roleMenu = getMenuByRole(parsedUser.user_type);
          setMenu(roleMenu);
          setActiveTab(roleMenu[0]?.key || null);
        }

        // Sonra API'den güncel verileri al
        await fetchProfile();
        await loadFavorites();
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        Alert.alert(
          "Hata",
          "Veriler yüklenirken bir hata oluştu. Lütfen tekrar giriş yapın."
        );
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      console.log("Profile response:", res.data);

      const userData = {
        id: res.data.id,
        email: res.data.email,
        full_name: res.data.full_name,
        user_type: res.data.user_type,
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      console.log("User data saved to storage:", userData);

      setUser(userData);
      const roleMenu = getMenuByRole(userData.user_type);
      setMenu(roleMenu);
      setActiveTab(roleMenu[0]?.key || null);

      // Sadece admin kullanıcılar için istatistikleri çek
      if (userData.user_type === "admin") {
        await fetchStats();
      }
      // Business kullanıcı için business panel verilerini çek
      if (userData.user_type === "business") {
        await loadBusinessStatsAndInfo();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert("Oturum süresi doldu", "Lütfen tekrar giriş yapın.");
        handleLogout();
      } else {
        console.error("Profil yükleme hatası:", error);
        Alert.alert(
          "Profil yükleme hatası",
          error.response?.data?.message || error.message
        );
      }
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, businessesRes, productsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/businesses"),
        api.get("/admin/products"),
      ]);
      let totalOrders = 0;
      try {
        const ordersRes = await api.get("/admin/orders");
        totalOrders = ordersRes.data.orders?.length || 0;
      } catch (err) {
        // orders endpointi yoksa sıfır olarak bırak
        totalOrders = 0;
      }
      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalBusinesses: businessesRes.data.businesses?.length || 0,
        totalProducts: productsRes.data.products?.length || 0,
        totalOrders,
      });
    } catch (err) {
      console.error("Stats fetch error:", err);
      // Admin istatistikleri çekilemezse sessizce devam et
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites");
      if (favoritesData) {
        const parsedFavorites = JSON.parse(favoritesData);
        console.log("Yüklenen favoriler:", parsedFavorites);

        // Tüm ürünleri tek seferde al
        try {
          const response = await api.get("/products");
          const allProducts = response.data.products || [];

          // Favori ürünleri ID'lerine göre eşleştir
          const updatedFavorites = parsedFavorites
            .map((favorite) => {
              const product = allProducts.find((p) => p.id === favorite.id);
              return product || favorite; // Eğer ürün bulunamazsa mevcut favori bilgisini kullan
            })
            .filter((favorite) => favorite); // null veya undefined olanları filtrele

          console.log("Güncellenmiş favoriler:", updatedFavorites);
          setFavorites(updatedFavorites);
        } catch (error) {
          console.error("Ürünler yüklenirken hata:", error);
          // Hata durumunda mevcut favori bilgilerini kullan
          setFavorites(parsedFavorites);
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Favoriler yüklenirken hata:", error);
      Alert.alert("Hata", "Favoriler yüklenirken bir hata oluştu");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Çıkış yapmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["token", "user", "favorites"]);
            setUserToken(null);
            setUser(null);
          } catch (error) {
            console.error("Çıkış yapılırken hata:", error);
          }
        },
      },
    ]);
  };

  const handleProductSubmit = async (data) => {
    setShowProductModal(false);
    try {
      console.log("Submitting product data:", data);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("description", data.desc?.trim() || "");
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("quantity", data.quantity);
      formData.append("expiration_date", data.expiration_date.toISOString());

      if (data.image) {
        const imageUri = data.image.uri;
        const imageType = imageUri.endsWith(".png")
          ? "image/png"
          : "image/jpeg";
        const imageName = imageUri.split("/").pop();

        formData.append("image", {
          uri: imageUri,
          type: imageType,
          name: imageName,
        });
      }

      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Başarılı", "Ürün başarıyla eklendi!");
        navigation.navigate("Home", { refresh: true });
      }
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      Alert.alert(
        "Hata",
        error.response?.data?.message ||
          error.message ||
          "Ürün eklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin."
      );
    }
  };

  const handleBusinessSubmit = async (data) => {
    setShowBusinessModal(false);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.desc);
      formData.append("sector", data.sector);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", user?.email || "");
      if (data.image) {
        formData.append("image", {
          uri: data.image.uri,
          type: data.image.type || "image/jpeg",
          name: data.image.fileName || "image.jpg",
        });
      }
      await api.post("/businesses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Başarılı", "Şirket başarıyla eklendi!");
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.message || error.message);
    }
  };

  const handleFavoritePress = (product) => {
    Alert.alert(
      "Ürün Detayı",
      "Ürün detaylarını görüntülemek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Görüntüle",
          onPress: () => {
            // Tüm ürünleri tek seferde al ve ilgili ürünü bul
            api
              .get("/products")
              .then((response) => {
                const allProducts = response.data.products || [];
                const updatedProduct =
                  allProducts.find((p) => p.id === product.id) || product;
                navigation.navigate("ProductDetail", {
                  product: updatedProduct,
                });
              })
              .catch((error) => {
                console.error("Ürün detayı alınamadı:", error);
                navigation.navigate("ProductDetail", { product });
              });
          },
        },
      ]
    );
  };

  const removeFavorite = async (productId) => {
    Alert.alert(
      "Favorilerden Kaldır",
      "Bu ürünü favorilerden kaldırmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Kaldır",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(
                (item) => item.id !== productId
              );
              await AsyncStorage.setItem(
                "favorites",
                JSON.stringify(updatedFavorites)
              );
              setFavorites(updatedFavorites);
              Alert.alert("Başarılı", "Ürün favorilerden kaldırıldı");
            } catch (error) {
              console.error("Favori kaldırma hatası:", error);
              Alert.alert("Hata", "Favori kaldırılırken bir hata oluştu");
            }
          },
        },
      ]
    );
  };

  const handleStatPress = (type) => {
    if (type === "user") setShowUserTypeModal(true);
    else if (type === "product") setShowProductList(true);
    else if (type === "business") setShowBusinessList(true);
    // Sipariş için ileride eklenebilir
  };

  const handleUserTypeSelect = (type) => {
    setShowUserTypeModal(false);
    setUserListType(type);
  };

  const handleUserListBack = () => setUserListType(null);
  const handleProductListBack = () => setShowProductList(false);
  const handleBusinessListBack = () => setShowBusinessList(false);

  const loadAddresses = async () => {
    try {
      console.log("Örnek adresler yükleniyor...");
      // Örnek adres verileri
      const mockAddresses = [
        {
          id: 1,
          title: "Ev",
          full_address:
            "Atatürk Mahallesi, Cumhuriyet Caddesi No: 123 Daire: 4",
          city: "İstanbul",
          district: "Kadıköy",
          postal_code: "34700",
          phone: "0555 123 4567",
        },
        {
          id: 2,
          title: "İş",
          full_address: "Levent Plaza, Büyükdere Caddesi No: 45 Kat: 8",
          city: "İstanbul",
          district: "Şişli",
          postal_code: "34330",
          phone: "0555 987 6543",
        },
      ];

      console.log("Örnek adresler:", mockAddresses);
      setAddresses(mockAddresses);
    } catch (err) {
      console.error("Adresler yüklenirken hata:", err);
      setAddresses([]);
    }
  };

  useEffect(() => {
    if (user?.user_type === "customer") {
      loadAddresses();
    }
  }, [user]);

  const handleAddressSuccess = (newAddress) => {
    setShowAddressModal(false);
    setEditingAddress(null);
    loadAddresses();
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    Alert.alert("Adres Sil", "Bu adresi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/addresses/${addressId}`);
            loadAddresses();
          } catch (err) {
            Alert.alert("Hata", "Adres silinemedi.");
          }
        },
      },
    ]);
  };

  const loadBusinessProducts = async () => {
    try {
      const res = await api.get("/business/products");
      setBusinessProducts(res.data.products || []);
    } catch (err) {
      setBusinessProducts([]);
    }
  };

  useEffect(() => {
    if (user?.user_type === "business") {
      loadBusinessProducts();
    }
  }, [user]);

  const handleAddProduct = () => setShowProductModal(true);

  const handleEditProduct = (product) => {
    loadBusinessProducts();
  };

  const handleDeleteProduct = (product) => {
    loadBusinessProducts();
  };

  const loadBusinessStatsAndInfo = async () => {
    try {
      // Önce profilden business id'yi al
      const profileRes = await api.get("/auth/profile");
      const business = profileRes.data.business || {};
      console.log("ÇEKİLEN BUSINESS INFO:", business);

      if (!business.id) {
        setBusinessStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          activeOrders: 0,
        });
        setBusinessInfo(business);
        return;
      }

      // Doğru endpoint ile ürünleri çek
      const res = await api.get(`/businesses/${business.id}/products`);
      const products = res.data.products || [];
      console.log("ÇEKİLEN ÜRÜNLER:", products);

      setBusinessStats({
        totalProducts: products.length,
        totalOrders: 0,
        totalRevenue: 0,
        activeOrders: 0,
      });
      setBusinessInfo(business);
    } catch (err) {
      console.error("Business stats error:", err);
      setBusinessStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeOrders: 0,
      });
      setBusinessInfo(null);
    }
  };

  useEffect(() => {
    if (user?.user_type === "business") {
      loadBusinessStatsAndInfo();
    }
  }, [user]);

  const handleEditBusinessProfile = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.desc);
      formData.append("sector", data.sector);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", user.email);
      if (data.image && data.image.uri) {
        formData.append("image", {
          uri: data.image.uri,
          type: data.image.type || "image/jpeg",
          name: data.image.fileName || "image.jpg",
        });
      }
      await api.put("/businesses/update-self", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Başarılı", "Profil başarıyla güncellendi!");
      setShowEditProfileModal(false);
      await loadBusinessStatsAndInfo();
    } catch (error) {
      console.log("Network error:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
      }
      console.log("Error message:", error.message);
      Alert.alert("Hata", error.response?.data?.message || error.message);
    }
  };

  const handleEditAdminProfile = async (data) => {
    // Burada backend'e güncelleme isteği atabilirsin
    Alert.alert("Başarılı", "Admin profili güncellendi (örnek)");
    setShowEditAdminModal(false);
  };

  // Hızlı işlemler fonksiyonları
  const handleAddUser = () => setShowAddUserModal(true);
  const handleAddUserSubmit = (data) => {
    Alert.alert("Kullanıcı Eklendi (örnek)", JSON.stringify(data, null, 2));
    setShowAddUserModal(false);
  };
  const handleAddBusiness = () => setShowBusinessModal(true);
  const handleEditAdmin = () => setShowEditAdminModal(true);

  const handleDeleteUser = async (user) => {
    try {
      await api.delete(`/admin/users/${user.id}`);
      Alert.alert("Başarılı", "Kullanıcı silindi.");
      // Kullanıcı listesini güncellemek için bir fetch veya state güncellemesi ekleyebilirsin
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.message || error.message);
    }
  };

  const handleEditUser = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}`, user);
      Alert.alert("Başarılı", "Kullanıcı güncellendi.");
      // Kullanıcı listesini güncellemek için bir fetch veya state güncellemesi ekleyebilirsin
    } catch (error) {
      Alert.alert("Hata", error.response?.data?.message || error.message);
    }
  };

  const renderCustomerProfile = () => (
    <View style={styles.customerProfileContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Icon name="user-circle" size={80} color="#1976d2" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.full_name || "Misafir Kullanıcı"}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Icon name="heart" size={20} color="#dc3545" />
              <Text style={styles.statValue}>{favorites?.length || 0}</Text>
              <Text style={styles.statLabel}>Favori</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="shopping-cart" size={20} color="#28a745" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Sipariş</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="map-marker" size={20} color="#ffc107" />
              <Text style={styles.statValue}>{addresses?.length || 0}</Text>
              <Text style={styles.statLabel}>Adres</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <HorizontalMenu
          menu={menu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </View>

      <View style={styles.contentContainer}>
        <CustomerContent
          activeTab={activeTab}
          favorites={favorites}
          onFavoritePress={handleFavoritePress}
          onRemoveFavorite={removeFavorite}
          showAddressModal={showAddressModal}
          setShowAddressModal={setShowAddressModal}
          handleAddressSuccess={handleAddressSuccess}
          addresses={addresses}
          onEditAddress={handleEditAddress}
          onDeleteAddress={handleDeleteAddress}
        />
      </View>
    </View>
  );

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.user_type) {
      case "admin":
        if (userListType) {
          return (
            <AdminUserManagement
              onBack={handleUserListBack}
              filterType={userListType}
              onAddUser={handleAddUser}
              onEditUser={handleEditAdmin}
              onDeleteUser={handleDeleteUser}
            />
          );
        }
        if (showProductList) {
          return <AdminProductManagement onBack={handleProductListBack} />;
        }
        if (showBusinessList) {
          return <AdminBusinessManagement onBack={handleBusinessListBack} />;
        }
        return (
          <>
            <AdminDashboard
              user={user}
              navigation={navigation}
              onStatPress={handleStatPress}
              stats={stats}
              onAddUser={handleAddUser}
              onAddBusiness={handleAddBusiness}
              onAddProduct={handleAddProduct}
              onEditProfile={handleEditAdmin}
            />
            <UserTypeSelectModal
              visible={showUserTypeModal}
              onSelect={handleUserTypeSelect}
              onClose={() => setShowUserTypeModal(false)}
            />
          </>
        );
      case "business":
        return (
          <BusinessDashboard
            stats={businessStats}
            businessInfo={businessInfo}
            onEditProfile={() => setShowEditProfileModal(true)}
            onAddProduct={() => setShowProductModal(true)}
          />
        );
      default:
        return renderCustomerProfile();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#dc3545" />
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* Sadece müşteri için ScrollView, admin ve business için direkt render */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : !user ? (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={50} color="#dc3545" />
          <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleLogout}>
            <Text style={styles.errorButtonText}>Tekrar Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      ) : user.user_type === "customer" ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderCustomerProfile()}
        </ScrollView>
      ) : (
        <View style={styles.dashboardContainer}>{renderDashboard()}</View>
      )}

      {/* Modals */}
      <ProductModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleProductSubmit}
      />
      <BusinessModal
        visible={showBusinessModal}
        onClose={() => setShowBusinessModal(false)}
        onSubmit={handleBusinessSubmit}
      />
      <AddressModal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSuccess={handleAddressSuccess}
        address={editingAddress}
      />
      {user?.user_type === "business" && (
        <EditBusinessProfileModal
          visible={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          businessData={businessInfo}
          onSubmit={handleEditBusinessProfile}
          ref={(ref) => {
            if (ref && businessInfo) {
              console.log("MODALA GİDEN BUSINESS INFO:", businessInfo);
            }
          }}
        />
      )}
      {user?.user_type === "admin" && (
        <EditAdminProfileModal
          visible={showEditAdminModal}
          onClose={() => setShowEditAdminModal(false)}
          adminData={user}
          onSubmit={handleEditAdminProfile}
        />
      )}
      <AddUserModal
        visible={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUserSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    marginLeft: 8,
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  customerProfileContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 16,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#dee2e6",
    marginHorizontal: 8,
  },
  menuContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#495057",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  errorButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

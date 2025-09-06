# 🚀 Veritabanı Verilerinizi Paylaşma Rehberi

Bu rehber, projeyi indiren kişilerin Supabase ayarlarıyla uğraşmadan **sizin veritabanınızdaki ürünleri ve işletmeleri** görebilmesi için hazırlanmıştır.

## 🎯 **Hızlı Başlangıç**

### 1. Projeyi İndirin
```bash
git clone https://github.com/[KULLANICI_ADI]/[REPO_ADI].git
cd projekopya/frontend
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Konfigürasyon
```bash
cp env.example .env
```

### 4. .env Dosyasını Düzenleyin
```env
# Sadece bu satırı düzenleyin - Sizin API URL'nizi girin
# Bu sayede sizin Supabase veritabanınızdaki verileri göreceksiniz
EXPO_PUBLIC_PUBLIC_API_URL=https://your-api-domain.com
```

### 5. Uygulamayı Başlatın
```bash
npm start
```

**Bu kadar!** Artık sizin veritabanınızdaki tüm ürünleri ve işletmeleri görebilirsiniz.

## 📊 **Sizin Verilerinizi Görme Endpoints**

### Ürünleriniz
- `GET /api/public/` - **Sizin tüm ürünlerinizi** listele
- `GET /api/public/:id` - **Belirli ürününüzün** detayını getir
- `GET /api/public/?category=yemek` - **Yemek kategorisindeki ürünlerinizi** filtrele
- `GET /api/public/?category=içecek` - **İçecek kategorisindeki ürünlerinizi** filtrele
- `GET /api/public/?search=pizza` - **Ürünlerinizde** arama yap

### İşletmeleriniz
- `GET /api/public/businesses/public` - **Sizin tüm işletmelerinizi** listele
- `GET /api/public/businesses/:id/products/public` - **Belirli işletmenizin ürünlerini** listele

### Sistem
- `GET /health` - API sağlık kontrolü

## 🗄️ **Görebileceğiniz Veriler**

### Ürün Verileri
- İsim ve açıklama
- Fiyat ve indirimli fiyat
- Stok miktarı
- Kategori
- Son kullanma tarihi
- Ürün resmi
- Hangi işletmeye ait olduğu

### İşletme Verileri
- İşletme adı ve açıklaması
- Adres bilgileri
- Telefon ve email
- İşletme resmi

## 🔧 **Frontend'de Kullanım**

### Public API Servisini Import Edin
```javascript
import { publicApiService } from './src/api/publicApiService';
```

### Sizin Ürünlerinizi Getirin
```javascript
// Sizin tüm ürünlerinizi getir
const products = await publicApiService.getProducts();

// Sizin ürünlerinizi kategoriye göre filtrele (yemek kategorileri)
const foodProducts = await publicApiService.getProducts({ category: 'yemek' });
const dessertProducts = await publicApiService.getProducts({ category: 'tatlı' });

// Sizin ürünlerinizde arama yap
const searchResults = await publicApiService.getProducts({ search: 'döner' });
const burgerSearch = await publicApiService.getProducts({ search: 'burger' });
```

### Sizin İşletmelerinizi Getirin
```javascript
// Sizin tüm işletmelerinizi getir
const businesses = await publicApiService.getBusinesses();

// Belirli işletmenizin ürünlerini getir
const businessProducts = await publicApiService.getBusinessProducts(1);
```

### Sizin Ürün Detayınızı Getirin
```javascript
// Belirli ürününüzün detayını getir
const product = await publicApiService.getProductById(1);
```

## 🌐 **API URL Örnekleri**

### Yerel Geliştirme
```env
EXPO_PUBLIC_PUBLIC_API_URL=http://localhost:3000
```

### Production (Heroku, Railway, vb.)
```env
EXPO_PUBLIC_PUBLIC_API_URL=https://your-app-name.herokuapp.com
```

### VPS/Dedicated Server
```env
EXPO_PUBLIC_PUBLIC_API_URL=https://your-domain.com
```

## 📱 **Platform Desteği**

- **Android Emülatör**: `http://10.0.2.2:3000`
- **iOS Simülatör**: `http://localhost:3000`
- **Gerçek Cihaz**: Bilgisayarınızın IP adresi
- **Web**: `http://localhost:3000`

## ⚠️ **Önemli Notlar**

1. **Güvenlik**: Public API sadece okuma işlemleri için tasarlanmıştır
2. **Rate Limiting**: API'nizde rate limiting varsa dikkatli kullanın
3. **CORS**: API CORS ayarları yapılmıştır
4. **SSL**: Production'da HTTPS kullanın

## 🐛 **Sorun Giderme**

### API Bağlantı Hatası
```javascript
// API sağlık kontrolü
try {
  const health = await publicApiService.healthCheck();
  console.log('API is running:', health);
} catch (error) {
  console.error('API connection failed:', error);
}
```

### Yaygın Hatalar
- **Network Error**: API URL'ini kontrol edin
- **CORS Error**: API'nin CORS ayarlarını kontrol edin
- **Timeout**: API'nin çalıştığından emin olun

## 📞 **Yardım**

Sorun yaşıyorsanız:
1. API'nin çalıştığından emin olun (`/health` endpoint'i)
2. Network bağlantınızı kontrol edin
3. API URL'ini doğru girdiğinizden emin olun
4. GitHub Issues'da sorun bildirin

---

**Not**: Bu API sadece veri okuma için tasarlanmıştır. Veri ekleme/düzenleme için authentication gerekir.

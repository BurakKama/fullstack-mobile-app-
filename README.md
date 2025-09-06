# E-Ticaret Mobil Uygulaması

Bu proje React Native ve Expo kullanılarak geliştirilmiş bir e-ticaret mobil uygulamasıdır. Backend Node.js ve Express ile geliştirilmiş olup Supabase PostgreSQL veritabanı kullanmaktadır.

## 🌟 **YENİ: Veritabanı Verilerinizi Paylaşın**

Artık Supabase veritabanınızdaki **ürünlerinizi ve işletmelerinizi** başkalarıyla paylaşabilirsiniz! Başkaları Supabase ayarlarıyla uğraşmadan doğrudan sizin verilerinizi görebilir.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **İşletme Yönetimi**: İşletme sahipleri için ürün yönetimi
- **Admin Paneli**: Sistem yöneticileri için kullanıcı ve işletme yönetimi
- **Ürün Katalogu**: Ürün arama, filtreleme, detay görüntüleme
- **Favoriler**: Kullanıcıların favori ürünleri kaydetmesi
- **Sepet**: Alışveriş sepeti işlevselliği
- **Resim Yükleme**: Ürün resimlerini yükleme ve görüntüleme

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo CLI
- Supabase hesabı

## 🛠️ Kurulum

### 🎯 **Kolay Yol: Sizin Verilerinizi Görme**

Başkaları artık Supabase ayarlarıyla uğraşmadan **sizin veritabanınızdaki ürünleri ve işletmeleri** görebilir!

#### Frontend için (Başkaları için):

1. Projeyi klonlayın:
```bash
git clone https://github.com/[KULLANICI_ADI]/[REPO_ADI].git
cd projekopya/frontend
npm install
```

2. `frontend/env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp env.example .env
```

3. `.env` dosyasını düzenleyin:
```env
# Sizin API URL'nizi kullanın - Bu sayede sizin verilerinizi görecekler
EXPO_PUBLIC_PUBLIC_API_URL=https://your-api-domain.com
```

4. Uygulamayı başlatın:
```bash
npm start
```

**Bu kadar!** Artık sizin Supabase veritabanınızdaki tüm ürünleri ve işletmeleri görebilirler.

### 🔧 **Geliştirici Kurulumu (Sizin için)**

#### Backend Kurulumu:

```bash
cd backend
npm install
cp env.example .env
# .env dosyasını Supabase bilgilerinizle düzenleyin
npm start
```

#### Frontend Kurulumu:

```bash
cd frontend
npm install
cp env.example .env
# .env dosyasını düzenleyin
npm start
```

### 📊 **Veri Paylaşım Endpoints**

Başkaları şu endpoint'lerle **sizin verilerinizi** görebilir:

- `GET /api/public/` - **Sizin tüm ürünlerinizi** listele
- `GET /api/public/:id` - **Belirli ürününüzün** detayını getir
- `GET /api/public/businesses/public` - **Sizin tüm işletmelerinizi** listele
- `GET /api/public/businesses/:id/products/public` - **Belirli işletmenizin ürünlerini** listele
- `GET /health` - API sağlık kontrolü

### 🍽️ **Örnek Kullanım**

```javascript
// Yemek kategorisindeki ürünlerinizi getir
const foodProducts = await publicApiService.getProducts({ category: 'yemek' });

// Pizza araması yap
const pizzaResults = await publicApiService.getProducts({ search: 'pizza' });

// İçecek kategorisindeki ürünlerinizi getir
const drinks = await publicApiService.getProducts({ category: 'içecek' });
```

### 🗄️ **Paylaşılan Veriler**

Başkaları şu verilerinizi görebilir:
- **Ürünler**: İsim, açıklama, fiyat, indirimli fiyat, stok, kategori, son kullanma tarihi, resim
- **İşletmeler**: İsim, açıklama, adres, telefon, email, resim
- **İlişkiler**: Hangi ürünün hangi işletmeye ait olduğu

## 🚀 Çalıştırma

### Backend'i Başlatın

```bash
cd backend
npm start
```

Backend `http://localhost:3000` adresinde çalışacak.

### Frontend'i Başlatın

```bash
cd frontend
npm start
```

Expo Developer Tools açılacak. Telefonunuzda Expo Go uygulamasını indirip QR kodu tarayarak uygulamayı çalıştırabilirsiniz.

## 📱 Platform Desteği

- **Android**: Expo Go veya APK build
- **iOS**: Expo Go veya TestFlight
- **Web**: `npm run web` ile web versiyonu

## 🗄️ Veritabanı Yapısı

### Tablolar:
- `users`: Kullanıcı bilgileri
- `businesses`: İşletme bilgileri  
- `products`: Ürün bilgileri

### İlişkiler:
- Bir kullanıcı birden fazla işletmeye sahip olabilir
- Bir işletme birden fazla ürüne sahip olabilir

## 🔧 Geliştirme

### API Endpoints

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/products` - Ürün listesi
- `POST /api/products` - Ürün ekleme
- `GET /api/businesses` - İşletme listesi
- `POST /api/businesses` - İşletme ekleme

### Dosya Yapısı

```
backend/
├── src/
│   ├── controllers/     # API kontrolcüleri
│   ├── models/         # Veritabanı modelleri
│   ├── routes/         # API rotaları
│   ├── middleware/     # Middleware fonksiyonları
│   └── config/         # Konfigürasyon dosyaları
└── uploads/            # Yüklenen dosyalar

frontend/
├── src/
│   ├── components/     # React Native bileşenleri
│   ├── screens/        # Ekran bileşenleri
│   ├── navigation/     # Navigasyon yapısı
│   └── api/           # API çağrıları
└── assets/            # Statik dosyalar
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar:

1. **Veritabanı Bağlantı Hatası**: `.env` dosyasındaki Supabase bilgilerini kontrol edin
2. **API Bağlantı Hatası**: Backend'in çalıştığından emin olun
3. **Resim Yükleme Hatası**: `uploads` klasörünün var olduğundan emin olun

### Log Kontrolü:

Backend logları terminal'de görünür. Frontend için Expo Developer Tools'u kullanın.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu projeyi çalıştırmadan önce Supabase hesabınızda gerekli tabloları oluşturduğunuzdan ve izinleri ayarladığınızdan emin olun.

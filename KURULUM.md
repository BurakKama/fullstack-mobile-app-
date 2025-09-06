# Kurulum Rehberi

Bu dosya projeyi nasıl kuracağınızı adım adım açıklar.

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin
```bash
git clone https://github.com/[KULLANICI_ADI]/[REPO_ADI].git
cd projekopya
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
cp env.example .env
# .env dosyasını düzenleyin (aşağıdaki adımları takip edin)
npm start
```

### 3. Frontend Kurulumu
```bash
cd ../frontend
npm install
cp env.example .env
# .env dosyasını düzenleyin (aşağıdaki adımları takip edin)
npm start
```

## 🔧 Supabase Konfigürasyonu

### Backend .env Dosyası
`backend/.env` dosyasını oluşturun ve aşağıdaki bilgileri girin:

```env
# Supabase Database URL (Supabase Dashboard > Settings > Database > Connection string)
DATABASE_URL=postgresql://postgres:[ŞİFRENİZ]@db.[PROJE_REF].supabase.co:5432/postgres

# JWT Secret (rastgele bir string)
JWT_SECRET=your_random_jwt_secret_here

# Server Port
PORT=3000
```

### Frontend .env Dosyası
`frontend/.env` dosyasını oluşturun ve aşağıdaki bilgileri girin:

```env
# API URL (Android emülatör için 10.0.2.2, gerçek cihaz için bilgisayarınızın IP'si)
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Supabase URL (Supabase Dashboard > Settings > API > Project URL)
EXPO_PUBLIC_SUPABASE_URL=https://[PROJE_REF].supabase.co

# Supabase Anon Key (Supabase Dashboard > Settings > API > Project API keys > anon public)
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 📊 Supabase Dashboard Ayarları

### 1. Authentication Ayarları
- Supabase Dashboard > Authentication > Settings
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

### 2. Database İzinleri
- Supabase Dashboard > Database > Tables
- `products` tablosu için: Row Level Security (RLS) açık, okuma izni ver
- `businesses` tablosu için: Row Level Security (RLS) açık, okuma izni ver

### 3. API Keys
- Supabase Dashboard > Settings > API
- Project URL ve anon public key'i kopyalayın

## 🔍 Supabase Bilgilerini Bulma

### Database URL Bulma:
1. Supabase Dashboard'a gidin
2. Settings > Database
3. Connection string'i kopyalayın
4. `[YOUR-PASSWORD]` kısmını gerçek şifrenizle değiştirin

### Project Reference Bulma:
1. Supabase Dashboard > Settings > General
2. Reference ID'yi kopyalayın
3. URL'lerde `[PROJE_REF]` yerine bu ID'yi kullanın

### Anon Key Bulma:
1. Supabase Dashboard > Settings > API
2. Project API keys bölümünden `anon public` key'i kopyalayın

## 📱 Mobil Cihazda Test Etme

### Android Emülatör:
- API URL: `http://10.0.2.2:3000`

### Gerçek Android Cihaz:
- Bilgisayarınızın IP adresini bulun: `ipconfig` (Windows) veya `ifconfig` (Mac/Linux)
- API URL: `http://[BİLGİSAYAR_IP]:3000`

### iOS Simülatör:
- API URL: `http://localhost:3000`

## ⚠️ Önemli Notlar

1. **Güvenlik**: `.env` dosyalarını asla GitHub'a yüklemeyin
2. **Port**: Backend 3000 portunda çalışmalı
3. **Firewall**: Windows Firewall'da 3000 portunu açın
4. **Network**: Mobil cihaz ve bilgisayar aynı WiFi ağında olmalı

## 🐛 Sorun Giderme

### Backend Başlamıyor:
- Node.js versiyonunu kontrol edin (v16+)
- `npm install` tekrar çalıştırın
- `.env` dosyasının doğru konumda olduğundan emin olun

### Frontend Bağlanamıyor:
- Backend'in çalıştığından emin olun
- API URL'ini kontrol edin
- Network bağlantısını kontrol edin

### Supabase Bağlantı Hatası:
- Database URL'ini kontrol edin
- Supabase projenizin aktif olduğundan emin olun
- İnternet bağlantısını kontrol edin

## 📞 Yardım

Sorun yaşıyorsanız:
1. README.md dosyasını kontrol edin
2. GitHub Issues'da sorun bildirin
3. Supabase dokümantasyonunu inceleyin

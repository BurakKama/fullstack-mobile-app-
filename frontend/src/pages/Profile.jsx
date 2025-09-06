import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaTicketAlt, FaSignOutAlt, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

// API base URL'i Android Studio için ayarla
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token kontrolü ve yenileme fonksiyonu
const checkAndRefreshToken = async () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!token || !refreshToken) return false;

  try {
    // Token'ın süresini kontrol et
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000; // milisaniyeye çevir
    const currentTime = Date.now();

    // Token'ın süresi dolmak üzereyse (5 dakika kaldıysa) yenile
    if (expirationTime - currentTime < 300000) { // 5 dakika = 300000 ms
      const response = await api.post('/auth/refresh-token', { refreshToken });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return true;
  } catch (error) {
    console.error('Token kontrol hatası:', error);
    return false;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Token kontrolü
        const isTokenValid = await checkAndRefreshToken();
        if (!isTokenValid) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setError(null);
      } catch (err) {
        console.error('Profil yükleme hatası:', err);
        if (err.response?.status === 401) {
          // Token geçersiz veya süresi dolmuş
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        } else {
          setError('Profil bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Tüm oturum verilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    
    // Çerezleri temizle (varsa)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Ana sayfaya yönlendir
    navigate('/', { replace: true });
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-user-info">
          <div className="profile-avatar">
            <FaUser size={50} />
          </div>
          <h3>{userData?.name || 'Kullanıcı'}</h3>
          <p>{userData?.email || 'user@email.com'}</p>
        </div>
        
        <nav className="profile-nav">
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> Siparişlerim
          </button>
          <button 
            className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <FaHeart /> Favorilerim
          </button>
          <button 
            className={`nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            <FaTicketAlt /> Kuponlarım
          </button>
          <button 
            className={`nav-item ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <FaMapMarkerAlt /> Adreslerim
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock /> Güvenlik
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h2>Siparişlerim</h2>
            <div className="orders-list">
              {/* Sipariş listesi buraya gelecek */}
              <p>Henüz siparişiniz bulunmamaktadır.</p>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="tab-content">
            <h2>Favorilerim</h2>
            <div className="favorites-list">
              {/* Favori ürünler listesi buraya gelecek */}
              <p>Henüz favori ürününüz bulunmamaktadır.</p>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="tab-content">
            <h2>Kuponlarım</h2>
            <div className="coupons-list">
              {/* Kupon listesi buraya gelecek */}
              <p>Aktif kuponunuz bulunmamaktadır.</p>
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="tab-content">
            <h2>Adreslerim</h2>
            <div className="addresses-list">
              {/* Adres listesi buraya gelecek */}
              <p>Henüz adres eklenmemiş.</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="tab-content">
            <h2>Güvenlik</h2>
            <div className="security-options">
              <button className="change-password-btn">Şifre Değiştir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 
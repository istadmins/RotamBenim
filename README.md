# RotamBenim - Avrupa Gezi Planlayıcısı

RotamBenim, Avrupa'daki gezilecek yerleri keşfetmenize, kişisel listenizi oluşturmanıza ve seyahat rotalarınızı planlamanıza yardımcı olan modern bir web uygulamasıdır.

## 🌟 Özellikler

### 🔐 Kimlik Doğrulama
- Google hesabı ile güvenli giriş
- Kişisel veri senkronizasyonu
- Çoklu cihaz desteği

### 📍 Yer Yönetimi
- Önceden tanımlanmış Avrupa destinasyonları
- Yeni yer ekleme özelliği
- Yer silme ve düzenleme
- Ziyaret durumu takibi
- Kategori bazlı filtreleme

### 🗺️ Harita Entegrasyonu
- Google Maps entegrasyonu
- Seçilen yerlerin harita üzerinde görüntülenmesi
- Koordinat bazlı konum desteği

### 🛣️ Rota Planlama
- Çoklu yer seçimi
- Sıralı rota oluşturma
- Google Maps'e otomatik yönlendirme
- Rota linkini paylaşma

### 🎨 Modern Kullanıcı Arayüzü
- Responsive tasarım
- Tailwind CSS ile modern görünüm
- Erişilebilirlik desteği
- Toast bildirimleri
- Loading durumları

### 🔧 Teknik Özellikler
- Modüler JavaScript mimarisi
- Firebase Firestore veritabanı
- Real-time veri senkronizasyonu
- Error handling ve logging
- Performance monitoring

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Firebase projesi
- İnternet bağlantısı

### Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. Authentication'ı etkinleştirin:
   - Authentication > Sign-in method
   - Google'ı etkinleştirin
4. Firestore Database'i etkinleştirin:
   - Firestore Database > Create database
   - Test mode'da başlatın
5. Hosting'i etkinleştirin (opsiyonel)
6. Proje ayarlarından config bilgilerini alın

### Yapılandırma

`public/js/config.js` dosyasındaki Firebase yapılandırmasını güncelleyin:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Firestore İndeksleri

Aşağıdaki birleşik indeksi oluşturun:
- Collection: `places`
- Fields: `country` (Ascending), `name` (Ascending)

Firebase Console > Firestore Database > Indexes bölümünden ekleyebilirsiniz.

### Yerel Geliştirme

```bash
# Firebase CLI kurulumu (opsiyonel)
npm install -g firebase-tools

# Projeyi klonlayın
git clone <repository-url>
cd RotamBenim

# Firebase'e giriş yapın
firebase login

# Yerel sunucuyu başlatın
firebase serve
```

Alternatif olarak, herhangi bir HTTP sunucusu kullanabilirsiniz:

```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx http-server

# PHP ile
php -S localhost:8000
```

## 📁 Proje Yapısı

```
RotamBenim/
├── public/
│   ├── index.html              # Ana HTML dosyası
│   ├── styles.css              # CSS stilleri
│   └── js/
│       ├── config.js           # Yapılandırma ve sabitler
│       ├── utils.js            # Yardımcı fonksiyonlar
│       ├── firebase-service.js # Firebase servisleri
│       ├── ui-components.js    # UI bileşenleri
│       ├── place-manager.js    # Yer yönetimi
│       ├── route-manager.js    # Rota yönetimi
│       └── app.js              # Ana uygulama
├── firebase.json               # Firebase yapılandırması
└── README.md                   # Bu dosya
```

## 🏗️ Mimari

### Modüler Yapı
Uygulama, birbirinden bağımsız modüllerden oluşur:

- **Config**: Yapılandırma ve sabitler
- **Utils**: Genel yardımcı fonksiyonlar
- **FirebaseService**: Firebase işlemleri
- **UIComponents**: Kullanıcı arayüzü bileşenleri
- **PlaceManager**: Yer yönetimi işlemleri
- **RouteManager**: Rota planlama işlemleri
- **App**: Ana uygulama koordinatörü

### Veri Akışı
1. Kullanıcı Google ile giriş yapar
2. Firebase Authentication kullanıcıyı doğrular
3. Firestore'dan kullanıcıya özel veriler yüklenir
4. Real-time listeners veri değişikliklerini takip eder
5. UI otomatik olarak güncellenir

### Güvenlik
- Firebase Security Rules ile veri koruması
- Kullanıcı bazlı veri izolasyonu
- XSS koruması için HTML sanitization
- HTTPS zorunluluğu

## 🎯 Kullanım

### Giriş Yapma
1. "Google ile Giriş Yap" butonuna tıklayın
2. Google hesabınızı seçin
3. İzinleri onaylayın

### Yer Ekleme
1. "Yeni Yer Ekle" bölümüne yer adını yazın
2. "Yer Ekle" butonuna tıklayın
3. Yer listenize otomatik olarak eklenir

### Rota Oluşturma
1. Listeden rotaya eklemek istediğiniz yerlere tıklayın
2. Seçilen yerler mavi renkte işaretlenir
3. En az 2 yer seçtikten sonra "Rota Oluştur" butonu aktif olur
4. Butona tıklayarak Google Maps rotasını oluşturun

### Filtreleme
- Ülke filtresini kullanarak belirli ülkelerdeki yerleri görün
- Ziyaret durumu filtresini kullanarak gezilen/gezilmeyen yerleri ayırın

## 🔧 Geliştirme

### Kod Standartları
- ES6+ JavaScript kullanımı
- Modüler mimari
- JSDoc dokümantasyonu
- Error handling
- Accessibility desteği

### Yeni Özellik Ekleme

1. **Yeni Modül Oluşturma**:
```javascript
class NewModule {
    constructor() {
        this.isInitialized = false;
    }
    
    initialize() {
        // Initialization logic
        this.isInitialized = true;
    }
    
    cleanup() {
        // Cleanup logic
    }
}

window.newModule = new NewModule();
```

2. **Ana Uygulamaya Entegrasyon**:
```javascript
// app.js içinde
this.modules.newModule = window.newModule;
this.modules.newModule.initialize();
```

### Debugging
- Browser Developer Tools kullanın
- Console logları kontrol edin
- Network sekmesinde Firebase isteklerini izleyin
- Application sekmesinde localStorage/sessionStorage'ı kontrol edin

## 🚀 Deployment

### Firebase Hosting
```bash
# Build (eğer build süreci varsa)
npm run build

# Deploy
firebase deploy
```

### Diğer Hosting Servisleri
- Netlify
- Vercel
- GitHub Pages
- Heroku

Statik dosyaları herhangi bir web sunucusuna yükleyebilirsiniz.

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**Firebase bağlantı hatası**:
- Config bilgilerini kontrol edin
- API anahtarının doğru olduğundan emin olun
- Firebase projesinin aktif olduğunu kontrol edin

**Firestore indeks hatası**:
- Firebase Console'dan gerekli indeksleri oluşturun
- Hata mesajındaki linke tıklayarak otomatik oluşturun

**Google Sign-In çalışmıyor**:
- Authorized domains listesini kontrol edin
- HTTPS kullandığınızdan emin olun (localhost hariç)

**Veriler yüklenmiyor**:
- Network sekmesinde istekleri kontrol edin
- Firestore Security Rules'ları kontrol edin
- Kullanıcının doğru yetkilere sahip olduğundan emin olun

### Log Kontrolü
```javascript
// Browser console'da
console.log(rotamBenimApp.getApplicationState());
console.log(firebaseService.getCurrentUser());
console.log(placeManager.getPlaces());
```

## 📈 Performance

### Optimizasyon İpuçları
- Lazy loading kullanın
- Image optimization yapın
- Bundle size'ı minimize edin
- Caching stratejileri uygulayın
- CDN kullanın

### Monitoring
- Firebase Performance Monitoring
- Google Analytics
- Custom performance metrics

## 🔒 Güvenlik

### Best Practices
- Firebase Security Rules kullanın
- API anahtarlarını güvenli tutun
- HTTPS zorunlu yapın
- Input validation yapın
- XSS koruması uygulayın

### Security Rules Örneği
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- GitHub Issues: Sorunları bildirin
- Email: [your-email@example.com]
- Website: [your-website.com]

## 🙏 Teşekkürler

- Firebase ekibine harika backend servisleri için
- Tailwind CSS ekibine modern CSS framework'ü için
- Google Maps ekibine harita servisleri için
- Açık kaynak topluluğuna katkıları için

---

**RotamBenim** ile Avrupa'yı keşfedin! 🌍✈️
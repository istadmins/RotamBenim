# RotamBenim Enhanced Setup Guide

Bu rehber, RotamBenim projenizin gelişmiş versiyonunu kurmak için gerekli adımları açıklar.

## 🚀 Yeni Özellikler

### 1. Fullpage Scrolling (Foton Tarzı)
- Smooth kayan sayfalar
- Otomatik animasyonlar
- Klavye navigasyonu
- Mobil uyumlu

### 2. Dinamik Arkaplan Resimleri
- Pexels API entegrasyonu
- Ülkeye özel arkaplan resimleri
- Otomatik resim önbelleği
- Fallback resimleri

## 📋 Kurulum Adımları

### 1. Pexels API Anahtarı Alın

1. [Pexels.com](https://www.pexels.com/) sitesine gidin
2. Ücretsiz hesap oluşturun
3. [API sayfasına](https://www.pexels.com/api/) gidin
4. "Get Started" butonuna tıklayın
5. API anahtarınızı kopyalayın

### 2. API Anahtarını Yapılandırın

`public/js/enhanced-background-manager.js` dosyasını açın ve şu satırı bulun:

```javascript
this.pexelsApiKey = 'YOUR_PEXELS_API_KEY';
```

`YOUR_PEXELS_API_KEY` yerine aldığınız API anahtarını yazın:

```javascript
this.pexelsApiKey = 'YOUR_ACTUAL_API_KEY_HERE';
```

### 3. Gelişmiş Versiyonu Aktifleştirin

Mevcut `index.html` dosyanızı yedekleyin:
```bash
cp public/index.html public/index-backup.html
```

Gelişmiş versiyonu aktifleştirin:
```bash
cp public/index-enhanced.html public/index.html
cp public/styles-enhanced.css public/styles.css
```

### 4. Gerekli Kütüphaneleri Kontrol Edin

Gelişmiş versiyon şu kütüphaneleri kullanır:
- FullPage.js (CDN'den yüklenir)
- Mevcut Firebase ve diğer kütüphaneler

## 🎨 Özelleştirme

### Arkaplan Resimleri

`enhanced-background-manager.js` dosyasında ülke sorgularını özelleştirebilirsiniz:

```javascript
this.countryQueries = {
    'turkey': ['Turkey landmarks', 'Istanbul', 'Cappadocia'],
    'france': ['France landmarks', 'Paris Eiffel Tower'],
    // Daha fazla ülke ekleyebilirsiniz
};
```

### Bölüm Eşleştirmeleri

Hangi bölümün hangi ülke temasını kullanacağını ayarlayabilirsiniz:

```javascript
this.sectionCountryMap = {
    'hero': 'default',
    'add-place': 'turkey',
    'places-list': 'italy', 
    'map-view': 'france',
    'about': 'spain'
};
```

### Animasyon Ayarları

`enhanced-fullpage-manager.js` dosyasında animasyon sürelerini değiştirebilirsiniz:

```javascript
this.animationDuration = 800; // ms
this.animationEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
```

## 🔧 Sorun Giderme

### API Anahtarı Çalışmıyor
- API anahtarının doğru kopyalandığından emin olun
- Pexels hesabınızın aktif olduğunu kontrol edin
- Tarayıcı konsolunda hata mesajlarını kontrol edin

### Fullpage Çalışmıyor
- FullPage.js CDN bağlantısının çalıştığını kontrol edin
- Mobil cihazlarda normal scrolling kullanılır
- Tarayıcı konsolunda hata mesajlarını kontrol edin

### Arkaplan Resimleri Yüklenmiyor
- İnternet bağlantınızı kontrol edin
- Fallback resimleri otomatik olarak kullanılır
- Cache'i temizlemek için sayfayı yenileyin

## 📱 Mobil Uyumluluk

Gelişmiş versiyon mobil cihazlarda:
- Normal scrolling kullanır
- Intersection Observer ile animasyonları tetikler
- Touch-friendly arayüz sağlar

## 🎯 Performans İpuçları

1. **Resim Önbelleği**: Resimler otomatik olarak önbelleğe alınır
2. **Lazy Loading**: Resimler ihtiyaç duyulduğunda yüklenir
3. **Fallback Resimleri**: API erişilemezse varsayılan resimler kullanılır

## 🔄 Geri Dönüş

Eski versiyona dönmek için:

```bash
cp public/index-backup.html public/index.html
cp public/styles-new.css public/styles.css
```

## 🆘 Destek

Sorun yaşarsanız:
1. Tarayıcı konsolunu kontrol edin
2. Network sekmesinde API isteklerini kontrol edin
3. GitHub Issues'da sorun bildirin

## 📈 Gelecek Güncellemeler

Planlanan özellikler:
- Daha fazla ülke teması
- Özel arkaplan yükleme
- Gelişmiş animasyonlar
- Daha fazla Pexels kategorisi

---

**Not**: Bu gelişmiş versiyon mevcut tüm özelliklerinizi korur ve üzerine yeni özellikler ekler.
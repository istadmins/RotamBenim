/**
 * Configuration file for RotamBenim application
 * Contains Firebase configuration and application constants
 */

// Firebase Configuration
// TODO: Replace with your own Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyB6bIJOkooeRSKWtb09zdNmMIjHDbXCzYA", 
    authDomain: "rotambenim.firebaseapp.com", 
    projectId: "rotambenim", 
    storageBucket: "rotambenim.firebasestorage.app", 
    messagingSenderId: "374285362920", 
    appId: "1:374285362920:web:b4058cf4a93e7337168b5d", 
    measurementId: "G-0QVZ4LDYPJ" 
};

// Application Configuration
const APP_CONFIG = {
    appId: firebaseConfig.appId || 'default-app-id',
    currentDataVersion: "1.6",
    maxPlaceNameLength: 100,
    maxDescriptionLength: 500,
    toastDuration: 5000,
    debounceDelay: 300,
    maxRoutePoints: 25, // Google Maps waypoint limit
    defaultMapZoom: 10,
    defaultMapCenter: { lat: 50.0755, lng: 14.4378 }, // Prague, Europe center
};

// UI Messages
const MESSAGES = {
    auth: {
        signingIn: "Google ile giriş yapılıyor...",
        signInSuccess: "Başarıyla giriş yapıldınız!",
        signInError: "Giriş yapılırken bir hata oluştu",
        signInCancelled: "Giriş iptal edildi",
        signOutSuccess: "Başarıyla çıkış yapıldınız",
        signOutError: "Çıkış yapılırken bir hata oluştu",
        networkError: "Ağ hatası. İnternet bağlantınızı kontrol edin",
        pleaseSignIn: "Lütfen Google ile giriş yapın"
    },
    places: {
        loading: "Yerler yükleniyor...",
        loadError: "Yerler yüklenirken hata oluştu",
        addSuccess: "Yer başarıyla eklendi!",
        addError: "Yer eklenirken hata oluştu",
        deleteSuccess: "Yer başarıyla silindi!",
        deleteError: "Yer silinirken hata oluştu",
        updateSuccess: "Yer güncellendi!",
        updateError: "Yer güncellenirken hata oluştu",
        emptyList: "Henüz yer eklenmemiş",
        noResults: "Bu filtreye uygun yer bulunamadı",
        confirmDelete: "Bu yeri silmek istediğinizden emin misiniz?",
        nameRequired: "Lütfen bir yer adı girin",
        nameTooLong: `Yer adı en fazla ${APP_CONFIG.maxPlaceNameLength} karakter olabilir`
    },
    route: {
        created: "Rota başarıyla oluşturuldu!",
        minPlaces: "Rota oluşturmak için en az 2 yer seçmelisiniz",
        maxPlaces: `En fazla ${APP_CONFIG.maxRoutePoints} yer seçebilirsiniz`,
        cleared: "Seçim temizlendi"
    },
    general: {
        error: "Bir hata oluştu",
        success: "İşlem başarılı",
        loading: "Yükleniyor...",
        retry: "Tekrar dene",
        cancel: "İptal",
        confirm: "Onayla"
    }
};

// Initial places data for new users
const INITIAL_PLACES_DATA = [
    // HOLLANDA
    { 
        userGivenId: 'nl_001', 
        country: "HOLLANDA", 
        name: "Amsterdam Kanalları", 
        city: "Amsterdam", 
        description: "UNESCO Dünya Mirası listesindeki Amsterdam'ın tarihi kanal kuşağı (Grachtengordel), şehrin Altın Çağı'ndan kalma zarif kanal evleri, sayısız köprüsü ve pitoresk su yollarıyla ünlüdür. Tekne turu yapmak, kanallar boyunca bisiklete binmek veya sadece kıyısında oturup atmosferin tadını çıkarmak eşsiz bir deneyimdir.", 
        category: "Şehir Simgesi / Kültürel / UNESCO / Tarihi", 
        visited: false, 
        mapQuery: "Amsterdam Kanalları", 
        selectedForRoute: false,
        coordinates: { lat: 52.3676, lng: 4.9041 }
    },
    { 
        userGivenId: 'nl_002', 
        country: "HOLLANDA", 
        name: "Keukenhof Bahçeleri", 
        city: "Lisse", 
        description: "Dünyanın en büyük çiçek bahçelerinden biri olan Keukenhof, özellikle ilkbahar aylarında (Mart-Mayıs arası) milyonlarca lale, nergis, sümbül ve diğer soğanlı çiçeklerin rengarenk bir şölen sunduğu bir cennettir. Her yıl farklı bir temayla düzenlenen bahçe, fotoğrafçılar ve doğa severler için kaçırılmaması gereken bir yerdir.", 
        category: "Bahçe / Doğa / Çiçek / Turistik", 
        visited: false, 
        mapQuery: "Keukenhof, Lisse", 
        selectedForRoute: false,
        coordinates: { lat: 52.2705, lng: 4.5466 }
    },
    { 
        userGivenId: 'nl_003', 
        country: "HOLLANDA", 
        name: "Zaanse Schans", 
        city: "Zaandam", 
        description: "Amsterdam yakınlarında yer alan Zaanse Schans, Hollanda'nın geleneksel kırsal yaşamını ve endüstriyel mirasını yansıtan bir açık hava müzesi gibidir. Tarihi yel değirmenleri, ahşap evleri, peynir ve takunya (klompen) yapım atölyeleriyle ziyaretçilere zamanda bir yolculuk sunar.", 
        category: "Köy / Kültürel / Tarihi / Turistik / Yel Değirmeni", 
        visited: false, 
        mapQuery: "Zaanse Schans", 
        selectedForRoute: false,
        coordinates: { lat: 52.4741, lng: 4.8179 }
    },
    { 
        userGivenId: 'nl_004', 
        country: "HOLLANDA", 
        name: "Rotterdam", 
        city: "Rotterdam", 
        description: "II. Dünya Savaşı'nda büyük ölçüde yıkıldıktan sonra modern mimariyle yeniden inşa edilen Rotterdam, Hollanda'nın en dinamik ve yenilikçi şehirlerinden biridir. Erasmus Köprüsü, Küp Evler (Kijk-Kubus), Markthal (Pazar Yeri) gibi cesur ve fütüristik yapılarıyla tanınır.", 
        category: "Şehir / Mimari / Modern / Liman", 
        visited: false, 
        mapQuery: "Rotterdam", 
        selectedForRoute: false,
        coordinates: { lat: 51.9225, lng: 4.4792 }
    },
    { 
        userGivenId: 'nl_005', 
        country: "HOLLANDA", 
        name: "Giethoorn", 
        city: "Giethoorn", 
        description: "'Kuzeyin Venedik'i' veya 'Hollanda'nın Venedik'i' olarak da anılan Giethoorn, arabaların giremediği, ulaşımın çoğunlukla teknelerle sağlandığı kanalları, ahşap köprüleri ve kamış çatılı şirin evleriyle masalsı bir köydür.", 
        category: "Köy / Kanal / Eşsiz / Pitoresk", 
        visited: false, 
        mapQuery: "Giethoorn, Hollanda", 
        selectedForRoute: false,
        coordinates: { lat: 52.7386, lng: 6.0783 }
    }
];

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, APP_CONFIG, MESSAGES, INITIAL_PLACES_DATA };
}
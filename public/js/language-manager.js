/**
 * Language Manager for Travel App
 * Supports Turkish and English languages
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'tr'; // Default language
        this.supportedLanguages = ['tr', 'en'];
        this.isInitialized = false;
        
        // Load saved language preference
        const savedLanguage = localStorage.getItem('travelApp_language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }
        
        // Language data
        this.translations = {
            tr: {
                // App Title and Description
                appTitle: "Seyahat Rotam",
                appDescription: "Dünyanın dört bir yanındaki harika yerleri keşfedin, seyahat rotalarınızı oluşturun ve maceralarınızı takip edin!",
                
                // Authentication
                signInWithGoogle: "Google ile Giriş Yap",
                signOut: "Çıkış Yap",
                pleaseSignIn: "Lütfen Google ile giriş yapın",
                welcome: "Hoşgeldin",
                signingIn: "Giriş yapılıyor...",
                signingOut: "Çıkış yapılıyor...",
                
                // Language Selection
                language: "Dil",
                english: "İngilizce",
                turkish: "Türkçe",
                
                // Add Place Section
                addNewPlace: "Yeni Yer Ekle",
                addNewCountry: "Yeni Ülke Ekle",
                placeholderPlace: "örn: Paris, Eyfel Kulesi...",
                placeholderCountry: "örn: Japonya",
                addPlace: "Yer Ekle",
                addCountry: "Ülke Ekle",
                addPlaces: "Yerleri Ekle",
                
                // Places List
                placesToVisit: "Gidilecek Yerler",
                clickToSelect: "Rota oluşturmak için yerleri tıklayın",
                country: "Ülke",
                status: "Durum",
                allCountries: "Tüm Ülkeler",
                all: "Tümü",
                notVisited: "Gezilmedi",
                visited: "Gezildi",
                
                // Route Generation
                createRoute: "Seçili Yerlerle Rota Oluştur",
                selectPlaces: "Rota oluşturmak için yer seçin",
                selectOneMore: "Bir yer daha seçin",
                routeCreated: "Rota Oluşturuldu:",
                openInGoogleMaps: "Google Haritalar'da Aç",
                
                // Map
                map: "Harita",
                clickToView: "Yerleri haritada görmek için tıklayın. Rota oluşturma, seçtiğiniz destinasyonlarla Google Haritalar'ı açacaktır.",
                
                // Messages
                enterPlaceName: "Lütfen bir yer adı girin",
                enterCountryName: "Lütfen bir ülke adı girin",
                addingPlace: "Ekleniyor...",
                addingCountry: "Ülke ekleniyor...",
                placeAdded: "Yer başarıyla eklendi!",
                countryAdded: "yerden yer eklendi",
                errorAddingPlace: "Yer eklenirken hata oluştu",
                errorAddingCountry: "Ülke eklenirken hata oluştu",
                confirmDelete: "silmek istediğinizden emin misiniz",
                deleted: "silindi",
                errorDeleting: "Yer silinirken hata oluştu",
                signInToAdd: "Yer eklemek için lütfen giriş yapın",
                signInToManage: "Seyahat rotanızı yönetmek için lütfen Google ile giriş yapın",
                loadingPlaces: "Yerler yükleniyor...",
                placesInItinerary: "yer rotanızda",
                
                // Place Details
                delete: "Sil",
                category: "Kategori",
                description: "Açıklama",
                city: "Şehir",
                userAdded: "Kullanıcı Ekledi",
                addedByUser: "Kullanıcı tarafından eklendi",
                
                // Country Places
                selectCountryPlaces: "eklenecek yerleri seçin",
                selectedPlaces: "seçilen yer",
                addSelectedPlaces: "Seçilen Yerleri Ekle",
                cancel: "İptal",
                
                // Tabs
                addPlaceTab: "Yer Ekle",
                addCountryTab: "Ülke Ekle",
                
                // Header
                title: 'Rotam Benim',
                subtitle: 'Dünyanın harika yerlerini keşfedin, seyahat rotalarınızı oluşturun ve maceralarınızı takip edin!',
                
                // Status Messages
                authChecking: 'Kimlik durumu kontrol ediliyor...',
                authError: 'Giriş hatası',
                authCancelled: 'Giriş iptal edildi. Lütfen tekrar deneyin',
                networkError: 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin',
                firebaseError: 'Firebase başlatılamadı',
                dataLoading: 'Veriler yükleniyor...',
                dataError: 'Veri yükleme hatası',
                
                // Country Background
                backgroundImage: 'Arka Plan Resmi',
                loadingImage: 'Resim yükleniyor...',
                imageError: 'Resim yüklenemedi',
                noPlacesFound: "Bu kriterlere uygun yer bulunamadı."
            },
            en: {
                // App Title and Description
                appTitle: "My Travel Itinerary",
                appDescription: "Discover amazing places around the world, create your travel routes, and track your adventures!",
                
                // Authentication
                signInWithGoogle: "Sign in with Google",
                signOut: "Sign Out",
                pleaseSignIn: "Please sign in with Google",
                welcome: "Welcome",
                signingIn: "Signing in...",
                signingOut: "Signing out...",
                
                // Language Selection
                language: "Language",
                english: "English",
                turkish: "Turkish",
                
                // Add Place Section
                addNewPlace: "Add New Place",
                addNewCountry: "Add New Country",
                placeholderPlace: "e.g., Paris, Eiffel Tower...",
                placeholderCountry: "e.g., Japan",
                addPlace: "Add Place",
                addCountry: "Add Country",
                addPlaces: "Add Places",
                
                // Places List
                placesToVisit: "Places to Visit",
                clickToSelect: "Click on places to select them for route creation",
                country: "Country",
                status: "Status",
                allCountries: "All Countries",
                all: "All",
                notVisited: "Not Visited",
                visited: "Visited",
                
                // Route Generation
                createRoute: "Create Route with Selected Places",
                selectPlaces: "Select places to create route",
                selectOneMore: "Select one more place",
                routeCreated: "Route Created:",
                openInGoogleMaps: "Open in Google Maps",
                
                // Map
                map: "Map",
                clickToView: "Click on places to view them on the map. Route creation will open Google Maps with your selected destinations.",
                
                // Messages
                enterPlaceName: "Please enter a place name",
                enterCountryName: "Please enter a country name",
                addingPlace: "Adding place...",
                addingCountry: "Adding country...",
                placeAdded: "Place added successfully!",
                countryAdded: "places added from",
                errorAddingPlace: "Error adding place",
                errorAddingCountry: "Error adding country",
                confirmDelete: "Are you sure you want to delete",
                deleted: "deleted",
                errorDeleting: "Error deleting place",
                signInToAdd: "Please sign in to add places",
                signInToManage: "Please sign in to manage your travel itinerary",
                loadingPlaces: "Loading places...",
                placesInItinerary: "places in your itinerary",
                
                // Place Details
                delete: "Delete",
                category: "Category",
                description: "Description",
                city: "City",
                userAdded: "User Added",
                addedByUser: "Added by user",
                
                // Country Places
                selectCountryPlaces: "Select places to add from",
                selectedPlaces: "selected places",
                addSelectedPlaces: "Add Selected Places",
                cancel: "Cancel",
                
                // Tabs
                addPlaceTab: "Add Place",
                addCountryTab: "Add Country",
                
                // Header
                title: 'My Travel Itinerary',
                subtitle: 'Discover amazing places around the world, create your travel routes, and track your adventures!',
                
                // Status Messages
                authChecking: 'Checking authentication status...',
                authError: 'Authentication error',
                authCancelled: 'Sign in cancelled. Please try again',
                networkError: 'Network error. Please check your internet connection',
                firebaseError: 'Failed to initialize Firebase',
                dataLoading: 'Loading data...',
                dataError: 'Data loading error',
                
                // Country Background
                backgroundImage: 'Background Image',
                loadingImage: 'Loading image...',
                imageError: 'Failed to load image',
                noPlacesFound: "No places found matching these criteria."
            }
        };
    }

    /**
     * Initialize language manager
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[LanguageManager] Already initialized');
            return;
        }

        this.createLanguageSelector();
        this.updatePageLanguage();
        
        this.isInitialized = true;
        console.log('[LanguageManager] Language Manager initialized');
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        if (!translation) {
            console.warn(`[LanguageManager] Translation not found for key: ${key}`);
            return key;
        }
        return translation;
    }

    /**
     * Change language
     * @param {string} language - Language code
     */
    changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`[LanguageManager] Unsupported language: ${language}`);
            return;
        }

        this.currentLanguage = language;
        localStorage.setItem('travelApp_language', language);
        
        this.updatePageLanguage();
        
        // Dispatch language change event
        const event = new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        });
        document.dispatchEvent(event);
        
        console.log(`[LanguageManager] Language changed to: ${language}`);
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Create language selector
     */
    createLanguageSelector() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        // Create language selector container
        const languageContainer = document.createElement('div');
        languageContainer.className = 'flex items-center justify-center mt-4 mb-2';
        languageContainer.innerHTML = `
            <label for="languageSelect" class="mr-2 text-sm text-gray-600">${this.t('language')}:</label>
            <select id="languageSelect" class="p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500 focus:outline-none">
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>${this.t('english')}</option>
                <option value="tr" ${this.currentLanguage === 'tr' ? 'selected' : ''}>${this.t('turkish')}</option>
            </select>
        `;

        // Insert after auth container
        authContainer.parentNode.insertBefore(languageContainer, authContainer.nextSibling);

        // Add event listener
        const select = document.getElementById('languageSelect');
        select.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }

    /**
     * Update page language
     */
    updatePageLanguage() {
        // Update page title
        document.title = this.t('appTitle');

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', this.t('appDescription'));
        }

        // Update main header
        const appTitle = document.querySelector('h1');
        if (appTitle) appTitle.textContent = this.t('appTitle');

        const appDesc = document.querySelector('header p');
        if (appDesc) appDesc.textContent = this.t('appDescription');

        // Update authentication elements
        this.updateAuthElements();
        
        // Update add place section
        this.updateAddPlaceSection();
        
        // Update places list section
        this.updatePlacesListSection();
        
        // Update route section
        this.updateRouteSection();
        
        // Update map section
        this.updateMapSection();
        
        // Update language selector
        this.updateLanguageSelector();
    }

    /**
     * Update authentication elements
     */
    updateAuthElements() {
        const signInBtn = document.getElementById('googleSignInBtn');
        if (signInBtn) {
            const textNode = signInBtn.childNodes[signInBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = this.t('signInWithGoogle');
            }
        }

        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) signOutBtn.textContent = this.t('signOut');
    }

    /**
     * Update add place section
     */
    updateAddPlaceSection() {
        // Tab buttons
        const addPlaceTab = document.getElementById('addPlaceTab');
        if (addPlaceTab) addPlaceTab.textContent = this.t('addPlaceTab');

        const addCountryTab = document.getElementById('addCountryTab');
        if (addCountryTab) addCountryTab.textContent = this.t('addCountryTab');

        // Section headers
        const addPlaceHeader = document.querySelector('[data-translate="addNewPlace"]');
        if (addPlaceHeader) addPlaceHeader.textContent = this.t('addNewPlace');

        const addCountryHeader = document.querySelector('[data-translate="addNewCountry"]');
        if (addCountryHeader) addCountryHeader.textContent = this.t('addNewCountry');

        // Input placeholders
        const placeInput = document.getElementById('newPlaceNameInput');
        if (placeInput) placeInput.placeholder = this.t('placeholderPlace');

        const countryInput = document.getElementById('newCountryNameInput');
        if (countryInput) countryInput.placeholder = this.t('placeholderCountry');

        // Button texts
        const addPlaceBtnText = document.getElementById('addPlaceBtnText');
        if (addPlaceBtnText) addPlaceBtnText.textContent = this.t('addPlace');

        const addCountryBtnText = document.getElementById('addCountryBtnText');
        if (addCountryBtnText) addCountryBtnText.textContent = this.t('addCountry');
    }

    /**
     * Update places list section
     */
    updatePlacesListSection() {
        const placesHeader = document.querySelector('[data-translate="placesToVisit"]');
        if (placesHeader) placesHeader.textContent = this.t('placesToVisit');

        const clickToSelect = document.querySelector('[data-translate="clickToSelect"]');
        if (clickToSelect) clickToSelect.textContent = this.t('clickToSelect');

        // Filter labels
        const countryLabel = document.querySelector('label[for="filterCountry"]');
        if (countryLabel) countryLabel.textContent = this.t('country') + ':';

        const statusLabel = document.querySelector('label[for="filterVisited"]');
        if (statusLabel) statusLabel.textContent = this.t('status') + ':';

        // Filter options
        this.updateFilterOptions();
    }

    /**
     * Update filter options
     */
    updateFilterOptions() {
        const countryFilter = document.getElementById('filterCountry');
        if (countryFilter) {
            const allOption = countryFilter.querySelector('option[value="all"]');
            if (allOption) allOption.textContent = this.t('allCountries');
        }

        const visitedFilter = document.getElementById('filterVisited');
        if (visitedFilter) {
            const options = visitedFilter.querySelectorAll('option');
            options.forEach(option => {
                switch (option.value) {
                    case 'all':
                        option.textContent = this.t('all');
                        break;
                    case 'notvisited':
                        option.textContent = this.t('notVisited');
                        break;
                    case 'visited':
                        option.textContent = this.t('visited');
                        break;
                }
            });
        }
    }

    /**
     * Update route section
     */
    updateRouteSection() {
        const generateRouteBtn = document.getElementById('generateRouteBtn');
        if (generateRouteBtn) {
            // This will be updated by the route manager based on selection count
        }
    }

    /**
     * Update map section
     */
    updateMapSection() {
        const mapTitle = document.querySelector('[data-translate="map"]');
        if (mapTitle) mapTitle.textContent = this.t('map');

        const mapDescription = document.querySelector('[data-translate="clickToView"]');
        if (mapDescription) mapDescription.textContent = this.t('clickToView');
    }

    /**
     * Update language selector
     */
    updateLanguageSelector() {
        const languageLabel = document.querySelector('label[for="languageSelect"]');
        if (languageLabel) languageLabel.textContent = this.t('language') + ':';

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            const options = languageSelect.querySelectorAll('option');
            options.forEach(option => {
                switch (option.value) {
                    case 'en':
                        option.textContent = this.t('english');
                        break;
                    case 'tr':
                        option.textContent = this.t('turkish');
                        break;
                }
            });
        }
    }

    /**
     * Get language manager status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            currentLanguage: this.currentLanguage,
            supportedLanguages: this.supportedLanguages
        };
    }

    /**
     * Clean up language manager
     */
    cleanup() {
        console.log('[LanguageManager] Cleaning up...');
        
        // Remove language selector
        const languageContainer = document.querySelector('label[for="languageSelect"]')?.parentElement;
        if (languageContainer) {
            languageContainer.remove();
        }
        
        console.log('[LanguageManager] Cleanup completed');
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Create global instance
window.languageManager = new LanguageManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}

window.languageManager.applyLanguage = window.languageManager.updatePageLanguage.bind(window.languageManager);
window.languageManager.getText = window.languageManager.t.bind(window.languageManager);
window.languageManager.getSupportedLanguages = function() { return this.supportedLanguages; };
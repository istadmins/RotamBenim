/**
 * Language Manager for RotamBenim application
 * Handles multi-language support and translations
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.translations = {};
        this.supportedLanguages = ['en', 'tr'];
        this.isInitialized = false;
        
        // Load saved language preference
        const savedLanguage = localStorage.getItem('rotamBenim_language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }
    }

    /**
     * Initialize language manager
     */
    initialize() {
        if (this.isInitialized) return;

        console.log('[LanguageManager] Initializing...');
        this.loadTranslations();
        this.createLanguageSelector();
        this.applyTranslations();
        this.isInitialized = true;
        console.log('[LanguageManager] Initialized successfully');
    }

    /**
     * Load all translations
     */
    loadTranslations() {
        this.translations = {
            en: {
                // Header
                appTitle: "My Travel List",
                appDescription: "Mark places to visit, filter, delete and view on map! Click on places to select them for route creation or add new places and countries.",
                signInWithGoogle: "Sign in with Google",
                signOut: "Sign Out",
                authStatus: "Authentication status: Checking...",
                
                // Add Section
                addNewPlaceOrCountry: "Add New Place or Country",
                addPlace: "Add Place",
                addCountry: "Add Country",
                placeholderPlace: "e.g., Eiffel Tower, Pamukkale, Sumela Monastery",
                placeholderCountry: "e.g., Turkey, France, Japan",
                addPlaceBtn: "Add Place",
                addCountryBtn: "Add Country",
                countryDescription: "Adding a country will automatically include 3-20 popular tourist destinations from that country.",
                
                // Places List
                placesToVisit: "Places to Visit",
                clickToCreateRoute: "Click on places from the list to create a route.",
                country: "Country:",
                allCountries: "All Countries",
                status: "Status:",
                all: "All",
                notVisited: "Not Visited",
                visited: "Visited",
                createRoute: "Create Route with Selected",
                clearSelection: "Clear Selection",
                
                // Map
                map: "Map",
                mapDescription: "Marking a place on the map shows its general location. The route creation feature sends selected places to Google Maps. The add new place feature tries to find information automatically; results depend on API capabilities. Your data is stored securely in Firebase.",
                
                // Messages
                loading: "Loading...",
                pleaseSignIn: "Please sign in with Google or wait for the places list to load...",
                welcome: "Welcome to My Travel List! Sign in to get started.",
                
                // Place item
                visitedLabel: "Visited",
                notVisitedLabel: "Not Visited",
                deleteBtn: "Delete",
                
                // Route
                routeCreated: "Route Created!",
                openInGoogleMaps: "Open in Google Maps",
                copyLink: "Copy Link",
                closeRoute: "Close",
                
                // Countries
                selectCountries: "Select Countries to Add",
                availableCountries: "Available Countries",
                selectedCountries: "Selected Countries",
                addSelectedCountries: "Add Selected Countries",
                removeFromSelection: "Remove from selection",
                addToSelection: "Add to selection",
                
                // Language
                language: "Language",
                english: "English",
                turkish: "Türkçe"
            },
            tr: {
                // Header
                appTitle: "Gezi Listem",
                appDescription: "Gezilecek yerleri işaretle, filtrele, sil ve haritada gör! Rota oluşturmak için yerlere tıklayarak seçin veya yeni yer ve ülkeler ekleyin.",
                signInWithGoogle: "Google ile Giriş Yap",
                signOut: "Çıkış Yap",
                authStatus: "Kimlik durumu: Kontrol ediliyor...",
                
                // Add Section
                addNewPlaceOrCountry: "Yeni Yer veya Ülke Ekle",
                addPlace: "Yer Ekle",
                addCountry: "Ülke Ekle",
                placeholderPlace: "örn: Eyfel Kulesi, Pamukkale, Sümela Manastırı",
                placeholderCountry: "örn: Türkiye, Fransa, Japonya",
                addPlaceBtn: "Yer Ekle",
                addCountryBtn: "Ülke Ekle",
                countryDescription: "Ülke eklemek, o ülkeden 3-20 popüler turistik destinasyonu otomatik olarak ekleyecektir.",
                
                // Places List
                placesToVisit: "Gezilecek Yerler",
                clickToCreateRoute: "Rota oluşturmak için listeden yerlere tıklayın.",
                country: "Ülke:",
                allCountries: "Tüm Ülkeler",
                status: "Durum:",
                all: "Tümü",
                notVisited: "Gezilmedi",
                visited: "Gezildi",
                createRoute: "Seçilenlerle Rota Oluştur",
                clearSelection: "Seçimi Temizle",
                
                // Map
                map: "Harita",
                mapDescription: "Haritada bir yerin işaretlenmesi, o yerin genel konumunu gösterir. Rota oluşturma özelliği, seçilen yerleri Google Haritalar'a gönderir. Yeni yer ekleme özelliği, bilgileri otomatik olarak bulmaya çalışır; sonuçlar API'lerin yeteneklerine bağlıdır. Verileriniz Firebase'de güvenli şekilde saklanır.",
                
                // Messages
                loading: "Yükleniyor...",
                pleaseSignIn: "Lütfen Google ile giriş yapın veya yer listesinin yüklenmesini bekleyin...",
                welcome: "Gezi Listem'e hoş geldiniz! Başlamak için giriş yapın.",
                
                // Place item
                visitedLabel: "Gezildi",
                notVisitedLabel: "Gezilmedi",
                deleteBtn: "Sil",
                
                // Route
                routeCreated: "Rota Oluşturuldu!",
                openInGoogleMaps: "Google Haritalar'da Aç",
                copyLink: "Linki Kopyala",
                closeRoute: "Kapat",
                
                // Countries
                selectCountries: "Eklenecek Ülkeleri Seçin",
                availableCountries: "Mevcut Ülkeler",
                selectedCountries: "Seçilen Ülkeler",
                addSelectedCountries: "Seçilen Ülkeleri Ekle",
                removeFromSelection: "Seçimden çıkar",
                addToSelection: "Seçime ekle",
                
                // Language
                language: "Dil",
                english: "English",
                turkish: "Türkçe"
            }
        };
    }

    /**
     * Create language selector in header
     */
    createLanguageSelector() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        // Create language selector
        const languageSelector = document.createElement('div');
        languageSelector.className = 'flex items-center justify-center mt-2 mb-2';
        languageSelector.innerHTML = `
            <label for="languageSelect" class="mr-2 text-sm text-gray-600">${this.t('language')}:</label>
            <select id="languageSelect" class="p-1 border border-gray-300 rounded text-sm focus:ring-sky-500 focus:border-sky-500 focus:outline-none">
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>${this.t('english')}</option>
                <option value="tr" ${this.currentLanguage === 'tr' ? 'selected' : ''}>${this.t('turkish')}</option>
            </select>
        `;

        // Insert before auth container
        authContainer.parentNode.insertBefore(languageSelector, authContainer);

        // Add event listener
        const select = document.getElementById('languageSelect');
        select.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    /**
     * Change language
     * @param {string} language - Language code
     */
    changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) return;
        
        this.currentLanguage = language;
        localStorage.setItem('rotamBenim_language', language);
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Apply translations
        this.applyTranslations();
        
        // Notify other components
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: language } 
        }));
        
        console.log(`[LanguageManager] Language changed to: ${language}`);
    }

    /**
     * Apply translations to DOM elements
     */
    applyTranslations() {
        // Update page title
        document.title = this.t('appTitle') + ' - RotamBenim';
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = this.t('appDescription');
        }

        // Update text content using data attributes
        this.updateElementsWithTranslations();
    }

    /**
     * Update DOM elements with translations
     */
    updateElementsWithTranslations() {
        // Main header
        const appTitle = document.querySelector('h1');
        if (appTitle) appTitle.textContent = this.t('appTitle');

        const appDesc = document.querySelector('header p');
        if (appDesc) appDesc.textContent = this.t('appDescription');

        // Auth section
        const signInBtn = document.getElementById('googleSignInBtn');
        if (signInBtn) {
            const textSpan = signInBtn.querySelector('svg').nextSibling;
            if (textSpan) textSpan.textContent = this.t('signInWithGoogle');
        }

        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) signOutBtn.textContent = this.t('signOut');

        // Add section
        const addSectionHeading = document.getElementById('add-section-heading');
        if (addSectionHeading) addSectionHeading.textContent = this.t('addNewPlaceOrCountry');

        const addPlaceTab = document.getElementById('addPlaceTab');
        if (addPlaceTab) addPlaceTab.textContent = this.t('addPlace');

        const addCountryTab = document.getElementById('addCountryTab');
        if (addCountryTab) addCountryTab.textContent = this.t('addCountry');

        const newPlaceInput = document.getElementById('newPlaceNameInput');
        if (newPlaceInput) newPlaceInput.placeholder = this.t('placeholderPlace');

        const newCountryInput = document.getElementById('newCountryNameInput');
        if (newCountryInput) newCountryInput.placeholder = this.t('placeholderCountry');

        const addPlaceBtn = document.getElementById('addPlaceBtnText');
        if (addPlaceBtn) addPlaceBtn.textContent = this.t('addPlaceBtn');

        const addCountryBtn = document.getElementById('addCountryBtnText');
        if (addCountryBtn) addCountryBtn.textContent = this.t('addCountryBtn');

        // Places section
        const placesHeading = document.getElementById('places-heading');
        if (placesHeading) placesHeading.textContent = this.t('placesToVisit');

        const clickToCreate = document.querySelector('#places-heading + p');
        if (clickToCreate) clickToCreate.textContent = this.t('clickToCreateRoute');

        // Filters
        const countryLabel = document.querySelector('label[for="filterCountry"]');
        if (countryLabel) countryLabel.textContent = this.t('country');

        const statusLabel = document.querySelector('label[for="filterVisited"]');
        if (statusLabel) statusLabel.textContent = this.t('status');

        // Filter options
        this.updateFilterOptions();

        // Buttons
        const generateRouteBtn = document.getElementById('generateRouteBtn');
        if (generateRouteBtn) {
            const text = generateRouteBtn.childNodes[0];
            if (text) text.textContent = this.t('createRoute') + ' (';
        }

        const clearSelectionBtn = document.getElementById('clearSelectionBtn');
        if (clearSelectionBtn) clearSelectionBtn.textContent = this.t('clearSelection');

        // Map section
        const mapHeading = document.getElementById('map-heading');
        if (mapHeading) mapHeading.textContent = this.t('map');

        const mapDesc = document.querySelector('aside p:last-child');
        if (mapDesc) mapDesc.textContent = this.t('mapDescription');

        // Loading overlay
        const loadingText = document.querySelector('#loadingOverlay span');
        if (loadingText) loadingText.textContent = this.t('loading');
    }

    /**
     * Update filter dropdown options
     */
    updateFilterOptions() {
        const filterCountry = document.getElementById('filterCountry');
        if (filterCountry) {
            const allCountriesOption = filterCountry.querySelector('option[value="all"]');
            if (allCountriesOption) allCountriesOption.textContent = this.t('allCountries');
        }

        const filterVisited = document.getElementById('filterVisited');
        if (filterVisited) {
            const options = filterVisited.querySelectorAll('option');
            options.forEach(option => {
                switch(option.value) {
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
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get supported languages
     * @returns {Array} Array of supported language codes
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Add new language support
     * @param {string} languageCode - Language code
     * @param {Object} translations - Translation object
     */
    addLanguage(languageCode, translations) {
        this.supportedLanguages.push(languageCode);
        this.translations[languageCode] = translations;
        
        // Update language selector if it exists
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            const option = document.createElement('option');
            option.value = languageCode;
            option.textContent = translations.language || languageCode.toUpperCase();
            languageSelect.appendChild(option);
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[LanguageManager] Cleaning up...');
        // Remove event listeners if needed
    }
}

// Create and export language manager instance
window.languageManager = new LanguageManager();
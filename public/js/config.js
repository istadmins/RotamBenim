/**
 * Configuration for RotamBenim Travel App
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6bIJOkooeRSKWtb09zdNmMIjHDbXCzYA",
    authDomain: "rotambenim.firebaseapp.com",
    projectId: "rotambenim",
<<<<<<< HEAD
    storageBucket: "rotambenim.appspot.com",
=======
    storageBucket: "rotambenim.firebasestorage.app",
>>>>>>> parent of 19e146e (Initial commit)
    messagingSenderId: "374285362920",
    appId: "1:374285362920:web:b4058cf4a93e7337168b5d",
    measurementId: "G-0QVZ4LDYPJ"
};

<<<<<<< HEAD
// Application Configuration
const APP_CONFIG = {
    appName: 'RotamBenim',
    version: '1.0.0',
    apiKeys: {
        pexels: 'qLDLKWTXLouQCKT40OyIA982lb5kv0ftITaaLYbaOrx2FKNbGf5sZlYF',
    },
    maxPlaceNameLength: 100,
    maxPlacesPerCountry: 20,
    toastDuration: 3000,
    animationDuration: 300,
    features: {
        enableParallaxScrolling: true,
        enableDynamicBackgrounds: true,
        enableMicroAnimations: true
    }
=======
// Pexels API Configuration
// TODO: Replace with your actual Pexels API key
// Get your free API key from: https://www.pexels.com/api/
const PEXELS_API_KEY = 'qLDLKWTXLouQCKT40OyIA982lb5kv0ftITaaLYbaOrx2FKNbGf5sZlYF';

// App Configuration
const APP_CONFIG = {
    name: 'Rotam Benim',
    version: '2.0.0',
    defaultLanguage: 'tr',
    supportedLanguages: ['tr', 'en'],
    maxPlacesPerCountry: 30,
    minPlacesPerCountry: 10,
    cacheExpiryHours: 24,
    enableBackgroundImages: true,
    enableOfflineMode: true,
    enableNotifications: true
};

// Feature Flags
const FEATURES = {
    countryBackgrounds: true,
    multiLanguage: true,
    routeGeneration: true,
    placeSuggestions: true,
    offlineSupport: true,
    analytics: false
};

// UI Configuration
const UI_CONFIG = {
    theme: 'light', // 'light' or 'dark'
    animations: true,
    autoSave: true,
    showPlaceCount: true,
    showCountryStats: true,
    enableKeyboardShortcuts: true
>>>>>>> parent of 19e146e (Initial commit)
};

// Messages
const MESSAGES = {
    auth: {
        signingIn: 'Signing in...',
        signInError: 'Error signing in. Please try again.',
        signOutSuccess: 'Signed out successfully.',
        signOutError: 'Error signing out. Please try again.',
        pleaseSignIn: 'Please sign in to use this feature.'
    },
    places: {
        loading: 'Loading places...',
        loadError: 'Error loading places. Please try again.',
        emptyList: 'No places added yet. Add some places to get started!',
        noResults: 'No places match your filters.',
        nameRequired: 'Please enter a place name.',
        nameTooLong: 'Place name is too long.',
        addSuccess: 'Place added successfully!',
        addError: 'Error adding place. Please try again.',
        updateError: 'Error updating place. Please try again.',
        deleteSuccess: 'Place deleted successfully.',
        deleteError: 'Error deleting place. Please try again.'
    },
    routes: {
        minPlacesRequired: 'Select at least 2 places to create a route',
        routeCreated: 'Route created successfully!',
        routeError: 'Error creating route. Please try again.'
    }
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        firebaseConfig,
        PEXELS_API_KEY,
        APP_CONFIG,
        FEATURES,
        UI_CONFIG
    };
} else {
    // Browser environment
    window.APP_CONFIG = {
        firebaseConfig,
        PEXELS_API_KEY,
        APP_CONFIG,
        FEATURES,
        UI_CONFIG
    };
    window.MESSAGES = MESSAGES;
}
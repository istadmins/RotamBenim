/**
 * Configuration for RotamBenim application
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6bIJOkooeRSKWtb09zdNmMIjHDbXCzYA",
    authDomain: "rotambenim.firebaseapp.com",
    projectId: "rotambenim",
    storageBucket: "rotambenim.appspot.com",
    messagingSenderId: "374285362920",
    appId: "1:374285362920:web:b4058cf4a93e7337168b5d",
    measurementId: "G-0QVZ4LDYPJ"
};

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
        addError: 'Error adding place. Please try again.',
        updateError: 'Error updating place. Please try again.',
        deleteSuccess: 'Place deleted successfully.',
        deleteError: 'Error deleting place. Please try again.'
    },
    countries: {
        addError: 'Error adding countries. Please try again.'
    }
};

// Countries database
const COUNTRIES_DATABASE = {
    // Sample data structure - will be populated from Firebase
    turkiye: {
        name: 'TÜRKİYE',
        places: []
    },
    italya: {
        name: 'İTALYA',
        places: []
    },
    fransa: {
        name: 'FRANSA',
        places: []
    }
};
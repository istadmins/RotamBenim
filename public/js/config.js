/**
 * Configuration for RotamBenim Travel App
 */

// Firebase Configuration
window.firebaseConfig = {
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
    // Application settings
    appName: 'My Travel Itinerary',
    version: '2.0.0',
    
    // API keys
    apiKeys: {
        pexels: 'qLDLKWTXLouQCKT40OyIA982lb5kv0ftITaaLYbaOrx2FKNbGf5sZlYF'
    },
    
    // Application limits
    maxPlaceNameLength: 100,
    maxPlacesPerRoute: 25,
    
    // UI settings
    toastDuration: 3000,
    animationDuration: 300,
    debounceDelay: 300,
    
    // Feature flags
    features: {
        enablePlaceSuggestions: true,
        enableCountryImages: true,
        enableRouteGeneration: true,
        enableRealTimeSync: true
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

// Make configurations globally available
window.APP_CONFIG = APP_CONFIG;
window.MESSAGES = MESSAGES;
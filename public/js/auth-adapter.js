/**
 * Authentication Adapter for RotamBenim application
 * Handles authentication UI and state management
 */

class AuthAdapter {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        
        // DOM elements
        this.authContainer = null;
        this.googleSignInBtn = null;
        this.userDisplay = null;
        this.userNameElement = null;
        this.userPhotoElement = null;
        this.signOutBtn = null;
        this.authStatusElement = null;
        this.userIdDisplayElement = null;
        
        // State
        this.authStateListeners = [];
    }

    /**
     * Initialize authentication adapter
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[AuthAdapter] Already initialized');
            return;
        }

        this.setupDOMElements();
        this.setupEventListeners();
        this.setupFirebaseAuthListener();
        
        this.isInitialized = true;
        console.log('[AuthAdapter] Authentication Adapter initialized');
    }

    /**
     * Setup DOM elements
     */
    setupDOMElements() {
        this.authContainer = document.getElementById('authContainer');
        this.googleSignInBtn = document.getElementById('googleSignInBtn');
        this.userDisplay = document.getElementById('userDisplay');
        this.userNameElement = document.getElementById('userName');
        this.userPhotoElement = document.getElementById('userPhoto');
        this.signOutBtn = document.getElementById('signOutBtn');
        this.authStatusElement = document.getElementById('authStatus');
        this.userIdDisplayElement = document.getElementById('userIdDisplay');

        // Validate required elements
        const requiredElements = {
            authContainer: this.authContainer,
            googleSignInBtn: this.googleSignInBtn,
            userDisplay: this.userDisplay
        };

        for (const [name, element] of Object.entries(requiredElements)) {
            if (!element) {
                console.warn(`[AuthAdapter] Required element not found: ${name}`);
            }
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Google Sign-In button
        if (this.googleSignInBtn) {
            this.googleSignInBtn.addEventListener('click', () => {
                this.handleGoogleSignIn();
            });
        }

        // Sign-Out button
        if (this.signOutBtn) {
            this.signOutBtn.addEventListener('click', () => {
                this.handleSignOut();
            });
        }

        // Listen for auth state changes from other components
        document.addEventListener('authStateChanged', (e) => {
            this.handleAuthStateChange(e.detail.user);
        });
    }

    /**
     * Setup Firebase auth state listener
     */
    setupFirebaseAuthListener() {
        if (window.firebaseService) {
            window.firebaseService.onAuthStateChange((user) => {
                this.handleAuthStateChange(user);
            });
        } else {
            console.warn('[AuthAdapter] Firebase service not available');
        }
    }

    /**
     * Handle Google Sign-In
     */
    async handleGoogleSignIn() {
        if (!window.firebaseService) {
            this.updateAuthStatus('Firebase service not available');
            return;
        }

        if (!this.googleSignInBtn) return;

        try {
            this.updateAuthStatus('Signing in with Google...');
            this.setSignInButtonState(true); // disabled
            
            await window.firebaseService.signInWithGoogle();
            
            // Success is handled by auth state change listener
            
        } catch (error) {
            console.error('[AuthAdapter] Google sign-in error:', error);
            this.updateAuthStatus(error.message || 'Sign-in failed');
            
            if (window.uiComponents) {
                window.uiComponents.showToast(error.message || 'Sign-in failed', 'error');
            }
            
        } finally {
            this.setSignInButtonState(false); // enabled
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        if (!window.firebaseService) {
            this.updateAuthStatus('Firebase service not available');
            return;
        }

        try {
            this.updateAuthStatus('Signing out...');
            
            await window.firebaseService.signOut();
            
            if (window.uiComponents) {
                window.uiComponents.showToast('Signed out successfully', 'success', 2000);
            }
            
        } catch (error) {
            console.error('[AuthAdapter] Sign-out error:', error);
            this.updateAuthStatus(error.message || 'Sign-out failed');
            
            if (window.uiComponents) {
                window.uiComponents.showToast(error.message || 'Sign-out failed', 'error');
            }
        }
    }

    /**
     * Handle authentication state changes
     * @param {Object|null} user - Firebase user object
     */
    handleAuthStateChange(user) {
        this.currentUser = user;
        
        if (user) {
            // User signed in
            this.showUserInterface(user);
            this.updateAuthStatus(`Welcome, ${user.displayName || 'User'}!`);
            
            // Show success toast
            if (window.uiComponents) {
                window.uiComponents.showToast(
                    `Hello ${user.displayName || 'User'}! Loading your places...`,
                    'success',
                    3000
                );
            }
            
            // Initialize user data if needed
            this.initializeUserData();
            
        } else {
            // User signed out
            this.showSignInInterface();
            this.updateAuthStatus('Please sign in with Google');
            
            // Clear any user-specific data
            this.clearUserData();
        }
        
        // Notify listeners
        this.notifyAuthStateListeners(user);
        
        // Dispatch global event
        const event = new CustomEvent('authStateChanged', {
            detail: { user, isAuthenticated: !!user }
        });
        document.dispatchEvent(event);
    }

    /**
     * Show user interface (authenticated state)
     * @param {Object} user - Firebase user object
     */
    showUserInterface(user) {
        if (this.userDisplay && this.googleSignInBtn) {
            // Update user info
            if (this.userNameElement) {
                this.userNameElement.textContent = user.displayName || 'No Name';
            }
            
            if (this.userPhotoElement && user.photoURL) {
                this.userPhotoElement.src = user.photoURL;
                this.userPhotoElement.alt = `${user.displayName || 'User'}'s photo`;
                this.userPhotoElement.classList.remove('hidden');
            } else if (this.userPhotoElement) {
                this.userPhotoElement.classList.add('hidden');
            }
            
            // Show user display, hide sign-in button
            this.userDisplay.classList.remove('hidden');
            this.userDisplay.classList.add('flex');
            this.googleSignInBtn.classList.add('hidden');
        }
        
        // Show user ID for debugging (if element exists)
        if (this.userIdDisplayElement) {
            this.userIdDisplayElement.textContent = `User ID: ${user.uid}`;
        }
        
        // Enable user-specific features
        this.enableUserFeatures();
    }

    /**
     * Show sign-in interface (unauthenticated state)
     */
    showSignInInterface() {
        if (this.userDisplay && this.googleSignInBtn) {
            this.userDisplay.classList.add('hidden');
            this.userDisplay.classList.remove('flex');
            this.googleSignInBtn.classList.remove('hidden');
            this.setSignInButtonState(false); // enabled
        }
        
        if (this.userIdDisplayElement) {
            this.userIdDisplayElement.textContent = '';
        }
        
        // Disable user-specific features
        this.disableUserFeatures();
    }

    /**
     * Enable user-specific features
     */
    enableUserFeatures() {
        // Enable add place button
        const addPlaceBtn = document.getElementById('addPlaceBtn');
        if (addPlaceBtn) {
            addPlaceBtn.disabled = false;
        }
        
        // Enable other user-specific buttons
        const userButtons = document.querySelectorAll('[data-requires-auth="true"]');
        userButtons.forEach(button => {
            button.disabled = false;
        });
    }

    /**
     * Disable user-specific features
     */
    disableUserFeatures() {
        // Disable add place button
        const addPlaceBtn = document.getElementById('addPlaceBtn');
        if (addPlaceBtn) {
            addPlaceBtn.disabled = true;
        }
        
        // Disable other user-specific buttons
        const userButtons = document.querySelectorAll('[data-requires-auth="true"]');
        userButtons.forEach(button => {
            button.disabled = true;
        });
    }

    /**
     * Set sign-in button state
     * @param {boolean} disabled - Whether button should be disabled
     */
    setSignInButtonState(disabled) {
        if (this.googleSignInBtn) {
            this.googleSignInBtn.disabled = disabled;
            
            if (disabled) {
                this.googleSignInBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                this.googleSignInBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    /**
     * Update authentication status message
     * @param {string} message - Status message
     */
    updateAuthStatus(message) {
        if (this.authStatusElement) {
            this.authStatusElement.textContent = message;
        }
        
        console.log(`[AuthAdapter] Status: ${message}`);
    }

    /**
     * Initialize user data after sign-in
     */
    async initializeUserData() {
        if (!window.firebaseService || !this.currentUser) return;

        try {
            this.updateAuthStatus('Initializing your data...');
            
            // Check and initialize user data
            await window.firebaseService.checkAndInitializeUserData();
            
            this.updateAuthStatus('Data initialized successfully');
            
        } catch (error) {
            console.error('[AuthAdapter] Error initializing user data:', error);
            this.updateAuthStatus('Error initializing data');
            
            if (window.uiComponents) {
                window.uiComponents.showToast('Error initializing your data', 'error');
            }
        }
    }

    /**
     * Clear user-specific data
     */
    clearUserData() {
        // Clear route selection
        if (window.routeManager) {
            window.routeManager.clearSelection();
        }
        
        // Clear any cached data
        if (window.placeManager) {
            window.placeManager.clearPlaces();
        }
        
        // Reset map to default view
        const mapFrame = document.getElementById('mapFrame');
        if (mapFrame) {
            mapFrame.src = "https://maps.google.com/maps?output=embed&q=Europe";
        }
        
        const mapLocationName = document.getElementById('mapLocationName');
        if (mapLocationName) {
            mapLocationName.textContent = '';
        }
    }

    /**
     * Add auth state listener
     * @param {Function} listener - Callback function
     */
    addAuthStateListener(listener) {
        if (typeof listener === 'function') {
            this.authStateListeners.push(listener);
        }
    }

    /**
     * Remove auth state listener
     * @param {Function} listener - Callback function to remove
     */
    removeAuthStateListener(listener) {
        const index = this.authStateListeners.indexOf(listener);
        if (index > -1) {
            this.authStateListeners.splice(index, 1);
        }
    }

    /**
     * Notify auth state listeners
     * @param {Object|null} user - User object
     */
    notifyAuthStateListeners(user) {
        this.authStateListeners.forEach(listener => {
            try {
                listener(user);
            } catch (error) {
                console.error('[AuthAdapter] Error in auth state listener:', error);
            }
        });
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user object
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get user statistics
     * @returns {Promise<Object>} User statistics
     */
    async getUserStats() {
        if (!this.isAuthenticated() || !window.firebaseService) {
            return null;
        }

        try {
            return await window.firebaseService.getUserStats();
        } catch (error) {
            console.error('[AuthAdapter] Error getting user stats:', error);
            return null;
        }
    }

    /**
     * Export user data
     * @returns {Promise<Object>} User data
     */
    async exportUserData() {
        if (!this.isAuthenticated() || !window.firebaseService) {
            throw new Error('User not authenticated');
        }

        try {
            return await window.firebaseService.exportUserData();
        } catch (error) {
            console.error('[AuthAdapter] Error exporting user data:', error);
            throw error;
        }
    }

    /**
     * Get auth adapter status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isAuthenticated: this.isAuthenticated(),
            currentUser: this.currentUser ? {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName,
                email: this.currentUser.email
            } : null,
            authListeners: this.authStateListeners.length
        };
    }

    /**
     * Clean up auth adapter
     */
    cleanup() {
        console.log('[AuthAdapter] Cleaning up...');
        
        // Clear listeners
        this.authStateListeners = [];
        
        // Reset UI state
        this.showSignInInterface();
        this.updateAuthStatus('');
        
        console.log('[AuthAdapter] Cleanup completed');
    }
}

// Create global instance
window.authAdapter = new AuthAdapter();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthAdapter;
}
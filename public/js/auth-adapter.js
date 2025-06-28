/**
 * Auth Adapter
 * Adapts the existing Firebase authentication to the new UI
 */

class AuthAdapter {
    constructor() {
        this.isInitialized = false;
        
        // DOM elements
        this.googleSignInBtn = document.getElementById('googleSignInBtn');
        this.userDisplay = document.getElementById('userDisplay');
        this.userName = document.getElementById('userName');
        this.userPhoto = document.getElementById('userPhoto');
        this.signOutBtn = document.getElementById('signOutBtn');
    }

    /**
     * Initialize the auth adapter
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[AuthAdapter] Initializing...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup auth state listener
        this.setupAuthStateListener();
        
        this.isInitialized = true;
        console.log('[AuthAdapter] Initialized successfully');
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
    }

    /**
     * Setup authentication state listener
     */
    setupAuthStateListener() {
        if (window.firebaseService) {
            window.firebaseService.onAuthStateChange((user) => {
                this.handleAuthStateChange(user);
            });
        } else {
            console.error('[AuthAdapter] Firebase service not available');
        }
    }

    /**
     * Handle authentication state changes
     * @param {Object|null} user - Firebase user object
     */
    handleAuthStateChange(user) {
        if (user) {
            // User signed in
            this.showUserInterface(user);
        } else {
            // User signed out
            this.showSignInInterface();
        }
    }

    /**
     * Handle Google Sign-In
     */
    async handleGoogleSignIn() {
        if (!this.googleSignInBtn) return;

        try {
            this.googleSignInBtn.disabled = true;
            
            if (window.firebaseService) {
                await window.firebaseService.signInWithGoogle();
            } else {
                throw new Error('Firebase service not available');
            }
            
        } catch (error) {
            console.error('[AuthAdapter] Google sign-in error:', error);
            
            if (window.uiComponents) {
                window.uiComponents.showToast(error.message || 'Error signing in', 'error');
            }
            
        } finally {
            this.googleSignInBtn.disabled = false;
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        try {
            if (window.firebaseService) {
                await window.firebaseService.signOut();
            } else {
                throw new Error('Firebase service not available');
            }
            
            if (window.uiComponents) {
                window.uiComponents.showToast('Signed out successfully', 'success');
            }
            
        } catch (error) {
            console.error('[AuthAdapter] Sign-out error:', error);
            
            if (window.uiComponents) {
                window.uiComponents.showToast(error.message || 'Error signing out', 'error');
            }
        }
    }

    /**
     * Show user interface (authenticated state)
     * @param {Object} user - Firebase user object
     */
    showUserInterface(user) {
        if (this.userDisplay && this.googleSignInBtn) {
            // Update user info
            if (this.userName) {
                this.userName.textContent = user.displayName || 'User';
            }
            
            if (this.userPhoto && user.photoURL) {
                this.userPhoto.src = user.photoURL;
                this.userPhoto.classList.remove('hidden');
            } else if (this.userPhoto) {
                this.userPhoto.classList.add('hidden');
            }
            
            // Show user display, hide sign-in button
            this.userDisplay.classList.remove('hidden');
            this.userDisplay.classList.add('flex');
            this.googleSignInBtn.classList.add('hidden');
        }
    }

    /**
     * Show sign-in interface (unauthenticated state)
     */
    showSignInInterface() {
        if (this.userDisplay && this.googleSignInBtn) {
            this.userDisplay.classList.add('hidden');
            this.userDisplay.classList.remove('flex');
            this.googleSignInBtn.classList.remove('hidden');
            this.googleSignInBtn.disabled = false;
        }
    }
}

// Create and export auth adapter instance
window.authAdapter = new AuthAdapter();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authAdapter.initialize();
});
/**
 * Main application file for RotamBenim
 * Coordinates all modules and handles application lifecycle
 */

class RotamBenimApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {
            languageManager: window.languageManager,
            firebaseService: window.firebaseService,
            uiComponents: window.uiComponents,
            placeManager: window.placeManager,
            routeManager: window.routeManager
        };
        
        // DOM elements
        this.authContainer = document.getElementById('authContainer');
        this.googleSignInBtn = document.getElementById('googleSignInBtn');
        this.userDisplay = document.getElementById('userDisplay');
        this.userNameElement = document.getElementById('userName');
        this.userPhotoElement = document.getElementById('userPhoto');
        this.signOutBtn = document.getElementById('signOutBtn');
        this.authStatusElement = document.getElementById('authStatus');
        this.userIdDisplayElement = document.getElementById('userIdDisplay');
    }

    /**
     * Initialize the application
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[RotamBenimApp] Application already initialized');
            return;
        }

        console.log('[RotamBenimApp] Starting application initialization...');
        
        try {
            // Show loading state
            this.updateAuthStatus('Starting application...');
            
            // Initialize language manager first
            this.modules.languageManager.initialize();
            
            // Initialize UI components
            this.modules.uiComponents.initialize();
            
            // Initialize Firebase service
            await this.modules.firebaseService.initialize();
            
            // Setup authentication UI
            this.setupAuthenticationUI();
            
            // Initialize other modules
            this.modules.placeManager.initialize();
            this.modules.routeManager.initialize();
            
            // Setup global error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup accessibility features
            this.setupAccessibilityFeatures();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('[RotamBenimApp] Application initialized successfully');
            this.updateAuthStatus('Application ready');
            
            // Show welcome message
            this.modules.uiComponents.showToast(
                'Welcome to My Travel List! Sign in to get started.',
                'info',
                4000
            );
            
        } catch (error) {
            console.error('[RotamBenimApp] Application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Setup authentication UI
     */
    setupAuthenticationUI() {
        // Setup Firebase auth state listener
        this.modules.firebaseService.onAuthStateChange((user) => {
            this.handleAuthStateChange(user);
        });

        // Google Sign-In button
        if (this.googleSignInBtn) {
            this.googleSignInBtn.addEventListener('click', async () => {
                await this.handleGoogleSignIn();
            });
        }

        // Sign-Out button
        if (this.signOutBtn) {
            this.signOutBtn.addEventListener('click', async () => {
                await this.handleSignOut();
            });
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
            this.updateAuthStatus(`Welcome, ${user.displayName || 'User'}!`);
            
            // Show success toast
            this.modules.uiComponents.showToast(
                `Hello ${user.displayName || 'User'}! Loading your places...`,
                'success',
                3000
            );
            
        } else {
            // User signed out
            this.showSignInInterface();
            this.updateAuthStatus('Please sign in with Google');
        }
    }

    /**
     * Handle Google Sign-In
     */
    async handleGoogleSignIn() {
        if (!this.googleSignInBtn) return;

        try {
            this.updateAuthStatus(MESSAGES.auth.signingIn);
            this.googleSignInBtn.disabled = true;
            
            await this.modules.firebaseService.signInWithGoogle();
            
            // Success is handled by auth state change listener
            
        } catch (error) {
            console.error('[RotamBenimApp] Google sign-in error:', error);
            this.updateAuthStatus(error.message || MESSAGES.auth.signInError);
            this.modules.uiComponents.showToast(error.message || MESSAGES.auth.signInError, 'error');
            
        } finally {
            this.googleSignInBtn.disabled = false;
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        try {
            this.updateAuthStatus('Çıkış yapılıyor...');
            
            await this.modules.firebaseService.signOut();
            
            this.modules.uiComponents.showToast(MESSAGES.auth.signOutSuccess, 'success', 2000);
            
        } catch (error) {
            console.error('[RotamBenimApp] Sign-out error:', error);
            this.updateAuthStatus(error.message || MESSAGES.auth.signOutError);
            this.modules.uiComponents.showToast(error.message || MESSAGES.auth.signOutError, 'error');
        }
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
                this.userPhotoElement.classList.remove('hidden');
            } else if (this.userPhotoElement) {
                this.userPhotoElement.classList.add('hidden');
            }
            
            // Show user display, hide sign-in button
            this.userDisplay.classList.remove('hidden');
            this.googleSignInBtn.classList.add('hidden');
        }
        
        // Show user ID for debugging
        if (this.userIdDisplayElement) {
            this.userIdDisplayElement.textContent = `User ID: ${user.uid}`;
        }
    }

    /**
     * Show sign-in interface (unauthenticated state)
     */
    showSignInInterface() {
        if (this.userDisplay && this.googleSignInBtn) {
            this.userDisplay.classList.add('hidden');
            this.googleSignInBtn.classList.remove('hidden');
            this.googleSignInBtn.disabled = false;
        }
        
        if (this.userIdDisplayElement) {
            this.userIdDisplayElement.textContent = '';
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
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Error object
     */
    handleInitializationError(error) {
        const errorMessage = 'Failed to start application: ' + error.message;
        
        this.updateAuthStatus(errorMessage);
        
        if (this.googleSignInBtn) {
            this.googleSignInBtn.disabled = true;
        }
        
        // Show error toast
        this.modules.uiComponents.showToast(
            'An error occurred while starting the application. Try refreshing the page.',
            'error',
            0 // Don't auto-hide
        );
        
        // Log error for debugging
        Utils.logError(error, { context: 'Application initialization' });
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('[RotamBenimApp] Unhandled promise rejection:', event.reason);
            Utils.logError(event.reason, { context: 'Unhandled promise rejection' });
            
            // Show user-friendly error message
            this.modules.uiComponents.showToast(
                'An unexpected error occurred. Please refresh the page.',
                'error'
            );
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('[RotamBenimApp] JavaScript error:', event.error);
            Utils.logError(event.error, { 
                context: 'JavaScript error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            this.modules.uiComponents.showToast(
                'Internet connection lost. Some features may not work.',
                'warning',
                0
            );
        });

        window.addEventListener('online', () => {
            this.modules.uiComponents.showToast(
                'Internet connection restored.',
                'success',
                3000
            );
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                        console.log(`[RotamBenimApp] Page load time: ${loadTime}ms`);
                        
                        // Log slow page loads
                        if (loadTime > 3000) {
                            console.warn('[RotamBenimApp] Slow page load detected');
                        }
                    }
                }, 0);
            });
        }

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576);
                const totalMB = Math.round(memInfo.totalJSHeapSize / 1048576);
                
                // Log high memory usage
                if (usedMB > 100) {
                    console.warn(`[RotamBenimApp] High memory usage: ${usedMB}MB / ${totalMB}MB`);
                }
            }, 30000); // Check every 30 seconds
        }
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus search/filter
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape: Clear focus/close modals
            if (e.key === 'Escape') {
                document.activeElement?.blur();
                this.modules.uiComponents.clearAllToasts();
            }
        });

        // Announce route changes to screen readers
        if (this.modules.routeManager) {
            // This would be implemented when route changes occur
            // For now, we'll add it as a placeholder
        }

        // Add focus indicators for better keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Get application state
     * @returns {Object} Application state
     */
    getApplicationState() {
        return {
            isInitialized: this.isInitialized,
            isAuthenticated: this.modules.firebaseService.isAuthenticated(),
            currentUser: this.modules.firebaseService.getCurrentUser(),
            placesCount: this.modules.placeManager.getPlaces().length,
            selectedPlacesCount: this.modules.routeManager.getSelectedCount(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Export application data
     * @returns {Object} Application data
     */
    exportApplicationData() {
        return {
            places: this.modules.placeManager.getPlaces(),
            route: this.modules.routeManager.exportRouteData(),
            appState: this.getApplicationState(),
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Restart application
     */
    async restart() {
        console.log('[RotamBenimApp] Restarting application...');
        
        try {
            // Clean up modules
            this.cleanup();
            
            // Reset initialization flag
            this.isInitialized = false;
            
            // Re-initialize
            await this.initialize();
            
            this.modules.uiComponents.showToast('Application restarted', 'success');
            
        } catch (error) {
            console.error('[RotamBenimApp] Restart failed:', error);
            this.modules.uiComponents.showToast('Restart failed', 'error');
        }
    }

    /**
     * Clean up application resources
     */
    cleanup() {
        console.log('[RotamBenimApp] Cleaning up application...');
        
        // Clean up modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.cleanup === 'function') {
                module.cleanup();
            }
        });
        
        // Clear any intervals or timeouts
        // (Add specific cleanup code here if needed)
    }

    /**
     * Handle page visibility changes
     */
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('[RotamBenimApp] Page hidden');
                // Pause non-essential operations
            } else {
                console.log('[RotamBenimApp] Page visible');
                // Resume operations
            }
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[RotamBenimApp] DOM loaded, initializing application...');
    
    // Create global app instance
    window.rotamBenimApp = new RotamBenimApp();
    
    try {
        await window.rotamBenimApp.initialize();
    } catch (error) {
        console.error('[RotamBenimApp] Failed to initialize application:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.rotamBenimApp) {
        window.rotamBenimApp.cleanup();
    }
});

// Export for debugging
window.RotamBenimApp = RotamBenimApp;
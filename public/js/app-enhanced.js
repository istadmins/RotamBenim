/**
 * Enhanced Main application file for RotamBenim
 * Coordinates all modules including fullpage scrolling and dynamic backgrounds
 */

class EnhancedRotamBenimApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {
            languageManager: window.languageManager,
            firebaseService: window.firebaseService,
            uiComponents: window.uiComponents,
            placeSuggestions: window.placeSuggestions,
            placeManager: window.placeManager,
            routeManager: window.routeManager,
            authAdapter: window.authAdapter,
            enhancedBackgroundManager: window.enhancedBackgroundManager,
            enhancedFullPageManager: window.enhancedFullPageManager
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
        
        // Enhanced features
        this.currentCountry = null;
        this.isFullPageEnabled = false;
    }

    /**
     * Initialize the enhanced application
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[EnhancedRotamBenimApp] Application already initialized');
            return;
        }

        console.log('[EnhancedRotamBenimApp] Starting enhanced application initialization...');
        
        try {
            // Show loading state
            this.updateAuthStatus('Starting enhanced application...');
            
            // Initialize core modules first
            await this.initializeCoreModules();
            
            // Initialize enhanced features
            await this.initializeEnhancedFeatures();
            
            // Setup authentication
            this.setupAuthenticationUI();
            
            // Setup enhanced event listeners
            this.setupEnhancedEventListeners();
            
            // Setup global error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup accessibility features
            this.setupAccessibilityFeatures();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('[EnhancedRotamBenimApp] Enhanced application initialized successfully');
            this.updateAuthStatus('Enhanced application ready');
            
            // Show welcome message
            this.modules.uiComponents.showToast(
                'Welcome to the enhanced RotamBenim! Experience smooth scrolling and dynamic backgrounds.',
                'info',
                5000
            );
            
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Enhanced application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize core modules
     */
    async initializeCoreModules() {
        console.log('[EnhancedRotamBenimApp] Initializing core modules...');
        
        // Initialize language manager first
        this.modules.languageManager.initialize();
        
        // Initialize UI components
        this.modules.uiComponents.initialize();
        
        // Initialize Firebase service
        await this.modules.firebaseService.initialize();
        
        // Initialize place suggestions
        this.modules.placeSuggestions.initialize();
        
        // Initialize other core modules
        this.modules.placeManager.initialize();
        this.modules.routeManager.initialize();
        
        console.log('[EnhancedRotamBenimApp] Core modules initialized');
    }

    /**
     * Initialize enhanced features
     */
    async initializeEnhancedFeatures() {
        console.log('[EnhancedRotamBenimApp] Initializing enhanced features...');
        
        try {
            // Initialize enhanced background manager
            if (this.modules.enhancedBackgroundManager) {
                await this.modules.enhancedBackgroundManager.initialize();
                console.log('[EnhancedRotamBenimApp] Enhanced background manager initialized');
            }
            
            // Initialize enhanced fullpage manager
            if (this.modules.enhancedFullPageManager) {
                this.modules.enhancedFullPageManager.initialize();
                this.isFullPageEnabled = true;
                console.log('[EnhancedRotamBenimApp] Enhanced fullpage manager initialized');
            }
            
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Error initializing enhanced features:', error);
            // Continue without enhanced features
        }
    }

    /**
     * Setup enhanced event listeners
     */
    setupEnhancedEventListeners() {
        // Listen for place selection to update backgrounds
        document.addEventListener('placeSelected', (e) => {
            this.handlePlaceSelection(e.detail);
        });
        
        // Listen for country filter changes
        document.addEventListener('filterChanged', (e) => {
            this.handleCountryFilterChange(e.detail);
        });
        
        // Listen for section changes
        document.addEventListener('sectionChanged', (e) => {
            this.handleSectionChange(e.detail);
        });
        
        // Listen for places list updates
        document.addEventListener('placesListUpdated', (e) => {
            this.handlePlacesListUpdate(e.detail);
        });
        
        // Setup navigation link handlers
        this.setupNavigationLinks();
        
        // Setup scroll indicator click
        this.setupScrollIndicatorClick();
    }

    /**
     * Setup navigation links
     */
    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const anchor = link.getAttribute('href').substring(1);
                
                if (this.modules.enhancedFullPageManager) {
                    this.modules.enhancedFullPageManager.moveToSectionByAnchor(anchor);
                }
            });
        });
    }

    /**
     * Setup scroll indicator click
     */
    setupScrollIndicatorClick() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', (e) => {
                const rect = scrollIndicator.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                const targetSection = Math.floor(clickPosition * 5); // 5 sections
                
                if (this.modules.enhancedFullPageManager) {
                    this.modules.enhancedFullPageManager.moveToSection(targetSection);
                }
            });
        }
    }

    /**
     * Handle place selection
     * @param {Object} detail - Event detail
     */
    handlePlaceSelection(detail) {
        if (detail && detail.place && detail.place.country) {
            this.currentCountry = detail.place.country;
            
            // Update background if background manager is available
            if (this.modules.enhancedBackgroundManager) {
                this.modules.enhancedBackgroundManager.updateBackgroundForCountry(detail.place.country);
            }
            
            console.log(`[EnhancedRotamBenimApp] Place selected: ${detail.place.name} in ${detail.place.country}`);
        }
    }

    /**
     * Handle country filter change
     * @param {Object} detail - Event detail
     */
    handleCountryFilterChange(detail) {
        if (detail && detail.country) {
            this.currentCountry = detail.country;
            
            // Update background if background manager is available
            if (this.modules.enhancedBackgroundManager && detail.country !== 'all') {
                this.modules.enhancedBackgroundManager.updateBackgroundForCountry(detail.country);
            }
            
            console.log(`[EnhancedRotamBenimApp] Country filter changed: ${detail.country}`);
        }
    }

    /**
     * Handle section change
     * @param {Object} detail - Event detail
     */
    handleSectionChange(detail) {
        if (detail && detail.sectionAnchor) {
            console.log(`[EnhancedRotamBenimApp] Section changed: ${detail.sectionAnchor}`);
            
            // Update page title
            this.updatePageTitle(detail.sectionAnchor);
            
            // Track analytics if available
            this.trackSectionView(detail.sectionAnchor);
        }
    }

    /**
     * Handle places list update
     * @param {Object} detail - Event detail
     */
    handlePlacesListUpdate(detail) {
        if (detail && detail.places) {
            console.log(`[EnhancedRotamBenimApp] Places list updated: ${detail.places.length} places`);
            
            // Update background based on most common country
            this.updateBackgroundFromPlacesList(detail.places);
        }
    }

    /**
     * Update background based on places list
     * @param {Array} places - Array of places
     */
    updateBackgroundFromPlacesList(places) {
        if (!places || places.length === 0) return;
        
        // Find most common country
        const countryCount = {};
        places.forEach(place => {
            if (place.country) {
                countryCount[place.country] = (countryCount[place.country] || 0) + 1;
            }
        });
        
        const mostCommonCountry = Object.keys(countryCount).reduce((a, b) => 
            countryCount[a] > countryCount[b] ? a : b
        );
        
        if (mostCommonCountry && this.modules.enhancedBackgroundManager) {
            this.modules.enhancedBackgroundManager.updateBackgroundForCountry(mostCommonCountry);
        }
    }

    /**
     * Update page title based on section
     * @param {string} sectionAnchor - Section anchor
     */
    updatePageTitle(sectionAnchor) {
        const titles = {
            'hero': 'RotamBenim - My Travel List',
            'add-place': 'Add Places - RotamBenim',
            'places-list': 'My Places - RotamBenim',
            'map-view': 'Map View - RotamBenim',
            'about': 'About - RotamBenim'
        };
        
        const title = titles[sectionAnchor] || 'RotamBenim - My Travel List';
        document.title = title;
    }

    /**
     * Track section view for analytics
     * @param {string} sectionAnchor - Section anchor
     */
    trackSectionView(sectionAnchor) {
        // Implement analytics tracking here
        // For example, Google Analytics, Firebase Analytics, etc.
        console.log(`[EnhancedRotamBenimApp] Section view tracked: ${sectionAnchor}`);
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
            this.updateAuthStatus('Signing in...');
            this.googleSignInBtn.disabled = true;
            
            await this.modules.firebaseService.signInWithGoogle();
            
            // Success is handled by auth state change listener
            
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Google sign-in error:', error);
            this.updateAuthStatus(error.message || 'Sign-in failed');
            this.modules.uiComponents.showToast(error.message || 'Sign-in failed', 'error');
            
        } finally {
            this.googleSignInBtn.disabled = false;
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        try {
            this.updateAuthStatus('Signing out...');
            
            await this.modules.firebaseService.signOut();
            
            this.modules.uiComponents.showToast('Signed out successfully', 'success', 2000);
            
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Sign-out error:', error);
            this.updateAuthStatus(error.message || 'Sign-out failed');
            this.modules.uiComponents.showToast(error.message || 'Sign-out failed', 'error');
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
            this.userDisplay.classList.add('flex');
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
            this.userDisplay.classList.remove('flex');
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
        const errorMessage = 'Failed to start enhanced application: ' + error.message;
        
        this.updateAuthStatus(errorMessage);
        
        if (this.googleSignInBtn) {
            this.googleSignInBtn.disabled = true;
        }
        
        // Show error toast
        this.modules.uiComponents.showToast(
            'An error occurred while starting the enhanced application. Try refreshing the page.',
            'error',
            0 // Don't auto-hide
        );
        
        // Log error for debugging
        console.error('[EnhancedRotamBenimApp] Initialization error:', error);
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('[EnhancedRotamBenimApp] Unhandled promise rejection:', event.reason);
            
            // Show user-friendly error message
            this.modules.uiComponents.showToast(
                'An unexpected error occurred. Please refresh the page.',
                'error'
            );
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('[EnhancedRotamBenimApp] JavaScript error:', event.error);
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
                        console.log(`[EnhancedRotamBenimApp] Page load time: ${loadTime}ms`);
                        
                        // Log slow page loads
                        if (loadTime > 3000) {
                            console.warn('[EnhancedRotamBenimApp] Slow page load detected');
                        }
                    }
                }, 0);
            });
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
     * Get enhanced application state
     * @returns {Object} Enhanced application state
     */
    getEnhancedApplicationState() {
        return {
            isInitialized: this.isInitialized,
            isAuthenticated: this.modules.firebaseService.isAuthenticated(),
            currentUser: this.modules.firebaseService.getCurrentUser(),
            placesCount: this.modules.placeManager.getPlaces().length,
            selectedPlacesCount: this.modules.routeManager.getSelectedCount(),
            currentCountry: this.currentCountry,
            isFullPageEnabled: this.isFullPageEnabled,
            currentSection: this.modules.enhancedFullPageManager?.getCurrentSection(),
            backgroundStats: this.modules.enhancedBackgroundManager?.getCacheStats(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Toggle fullpage mode
     */
    toggleFullPageMode() {
        if (this.modules.enhancedFullPageManager) {
            if (this.isFullPageEnabled) {
                this.modules.enhancedFullPageManager.cleanup();
                this.isFullPageEnabled = false;
                this.modules.uiComponents.showToast('Fullpage mode disabled', 'info');
            } else {
                this.modules.enhancedFullPageManager.initialize();
                this.isFullPageEnabled = true;
                this.modules.uiComponents.showToast('Fullpage mode enabled', 'info');
            }
        }
    }

    /**
     * Refresh backgrounds
     */
    async refreshBackgrounds() {
        if (this.modules.enhancedBackgroundManager) {
            this.modules.enhancedBackgroundManager.clearCache();
            await this.modules.enhancedBackgroundManager.initialize();
            this.modules.uiComponents.showToast('Backgrounds refreshed', 'success');
        }
    }

    /**
     * Clean up enhanced application resources
     */
    cleanup() {
        console.log('[EnhancedRotamBenimApp] Cleaning up enhanced application...');
        
        // Clean up enhanced modules
        if (this.modules.enhancedFullPageManager) {
            this.modules.enhancedFullPageManager.cleanup();
        }
        
        if (this.modules.enhancedBackgroundManager) {
            this.modules.enhancedBackgroundManager.cleanup();
        }
        
        // Clean up core modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.cleanup === 'function') {
                module.cleanup();
            }
        });
    }
}

// Initialize enhanced application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[EnhancedRotamBenimApp] DOM loaded, initializing enhanced application...');
    
    // Create global enhanced app instance
    window.enhancedRotamBenimApp = new EnhancedRotamBenimApp();
    
    try {
        await window.enhancedRotamBenimApp.initialize();
    } catch (error) {
        console.error('[EnhancedRotamBenimApp] Failed to initialize enhanced application:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.enhancedRotamBenimApp) {
        window.enhancedRotamBenimApp.cleanup();
    }
});

// Export for debugging
window.EnhancedRotamBenimApp = EnhancedRotamBenimApp;
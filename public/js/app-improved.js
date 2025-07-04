/**
 * Improved Main application file for RotamBenim
 * Coordinates all modules and handles application lifecycle
 */

class ImprovedRotamBenimApp {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.initializationOrder = [
            'utils',
            'firebaseService',
            'uiComponents',
            'authAdapter',
            'languageManager',
            'routeManager',
            'placeSuggestions',
            'placeManager',
            'placeCard',
            'backgroundManager',
            'parallaxScrollManager'
        ];
        
        // Application state
        this.state = {
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            hasError: false,
            errorMessage: ''
        };
    }

    /**
     * Initialize the application
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[ImprovedRotamBenimApp] Application already initialized');
            return;
        }

        console.log('[ImprovedRotamBenimApp] Starting application initialization...');
        
        try {
            this.setState({ isLoading: true });
            
            // Initialize modules in order
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup accessibility features
            this.setupAccessibilityFeatures();
            
            // Mark as initialized
            this.isInitialized = true;
            this.setState({ isLoading: false });
            
            console.log('[ImprovedRotamBenimApp] Application initialized successfully');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('[ImprovedRotamBenimApp] Application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize modules in the correct order
     */
    async initializeModules() {
        console.log('[ImprovedRotamBenimApp] Initializing modules...');
        
        for (const moduleName of this.initializationOrder) {
            try {
                const module = window[moduleName];
                
                if (module && typeof module.initialize === 'function') {
                    console.log(`[ImprovedRotamBenimApp] Initializing ${moduleName}...`);
                    
                    if (moduleName === 'firebaseService') {
                        await module.initialize();
                    } else {
                        module.initialize();
                    }
                    
                    this.modules.set(moduleName, module);
                    console.log(`[ImprovedRotamBenimApp] ${moduleName} initialized successfully`);
                } else {
                    console.warn(`[ImprovedRotamBenimApp] Module ${moduleName} not found or not initializable`);
                }
            } catch (error) {
                console.error(`[ImprovedRotamBenimApp] Error initializing ${moduleName}:`, error);
                
                // Continue with other modules unless it's a critical module
                if (this.isCriticalModule(moduleName)) {
                    throw new Error(`Critical module ${moduleName} failed to initialize: ${error.message}`);
                }
            }
        }
        
        console.log('[ImprovedRotamBenimApp] All modules initialized');
    }

    /**
     * Check if a module is critical for app functionality
     * @param {string} moduleName - Module name
     * @returns {boolean} True if critical
     */
    isCriticalModule(moduleName) {
        const criticalModules = ['firebaseService', 'uiComponents', 'authAdapter'];
        return criticalModules.includes(moduleName);
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Listen for authentication state changes
        document.addEventListener('authStateChanged', (e) => {
            this.handleAuthStateChange(e.detail);
        });

        // Listen for route updates
        document.addEventListener('routeUpdated', (e) => {
            this.handleRouteUpdate(e.detail);
        });

        // Listen for places list updates
        document.addEventListener('placesListUpdated', (e) => {
            this.handlePlacesListUpdate(e.detail);
        });

        // Listen for errors
        document.addEventListener('appError', (e) => {
            this.handleAppError(e.detail);
        });

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Window resize
        window.addEventListener('resize', Utils.throttle(() => {
            this.handleWindowResize();
        }, 250));

        console.log('[ImprovedRotamBenimApp] Global event listeners setup');
    }

    /**
     * Handle authentication state changes
     * @param {Object} detail - Event detail
     */
    handleAuthStateChange(detail) {
        this.setState({
            isAuthenticated: detail.isAuthenticated,
            currentUser: detail.user
        });

        console.log(`[ImprovedRotamBenimApp] Auth state changed: ${detail.isAuthenticated ? 'authenticated' : 'not authenticated'}`);

        // Update UI based on auth state
        this.updateUIForAuthState(detail.isAuthenticated);
    }

    /**
     * Handle route updates
     * @param {Object} detail - Event detail
     */
    handleRouteUpdate(detail) {
        console.log(`[ImprovedRotamBenimApp] Route updated: ${detail.selectedCount} places selected`);
        
        // Update any route-dependent UI
        this.updateRouteUI(detail);
    }

    /**
     * Handle places list updates
     * @param {Object} detail - Event detail
     */
    handlePlacesListUpdate(detail) {
        console.log(`[ImprovedRotamBenimApp] Places list updated: ${detail.places?.length || 0} places`);
        
        // Update any places-dependent UI
        this.updatePlacesUI(detail);
    }

    /**
     * Handle application errors
     * @param {Object} detail - Error detail
     */
    handleAppError(detail) {
        console.error('[ImprovedRotamBenimApp] Application error:', detail);
        
        this.setState({
            hasError: true,
            errorMessage: detail.message || 'An unexpected error occurred'
        });

        // Show error to user
        if (this.modules.get('uiComponents')) {
            this.modules.get('uiComponents').showToast(
                detail.userMessage || 'An error occurred. Please try again.',
                'error'
            );
        }
    }

    /**
     * Handle page visibility changes
     */
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('[ImprovedRotamBenimApp] Page hidden - pausing non-essential operations');
            this.pauseNonEssentialOperations();
        } else {
            console.log('[ImprovedRotamBenimApp] Page visible - resuming operations');
            this.resumeOperations();
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Update responsive components
        const deviceType = Utils.getDeviceType();
        console.log(`[ImprovedRotamBenimApp] Window resized - device type: ${deviceType}`);
        
        // Notify modules about resize
        this.modules.forEach((module, name) => {
            if (module && typeof module.handleResize === 'function') {
                module.handleResize();
            }
        });
    }

    /**
     * Update UI based on authentication state
     * @param {boolean} isAuthenticated - Authentication status
     */
    updateUIForAuthState(isAuthenticated) {
        // Enable/disable features based on auth state
        const authRequiredElements = document.querySelectorAll('[data-requires-auth="true"]');
        authRequiredElements.forEach(element => {
            element.disabled = !isAuthenticated;
        });

        // Update navigation or other UI elements
        this.updateNavigationForAuth(isAuthenticated);
    }

    /**
     * Update navigation for authentication state
     * @param {boolean} isAuthenticated - Authentication status
     */
    updateNavigationForAuth(isAuthenticated) {
        // Update any navigation elements based on auth state
        const navElements = document.querySelectorAll('.auth-dependent');
        navElements.forEach(element => {
            if (isAuthenticated) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    /**
     * Update route-related UI
     * @param {Object} routeDetail - Route detail
     */
    updateRouteUI(routeDetail) {
        // Update any route-specific UI elements
        const routeCounters = document.querySelectorAll('.route-counter');
        routeCounters.forEach(counter => {
            counter.textContent = routeDetail.selectedCount;
        });
    }

    /**
     * Update places-related UI
     * @param {Object} placesDetail - Places detail
     */
    updatePlacesUI(placesDetail) {
        // Update any places-specific UI elements
        const placesCounters = document.querySelectorAll('.places-counter');
        placesCounters.forEach(counter => {
            counter.textContent = placesDetail.places?.length || 0;
        });
    }

    /**
     * Pause non-essential operations when page is hidden
     */
    pauseNonEssentialOperations() {
        // Pause animations, background updates, etc.
        this.modules.forEach((module, name) => {
            if (module && typeof module.pause === 'function') {
                module.pause();
            }
        });
    }

    /**
     * Resume operations when page becomes visible
     */
    resumeOperations() {
        // Resume animations, background updates, etc.
        this.modules.forEach((module, name) => {
            if (module && typeof module.resume === 'function') {
                module.resume();
            }
        });
    }

    /**
     * Set application state
     * @param {Object} newState - New state properties
     */
    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        // Dispatch state change event
        const event = new CustomEvent('appStateChanged', {
            detail: { oldState, newState: this.state }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get application state
     * @returns {Object} Current application state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const uiComponents = this.modules.get('uiComponents');
        if (uiComponents) {
            const message = this.state.isAuthenticated 
                ? 'Welcome back! Your travel list is ready.'
                : 'Welcome to RotamBenim! Sign in to start building your travel list.';
            
            uiComponents.showToast(message, 'info', 4000);
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Error object
     */
    handleInitializationError(error) {
        const errorMessage = `Failed to start application: ${error.message}`;
        
        this.setState({
            isLoading: false,
            hasError: true,
            errorMessage: errorMessage
        });

        console.error('[ImprovedRotamBenimApp] Initialization error:', error);

        // Show error in UI
        const authStatus = document.getElementById('authStatus');
        if (authStatus) {
            authStatus.textContent = errorMessage;
            authStatus.className = 'text-red-600 text-sm';
        }

        // Disable interactive elements
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Show error toast if UI components are available
        const uiComponents = this.modules.get('uiComponents');
        if (uiComponents) {
            uiComponents.showToast(
                'Application failed to start. Please refresh the page.',
                'error',
                0 // Don't auto-hide
            );
        }
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('[ImprovedRotamBenimApp] Unhandled promise rejection:', event.reason);
            Utils.logError(event.reason, { context: 'Unhandled promise rejection' });
            
            this.handleAppError({
                message: event.reason?.message || 'Unhandled promise rejection',
                userMessage: 'An unexpected error occurred. Please refresh the page.'
            });
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('[ImprovedRotamBenimApp] JavaScript error:', event.error);
            Utils.logError(event.error, { 
                context: 'JavaScript error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            const uiComponents = this.modules.get('uiComponents');
            if (uiComponents) {
                uiComponents.showToast(
                    'Internet connection lost. Some features may not work.',
                    'warning',
                    0
                );
            }
        });

        window.addEventListener('online', () => {
            const uiComponents = this.modules.get('uiComponents');
            if (uiComponents) {
                uiComponents.showToast(
                    'Internet connection restored.',
                    'success',
                    3000
                );
            }
        });

        console.log('[ImprovedRotamBenimApp] Error handling setup');
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
                        console.log(`[ImprovedRotamBenimApp] Page load time: ${loadTime}ms`);
                        
                        // Log slow page loads
                        if (loadTime > 3000) {
                            console.warn('[ImprovedRotamBenimApp] Slow page load detected');
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
                    console.warn(`[ImprovedRotamBenimApp] High memory usage: ${usedMB}MB / ${totalMB}MB`);
                }
            }, 60000); // Check every minute
        }

        console.log('[ImprovedRotamBenimApp] Performance monitoring setup');
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
                const uiComponents = this.modules.get('uiComponents');
                if (uiComponents) {
                    uiComponents.clearAllToasts();
                    uiComponents.closeAllModals();
                }
            }
        });

        // Add focus indicators for better keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .focus-visible {
                    outline: 3px solid;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);

        console.log('[ImprovedRotamBenimApp] Accessibility features setup');
    }

    /**
     * Get comprehensive application status
     * @returns {Object} Application status
     */
    getApplicationStatus() {
        const moduleStatuses = {};
        this.modules.forEach((module, name) => {
            if (module && typeof module.getStatus === 'function') {
                moduleStatuses[name] = module.getStatus();
            } else {
                moduleStatuses[name] = { available: !!module };
            }
        });

        return {
            isInitialized: this.isInitialized,
            state: this.getState(),
            modules: moduleStatuses,
            performance: this.getPerformanceMetrics(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        const metrics = {};
        
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            }
            
            if ('memory' in performance) {
                const memInfo = performance.memory;
                metrics.memoryUsage = {
                    used: Math.round(memInfo.usedJSHeapSize / 1048576),
                    total: Math.round(memInfo.totalJSHeapSize / 1048576),
                    limit: Math.round(memInfo.jsHeapSizeLimit / 1048576)
                };
            }
        }
        
        return metrics;
    }

    /**
     * Restart application
     */
    async restart() {
        console.log('[ImprovedRotamBenimApp] Restarting application...');
        
        try {
            // Clean up current instance
            this.cleanup();
            
            // Reset state
            this.isInitialized = false;
            this.state = {
                isAuthenticated: false,
                currentUser: null,
                isLoading: false,
                hasError: false,
                errorMessage: ''
            };
            
            // Re-initialize
            await this.initialize();
            
            const uiComponents = this.modules.get('uiComponents');
            if (uiComponents) {
                uiComponents.showToast('Application restarted successfully', 'success');
            }
            
        } catch (error) {
            console.error('[ImprovedRotamBenimApp] Restart failed:', error);
            
            const uiComponents = this.modules.get('uiComponents');
            if (uiComponents) {
                uiComponents.showToast('Restart failed. Please refresh the page.', 'error');
            }
        }
    }

    /**
     * Clean up application resources
     */
    cleanup() {
        console.log('[ImprovedRotamBenimApp] Cleaning up application...');
        
        // Clean up modules
        this.modules.forEach((module, name) => {
            if (module && typeof module.cleanup === 'function') {
                try {
                    module.cleanup();
                } catch (error) {
                    console.error(`[ImprovedRotamBenimApp] Error cleaning up ${name}:`, error);
                }
            }
        });
        
        this.modules.clear();
        
        console.log('[ImprovedRotamBenimApp] Cleanup completed');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[ImprovedRotamBenimApp] DOM loaded, initializing application...');
    
    // Create global app instance
    window.improvedRotamBenimApp = new ImprovedRotamBenimApp();
    
    try {
        await window.improvedRotamBenimApp.initialize();
    } catch (error) {
        console.error('[ImprovedRotamBenimApp] Failed to initialize application:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.improvedRotamBenimApp) {
        window.improvedRotamBenimApp.cleanup();
    }
});

// Export for debugging and module systems
window.ImprovedRotamBenimApp = ImprovedRotamBenimApp;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImprovedRotamBenimApp;
}
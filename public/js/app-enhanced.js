/**
 * Enhanced Main Application for RotamBenim
 * Advanced version with improved performance, error handling, and user experience
 * @version 2.0.0
 */

class EnhancedRotamBenimApp {
    constructor() {
        this.isInitialized = false;
        this.isDestroyed = false;
        this.modules = new Map();
        this.eventListeners = new Map();
        this.performanceMetrics = {
            startTime: Date.now(),
            moduleLoadTimes: {},
            errorCount: 0,
            userInteractions: 0
        };
        
        // Enhanced initialization order with dependency management
        this.initializationOrder = [
            { name: 'utils', critical: true },
            { name: 'firebaseService', critical: true },
            { name: 'uiComponents', critical: true },
            { name: 'authAdapter', critical: true },
            { name: 'languageManager', critical: false },
            { name: 'routeManager', critical: false },
            { name: 'placeSuggestions', critical: false },
            { name: 'placeManager', critical: false },
            { name: 'placeCard', critical: false },
            { name: 'backgroundManager', critical: false },
            { name: 'parallaxScrollManager', critical: false }
        ];
        
        // Enhanced application state with better structure
        this.state = {
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            hasError: false,
            errorMessage: '',
            lastActivity: Date.now(),
            sessionStartTime: Date.now(),
            features: {
                offlineMode: false,
                notifications: false,
                analytics: true
            }
        };

        // Performance monitoring
        this.performanceObserver = null;
        this.memoryUsage = [];
        this.errorLog = [];
        
        // Auto-save functionality
        this.autoSaveInterval = null;
        this.autoSaveDelay = 30000; // 30 seconds
        
        // Offline support
        this.offlineQueue = [];
        this.isOnline = navigator.onLine;
    }

    /**
     * Initialize the enhanced application
     */
    async initialize() {
        if (this.isInitialized || this.isDestroyed) {
            console.warn('[EnhancedRotamBenimApp] Application already initialized or destroyed');
            return;
        }

        console.log('[EnhancedRotamBenimApp] Starting enhanced application initialization...');
        
        try {
            this.setState({ isLoading: true });
            
            // Setup performance monitoring first
            this.setupPerformanceMonitoring();
            
            // Setup offline detection
            this.setupOfflineDetection();
            
            // Initialize modules with enhanced error handling
            await this.initializeModulesWithRetry();
            
            // Setup enhanced event listeners
            this.setupEnhancedEventListeners();
            
            // Setup auto-save functionality
            this.setupAutoSave();
            
            // Setup accessibility features
            this.setupAccessibilityFeatures();
            
            // Setup error boundary
            this.setupErrorBoundary();
            
            // Setup memory management
            this.setupMemoryManagement();
            
            // Mark as initialized
            this.isInitialized = true;
            this.setState({ isLoading: false });
            
            console.log('[EnhancedRotamBenimApp] Application initialized successfully');
            
            // Track initialization performance
            this.trackPerformance('appInitialization', Date.now() - this.performanceMetrics.startTime);
            
            // Show enhanced welcome message
            this.showEnhancedWelcomeMessage();
            
            // Initialize analytics
            this.initializeAnalytics();
            
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize modules with retry mechanism and dependency management
     */
    async initializeModulesWithRetry() {
        console.log('[EnhancedRotamBenimApp] Initializing modules with enhanced error handling...');
        
        const maxRetries = 3;
        const retryDelay = 1000;
        
        for (const moduleConfig of this.initializationOrder) {
            const { name, critical } = moduleConfig;
            let retryCount = 0;
            let success = false;
            
            while (retryCount < maxRetries && !success) {
                try {
                    const moduleStartTime = Date.now();
                    const module = window[name];
                    
                    if (!module) {
                        throw new Error(`Module ${name} not found`);
                    }
                    
                    if (typeof module.initialize !== 'function') {
                        throw new Error(`Module ${name} does not have initialize method`);
                    }
                    
                    console.log(`[EnhancedRotamBenimApp] Initializing ${name} (attempt ${retryCount + 1})...`);
                    
                    // Initialize module
                    if (name === 'firebaseService') {
                        await module.initialize();
                    } else {
                        module.initialize();
                    }
                    
                    this.modules.set(name, module);
                    this.performanceMetrics.moduleLoadTimes[name] = Date.now() - moduleStartTime;
                    
                    console.log(`[EnhancedRotamBenimApp] ${name} initialized successfully in ${this.performanceMetrics.moduleLoadTimes[name]}ms`);
                    success = true;
                    
                } catch (error) {
                    retryCount++;
                    console.error(`[EnhancedRotamBenimApp] Error initializing ${name} (attempt ${retryCount}):`, error);
                    
                    if (retryCount >= maxRetries) {
                        if (critical) {
                            throw new Error(`Critical module ${name} failed to initialize after ${maxRetries} attempts: ${error.message}`);
                        } else {
                            console.warn(`[EnhancedRotamBenimApp] Non-critical module ${name} failed to initialize, continuing...`);
                            break;
                        }
                    } else {
                        await this.sleep(retryDelay * retryCount);
                    }
                }
            }
        }
        
        console.log('[EnhancedRotamBenimApp] All modules initialized');
    }

    /**
     * Setup enhanced event listeners with better error handling
     */
    setupEnhancedEventListeners() {
        const events = [
            { name: 'authStateChanged', handler: this.handleAuthStateChange.bind(this) },
            { name: 'routeUpdated', handler: this.handleRouteUpdate.bind(this) },
            { name: 'placesListUpdated', handler: this.handlePlacesListUpdate.bind(this) },
            { name: 'appError', handler: this.handleAppError.bind(this) },
            { name: 'userInteraction', handler: this.handleUserInteraction.bind(this) }
        ];

        events.forEach(({ name, handler }) => {
            const wrappedHandler = (e) => {
                try {
                    this.state.lastActivity = Date.now();
                    this.state.userInteractions++;
                    handler(e);
                } catch (error) {
                    console.error(`[EnhancedRotamBenimApp] Error in ${name} event handler:`, error);
                    this.logError(error, { context: 'eventHandler', event: name });
                }
            };
            
            document.addEventListener(name, wrappedHandler);
            this.eventListeners.set(name, wrappedHandler);
        });

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Window resize with enhanced throttling
        window.addEventListener('resize', Utils.throttle(() => {
            this.handleWindowResize();
        }, 100));

        // Online/offline detection
        window.addEventListener('online', () => this.handleOnlineStatusChange(true));
        window.addEventListener('offline', () => this.handleOnlineStatusChange(false));

        console.log('[EnhancedRotamBenimApp] Enhanced event listeners setup');
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.memoryUsage.push({
                    timestamp: Date.now(),
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                });
                
                // Keep only last 100 entries
                if (this.memoryUsage.length > 100) {
                    this.memoryUsage.shift();
                }
            }, 30000); // Every 30 seconds
        }

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                this.performanceObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            console.warn('[EnhancedRotamBenimApp] Long task detected:', entry);
                        }
                    }
                });
                this.performanceObserver.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('[EnhancedRotamBenimApp] PerformanceObserver not supported');
            }
        }
    }

    /**
     * Setup offline detection and queue management
     */
    setupOfflineDetection() {
        this.isOnline = navigator.onLine;
        
        // Process offline queue when coming back online
        window.addEventListener('online', () => {
            this.processOfflineQueue();
        });
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.state.isAuthenticated && !this.state.isLoading) {
                this.autoSave();
            }
        }, this.autoSaveDelay);
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const mainContent = document.querySelector('.container');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }

        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + S for save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.manualSave();
            }
        });
    }

    /**
     * Setup error boundary
     */
    setupErrorBoundary() {
        window.addEventListener('error', (e) => {
            this.logError(e.error, { context: 'globalError', filename: e.filename, lineno: e.lineno });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError(e.reason, { context: 'unhandledRejection' });
        });
    }

    /**
     * Setup memory management
     */
    setupMemoryManagement() {
        // Cleanup unused resources periodically
        setInterval(() => {
            this.cleanupUnusedResources();
        }, 60000); // Every minute
    }

    /**
     * Handle authentication state changes with enhanced logging
     */
    handleAuthStateChange(detail) {
        const previousAuth = this.state.isAuthenticated;
        
        this.setState({
            isAuthenticated: detail.isAuthenticated,
            currentUser: detail.user
        });

        console.log(`[EnhancedRotamBenimApp] Auth state changed: ${detail.isAuthenticated ? 'authenticated' : 'not authenticated'}`);

        // Track auth state change
        this.trackEvent('auth_state_change', {
            from: previousAuth,
            to: detail.isAuthenticated,
            user: detail.user ? detail.user.uid : null
        });

        // Update UI based on auth state
        this.updateUIForAuthState(detail.isAuthenticated);
        
        // Initialize user data if newly authenticated
        if (detail.isAuthenticated && !previousAuth) {
            this.initializeUserData();
        }
    }

    /**
     * Handle route updates with enhanced validation
     */
    handleRouteUpdate(detail) {
        console.log(`[EnhancedRotamBenimApp] Route updated: ${detail.selectedCount} places selected`);
        
        // Validate route data
        if (detail.selectedCount > 20) {
            console.warn('[EnhancedRotamBenimApp] Large route detected:', detail.selectedCount, 'places');
        }
        
        // Track route update
        this.trackEvent('route_update', {
            selectedCount: detail.selectedCount,
            routeId: detail.routeId
        });
        
        // Update route-dependent UI
        this.updateRouteUI(detail);
    }

    /**
     * Handle places list updates with enhanced processing
     */
    handlePlacesListUpdate(detail) {
        console.log(`[EnhancedRotamBenimApp] Places list updated: ${detail.places?.length || 0} places`);
        
        // Validate places data
        if (detail.places && detail.places.length > 1000) {
            console.warn('[EnhancedRotamBenimApp] Large places list detected:', detail.places.length, 'places');
        }
        
        // Track places update
        this.trackEvent('places_update', {
            count: detail.places?.length || 0,
            source: detail.source
        });
        
        // Update places-dependent UI
        this.updatePlacesUI(detail);
    }

    /**
     * Handle user interactions
     */
    handleUserInteraction(detail) {
        this.state.userInteractions++;
        this.state.lastActivity = Date.now();
        
        // Track interaction
        this.trackEvent('user_interaction', {
            type: detail.type,
            target: detail.target
        });
    }

    /**
     * Handle online/offline status changes
     */
    handleOnlineStatusChange(isOnline) {
        this.isOnline = isOnline;
        
        if (isOnline) {
            this.processOfflineQueue();
            this.showToast('You are back online', 'success');
        } else {
            this.showToast('You are offline. Changes will be saved when you reconnect.', 'warning');
        }
        
        this.trackEvent('connection_change', { isOnline });
    }

    /**
     * Process offline queue
     */
    async processOfflineQueue() {
        if (this.offlineQueue.length === 0) return;
        
        console.log(`[EnhancedRotamBenimApp] Processing ${this.offlineQueue.length} offline operations`);
        
        const queue = [...this.offlineQueue];
        this.offlineQueue = [];
        
        for (const operation of queue) {
            try {
                await this.executeOfflineOperation(operation);
            } catch (error) {
                console.error('[EnhancedRotamBenimApp] Failed to process offline operation:', error);
                this.offlineQueue.push(operation); // Re-queue failed operations
            }
        }
    }

    /**
     * Execute offline operation
     */
    async executeOfflineOperation(operation) {
        const { type, data, timestamp } = operation;
        
        switch (type) {
            case 'addPlace':
                await this.modules.get('firebaseService')?.addPlace(data);
                break;
            case 'updatePlace':
                await this.modules.get('firebaseService')?.updatePlace(data.id, data.updates);
                break;
            case 'deletePlace':
                await this.modules.get('firebaseService')?.deletePlace(data.id);
                break;
            default:
                console.warn('[EnhancedRotamBenimApp] Unknown offline operation type:', type);
        }
    }

    /**
     * Auto-save functionality
     */
    async autoSave() {
        try {
            // Save current state to localStorage as backup
            const backupData = {
                timestamp: Date.now(),
                state: this.state,
                performanceMetrics: this.performanceMetrics
            };
            
            localStorage.setItem('rotambenim_backup', JSON.stringify(backupData));
            
            // Track auto-save
            this.trackEvent('auto_save', { timestamp: Date.now() });
            
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Auto-save failed:', error);
            this.logError(error, { context: 'autoSave' });
        }
    }

    /**
     * Manual save functionality
     */
    async manualSave() {
        try {
            await this.autoSave();
            this.showToast('Data saved successfully', 'success');
        } catch (error) {
            this.showToast('Save failed. Please try again.', 'error');
        }
    }

    /**
     * Show enhanced welcome message
     */
    showEnhancedWelcomeMessage() {
        const welcomeMessages = [
            'Welcome to RotamBenim! 🗺️',
            'Ready to plan your next adventure? ✈️',
            'Discover amazing places and create your perfect route! 🌍'
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        this.showToast(randomMessage, 'info', 3000);
    }

    /**
     * Initialize analytics
     */
    initializeAnalytics() {
        // Track app initialization
        this.trackEvent('app_initialized', {
            loadTime: Date.now() - this.performanceMetrics.startTime,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`
        });
    }

    /**
     * Track performance metrics
     */
    trackPerformance(name, duration) {
        this.performanceMetrics[name] = duration;
        
        if (duration > 1000) {
            console.warn(`[EnhancedRotamBenimApp] Slow operation detected: ${name} took ${duration}ms`);
        }
    }

    /**
     * Track events for analytics
     */
    trackEvent(eventName, data = {}) {
        // Simple event tracking - can be replaced with Google Analytics or similar
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            sessionId: this.state.sessionStartTime
        };
        
        console.log('[EnhancedRotamBenimApp] Event tracked:', event);
        
        // Store in localStorage for analytics
        try {
            const events = JSON.parse(localStorage.getItem('rotambenim_events') || '[]');
            events.push(event);
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('rotambenim_events', JSON.stringify(events));
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Failed to store event:', error);
        }
    }

    /**
     * Log errors with enhanced context
     */
    logError(error, context = {}) {
        const errorEntry = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.errorLog.push(errorEntry);
        this.performanceMetrics.errorCount++;
        
        // Keep only last 50 errors
        if (this.errorLog.length > 50) {
            this.errorLog.shift();
        }
        
        console.error('[EnhancedRotamBenimApp] Error logged:', errorEntry);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 5000) {
        const uiComponents = this.modules.get('uiComponents');
        if (uiComponents && uiComponents.showToast) {
            uiComponents.showToast(message, type, duration);
        } else {
            // Fallback toast
            console.log(`[Toast] ${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        const uiComponents = this.modules.get('uiComponents');
        if (uiComponents && uiComponents.closeAllModals) {
            uiComponents.closeAllModals();
        }
    }

    /**
     * Cleanup unused resources
     */
    cleanupUnusedResources() {
        // Clear old performance data
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        this.memoryUsage = this.memoryUsage.filter(entry => entry.timestamp > cutoff);
        
        // Clear old error log
        this.errorLog = this.errorLog.filter(entry => entry.timestamp > cutoff);
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Get enhanced application status
     */
    getApplicationStatus() {
        return {
            isInitialized: this.isInitialized,
            isDestroyed: this.isDestroyed,
            isOnline: this.isOnline,
            state: this.state,
            performanceMetrics: this.performanceMetrics,
            memoryUsage: this.memoryUsage.length > 0 ? this.memoryUsage[this.memoryUsage.length - 1] : null,
            errorCount: this.performanceMetrics.errorCount,
            userInteractions: this.state.userInteractions,
            uptime: Date.now() - this.performanceMetrics.startTime,
            offlineQueueLength: this.offlineQueue.length
        };
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            memoryUsage: this.memoryUsage,
            errorLog: this.errorLog,
            moduleLoadTimes: this.performanceMetrics.moduleLoadTimes
        };
    }

    /**
     * Restart application
     */
    async restart() {
        console.log('[EnhancedRotamBenimApp] Restarting application...');
        
        try {
            await this.cleanup();
            await this.initialize();
            console.log('[EnhancedRotamBenimApp] Application restarted successfully');
        } catch (error) {
            console.error('[EnhancedRotamBenimApp] Application restart failed:', error);
            throw error;
        }
    }

    /**
     * Enhanced cleanup with better resource management
     */
    async cleanup() {
        if (this.isDestroyed) return;
        
        console.log('[EnhancedRotamBenimApp] Cleaning up application...');
        
        // Clear intervals
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
        
        // Disconnect performance observer
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
            this.performanceObserver = null;
        }
        
        // Remove event listeners
        this.eventListeners.forEach((handler, event) => {
            document.removeEventListener(event, handler);
        });
        this.eventListeners.clear();
        
        // Cleanup modules
        for (const [name, module] of this.modules) {
            if (module && typeof module.cleanup === 'function') {
                try {
                    await module.cleanup();
                } catch (error) {
                    console.error(`[EnhancedRotamBenimApp] Error cleaning up module ${name}:`, error);
                }
            }
        }
        this.modules.clear();
        
        // Clear data structures
        this.memoryUsage = [];
        this.errorLog = [];
        this.offlineQueue = [];
        
        this.isInitialized = false;
        this.isDestroyed = true;
        
        console.log('[EnhancedRotamBenimApp] Application cleaned up successfully');
    }

    /**
     * Utility method for sleeping
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Set application state
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        
        // Trigger state change event
        document.dispatchEvent(new CustomEvent('appStateChanged', {
            detail: { state: this.state }
        }));
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }
}

// Initialize enhanced application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedApp = new EnhancedRotamBenimApp();
    window.enhancedApp.initialize().catch(error => {
        console.error('[EnhancedRotamBenimApp] Failed to initialize:', error);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedRotamBenimApp;
} 
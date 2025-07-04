/**
 * Route Manager for RotamBenim application
 * Handles route creation, management, and Google Maps integration
 */

class RouteManager {
    constructor() {
        this.selectedPlaces = new Map();
        this.routeOrder = [];
        this.isInitialized = false;
        
        // DOM elements
        this.generateRouteBtn = null;
        this.routeLinkContainer = null;
        
        // Configuration
        this.config = {
            maxPlacesInRoute: 25, // Google Maps waypoints limit
            googleMapsBaseUrl: 'https://www.google.com/maps/dir/'
        };
    }

    /**
     * Initialize route manager
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[RouteManager] Already initialized');
            return;
        }

        this.setupDOMElements();
        this.setupEventListeners();
        this.updateRouteButtonState();
        
        this.isInitialized = true;
        console.log('[RouteManager] Route Manager initialized');
    }

    /**
     * Setup DOM elements
     */
    setupDOMElements() {
        this.generateRouteBtn = document.getElementById('generateRouteBtn');
        this.routeLinkContainer = document.getElementById('routeLinkContainer');
        
        if (!this.generateRouteBtn) {
            console.warn('[RouteManager] Generate route button not found');
        }
        
        if (!this.routeLinkContainer) {
            console.warn('[RouteManager] Route link container not found');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.generateRouteBtn) {
            this.generateRouteBtn.addEventListener('click', () => {
                this.generateRoute();
            });
        }

        // Listen for place selection events
        document.addEventListener('placeSelected', (e) => {
            this.handlePlaceSelection(e.detail);
        });

        document.addEventListener('placeDeselected', (e) => {
            this.handlePlaceDeselection(e.detail);
        });
    }

    /**
     * Handle place selection
     * @param {Object} detail - Event detail containing place info
     */
    handlePlaceSelection(detail) {
        if (!detail || !detail.place) return;

        const place = detail.place;
        const order = this.routeOrder.length + 1;
        
        this.selectedPlaces.set(place.id, {
            ...place,
            order: order,
            selectedAt: new Date().toISOString()
        });
        
        this.routeOrder.push(place.id);
        this.updateRouteButtonState();
        
        console.log(`[RouteManager] Place selected: ${place.name} (Order: ${order})`);
        
        // Dispatch event
        this.dispatchRouteUpdateEvent();
    }

    /**
     * Handle place deselection
     * @param {Object} detail - Event detail containing place info
     */
    handlePlaceDeselection(detail) {
        if (!detail || !detail.place) return;

        const place = detail.place;
        
        if (this.selectedPlaces.has(place.id)) {
            this.selectedPlaces.delete(place.id);
            
            // Remove from route order and reorder
            const index = this.routeOrder.indexOf(place.id);
            if (index > -1) {
                this.routeOrder.splice(index, 1);
                this.reorderSelectedPlaces();
            }
            
            this.updateRouteButtonState();
            
            console.log(`[RouteManager] Place deselected: ${place.name}`);
            
            // Dispatch event
            this.dispatchRouteUpdateEvent();
        }
    }

    /**
     * Toggle place selection
     * @param {Object} place - Place object
     * @returns {boolean} True if selected, false if deselected
     */
    togglePlaceSelection(place) {
        if (!place || !place.id) return false;

        if (this.selectedPlaces.has(place.id)) {
            this.handlePlaceDeselection({ place });
            return false;
        } else {
            // Check if we've reached the limit
            if (this.selectedPlaces.size >= this.config.maxPlacesInRoute) {
                if (window.uiComponents) {
                    window.uiComponents.showToast(
                        `Maximum ${this.config.maxPlacesInRoute} places allowed in a route`,
                        'warning'
                    );
                }
                return false;
            }
            
            this.handlePlaceSelection({ place });
            return true;
        }
    }

    /**
     * Reorder selected places after removal
     */
    reorderSelectedPlaces() {
        this.routeOrder.forEach((placeId, index) => {
            const place = this.selectedPlaces.get(placeId);
            if (place) {
                place.order = index + 1;
            }
        });
    }

    /**
     * Check if place is selected for route
     * @param {string} placeId - Place ID
     * @returns {boolean} True if selected
     */
    isPlaceSelected(placeId) {
        return this.selectedPlaces.has(placeId);
    }

    /**
     * Get place order in route
     * @param {string} placeId - Place ID
     * @returns {number} Order number (0 if not selected)
     */
    getPlaceOrder(placeId) {
        const place = this.selectedPlaces.get(placeId);
        return place ? place.order : 0;
    }

    /**
     * Get selected places count
     * @returns {number} Number of selected places
     */
    getSelectedCount() {
        return this.selectedPlaces.size;
    }

    /**
     * Get selected places as array
     * @returns {Array} Array of selected places
     */
    getSelectedPlaces() {
        return Array.from(this.selectedPlaces.values()).sort((a, b) => a.order - b.order);
    }

    /**
     * Clear all selected places
     */
    clearSelection() {
        this.selectedPlaces.clear();
        this.routeOrder = [];
        this.updateRouteButtonState();
        this.clearRouteLink();
        
        // Dispatch event
        this.dispatchRouteUpdateEvent();
        
        console.log('[RouteManager] Route selection cleared');
    }

    /**
     * Update route button state
     */
    updateRouteButtonState() {
        if (!this.generateRouteBtn) return;

        const selectedCount = this.selectedPlaces.size;
        const isEnabled = selectedCount >= 2;
        
        this.generateRouteBtn.disabled = !isEnabled;
        
        // Update button text
        const buttonText = selectedCount >= 2 
            ? `Create Route (${selectedCount} places)`
            : selectedCount === 1
                ? 'Select at least one more place'
                : 'Select places to create route';
                
        // Update button text while preserving any existing structure
        const textNode = Array.from(this.generateRouteBtn.childNodes)
            .find(node => node.nodeType === Node.TEXT_NODE);
        
        if (textNode) {
            textNode.textContent = buttonText;
        } else {
            this.generateRouteBtn.textContent = buttonText;
        }
    }

    /**
     * Generate route URL and display it
     */
    generateRoute() {
        const selectedPlaces = this.getSelectedPlaces();
        
        if (selectedPlaces.length < 2) {
            if (window.uiComponents) {
                window.uiComponents.showToast('Select at least 2 places to create a route', 'warning');
            }
            return;
        }

        try {
            const routeUrl = this.buildGoogleMapsUrl(selectedPlaces);
            this.displayRouteLink(routeUrl, selectedPlaces);
            
            // Track route generation
            this.trackRouteGeneration(selectedPlaces);
            
            console.log('[RouteManager] Route generated:', routeUrl);
            
            if (window.uiComponents) {
                window.uiComponents.showToast('Route created successfully!', 'success');
            }
            
        } catch (error) {
            console.error('[RouteManager] Error generating route:', error);
            
            if (window.uiComponents) {
                window.uiComponents.showToast('Error creating route. Please try again.', 'error');
            }
        }
    }

    /**
     * Build Google Maps URL for the route
     * @param {Array} places - Array of places in order
     * @returns {string} Google Maps URL
     */
    buildGoogleMapsUrl(places) {
        let url = this.config.googleMapsBaseUrl;
        
        places.forEach((place, index) => {
            let location;
            
            // Use coordinates if available, otherwise use name and location
            if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
                location = `${place.coordinates.lat},${place.coordinates.lng}`;
            } else {
                // Build location string from available data
                const locationParts = [place.name];
                if (place.city) locationParts.push(place.city);
                if (place.country) locationParts.push(place.country);
                location = encodeURIComponent(locationParts.join(', '));
            }
            
            url += location;
            
            // Add separator except for the last place
            if (index < places.length - 1) {
                url += '/';
            }
        });
        
        return url;
    }

    /**
     * Display route link in the UI
     * @param {string} routeUrl - Route URL
     * @param {Array} places - Array of places
     */
    displayRouteLink(routeUrl, places) {
        if (!this.routeLinkContainer) return;

        const placeNames = places.map(place => place.name).join(' → ');
        
        this.routeLinkContainer.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start justify-between">
                    <div class="flex-grow">
                        <h4 class="text-green-800 font-semibold mb-2">Route Created Successfully!</h4>
                        <p class="text-green-700 text-sm mb-3">${Utils.escapeHTML(placeNames)}</p>
                        <div class="flex flex-wrap gap-2">
                            <a href="${routeUrl}" target="_blank" rel="noopener noreferrer" 
                               class="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                                Open in Google Maps
                            </a>
                            <button onclick="window.routeManager.copyRouteUrl('${routeUrl}')" 
                                    class="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Copy Link
                            </button>
                            <button onclick="window.routeManager.shareRoute('${routeUrl}', '${Utils.escapeHTML(placeNames)}')" 
                                    class="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                    <button onclick="window.routeManager.clearRouteLink()" 
                            class="ml-4 text-green-600 hover:text-green-800 focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Copy route URL to clipboard
     * @param {string} url - URL to copy
     */
    async copyRouteUrl(url) {
        try {
            const success = await Utils.copyToClipboard(url);
            
            if (success && window.uiComponents) {
                window.uiComponents.showToast('Route link copied to clipboard!', 'success');
            } else if (window.uiComponents) {
                window.uiComponents.showToast('Failed to copy link. Please copy manually.', 'error');
            }
        } catch (error) {
            console.error('[RouteManager] Error copying URL:', error);
            
            if (window.uiComponents) {
                window.uiComponents.showToast('Failed to copy link. Please copy manually.', 'error');
            }
        }
    }

    /**
     * Share route using Web Share API or fallback
     * @param {string} url - Route URL
     * @param {string} title - Route title
     */
    async shareRoute(url, title) {
        const shareData = {
            title: `My Travel Route: ${title}`,
            text: `Check out my travel route: ${title}`,
            url: url
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log('[RouteManager] Route shared successfully');
            } else {
                // Fallback: copy to clipboard
                await this.copyRouteUrl(url);
            }
        } catch (error) {
            console.error('[RouteManager] Error sharing route:', error);
            
            // Fallback: copy to clipboard
            await this.copyRouteUrl(url);
        }
    }

    /**
     * Clear route link display
     */
    clearRouteLink() {
        if (this.routeLinkContainer) {
            this.routeLinkContainer.innerHTML = '';
        }
    }

    /**
     * Track route generation for analytics
     * @param {Array} places - Array of places in route
     */
    trackRouteGeneration(places) {
        const routeData = {
            placesCount: places.length,
            countries: [...new Set(places.map(p => p.country).filter(Boolean))],
            timestamp: new Date().toISOString()
        };

        console.log('[RouteManager] Route generated:', routeData);

        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'route_generated', {
                places_count: routeData.placesCount,
                countries_count: routeData.countries.length
            });
        }
    }

    /**
     * Export route data
     * @returns {Object} Route data
     */
    exportRouteData() {
        return {
            selectedPlaces: this.getSelectedPlaces(),
            routeOrder: [...this.routeOrder],
            createdAt: new Date().toISOString(),
            placesCount: this.selectedPlaces.size
        };
    }

    /**
     * Import route data
     * @param {Object} routeData - Route data to import
     */
    importRouteData(routeData) {
        if (!routeData || !routeData.selectedPlaces) return;

        this.clearSelection();

        routeData.selectedPlaces.forEach(place => {
            this.selectedPlaces.set(place.id, place);
            this.routeOrder.push(place.id);
        });

        this.updateRouteButtonState();
        this.dispatchRouteUpdateEvent();

        console.log('[RouteManager] Route data imported:', routeData.placesCount);
    }

    /**
     * Dispatch route update event
     */
    dispatchRouteUpdateEvent() {
        const event = new CustomEvent('routeUpdated', {
            detail: {
                selectedPlaces: this.getSelectedPlaces(),
                selectedCount: this.selectedPlaces.size
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get route manager status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            selectedPlacesCount: this.selectedPlaces.size,
            maxPlacesAllowed: this.config.maxPlacesInRoute,
            routeOrder: [...this.routeOrder]
        };
    }

    /**
     * Clean up route manager
     */
    cleanup() {
        console.log('[RouteManager] Cleaning up...');
        
        this.clearSelection();
        this.clearRouteLink();
        
        console.log('[RouteManager] Cleanup completed');
    }
}

// Create global instance
window.routeManager = new RouteManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RouteManager;
}
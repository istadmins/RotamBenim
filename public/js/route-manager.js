/**
 * Route Manager for RotamBenim application
 * Handles route creation, management, and Google Maps integration
 */

class RouteManager {
    constructor() {
        this.selectedPlaces = new Map(); // Map of placeId -> {place, order}
        this.routeOrder = [];
        
        // DOM elements
        this.generateRouteBtn = document.getElementById('generateRouteBtn');
        this.clearSelectionBtn = document.getElementById('clearSelectionBtn');
        this.selectedCountElement = document.getElementById('selectedCount');
        this.routeLinkContainer = document.getElementById('routeLinkContainer');
        
        this.isInitialized = false;
    }

    /**
     * Initialize route manager
     */
    initialize() {
        if (this.isInitialized) return;

        console.log('[RouteManager] Initializing...');
        
        this.setupEventListeners();
        this.updateUI();
        
        this.isInitialized = true;
        console.log('[RouteManager] Initialized successfully');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Generate route button
        if (this.generateRouteBtn) {
            this.generateRouteBtn.addEventListener('click', () => {
                this.generateRoute();
            });
        }

        // Clear selection button
        if (this.clearSelectionBtn) {
            this.clearSelectionBtn.addEventListener('click', () => {
                this.clearSelection();
            });
        }

        // Listen for auth state changes
        firebaseService.onAuthStateChange((user) => {
            this.handleAuthStateChange(user);
        });
    }

    /**
     * Handle authentication state changes
     * @param {Object|null} user - Firebase user object
     */
    handleAuthStateChange(user) {
        if (!user) {
            // User signed out - clear selection
            this.clearSelection();
        }
        this.updateUI();
    }

    /**
     * Toggle place selection for route
     * @param {Object} place - Place object
     */
    togglePlaceSelection(place) {
        if (!place || !place.id) {
            console.warn('[RouteManager] Invalid place object');
            return;
        }

        if (this.selectedPlaces.has(place.id)) {
            this.removePlaceFromRoute(place.id);
        } else {
            this.addPlaceToRoute(place);
        }
    }

    /**
     * Add place to route
     * @param {Object} place - Place object
     */
    addPlaceToRoute(place) {
        if (!place || !place.id) {
            console.warn('[RouteManager] Invalid place object');
            return;
        }

        // Check maximum route points limit
        if (this.selectedPlaces.size >= APP_CONFIG.maxRoutePoints) {
            uiComponents.showToast(MESSAGES.route.maxPlaces, 'warning');
            return;
        }

        const order = this.routeOrder.length + 1;
        this.selectedPlaces.set(place.id, { place, order });
        this.routeOrder.push(place.id);

        console.log(`[RouteManager] Added place to route: ${place.name} (order: ${order})`);
        this.updateUI();
        
        uiComponents.showToast(`${place.name} rotaya eklendi (${order}. sıra)`, 'success', 2000);
    }

    /**
     * Remove place from route
     * @param {string} placeId - Place ID
     */
    removePlaceFromRoute(placeId) {
        if (!this.selectedPlaces.has(placeId)) {
            return;
        }

        const placeData = this.selectedPlaces.get(placeId);
        this.selectedPlaces.delete(placeId);
        
        // Remove from order array
        const orderIndex = this.routeOrder.indexOf(placeId);
        if (orderIndex > -1) {
            this.routeOrder.splice(orderIndex, 1);
        }

        // Reorder remaining places
        this.reorderPlaces();

        console.log(`[RouteManager] Removed place from route: ${placeData.place.name}`);
        this.updateUI();
        
        uiComponents.showToast(`${placeData.place.name} rotadan çıkarıldı`, 'info', 2000);
    }

    /**
     * Reorder places after removal
     */
    reorderPlaces() {
        this.routeOrder.forEach((placeId, index) => {
            const placeData = this.selectedPlaces.get(placeId);
            if (placeData) {
                placeData.order = index + 1;
            }
        });
    }

    /**
     * Clear all selected places
     */
    clearSelection() {
        if (this.selectedPlaces.size === 0) {
            return;
        }

        this.selectedPlaces.clear();
        this.routeOrder = [];
        
        // Clear route link
        if (this.routeLinkContainer) {
            this.routeLinkContainer.innerHTML = '';
        }

        this.updateUI();
        
        // Refresh places list to update selection state
        if (placeManager) {
            placeManager.refresh();
        }
        
        uiComponents.showToast(MESSAGES.route.cleared, 'info', 2000);
        console.log('[RouteManager] Selection cleared');
    }

    /**
     * Generate Google Maps route
     */
    generateRoute() {
        if (this.selectedPlaces.size < 2) {
            uiComponents.showToast(MESSAGES.route.minPlaces, 'warning');
            return;
        }

        try {
            const sortedPlaces = this.getSortedSelectedPlaces();
            const googleMapsUrl = this.buildGoogleMapsUrl(sortedPlaces);
            
            this.displayRouteLink(googleMapsUrl, sortedPlaces);
            uiComponents.showToast(MESSAGES.route.created, 'success');
            
            console.log('[RouteManager] Route generated:', googleMapsUrl);
            
        } catch (error) {
            console.error('[RouteManager] Error generating route:', error);
            uiComponents.showToast('Rota oluşturulurken hata oluştu', 'error');
        }
    }

    /**
     * Get selected places sorted by order
     * @returns {Array} Sorted places array
     */
    getSortedSelectedPlaces() {
        return this.routeOrder
            .map(placeId => this.selectedPlaces.get(placeId))
            .filter(Boolean)
            .sort((a, b) => a.order - b.order);
    }

    /**
     * Build Google Maps URL for route
     * @param {Array} sortedPlaces - Sorted places array
     * @returns {string} Google Maps URL
     */
    buildGoogleMapsUrl(sortedPlaces) {
        let url = "https://www.google.com/maps/dir/";
        
        sortedPlaces.forEach(({ place }) => {
            if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
                // Use coordinates if available
                url += `${place.coordinates.lat},${place.coordinates.lng}/`;
            } else {
                // Use place name and location
                const query = encodeURIComponent(
                    `${place.name}${place.city ? ', ' + place.city : ''}${place.country ? ', ' + place.country : ''}`
                );
                url += `${query}/`;
            }
        });

        return url;
    }

    /**
     * Display route link in UI
     * @param {string} url - Google Maps URL
     * @param {Array} sortedPlaces - Sorted places array
     */
    displayRouteLink(url, sortedPlaces) {
        if (!this.routeLinkContainer) return;

        const placeNames = sortedPlaces.map(({ place }) => place.name).join(' → ');
        
        this.routeLinkContainer.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start justify-between">
                    <div class="flex-grow">
                        <h4 class="text-green-800 font-semibold mb-2">Rota Oluşturuldu!</h4>
                        <p class="text-green-700 text-sm mb-3">${Utils.escapeHTML(placeNames)}</p>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <a 
                                href="${url}" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                                aria-label="Rotayı Google Haritalar'da aç"
                            >
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
                                </svg>
                                Google Haritalar'da Aç
                            </a>
                            <button 
                                onclick="uiComponents.copyToClipboard('${url}', 'Rota linki kopyalandı!')"
                                class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                                aria-label="Rota linkini kopyala"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Linki Kopyala
                            </button>
                        </div>
                    </div>
                    <button 
                        onclick="routeManager.clearRouteDisplay()"
                        class="ml-4 text-green-600 hover:text-green-800 transition-colors duration-200"
                        aria-label="Rota görünümünü kapat"
                    >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Scroll to route link
        Utils.scrollToElement(this.routeLinkContainer, 100);
    }

    /**
     * Clear route display
     */
    clearRouteDisplay() {
        if (this.routeLinkContainer) {
            this.routeLinkContainer.innerHTML = '';
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const selectedCount = this.selectedPlaces.size;
        const isAuthenticated = firebaseService.isAuthenticated();

        // Update selected count
        if (this.selectedCountElement) {
            this.selectedCountElement.textContent = selectedCount;
        }

        // Update generate route button
        if (this.generateRouteBtn) {
            this.generateRouteBtn.disabled = !isAuthenticated || selectedCount < 2;
            
            if (this.selectedCountElement) {
                this.generateRouteBtn.setAttribute('aria-label', 
                    `${selectedCount} yer seçili, rota oluştur`
                );
            }
        }

        // Update clear selection button
        if (this.clearSelectionBtn) {
            if (selectedCount > 0) {
                this.clearSelectionBtn.classList.remove('hidden');
            } else {
                this.clearSelectionBtn.classList.add('hidden');
            }
        }
    }

    /**
     * Check if place is selected for route
     * @param {string} placeId - Place ID
     * @returns {boolean} Selection status
     */
    isPlaceSelected(placeId) {
        return this.selectedPlaces.has(placeId);
    }

    /**
     * Get place order in route
     * @param {string} placeId - Place ID
     * @returns {number|null} Order number or null if not selected
     */
    getPlaceOrder(placeId) {
        const placeData = this.selectedPlaces.get(placeId);
        return placeData ? placeData.order : null;
    }

    /**
     * Get selected places count
     * @returns {number} Number of selected places
     */
    getSelectedCount() {
        return this.selectedPlaces.size;
    }

    /**
     * Get selected places data
     * @returns {Array} Array of selected place data
     */
    getSelectedPlaces() {
        return Array.from(this.selectedPlaces.values());
    }

    /**
     * Move place up in route order
     * @param {string} placeId - Place ID
     */
    movePlaceUp(placeId) {
        const currentIndex = this.routeOrder.indexOf(placeId);
        if (currentIndex <= 0) return; // Already at top or not found

        // Swap with previous place
        [this.routeOrder[currentIndex - 1], this.routeOrder[currentIndex]] = 
        [this.routeOrder[currentIndex], this.routeOrder[currentIndex - 1]];

        this.reorderPlaces();
        this.updateUI();
        
        if (placeManager) {
            placeManager.refresh();
        }
    }

    /**
     * Move place down in route order
     * @param {string} placeId - Place ID
     */
    movePlaceDown(placeId) {
        const currentIndex = this.routeOrder.indexOf(placeId);
        if (currentIndex < 0 || currentIndex >= this.routeOrder.length - 1) return; // At bottom or not found

        // Swap with next place
        [this.routeOrder[currentIndex], this.routeOrder[currentIndex + 1]] = 
        [this.routeOrder[currentIndex + 1], this.routeOrder[currentIndex]];

        this.reorderPlaces();
        this.updateUI();
        
        if (placeManager) {
            placeManager.refresh();
        }
    }

    /**
     * Export route data
     * @returns {Object} Route data
     */
    exportRouteData() {
        const sortedPlaces = this.getSortedSelectedPlaces();
        return {
            places: sortedPlaces.map(({ place, order }) => ({
                id: place.id,
                name: place.name,
                city: place.city,
                country: place.country,
                coordinates: place.coordinates,
                order: order
            })),
            createdAt: new Date().toISOString(),
            totalPlaces: sortedPlaces.length
        };
    }

    /**
     * Import route data
     * @param {Object} routeData - Route data to import
     */
    importRouteData(routeData) {
        if (!routeData || !routeData.places || !Array.isArray(routeData.places)) {
            throw new Error('Invalid route data format');
        }

        this.clearSelection();

        routeData.places.forEach(placeData => {
            if (placeManager) {
                const place = placeManager.getPlaceById(placeData.id);
                if (place) {
                    this.addPlaceToRoute(place);
                }
            }
        });

        uiComponents.showToast('Rota başarıyla içe aktarıldı', 'success');
    }

    /**
     * Get route statistics
     * @returns {Object} Route statistics
     */
    getRouteStatistics() {
        const selectedPlaces = this.getSelectedPlaces();
        const countries = new Set();
        const cities = new Set();
        let visitedCount = 0;

        selectedPlaces.forEach(({ place }) => {
            if (place.country) countries.add(place.country);
            if (place.city) cities.add(place.city);
            if (place.visited) visitedCount++;
        });

        return {
            totalPlaces: selectedPlaces.length,
            countries: countries.size,
            cities: cities.size,
            visitedPlaces: visitedCount,
            unvisitedPlaces: selectedPlaces.length - visitedCount,
            countryList: Array.from(countries),
            cityList: Array.from(cities)
        };
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[RouteManager] Cleaning up...');
        this.clearSelection();
    }
}

// Create and export route manager instance
window.routeManager = new RouteManager();
/**
 * Place Manager for RotamBenim application
 * Handles place-related operations and UI interactions
 */

class PlaceManager {
    constructor() {
        this.places = [];
        this.filteredPlaces = [];
        this.currentFilters = {
            country: 'all',
            visited: 'notvisited'
        };
        
        // DOM elements
        this.placesListElement = document.getElementById('placesList');
        this.placesListStatusElement = document.getElementById('placesListStatus');
        this.filterCountryElement = document.getElementById('filterCountry');
        this.filterVisitedElement = document.getElementById('filterVisited');
        this.newPlaceNameInput = document.getElementById('newPlaceNameInput');
        this.addPlaceBtn = document.getElementById('addPlaceBtn');
        this.addPlaceBtnText = document.getElementById('addPlaceBtnText');
        this.addPlaceLoader = document.getElementById('addPlaceLoader');
        this.addPlaceMessage = document.getElementById('addPlaceMessage');
        this.mapFrame = document.getElementById('mapFrame');
        this.mapLocationName = document.getElementById('mapLocationName');

        this.isInitialized = false;
        this.renderDebounced = Utils.debounce(this.renderPlacesList.bind(this), 100);
    }

    /**
     * Initialize place manager
     */
    initialize() {
        if (this.isInitialized) return;

        console.log('[PlaceManager] Initializing...');
        
        this.setupEventListeners();
        this.setupFirebaseListeners();
        
        this.isInitialized = true;
        console.log('[PlaceManager] Initialized successfully');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Filter change listeners
        if (this.filterCountryElement) {
            this.filterCountryElement.addEventListener('change', () => {
                this.currentFilters.country = this.filterCountryElement.value;
                this.applyFilters();
            });
        }

        if (this.filterVisitedElement) {
            this.filterVisitedElement.addEventListener('change', () => {
                this.currentFilters.visited = this.filterVisitedElement.value;
                this.applyFilters();
            });
        }

        // Add place functionality
        if (this.addPlaceBtn && this.newPlaceNameInput) {
            this.addPlaceBtn.addEventListener('click', () => this.handleAddPlace());
            
            this.newPlaceNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddPlace();
                }
            });

            this.newPlaceNameInput.addEventListener('input', () => {
                this.validateAddPlaceInput();
            });
        }
    }

    /**
     * Setup Firebase listeners
     */
    setupFirebaseListeners() {
        // Listen for places changes
        firebaseService.onPlacesChange((places, error) => {
            if (error) {
                console.error('[PlaceManager] Places listener error:', error);
                this.handlePlacesError(error);
                return;
            }

            this.places = places || [];
            this.populateCountryFilter();
            this.applyFilters();
            
            if (this.places.length > 0) {
                this.updateStatus(`${this.places.length} yer yüklendi`);
            } else {
                this.updateStatus('Henüz yer eklenmemiş');
            }
        });

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
        if (user) {
            // User signed in
            if (this.addPlaceBtn) {
                this.addPlaceBtn.disabled = false;
            }
            this.updateStatus('Yerler yükleniyor...');
        } else {
            // User signed out
            if (this.addPlaceBtn) {
                this.addPlaceBtn.disabled = true;
            }
            this.places = [];
            this.filteredPlaces = [];
            this.populateCountryFilter();
            this.showSignInPrompt();
        }
    }

    /**
     * Handle places loading error
     * @param {Error} error - Error object
     */
    handlePlacesError(error) {
        console.error('[PlaceManager] Places error:', error);
        
        let errorMessage = MESSAGES.places.loadError;
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
            errorMessage += ' (Firestore indeks hatası - Firebase konsolundan gerekli indeksi oluşturun)';
        }
        
        uiComponents.showErrorState(
            this.placesListElement,
            errorMessage,
            () => window.location.reload()
        );
        
        this.updateStatus(errorMessage);
    }

    /**
     * Update status message
     * @param {string} message - Status message
     */
    updateStatus(message) {
        if (this.placesListStatusElement) {
            this.placesListStatusElement.textContent = message;
        }
    }

    /**
     * Show sign-in prompt
     */
    showSignInPrompt() {
        if (this.placesListElement) {
            this.placesListElement.innerHTML = `
                <div class="text-center py-8">
                    <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p class="text-gray-500 text-lg mb-2">Yerlerinizi görmek için giriş yapın</p>
                    <p class="text-gray-400 text-sm">Google hesabınızla giriş yaparak kişisel yer listenize erişebilirsiniz</p>
                </div>
            `;
        }
        this.updateStatus('Giriş yapılmadı');
    }

    /**
     * Populate country filter dropdown
     */
    populateCountryFilter() {
        if (!this.filterCountryElement) return;

        const currentValue = this.filterCountryElement.value;
        this.filterCountryElement.innerHTML = '<option value="all">Tüm Ülkeler</option>';

        if (this.places.length > 0) {
            const countries = [...new Set(this.places.map(place => place.country).filter(Boolean))].sort();
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                this.filterCountryElement.appendChild(option);
            });

            // Restore previous selection if still valid
            if (countries.includes(currentValue)) {
                this.filterCountryElement.value = currentValue;
            }
        }
    }

    /**
     * Apply current filters to places
     */
    applyFilters() {
        this.filteredPlaces = this.places.filter(place => {
            // Country filter
            if (this.currentFilters.country !== 'all' && place.country !== this.currentFilters.country) {
                return false;
            }

            // Visited filter
            if (this.currentFilters.visited !== 'all') {
                const isVisited = place.visited === true;
                if (this.currentFilters.visited === 'visited' && !isVisited) return false;
                if (this.currentFilters.visited === 'notvisited' && isVisited) return false;
            }

            return true;
        });

        this.renderDebounced();
    }

    /**
     * Render places list
     */
    renderPlacesList() {
        if (!this.placesListElement) return;

        // Clear existing content
        this.placesListElement.innerHTML = '';

        if (!firebaseService.isAuthenticated()) {
            this.showSignInPrompt();
            return;
        }

        if (this.filteredPlaces.length === 0) {
            const message = this.places.length === 0 ? 
                MESSAGES.places.emptyList : 
                MESSAGES.places.noResults;
            
            uiComponents.showEmptyState(this.placesListElement, message, `
                <svg class="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            `);
            return;
        }

        // Group places by country
        const placesByCountry = this.groupPlacesByCountry(this.filteredPlaces);
        
        // Render places grouped by country
        Object.keys(placesByCountry).sort().forEach(country => {
            this.renderCountrySection(country, placesByCountry[country]);
        });

        // Update status
        this.updateStatus(`${this.filteredPlaces.length} yer gösteriliyor`);
    }

    /**
     * Group places by country
     * @param {Array} places - Places array
     * @returns {Object} Places grouped by country
     */
    groupPlacesByCountry(places) {
        return places.reduce((groups, place) => {
            const country = place.country || 'Diğer';
            if (!groups[country]) {
                groups[country] = [];
            }
            groups[country].push(place);
            return groups;
        }, {});
    }

    /**
     * Render country section
     * @param {string} country - Country name
     * @param {Array} places - Places in the country
     */
    renderCountrySection(country, places) {
        // Create country header
        const countryHeader = document.createElement('h3');
        countryHeader.className = 'country-header';
        countryHeader.textContent = country;
        this.placesListElement.appendChild(countryHeader);

        // Render places in this country
        places.forEach(place => {
            this.renderPlaceItem(place);
        });
    }

    /**
     * Render individual place item
     * @param {Object} place - Place object
     */
    renderPlaceItem(place) {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-item';
        placeElement.setAttribute('data-id', place.id);
        placeElement.setAttribute('role', 'listitem');
        placeElement.setAttribute('tabindex', '0');
        placeElement.setAttribute('aria-label', `${place.name}, ${place.city || ''} ${place.country || ''}`);

        // Check if place is selected for route
        const isSelectedForRoute = routeManager && routeManager.isPlaceSelected(place.id);
        if (isSelectedForRoute) {
            placeElement.classList.add('selected-for-route');
        }

        placeElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-grow">
                    <h4 class="text-lg font-semibold text-sky-700">${Utils.escapeHTML(place.name || 'İsimsiz Yer')}</h4>
                    <p class="text-sm text-gray-500">
                        ${place.city ? Utils.escapeHTML(place.city) + ', ' : ''}${Utils.escapeHTML(place.country || 'Bilinmeyen Ülke')}
                    </p>
                    ${place.category ? `<span class="category-tag">${Utils.escapeHTML(place.category)}</span>` : ''}
                    <p class="text-sm text-gray-600 mt-1">${Utils.escapeHTML(place.description || 'Açıklama bulunamadı.')}</p>
                    ${isSelectedForRoute ? `<p class="text-xs text-blue-600 font-semibold mt-1">Rota Sırası: ${routeManager.getPlaceOrder(place.id)}</p>` : ''}
                </div>
                <div class="ml-4 flex-shrink-0 flex flex-col items-center space-y-2">
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            id="visited-${place.id}" 
                            data-id="${place.id}" 
                            class="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
                            ${place.visited ? 'checked' : ''}
                            aria-label="${place.visited ? 'Gezildi olarak işaretli' : 'Gezilmedi olarak işaretli'}"
                        >
                        <label for="visited-${place.id}" class="text-xs text-gray-500 ml-1">
                            ${place.visited ? 'Gezildi' : 'Gezilmedi'}
                        </label>
                    </div>
                    <button 
                        class="delete-place-btn" 
                        data-id="${place.id}"
                        aria-label="${place.name} yerini sil"
                    >
                        Sil
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        this.setupPlaceItemListeners(placeElement, place);
        
        this.placesListElement.appendChild(placeElement);
    }

    /**
     * Setup event listeners for place item
     * @param {HTMLElement} placeElement - Place element
     * @param {Object} place - Place object
     */
    setupPlaceItemListeners(placeElement, place) {
        // Click to select for route
        placeElement.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox' || e.target.classList.contains('delete-place-btn')) {
                return; // Ignore checkbox and delete button clicks
            }
            this.handlePlaceSelection(place);
        });

        // Keyboard navigation
        placeElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handlePlaceSelection(place);
            }
        });

        // Visited checkbox
        const visitedCheckbox = placeElement.querySelector(`#visited-${place.id}`);
        if (visitedCheckbox) {
            visitedCheckbox.addEventListener('change', (e) => {
                this.handleVisitedToggle(place.id, e.target.checked);
            });
        }

        // Delete button
        const deleteButton = placeElement.querySelector('.delete-place-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDeletePlace(place);
            });
        }
    }

    /**
     * Handle place selection for route
     * @param {Object} place - Place object
     */
    handlePlaceSelection(place) {
        if (!firebaseService.isAuthenticated()) {
            uiComponents.showToast(MESSAGES.auth.pleaseSignIn, 'warning');
            return;
        }

        if (routeManager) {
            routeManager.togglePlaceSelection(place);
            this.updateMap(place);
            // Re-render to update selection state
            this.renderDebounced();
        }
    }

    /**
     * Handle visited status toggle
     * @param {string} placeId - Place ID
     * @param {boolean} isVisited - New visited status
     */
    async handleVisitedToggle(placeId, isVisited) {
        if (!firebaseService.isAuthenticated()) {
            uiComponents.showToast(MESSAGES.auth.pleaseSignIn, 'warning');
            return;
        }

        try {
            await firebaseService.updatePlace(placeId, { visited: isVisited });
            
            // Update local data immediately for better UX
            const place = this.places.find(p => p.id === placeId);
            if (place) {
                place.visited = isVisited;
            }
            
            uiComponents.showToast(
                isVisited ? 'Gezildi olarak işaretlendi' : 'Gezilmedi olarak işaretlendi',
                'success',
                2000
            );

        } catch (error) {
            console.error('[PlaceManager] Error updating visited status:', error);
            uiComponents.showToast(MESSAGES.places.updateError, 'error');
            
            // Revert checkbox state
            const checkbox = document.querySelector(`#visited-${placeId}`);
            if (checkbox) {
                checkbox.checked = !isVisited;
            }
        }
    }

    /**
     * Handle place deletion
     * @param {Object} place - Place object
     */
    async handleDeletePlace(place) {
        if (!firebaseService.isAuthenticated()) {
            uiComponents.showToast(MESSAGES.auth.pleaseSignIn, 'warning');
            return;
        }

        const confirmed = await uiComponents.showConfirmDialog(
            `"${place.name}" adlı yeri silmek istediğinizden emin misiniz?`,
            'Yeri Sil'
        );

        if (!confirmed) return;

        try {
            uiComponents.showLoading('Yer siliniyor...');
            
            await firebaseService.deletePlace(place.id);
            
            // Remove from route if selected
            if (routeManager && routeManager.isPlaceSelected(place.id)) {
                routeManager.removePlaceFromRoute(place.id);
            }
            
            uiComponents.showToast(MESSAGES.places.deleteSuccess, 'success');
            
        } catch (error) {
            console.error('[PlaceManager] Error deleting place:', error);
            uiComponents.showToast(MESSAGES.places.deleteError, 'error');
        } finally {
            uiComponents.hideLoading();
        }
    }

    /**
     * Validate add place input
     */
    validateAddPlaceInput() {
        if (!this.newPlaceNameInput || !this.addPlaceMessage) return;

        const placeName = this.newPlaceNameInput.value.trim();
        
        if (!placeName) {
            this.addPlaceMessage.textContent = '';
            this.addPlaceMessage.className = 'text-sm mt-2';
            return;
        }

        if (placeName.length > APP_CONFIG.maxPlaceNameLength) {
            this.addPlaceMessage.textContent = MESSAGES.places.nameTooLong;
            this.addPlaceMessage.className = 'text-sm mt-2 text-red-600';
            return;
        }

        // Check for duplicates
        const isDuplicate = this.places.some(place => 
            place.name.toLowerCase() === placeName.toLowerCase()
        );

        if (isDuplicate) {
            this.addPlaceMessage.textContent = 'Bu yer zaten listede mevcut';
            this.addPlaceMessage.className = 'text-sm mt-2 text-yellow-600';
            return;
        }

        this.addPlaceMessage.textContent = '';
        this.addPlaceMessage.className = 'text-sm mt-2';
    }

    /**
     * Handle add place
     */
    async handleAddPlace() {
        if (!firebaseService.isAuthenticated()) {
            this.showAddPlaceMessage(MESSAGES.auth.pleaseSignIn, 'error');
            return;
        }

        const placeName = this.newPlaceNameInput.value.trim();
        
        if (!placeName) {
            this.showAddPlaceMessage(MESSAGES.places.nameRequired, 'error');
            this.newPlaceNameInput.focus();
            return;
        }

        if (placeName.length > APP_CONFIG.maxPlaceNameLength) {
            this.showAddPlaceMessage(MESSAGES.places.nameTooLong, 'error');
            return;
        }

        try {
            uiComponents.setButtonLoading(this.addPlaceBtn, true, 'Ekleniyor...');
            this.showAddPlaceMessage('', '');

            const newPlace = {
                name: placeName,
                city: '',
                country: '',
                category: 'Kullanıcı Ekledi',
                description: 'Kullanıcı tarafından eklendi.',
                coordinates: null
            };

            await firebaseService.addPlace(newPlace);
            
            this.newPlaceNameInput.value = '';
            this.showAddPlaceMessage(MESSAGES.places.addSuccess, 'success');
            
            // Clear success message after delay
            setTimeout(() => {
                this.showAddPlaceMessage('', '');
            }, 3000);

        } catch (error) {
            console.error('[PlaceManager] Error adding place:', error);
            this.showAddPlaceMessage(MESSAGES.places.addError, 'error');
        } finally {
            uiComponents.setButtonLoading(this.addPlaceBtn, false, 'Yer Ekle');
        }
    }

    /**
     * Show add place message
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, warning)
     */
    showAddPlaceMessage(message, type) {
        if (!this.addPlaceMessage) return;

        this.addPlaceMessage.textContent = message;
        
        const typeClasses = {
            success: 'text-green-600',
            error: 'text-red-600',
            warning: 'text-yellow-600'
        };

        this.addPlaceMessage.className = `text-sm mt-2 ${typeClasses[type] || ''}`;
    }

    /**
     * Update map display
     * @param {Object} place - Place object
     */
    updateMap(place) {
        if (!this.mapFrame || !this.mapLocationName) return;

        if (place && place.coordinates && place.coordinates.lat && place.coordinates.lng) {
            const { lat, lng } = place.coordinates;
            this.mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&hl=tr&z=14&output=embed`;
            this.mapLocationName.textContent = `${place.name} (${place.city || ''}, ${place.country || ''})`;
        } else if (place && place.name) {
            const query = encodeURIComponent(`${place.name}${place.city ? ', ' + place.city : ''}${place.country ? ', ' + place.country : ''}`);
            this.mapFrame.src = `https://maps.google.com/maps?q=${query}&hl=tr&z=10&output=embed`;
            this.mapLocationName.textContent = place.name;
        } else {
            this.mapFrame.src = "https://maps.google.com/maps?output=embed&q=Avrupa";
            this.mapLocationName.textContent = "";
        }
    }

    /**
     * Get places data
     * @returns {Array} Places array
     */
    getPlaces() {
        return this.places;
    }

    /**
     * Get filtered places data
     * @returns {Array} Filtered places array
     */
    getFilteredPlaces() {
        return this.filteredPlaces;
    }

    /**
     * Get place by ID
     * @param {string} placeId - Place ID
     * @returns {Object|null} Place object
     */
    getPlaceById(placeId) {
        return this.places.find(place => place.id === placeId) || null;
    }

    /**
     * Refresh places list
     */
    refresh() {
        this.applyFilters();
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[PlaceManager] Cleaning up...');
        // Remove event listeners, clear intervals, etc.
    }
}

// Create and export place manager instance
window.placeManager = new PlaceManager();
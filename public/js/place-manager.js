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
        
        // Place tab elements
        this.newPlaceNameInput = document.getElementById('newPlaceNameInput');
        this.addPlaceBtn = document.getElementById('addPlaceBtn');
        this.addPlaceBtnText = document.getElementById('addPlaceBtnText');
        this.addPlaceLoader = document.getElementById('addPlaceLoader');
        this.addPlaceMessage = document.getElementById('addPlaceMessage');
        
        // Country tab elements
        this.openCountrySelectorBtn = document.getElementById('openCountrySelectorBtn');
        this.openCountrySelectorBtnText = document.getElementById('openCountrySelectorBtnText');
        this.addCountryMessage = document.getElementById('addCountryMessage');
        
        // Country selector modal elements
        this.countrySelectorModal = document.getElementById('countrySelectorModal');
        this.countryGrid = document.getElementById('countryGrid');
        this.selectedCountryCount = document.getElementById('selectedCountryCount');
        this.addSelectedCountriesBtn = document.getElementById('addSelectedCountriesBtn');
        this.addSelectedCountriesBtnText = document.getElementById('addSelectedCountriesBtnText');
        this.addSelectedCountriesLoader = document.getElementById('addSelectedCountriesLoader');
        this.closeCountrySelectorBtn = document.getElementById('closeCountrySelectorBtn');
        this.cancelCountrySelectionBtn = document.getElementById('cancelCountrySelectionBtn');
        
        this.selectedCountries = new Set();
        
        // Tab elements
        this.addPlaceTab = document.getElementById('addPlaceTab');
        this.addCountryTab = document.getElementById('addCountryTab');
        this.addPlaceContent = document.getElementById('addPlaceContent');
        this.addCountryContent = document.getElementById('addCountryContent');
        
        this.mapFrame = document.getElementById('mapFrame');
        this.mapLocationName = document.getElementById('mapLocationName');

        this.currentTab = 'place'; // 'place' or 'country'

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

        // Tab functionality
        if (this.addPlaceTab && this.addCountryTab) {
            this.addPlaceTab.addEventListener('click', () => this.switchTab('place'));
            this.addCountryTab.addEventListener('click', () => this.switchTab('country'));
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

        // Add country functionality
        if (this.openCountrySelectorBtn) {
            this.openCountrySelectorBtn.addEventListener('click', () => this.openCountrySelector());
        }

        // Country selector modal events
        if (this.closeCountrySelectorBtn) {
            this.closeCountrySelectorBtn.addEventListener('click', () => this.closeCountrySelector());
        }

        if (this.cancelCountrySelectionBtn) {
            this.cancelCountrySelectionBtn.addEventListener('click', () => this.closeCountrySelector());
        }

        if (this.addSelectedCountriesBtn) {
            this.addSelectedCountriesBtn.addEventListener('click', () => this.handleAddSelectedCountries());
        }

        // Close modal on outside click
        if (this.countrySelectorModal) {
            this.countrySelectorModal.addEventListener('click', (e) => {
                if (e.target === this.countrySelectorModal) {
                    this.closeCountrySelector();
                }
            });
        }
    }

    /**
     * Switch between add place and add country tabs
     * @param {string} tab - Tab to switch to ('place' or 'country')
     */
    switchTab(tab) {
        this.currentTab = tab;

        if (tab === 'place') {
            // Update tab buttons
            this.addPlaceTab.classList.add('text-sky-600', 'border-b-2', 'border-sky-600');
            this.addPlaceTab.classList.remove('text-gray-500');
            this.addCountryTab.classList.remove('text-sky-600', 'border-b-2', 'border-sky-600');
            this.addCountryTab.classList.add('text-gray-500');

            // Show/hide content
            this.addPlaceContent.classList.remove('hidden');
            this.addCountryContent.classList.add('hidden');
        } else {
            // Update tab buttons
            this.addCountryTab.classList.add('text-sky-600', 'border-b-2', 'border-sky-600');
            this.addCountryTab.classList.remove('text-gray-500');
            this.addPlaceTab.classList.remove('text-sky-600', 'border-b-2', 'border-sky-600');
            this.addPlaceTab.classList.add('text-gray-500');

            // Show/hide content
            this.addCountryContent.classList.remove('hidden');
            this.addPlaceContent.classList.add('hidden');
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
            if (this.openCountrySelectorBtn) {
                this.openCountrySelectorBtn.disabled = false;
            }
            this.updateStatus(MESSAGES.places.loading);
        } else {
            // User signed out
            if (this.addPlaceBtn) {
                this.addPlaceBtn.disabled = true;
            }
            if (this.openCountrySelectorBtn) {
                this.openCountrySelectorBtn.disabled = true;
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
     * Update map with place location
     * @param {Object} place - Place object
     */
    updateMap(place) {
        if (!this.mapFrame || !this.mapLocationName) return;
        
        // Update map location name
        this.mapLocationName.textContent = `${place.name}, ${place.city || ''} ${place.country || ''}`.trim();
        
        // Update map iframe source
        let mapQuery;
        if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
            // Use coordinates if available
            mapQuery = `${place.coordinates.lat},${place.coordinates.lng}`;
        } else {
            // Use place name and location
            mapQuery = encodeURIComponent(
                `${place.name}${place.city ? ', ' + place.city : ''}${place.country ? ', ' + place.country : ''}`
            );
        }
        
        this.mapFrame.src = `https://maps.google.com/maps?output=embed&q=${mapQuery}`;
        
        console.log(`[PlaceManager] Map updated to show: ${place.name}`);
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

        // Check for duplicates with more comprehensive matching
        const duplicateInfo = this.checkForDuplicates(placeName);
        if (duplicateInfo.isDuplicate) {
            this.addPlaceMessage.textContent = `Bu yer zaten listede mevcut: "${duplicateInfo.existingPlace.name}" (${duplicateInfo.existingPlace.city || ''}, ${duplicateInfo.existingPlace.country || ''})`;
            this.addPlaceMessage.className = 'text-sm mt-2 text-yellow-600';
            return;
        }

        this.addPlaceMessage.textContent = '';
        this.addPlaceMessage.className = 'text-sm mt-2';
    }

    /**
     * Check for duplicate places with comprehensive matching
     * @param {string} placeName - Place name to check
     * @returns {Object} Duplicate check result
     */
    checkForDuplicates(placeName) {
        const normalizedInput = this.normalizePlaceName(placeName);
        
        for (const place of this.places) {
            const normalizedExisting = this.normalizePlaceName(place.name);
            
            // Exact match
            if (normalizedInput === normalizedExisting) {
                return { isDuplicate: true, existingPlace: place, matchType: 'exact' };
            }
            
            // Similar match (contains or is contained)
            if (normalizedInput.length > 3 && normalizedExisting.length > 3) {
                if (normalizedInput.includes(normalizedExisting) || normalizedExisting.includes(normalizedInput)) {
                    return { isDuplicate: true, existingPlace: place, matchType: 'similar' };
                }
            }
            
            // Check alternative names for Turkish places
            const alternativeMatch = this.checkAlternativeNames(placeName, place);
            if (alternativeMatch) {
                return { isDuplicate: true, existingPlace: place, matchType: 'alternative' };
            }
        }
        
        return { isDuplicate: false };
    }

    /**
     * Normalize place name for comparison
     * @param {string} name - Place name to normalize
     * @returns {string} Normalized name
     */
    normalizePlaceName(name) {
        if (!name) return '';
        
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '') // Remove special characters
            .replace(/\s+/g, ' ') // Normalize spaces
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c');
    }

    /**
     * Check alternative names for places
     * @param {string} inputName - Input place name
     * @param {Object} existingPlace - Existing place object
     * @returns {boolean} Whether names match
     */
    checkAlternativeNames(inputName, existingPlace) {
        const alternatives = {
            'pamukkale': ['pamukkale', 'cotton castle', 'pamuk kale'],
            'kapadokya': ['kapadokya', 'cappadocia', 'capadocia'],
            'efes': ['efes', 'ephesus', 'efes antik kenti'],
            'ayasofya': ['ayasofya', 'hagia sophia', 'aya sofya'],
            'topkapi': ['topkapi', 'topkapı', 'topkapi palace', 'topkapı sarayı'],
            'galata kulesi': ['galata kulesi', 'galata tower'],
            'truva': ['truva', 'troy', 'troya'],
            'amsterdam': ['amsterdam', 'amsterdam kanalları'],
            'venedik': ['venedik', 'venice', 'venezia', 'venedik kanalları'],
            'roma': ['roma', 'rome', 'roma kolezyumu', 'colosseum']
        };
        
        const normalizedInput = this.normalizePlaceName(inputName);
        const normalizedExisting = this.normalizePlaceName(existingPlace.name);
        
        for (const [key, altNames] of Object.entries(alternatives)) {
            const normalizedAltNames = altNames.map(name => this.normalizePlaceName(name));
            
            if (normalizedAltNames.includes(normalizedInput) && normalizedAltNames.includes(normalizedExisting)) {
                return true;
            }
        }
        
        return false;
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

        // Check for duplicates before making API calls
        const duplicateInfo = this.checkForDuplicates(placeName);
        if (duplicateInfo.isDuplicate) {
            this.showAddPlaceMessage(
                `This place already exists in your list: "${duplicateInfo.existingPlace.name}" (${duplicateInfo.existingPlace.city || ''}, ${duplicateInfo.existingPlace.country || ''})`, 
                'warning'
            );
            
            // Highlight the existing place in the list
            this.highlightExistingPlace(duplicateInfo.existingPlace.id);
            return;
        }

        try {
            uiComponents.setButtonLoading(this.addPlaceBtn, true, 'Searching place info...');
            this.showAddPlaceMessage('Automatically searching for place information...', 'info');

            // Get place information from geocoding API
            const placeInfo = await this.getPlaceInformation(placeName);
            
            // Final duplicate check with the resolved place name
            const finalDuplicateInfo = this.checkForDuplicates(placeInfo.name || placeName);
            if (finalDuplicateInfo.isDuplicate) {
                this.showAddPlaceMessage(
                    `This place already exists in your list: "${finalDuplicateInfo.existingPlace.name}" (${finalDuplicateInfo.existingPlace.city || ''}, ${finalDuplicateInfo.existingPlace.country || ''})`, 
                    'warning'
                );
                this.highlightExistingPlace(finalDuplicateInfo.existingPlace.id);
                return;
            }
            
            const newPlace = {
                name: placeInfo.name || placeName,
                city: placeInfo.city || '',
                country: placeInfo.country || 'OTHER',
                category: placeInfo.category || 'User Added',
                description: placeInfo.description || 'Added by user.',
                coordinates: placeInfo.coordinates || null,
                mapQuery: placeInfo.mapQuery || placeName
            };

            await firebaseService.addPlace(newPlace);
            
            this.newPlaceNameInput.value = '';
            this.showAddPlaceMessage(
                `${newPlace.name} added successfully! ${newPlace.country !== 'OTHER' ? `(${newPlace.country})` : ''}`, 
                'success'
            );
            
            // Clear success message after delay
            setTimeout(() => {
                this.showAddPlaceMessage('', '');
            }, 5000);

        } catch (error) {
            console.error('[PlaceManager] Error adding place:', error);
            this.showAddPlaceMessage(MESSAGES.places.addError, 'error');
        } finally {
            uiComponents.setButtonLoading(this.addPlaceBtn, false, 'Add Place');
        }
    }

    /**
     * Highlight existing place in the list
     * @param {string} placeId - ID of the place to highlight
     */
    highlightExistingPlace(placeId) {
        // Remove any existing highlights
        document.querySelectorAll('.place-item.highlight-duplicate').forEach(item => {
            item.classList.remove('highlight-duplicate');
        });

        // Add highlight to the duplicate place
        const placeElement = document.querySelector(`[data-id="${placeId}"]`);
        if (placeElement) {
            placeElement.classList.add('highlight-duplicate');
            
            // Scroll to the highlighted place
            Utils.scrollToElement(placeElement, 100);
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                placeElement.classList.remove('highlight-duplicate');
            }, 3000);
        }
    }

    /**
     * Get place information from various sources
     * @param {string} placeName - Place name to search
     * @returns {Promise<Object>} Place information
     */
    async getPlaceInformation(placeName) {
        console.log(`[PlaceManager] Getting information for: ${placeName}`);
        
        try {
            // Try multiple sources for place information
            let placeInfo = await this.searchWithNominatim(placeName);
            
            if (!placeInfo.country || placeInfo.country === 'DİĞER') {
                // Fallback to Wikipedia/other sources
                const wikiInfo = await this.searchWithWikipedia(placeName);
                placeInfo = { ...placeInfo, ...wikiInfo };
            }
            
            return placeInfo;
            
        } catch (error) {
            console.error('[PlaceManager] Error getting place information:', error);
            return {
            name: placeName,
            city: '',
            country: 'OTHER',
            category: 'User Added',
            description: 'Added by user. Place information could not be found automatically.',
            coordinates: null,
            mapQuery: placeName
            };
        }
    }

    /**
     * Search place information using Nominatim (OpenStreetMap)
     * @param {string} placeName - Place name to search
     * @returns {Promise<Object>} Place information
     */
    async searchWithNominatim(placeName) {
        try {
            const encodedName = encodeURIComponent(placeName);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodedName}&format=json&limit=1&addressdetails=1&extratags=1&namedetails=1`,
                {
                    headers: {
                        'User-Agent': 'RotamBenim/1.0 (Travel Planning App)'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`Nominatim API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const place = data[0];
                const address = place.address || {};
                
                // Determine country and translate to Turkish
                let country = this.translateCountryName(
                    address.country || 
                    address.country_code?.toUpperCase() || 
                    'DİĞER'
                );
                
                // Get city information
                let city = address.city || 
                          address.town || 
                          address.village || 
                          address.municipality || 
                          address.county || '';
                
                // Generate description based on place type
                let description = this.generatePlaceDescription(place, address);
                let category = this.determinePlaceCategory(place, address);
                
                return {
                    name: place.display_name?.split(',')[0] || placeName,
                    city: city,
                    country: country,
                    category: category,
                    description: description,
                    coordinates: {
                        lat: parseFloat(place.lat),
                        lng: parseFloat(place.lon)
                    },
                    mapQuery: place.display_name || placeName
                };
            }
            
        } catch (error) {
            console.error('[PlaceManager] Nominatim search error:', error);
        }
        
        return {
            name: placeName,
            city: '',
            country: 'DİĞER',
            category: 'Kullanıcı Ekledi',
            description: 'Kullanıcı tarafından eklendi.',
            coordinates: null,
            mapQuery: placeName
        };
    }

    /**
     * Search place information using Wikipedia
     * @param {string} placeName - Place name to search
     * @returns {Promise<Object>} Place information
     */
    async searchWithWikipedia(placeName) {
        try {
            // Check if it's a known Turkish place first
            const turkishPlaceInfo = this.getTurkishPlaceInfo(placeName);
            if (turkishPlaceInfo) {
                return turkishPlaceInfo;
            }

            const encodedName = encodeURIComponent(placeName);
            
            // First, search for the page
            const searchResponse = await fetch(
                `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodedName}`
            );
            
            if (searchResponse.ok) {
                const data = await searchResponse.json();
                
                if (data.extract) {
                    // Try to extract country information from the description
                    const country = this.extractCountryFromText(data.extract);
                    
                    return {
                        description: data.extract.substring(0, 300) + (data.extract.length > 300 ? '...' : ''),
                        country: country || 'DİĞER',
                        category: this.determineCategoryFromDescription(data.extract)
                    };
                }
            }
            
        } catch (error) {
            console.error('[PlaceManager] Wikipedia search error:', error);
        }
        
        return {};
    }

    /**
     * Get information for known Turkish places
     * @param {string} placeName - Place name to check
     * @returns {Object|null} Place information if found
     */
    getTurkishPlaceInfo(placeName) {
        const turkishPlaces = {
            'pamukkale': {
                name: 'Pamukkale',
                city: 'Denizli',
                country: 'TÜRKİYE',
                category: 'Doğa / UNESCO / Termal / Tarihi',
                description: 'Pamukkale, Denizli ili sınırları içerisinde yer alan ve UNESCO Dünya Mirası Listesi\'nde bulunan doğal bir harikadır. Beyaz kireç taraçaları ve termal suları ile ünlü olan bu eşsiz oluşum, binlerce yıldır akan kalsiyum karbonat açıs��ndan zengin termal sularla şekillenmiştir.',
                coordinates: { lat: 37.9203, lng: 29.1206 }
            },
            'kapadokya': {
                name: 'Kapadokya',
                city: 'Nevşehir',
                country: 'TÜRKİYE',
                category: 'Doğa / UNESCO / Tarihi / Kültürel',
                description: 'Kapadokya, peri bacaları, yeraltı şehirleri ve kaya kiliselerle ünlü UNESCO Dünya Mirası alanıdır. Balon turları, at turları ve yürüyüş rotalarıyla ziyaretçilerine eşsiz deneyimler sunar.',
                coordinates: { lat: 38.6431, lng: 34.8287 }
            },
            'cappadocia': {
                name: 'Kapadokya',
                city: 'Nevşehir',
                country: 'TÜRKİYE',
                category: 'Doğa / UNESCO / Tarihi / Kültürel',
                description: 'Kapadokya, peri bacaları, yeraltı şehirleri ve kaya kiliselerle ünlü UNESCO Dünya Mirası alanıdır. Balon turları, at turları ve yürüyüş rotalarıyla ziyaretçilerine eşsiz deneyimler sunar.',
                coordinates: { lat: 38.6431, lng: 34.8287 }
            },
            'efes': {
                name: 'Efes Antik Kenti',
                city: 'İzmir',
                country: 'TÜRKİYE',
                category: 'Tarihi / UNESCO / Antik Kent / Kültürel',
                description: 'Efes, İzmir\'in Selçuk ilçesinde bulunan ve dünyanın en iyi korunmuş antik kentlerinden biri olan UNESCO Dünya Mirası alanıdır.',
                coordinates: { lat: 37.9395, lng: 27.3417 }
            },
            'ephesus': {
                name: 'Efes Antik Kenti',
                city: 'İzmir',
                country: 'TÜRKİYE',
                category: 'Tarihi / UNESCO / Antik Kent / Kültürel',
                description: 'Efes, İzmir\'in Selçuk ilçesinde bulunan ve dünyanın en iyi korunmuş antik kentlerinden biri olan UNESCO Dünya Mirası alanıdır.',
                coordinates: { lat: 37.9395, lng: 27.3417 }
            },
            'ayasofya': {
                name: 'Ayasofya',
                city: 'İstanbul',
                country: 'TÜRKİYE',
                category: 'Tarihi / Mimari / Dini / UNESCO',
                description: 'Ayasofya, İstanbul\'da bulunan ve hem Bizans hem de Osmanlı mimarisinin en önemli eserlerinden biri olan tarihi yapıdır.',
                coordinates: { lat: 41.0086, lng: 28.9802 }
            },
            'hagia sophia': {
                name: 'Ayasofya',
                city: 'İstanbul',
                country: 'TÜRKİYE',
                category: 'Tarihi / Mimari / Dini / UNESCO',
                description: 'Ayasofya, İstanbul\'da bulunan ve hem Bizans hem de Osmanlı mimarisinin en önemli eserlerinden biri olan tarihi yapıdır.',
                coordinates: { lat: 41.0086, lng: 28.9802 }
            },
            'kaleiçi': {
                name: 'Antalya Kaleiçi',
                city: 'Antalya',
                country: 'TÜRKİYE',
                category: 'Tarihi / Şehir Merkezi / Kültürel / Turistik',
                description: 'Kaleiçi, Antalya\'nın tarihi merkezi olup, Roma, Bizans, Selçuklu ve Osmanlı dönemlerinden kalma eserlerin bir arada bulunduğu büyüleyici bir bölgedir.',
                coordinates: { lat: 36.8841, lng: 30.7056 }
            },
            'topkapı': {
                name: 'Topkapı Sarayı',
                city: 'İstanbul',
                country: 'TÜRKİYE',
                category: 'Tarihi / Müze / Saray / UNESCO',
                description: 'Topkapı Sarayı, 15. yüzyıldan 19. yüzyıla kadar Osmanlı padişahlarının yaşadığı saray kompleksidir.',
                coordinates: { lat: 41.0115, lng: 28.9833 }
            },
            'galata kulesi': {
                name: 'Galata Kulesi',
                city: 'İstanbul',
                country: 'TÜRKİYE',
                category: 'Tarihi / Mimari / Manzara',
                description: 'Galata Kulesi, İstanbul\'un simgelerinden biri olan ve şehrin panoramik manzarasını sunan tarihi kuledir.',
                coordinates: { lat: 41.0256, lng: 28.9744 }
            },
            'troy': {
                name: 'Truva Antik Kenti',
                city: 'Çanakkale',
                country: 'TÜRKİYE',
                category: 'Tarihi / UNESCO / Antik Kent / Arkeoloji',
                description: 'Truva, Homeros\'un İlyada destanında geçen efsanevi şehrin kalıntılarının bulunduğu UNESCO Dünya Mirası alanıdır.',
                coordinates: { lat: 39.9576, lng: 26.2390 }
            },
            'truva': {
                name: 'Truva Antik Kenti',
                city: 'Çanakkale',
                country: 'TÜRKİYE',
                category: 'Tarihi / UNESCO / Antik Kent / Arkeoloji',
                description: 'Truva, Homeros\'un İlyada destanında geçen efsanevi şehrin kalıntılarının bulunduğu UNESCO Dünya Mirası alanıdır.',
                coordinates: { lat: 39.9576, lng: 26.2390 }
            }
        };

        const normalizedName = placeName.toLowerCase().trim();
        return turkishPlaces[normalizedName] || null;
    }

    /**
     * Translate country name to Turkish
     * @param {string} countryName - Country name in English
     * @returns {string} Country name in Turkish
     */
    translateCountryName(countryName) {
        const countryTranslations = {
            'Turkey': 'TÜRKİYE',
            'Greece': 'YUNANİSTAN',
            'Italy': 'İTALYA',
            'France': 'FRANSA',
            'Spain': 'İSPANYA',
            'Germany': 'ALMANYA',
            'Netherlands': 'HOLLANDA',
            'Belgium': 'BELÇİKA',
            'Switzerland': 'İSVİÇRE',
            'Austria': 'AVUSTURYA',
            'Czech Republic': 'ÇEK CUMHURİYETİ',
            'Hungary': 'MACARİSTAN',
            'Poland': 'POLONYA',
            'Croatia': 'HIRVATİSTAN',
            'Slovenia': 'SLOVENYA',
            'Portugal': 'PORTEKİZ',
            'United Kingdom': 'BİRLEŞİK KRALLIK',
            'Ireland': 'İRLANDA',
            'Norway': 'NORVEÇ',
            'Sweden': 'İSVEÇ',
            'Denmark': 'DANİMARKA',
            'Finland': 'FİNLANDİYA',
            'Iceland': 'İZLANDA',
            'Romania': 'ROMANYA',
            'Bulgaria': 'BULGARİSTAN',
            'Serbia': 'SIRBİSTAN',
            'Montenegro': 'KARADAĞ',
            'Bosnia and Herzegovina': 'BOSNA HERSEK',
            'Albania': 'ARNAVUTLUK',
            'North Macedonia': 'KUZEY MAKEDONYA',
            'Slovakia': 'SLOVAKYA',
            'Lithuania': 'LİTVANYA',
            'Latvia': 'LETONYA',
            'Estonia': 'ESTONYA',
            'Malta': 'MALTA',
            'Cyprus': 'KIBRIS',
            'Luxembourg': 'LÜKSEMBURG',
            'Monaco': 'MONAKO',
            'San Marino': 'SAN MARİNO',
            'Vatican City': 'VATİKAN',
            'Andorra': 'ANDORRA',
            'Liechtenstein': 'LİHTENŞTAYN',
            'TR': 'TÜRKİYE',
            'GR': 'YUNANİSTAN',
            'IT': 'İTALYA',
            'FR': 'FRANSA',
            'ES': 'İSPANYA',
            'DE': 'ALMANYA',
            'NL': 'HOLLANDA',
            'BE': 'BELÇİKA',
            'CH': 'İSVİÇRE',
            'AT': 'AVUSTURYA',
            'CZ': 'ÇEK CUMHURİYETİ',
            'HU': 'MACARİSTAN',
            'PL': 'POLONYA',
            'HR': 'HIRVATİSTAN',
            'SI': 'SLOVENYA',
            'PT': 'PORTEKİZ',
            'GB': 'BİRLEŞİK KRALLIK',
            'UK': 'BİRLEŞİK KRALLIK',
            'IE': 'İRLANDA',
            'NO': 'NORVEÇ',
            'SE': 'İSVEÇ',
            'DK': 'DANİMARKA',
            'FI': 'FİNLANDİYA',
            'IS': 'İZLANDA'
        };
        
        return countryTranslations[countryName] || countryName.toUpperCase();
    }

    /**
     * Extract country information from text
     * @param {string} text - Text to analyze
     * @returns {string|null} Country name
     */
    extractCountryFromText(text) {
        const countryKeywords = {
            'Türkiye': 'TÜRKİYE',
            'Turkey': 'TÜRKİYE',
            'Anadolu': 'TÜRKİYE',
            'Denizli': 'TÜRKİYE',
            'Nevşehir': 'TÜRKİYE',
            'İzmir': 'TÜRKİYE',
            'İstanbul': 'TÜRKİYE',
            'Antalya': 'TÜRKİYE',
            'Ankara': 'TÜRKİYE',
            'Bursa': 'TÜRKİYE',
            'Konya': 'TÜRKİYE',
            'Trabzon': 'TÜRKİYE',
            'Yunanistan': 'YUNANİSTAN',
            'Greece': 'YUNANİSTAN',
            'İtalya': 'İTALYA',
            'Italy': 'İTALYA',
            'Fransa': 'FRANSA',
            'France': 'FRANSA',
            'İspanya': 'İSPANYA',
            'Spain': 'İSPANYA',
            'Almanya': 'ALMANYA',
            'Germany': 'ALMANYA',
            'Hollanda': 'HOLLANDA',
            'Netherlands': 'HOLLANDA',
            'Belçika': 'BELÇİKA',
            'Belgium': 'BELÇİKA',
            'İsviçre': 'İSVİÇRE',
            'Switzerland': 'İSVİÇRE',
            'Avusturya': 'AVUSTURYA',
            'Austria': 'AVUSTURYA'
        };
        
        for (const [keyword, country] of Object.entries(countryKeywords)) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                return country;
            }
        }
        
        return null;
    }

    /**
     * Generate place description based on API data
     * @param {Object} place - Place data from API
     * @param {Object} address - Address data
     * @returns {string} Generated description
     */
    generatePlaceDescription(place, address) {
        const placeType = place.type || place.class || '';
        const category = place.category || '';
        const extratags = place.extratags || {};
        
        let description = '';
        
        // Add basic location info
        if (address.city || address.town) {
            description += `${address.city || address.town} şehrinde yer alan `;
        }
        
        // Add type-specific description
        if (placeType.includes('tourism') || category.includes('tourism')) {
            description += 'turistik bir destinasyon. ';
        } else if (placeType.includes('historic') || extratags.historic) {
            description += 'tarihi bir yer. ';
        } else if (placeType.includes('natural') || placeType.includes('peak') || placeType.includes('water')) {
            description += 'doğal bir güzellik. ';
        } else if (placeType.includes('building') || placeType.includes('architecture')) {
            description += 'mimari açıdan önemli bir yapı. ';
        } else {
            description += 'ilgi çekici bir yer. ';
        }
        
        // Add Wikipedia info if available
        if (extratags.wikipedia) {
            description += 'Detaylı bilgi için Wikipedia sayfasını ziyaret edebilirsiniz.';
        }
        
        return description || 'Place added by user.';
    }

    /**
     * Determine place category based on API data
     * @param {Object} place - Place data from API
     * @param {Object} address - Address data
     * @returns {string} Place category
     */
    determinePlaceCategory(place, address) {
        const placeType = place.type || place.class || '';
        const category = place.category || '';
        const extratags = place.extratags || {};
        
        if (placeType.includes('tourism') || category.includes('tourism')) {
            return 'Turistik / Gezilecek Yer';
        } else if (placeType.includes('historic') || extratags.historic) {
            return 'Tarihi / Kültürel';
        } else if (placeType.includes('natural') || placeType.includes('peak')) {
            return 'Doğa / Manzara';
        } else if (placeType.includes('water') || placeType.includes('beach')) {
            return 'Su Sporları / Plaj';
        } else if (placeType.includes('building') || placeType.includes('architecture')) {
            return 'Mimari / Yapı';
        } else if (placeType.includes('museum')) {
            return 'Müze / Kültür';
        } else if (placeType.includes('park') || placeType.includes('garden')) {
            return 'Park / Bahçe';
        } else {
            return 'User Added';
        }
    }

    /**
     * Determine category from description text
     * @param {string} description - Description text
     * @returns {string} Category
     */
    determineCategoryFromDescription(description) {
        const text = description.toLowerCase();
        
        if (text.includes('müze') || text.includes('museum')) {
            return 'Müze / Kültür';
        } else if (text.includes('tarihi') || text.includes('antik') || text.includes('historic')) {
            return 'Tarihi / Kültürel';
        } else if (text.includes('doğal') || text.includes('dağ') || text.includes('göl') || text.includes('natural')) {
            return 'Doğa / Manzara';
        } else if (text.includes('plaj') || text.includes('deniz') || text.includes('beach')) {
            return 'Su Sporları / Plaj';
        } else if (text.includes('park') || text.includes('bahçe') || text.includes('garden')) {
            return 'Park / Bahçe';
        } else if (text.includes('kilise') || text.includes('cami') || text.includes('tapınak')) {
            return 'Dini / Manevi';
        } else {
            return 'Turistik / Gezilecek Yer';
        }
    }

    /**
     * Open country selector modal
     */
    openCountrySelector() {
        if (!firebaseService.isAuthenticated()) {
            this.showAddCountryMessage(MESSAGES.auth.pleaseSignIn, 'error');
            return;
        }

        this.selectedCountries.clear();
        this.populateCountryGrid();
        this.updateSelectedCountryCount();
        this.countrySelectorModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close country selector modal
     */
    closeCountrySelector() {
        this.countrySelectorModal.classList.add('hidden');
        document.body.style.overflow = '';
        this.selectedCountries.clear();
        this.updateSelectedCountryCount();
    }

    /**
     * Populate country grid in modal
     */
    populateCountryGrid() {
        if (!this.countryGrid) return;

        this.countryGrid.innerHTML = '';

        Object.entries(COUNTRIES_DATABASE).forEach(([countryKey, countryData]) => {
            // Check if country already has places in user's list
            const hasCountryPlaces = this.places.some(place => 
                place.country && place.country.toLowerCase() === countryData.name.toLowerCase()
            );

            const countryCard = document.createElement('div');
            countryCard.className = `border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${hasCountryPlaces ? 'bg-gray-100 opacity-60' : 'hover:border-purple-300'}`;
            countryCard.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-grow">
                        <h4 class="font-semibold text-gray-900">${countryData.name}</h4>
                        <p class="text-sm text-gray-600">${countryData.places.length} places</p>
                        ${hasCountryPlaces ? '<p class="text-xs text-orange-600 mt-1">Already in your list</p>' : ''}
                    </div>
                    <div class="ml-3">
                        ${hasCountryPlaces ? 
                            '<svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' :
                            '<div class="w-6 h-6 border-2 border-gray-300 rounded"></div>'
                        }
                    </div>
                </div>
            `;

            if (!hasCountryPlaces) {
                countryCard.addEventListener('click', () => {
                    this.toggleCountrySelection(countryKey, countryData, countryCard);
                });
            }

            this.countryGrid.appendChild(countryCard);
        });
    }

    /**
     * Toggle country selection
     */
    toggleCountrySelection(countryKey, countryData, cardElement) {
        if (this.selectedCountries.has(countryKey)) {
            this.selectedCountries.delete(countryKey);
            cardElement.classList.remove('bg-purple-100', 'border-purple-500');
            cardElement.classList.add('hover:border-purple-300');
            const checkbox = cardElement.querySelector('div:last-child > div');
            checkbox.innerHTML = '<div class="w-6 h-6 border-2 border-gray-300 rounded"></div>';
        } else {
            this.selectedCountries.add(countryKey);
            cardElement.classList.add('bg-purple-100', 'border-purple-500');
            cardElement.classList.remove('hover:border-purple-300');
            const checkbox = cardElement.querySelector('div:last-child');
            checkbox.innerHTML = '<svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
        }
        this.updateSelectedCountryCount();
    }

    /**
     * Update selected country count
     */
    updateSelectedCountryCount() {
        if (this.selectedCountryCount) {
            this.selectedCountryCount.textContent = this.selectedCountries.size;
        }
        
        if (this.addSelectedCountriesBtn) {
            this.addSelectedCountriesBtn.disabled = this.selectedCountries.size === 0;
        }
    }

    /**
     * Handle adding selected countries
     */
    async handleAddSelectedCountries() {
        if (this.selectedCountries.size === 0) return;

        try {
            uiComponents.setButtonLoading(this.addSelectedCountriesBtn, true, 'Adding...');
            
            let totalAdded = 0;
            const countryNames = [];

            for (const countryKey of this.selectedCountries) {
                const countryData = COUNTRIES_DATABASE[countryKey];
                if (!countryData) continue;

                countryNames.push(countryData.name);
                
                // Add all places from the country
                for (const placeData of countryData.places) {
                    try {
                        // Check for duplicates before adding
                        const duplicateInfo = this.checkForDuplicates(placeData.name);
                        if (!duplicateInfo.isDuplicate) {
                            const newPlace = {
                                name: placeData.name,
                                city: placeData.city,
                                country: countryData.name,
                                category: placeData.category,
                                description: placeData.description,
                                coordinates: placeData.coordinates,
                                mapQuery: `${placeData.name}, ${placeData.city}`
                            };
                            await firebaseService.addPlace(newPlace);
                            totalAdded++;
                        }
                    } catch (error) {
                        console.error(`[PlaceManager] Error adding place ${placeData.name}:`, error);
                    }
                }
            }

            this.closeCountrySelector();
            
            // Show success message
            const message = `${countryNames.join(', ')} added successfully! ${totalAdded} places added to your list.`;
            this.showAddCountryMessage(message, 'success');
            
            // Clear success message after delay
            setTimeout(() => {
                this.showAddCountryMessage('', '');
            }, 5000);

            // Refresh the page to show new places
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('[PlaceManager] Error adding countries:', error);
            this.showAddCountryMessage(MESSAGES.countries.addError, 'error');
        } finally {
            uiComponents.setButtonLoading(this.addSelectedCountriesBtn, false, 'Add Selected Countries');
        }
    }

    /**
     * Get places for a country from the database
     * @param {string} countryName - Country name
     * @returns {Promise<Array>} Array of place objects
     */
    async getCountryPlaces(countryName) {
        const normalizedCountry = countryName.toLowerCase().trim();
        
        // Check if country exists in our database
        if (COUNTRIES_DATABASE[normalizedCountry]) {
            const countryData = COUNTRIES_DATABASE[normalizedCountry];
            return countryData.places.map(place => ({
                name: place.name,
                city: place.city,
                country: countryData.name,
                category: place.category,
                description: place.description,
                coordinates: place.coordinates,
                mapQuery: `${place.name}, ${place.city}`
            }));
        }

        // If not in database, try to search online
        return await this.searchCountryPlacesOnline(countryName);
    }

    /**
     * Search for country places online (fallback)
     * @param {string} countryName - Country name
     * @returns {Promise<Array>} Array of place objects
     */
    async searchCountryPlacesOnline(countryName) {
        try {
            // This is a simplified implementation
            // In a real app, you might use tourism APIs or Wikipedia
            const searchQuery = `${countryName} tourist attractions`;
            
            // For now, return empty array as we don't have a specific API
            // You could integrate with APIs like:
            // - Google Places API
            // - TripAdvisor API
            // - Wikipedia API for tourist attractions
            
            console.log(`[PlaceManager] Online search for ${countryName} not implemented yet`);
            return [];
            
        } catch (error) {
            console.error('[PlaceManager] Error searching country places online:', error);
            return [];
        }
    }

    /**
     * Show add country message
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, warning, info)
     */
    showAddCountryMessage(message, type) {
        if (!this.addCountryMessage) return;

        this.addCountryMessage.textContent = message;
        
        const typeClasses = {
            success: 'text-green-600',
            error: 'text-red-600',
            warning: 'text-yellow-600',
            info: 'text-blue-600'
        };

        this.addCountryMessage.className = `text-sm mt-2 ${typeClasses[type] || ''}`;
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
            warning: 'text-yellow-600',
            info: 'text-blue-600'
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
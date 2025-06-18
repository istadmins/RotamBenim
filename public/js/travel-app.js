/**
 * Main Travel App - Simplified and Fixed
 * Handles the core functionality without unnecessary complexity
 */

class TravelApp {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.places = [];
        this.selectedPlaces = [];
        this.isLoading = false;
        
        // DOM elements
        this.elements = {};
        
        // Firebase
        this.app = null;
        this.auth = null;
        this.db = null;
        this.unsubscribe = null;
    }

    /**
     * Initialize the travel app
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[TravelApp] Already initialized');
            return;
        }

        console.log('[TravelApp] Initializing...');

        try {
            this.setupDOMElements();
            await this.initializeFirebase();
            this.setupEventListeners();
            
            // Initialize enhanced place suggestions
            if (window.enhancedPlaceSuggestions) {
                window.enhancedPlaceSuggestions.initialize();
            }
            
            this.isInitialized = true;
            console.log('[TravelApp] Initialized successfully');
            
        } catch (error) {
            console.error('[TravelApp] Initialization failed:', error);
            this.showError('Failed to initialize app. Please refresh the page.');
        }
    }

    /**
     * Setup DOM elements
     */
    setupDOMElements() {
        this.elements = {
            // Auth elements
            authContainer: document.getElementById('authContainer'),
            googleSignInBtn: document.getElementById('googleSignInBtn'),
            userDisplay: document.getElementById('userDisplay'),
            userName: document.getElementById('userName'),
            userPhoto: document.getElementById('userPhoto'),
            signOutBtn: document.getElementById('signOutBtn'),
            authStatus: document.getElementById('authStatus'),
            
            // Place management
            newPlaceInput: document.getElementById('newPlaceNameInput'),
            addPlaceBtn: document.getElementById('addPlaceBtn'),
            addPlaceBtnText: document.getElementById('addPlaceBtnText'),
            addPlaceLoader: document.getElementById('addPlaceLoader'),
            addPlaceMessage: document.getElementById('addPlaceMessage'),
            
            // Places list
            placesList: document.getElementById('placesList'),
            placesListStatus: document.getElementById('placesListStatus'),
            filterCountry: document.getElementById('filterCountry'),
            filterVisited: document.getElementById('filterVisited'),
            
            // Route management
            generateRouteBtn: document.getElementById('generateRouteBtn'),
            routeLinkContainer: document.getElementById('routeLinkContainer'),
            
            // Map
            mapFrame: document.getElementById('mapFrame'),
            mapLocationName: document.getElementById('mapLocationName')
        };

        // Validate required elements
        const required = ['googleSignInBtn', 'newPlaceInput', 'addPlaceBtn', 'placesList'];
        for (const elementName of required) {
            if (!this.elements[elementName]) {
                console.warn(`[TravelApp] Required element not found: ${elementName}`);
            }
        }
    }

    /**
     * Initialize Firebase
     */
    async initializeFirebase() {
        if (!window.firebaseConfig) {
            throw new Error('Firebase configuration not found');
        }

        try {
            // Import Firebase modules
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
            const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
            const { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, onSnapshot, query, orderBy } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");

            this.app = initializeApp(window.firebaseConfig);
            this.auth = getAuth(this.app);
            this.db = getFirestore(this.app);

            // Store Firebase modules
            this.firebase = {
                GoogleAuthProvider,
                signInWithPopup,
                signOut,
                collection,
                doc,
                addDoc,
                getDocs,
                deleteDoc,
                updateDoc,
                onSnapshot,
                query,
                orderBy
            };

            // Setup auth state listener
            onAuthStateChanged(this.auth, (user) => {
                this.handleAuthStateChange(user);
            });

            console.log('[TravelApp] Firebase initialized');
        } catch (error) {
            console.error('[TravelApp] Firebase initialization error:', error);
            throw error;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Auth events
        if (this.elements.googleSignInBtn) {
            this.elements.googleSignInBtn.addEventListener('click', () => {
                this.handleSignIn();
            });
        }

        if (this.elements.signOutBtn) {
            this.elements.signOutBtn.addEventListener('click', () => {
                this.handleSignOut();
            });
        }

        // Add place events
        if (this.elements.addPlaceBtn) {
            this.elements.addPlaceBtn.addEventListener('click', () => {
                this.handleAddPlace();
            });
        }

        if (this.elements.newPlaceInput) {
            this.elements.newPlaceInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddPlace();
                }
            });
        }

        // Filter events
        if (this.elements.filterCountry) {
            this.elements.filterCountry.addEventListener('change', () => {
                this.renderPlaces();
            });
        }

        if (this.elements.filterVisited) {
            this.elements.filterVisited.addEventListener('change', () => {
                this.renderPlaces();
            });
        }

        // Route generation
        if (this.elements.generateRouteBtn) {
            this.elements.generateRouteBtn.addEventListener('click', () => {
                this.generateRoute();
            });
        }

        // Suggestion selection
        document.addEventListener('suggestionSelected', (e) => {
            this.handleSuggestionSelected(e.detail.suggestion);
        });
    }

    /**
     * Handle authentication state changes
     * @param {Object|null} user - Firebase user object
     */
    async handleAuthStateChange(user) {
        this.currentUser = user;

        if (user) {
            // User signed in
            this.showUserInterface(user);
            this.updateAuthStatus(`Welcome, ${user.displayName || 'User'}!`);
            
            // Load user's places
            await this.loadUserPlaces();
            
            // Enable add place functionality
            if (this.elements.addPlaceBtn) {
                this.elements.addPlaceBtn.disabled = false;
            }
            
            this.showToast(`Hello ${user.displayName || 'User'}! Your places are loading...`, 'success');
            
        } else {
            // User signed out
            this.showSignInInterface();
            this.updateAuthStatus('Please sign in with Google to manage your travel itinerary');
            
            // Clear data
            this.places = [];
            this.selectedPlaces = [];
            this.renderPlaces();
            
            // Disable add place functionality
            if (this.elements.addPlaceBtn) {
                this.elements.addPlaceBtn.disabled = true;
            }
            
            // Clean up Firestore listener
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
        }
    }

    /**
     * Show user interface (authenticated state)
     * @param {Object} user - Firebase user object
     */
    showUserInterface(user) {
        if (this.elements.userDisplay && this.elements.googleSignInBtn) {
            // Update user info
            if (this.elements.userName) {
                this.elements.userName.textContent = user.displayName || 'User';
            }
            
            if (this.elements.userPhoto && user.photoURL) {
                this.elements.userPhoto.src = user.photoURL;
                this.elements.userPhoto.classList.remove('hidden');
            }
            
            // Show user display, hide sign-in button
            this.elements.userDisplay.classList.remove('hidden');
            this.elements.userDisplay.classList.add('flex');
            this.elements.googleSignInBtn.classList.add('hidden');
        }
    }

    /**
     * Show sign-in interface (unauthenticated state)
     */
    showSignInInterface() {
        if (this.elements.userDisplay && this.elements.googleSignInBtn) {
            this.elements.userDisplay.classList.add('hidden');
            this.elements.userDisplay.classList.remove('flex');
            this.elements.googleSignInBtn.classList.remove('hidden');
        }
    }

    /**
     * Handle Google Sign-In
     */
    async handleSignIn() {
        if (!this.auth || !this.firebase) return;

        try {
            this.updateAuthStatus('Signing in...');
            this.setButtonLoading(this.elements.googleSignInBtn, true);
            
            const provider = new this.firebase.GoogleAuthProvider();
            await this.firebase.signInWithPopup(this.auth, provider);
            
        } catch (error) {
            console.error('[TravelApp] Sign-in error:', error);
            this.updateAuthStatus('Sign-in failed. Please try again.');
            this.showToast('Sign-in failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading(this.elements.googleSignInBtn, false);
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        if (!this.auth || !this.firebase) return;

        try {
            await this.firebase.signOut(this.auth);
            this.showToast('Signed out successfully', 'success');
        } catch (error) {
            console.error('[TravelApp] Sign-out error:', error);
            this.showToast('Sign-out failed', 'error');
        }
    }

    /**
     * Load user's places from Firestore
     */
    async loadUserPlaces() {
        if (!this.currentUser || !this.db) return;

        try {
            const placesRef = this.firebase.collection(this.db, `users/${this.currentUser.uid}/places`);
            const q = this.firebase.query(placesRef, this.firebase.orderBy('name'));
            
            // Set up real-time listener
            this.unsubscribe = this.firebase.onSnapshot(q, (snapshot) => {
                this.places = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                this.renderPlaces();
                this.updateCountryFilter();
                this.updateAuthStatus(`${this.places.length} places in your itinerary`);
                
                // Dispatch event for country image hovers
                document.dispatchEvent(new CustomEvent('placesListRendered'));
            });
            
        } catch (error) {
            console.error('[TravelApp] Error loading places:', error);
            this.showToast('Error loading your places', 'error');
        }
    }

    /**
     * Handle adding a new place
     */
    async handleAddPlace() {
        if (!this.currentUser) {
            this.showToast('Please sign in to add places', 'warning');
            return;
        }

        const placeName = this.elements.newPlaceInput?.value?.trim();
        if (!placeName) {
            this.showAddPlaceMessage('Please enter a place name', 'error');
            return;
        }

        try {
            this.setAddPlaceLoading(true);
            this.showAddPlaceMessage('Adding place...', 'info');

            const newPlace = {
                name: placeName,
                country: '',
                city: '',
                category: 'User Added',
                description: 'Added by user',
                visited: false,
                createdAt: new Date().toISOString(),
                userId: this.currentUser.uid
            };

            const placesRef = this.firebase.collection(this.db, `users/${this.currentUser.uid}/places`);
            await this.firebase.addDoc(placesRef, newPlace);

            this.elements.newPlaceInput.value = '';
            this.showAddPlaceMessage(`"${placeName}" added successfully!`, 'success');
            this.showToast(`${placeName} added to your itinerary`, 'success');

        } catch (error) {
            console.error('[TravelApp] Error adding place:', error);
            this.showAddPlaceMessage('Error adding place. Please try again.', 'error');
            this.showToast('Error adding place', 'error');
        } finally {
            this.setAddPlaceLoading(false);
        }
    }

    /**
     * Handle suggestion selection
     * @param {Object} suggestion - Selected suggestion
     */
    handleSuggestionSelected(suggestion) {
        // Auto-fill the input with suggestion data
        if (this.elements.newPlaceInput) {
            this.elements.newPlaceInput.value = suggestion.name;
        }
        
        // You could also auto-add the place here if desired
        // this.handleAddPlace();
    }

    /**
     * Render places list
     */
    renderPlaces() {
        if (!this.elements.placesList) return;

        const countryFilter = this.elements.filterCountry?.value || 'all';
        const visitedFilter = this.elements.filterVisited?.value || 'all';

        // Filter places
        let filteredPlaces = [...this.places];

        if (countryFilter !== 'all') {
            filteredPlaces = filteredPlaces.filter(place => place.country === countryFilter);
        }

        if (visitedFilter !== 'all') {
            filteredPlaces = filteredPlaces.filter(place => {
                return visitedFilter === 'visited' ? place.visited : !place.visited;
            });
        }

        // Clear list
        this.elements.placesList.innerHTML = '';

        if (filteredPlaces.length === 0) {
            const message = this.currentUser ? 
                'No places match your filters. Try adding some places!' : 
                'Please sign in to see your travel itinerary';
            
            this.elements.placesList.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500">${message}</p>
                </div>
            `;
            return;
        }

        // Group by country
        const placesByCountry = this.groupPlacesByCountry(filteredPlaces);

        // Render each country group
        Object.keys(placesByCountry).sort().forEach(country => {
            // Country header
            const countryHeader = document.createElement('h3');
            countryHeader.className = 'country-header';
            countryHeader.textContent = country || 'Unknown';
            this.elements.placesList.appendChild(countryHeader);

            // Places in this country
            placesByCountry[country].forEach(place => {
                const placeElement = this.createPlaceElement(place);
                this.elements.placesList.appendChild(placeElement);
            });
        });

        // Update route button
        this.updateRouteButton();
    }

    /**
     * Group places by country
     * @param {Array} places - Array of places
     * @returns {Object} Places grouped by country
     */
    groupPlacesByCountry(places) {
        return places.reduce((groups, place) => {
            const country = place.country || 'Unknown';
            if (!groups[country]) {
                groups[country] = [];
            }
            groups[country].push(place);
            return groups;
        }, {});
    }

    /**
     * Create place element
     * @param {Object} place - Place object
     * @returns {HTMLElement} Place element
     */
    createPlaceElement(place) {
        const isSelected = this.selectedPlaces.some(p => p.id === place.id);
        
        const placeElement = document.createElement('div');
        placeElement.className = `place-item p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${isSelected ? 'selected-for-route' : ''}`;
        placeElement.setAttribute('data-id', place.id);

        placeElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-grow">
                    <h4 class="text-lg font-semibold text-sky-700">${Utils.escapeHTML(place.name)}</h4>
                    <p class="text-sm text-gray-500">
                        ${place.city ? Utils.escapeHTML(place.city) + ', ' : ''}${Utils.escapeHTML(place.country || 'Unknown')}
                    </p>
                    ${place.category ? `<span class="category-tag">${Utils.escapeHTML(place.category)}</span>` : ''}
                    <p class="text-sm text-gray-600 mt-1">${Utils.escapeHTML(place.description || 'No description')}</p>
                    ${isSelected ? `<p class="text-xs text-blue-600 font-semibold mt-1">Selected for route</p>` : ''}
                </div>
                <div class="ml-4 flex-shrink-0 flex flex-col items-center space-y-2">
                    <div class="flex items-center">
                        <input type="checkbox" 
                               class="visited-checkbox h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
                               ${place.visited ? 'checked' : ''}
                               data-id="${place.id}">
                        <label class="text-xs text-gray-500 ml-1">${place.visited ? 'Visited' : 'Not visited'}</label>
                    </div>
                    <button class="delete-place-btn text-xs" data-id="${place.id}">Delete</button>
                </div>
            </div>
        `;

        // Event listeners
        placeElement.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox' || e.target.classList.contains('delete-place-btn')) {
                return;
            }
            this.togglePlaceSelection(place);
        });

        // Visited checkbox
        const checkbox = placeElement.querySelector('.visited-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            this.togglePlaceVisited(place.id, e.target.checked);
        });

        // Delete button
        const deleteBtn = placeElement.querySelector('.delete-place-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePlace(place);
        });

        return placeElement;
    }

    /**
     * Toggle place selection for route
     * @param {Object} place - Place object
     */
    togglePlaceSelection(place) {
        const index = this.selectedPlaces.findIndex(p => p.id === place.id);
        
        if (index > -1) {
            this.selectedPlaces.splice(index, 1);
        } else {
            this.selectedPlaces.push(place);
        }
        
        this.renderPlaces();
        this.updateMap(place);
    }

    /**
     * Toggle place visited status
     * @param {string} placeId - Place ID
     * @param {boolean} visited - Visited status
     */
    async togglePlaceVisited(placeId, visited) {
        if (!this.currentUser) return;

        try {
            const placeRef = this.firebase.doc(this.db, `users/${this.currentUser.uid}/places`, placeId);
            await this.firebase.updateDoc(placeRef, { visited });
        } catch (error) {
            console.error('[TravelApp] Error updating place:', error);
            this.showToast('Error updating place', 'error');
        }
    }

    /**
     * Delete place
     * @param {Object} place - Place object
     */
    async deletePlace(place) {
        if (!this.currentUser) return;

        if (!confirm(`Are you sure you want to delete "${place.name}"?`)) {
            return;
        }

        try {
            const placeRef = this.firebase.doc(this.db, `users/${this.currentUser.uid}/places`, place.id);
            await this.firebase.deleteDoc(placeRef);
            
            // Remove from selected places if it was selected
            this.selectedPlaces = this.selectedPlaces.filter(p => p.id !== place.id);
            
            this.showToast(`${place.name} deleted`, 'success');
        } catch (error) {
            console.error('[TravelApp] Error deleting place:', error);
            this.showToast('Error deleting place', 'error');
        }
    }

    /**
     * Generate route with selected places
     */
    generateRoute() {
        if (this.selectedPlaces.length < 2) {
            this.showToast('Select at least 2 places to create a route', 'warning');
            return;
        }

        // Create Google Maps URL
        let url = 'https://www.google.com/maps/dir/';
        this.selectedPlaces.forEach((place, index) => {
            const location = encodeURIComponent(`${place.name}${place.city ? ', ' + place.city : ''}${place.country ? ', ' + place.country : ''}`);
            url += location;
            if (index < this.selectedPlaces.length - 1) {
                url += '/';
            }
        });

        // Display route link
        if (this.elements.routeLinkContainer) {
            const placeNames = this.selectedPlaces.map(p => p.name).join(' → ');
            
            this.elements.routeLinkContainer.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="text-green-800 font-semibold mb-2">Route Created!</h4>
                    <p class="text-green-700 text-sm mb-3">${Utils.escapeHTML(placeNames)}</p>
                    <a href="${url}" target="_blank" rel="noopener noreferrer" 
                       class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        Open in Google Maps
                    </a>
                </div>
            `;
        }

        this.showToast('Route created successfully!', 'success');
    }

    /**
     * Update country filter options
     */
    updateCountryFilter() {
        if (!this.elements.filterCountry) return;

        const currentValue = this.elements.filterCountry.value;
        this.elements.filterCountry.innerHTML = '<option value="all">All Countries</option>';

        const countries = [...new Set(this.places.map(place => place.country).filter(Boolean))].sort();
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            this.elements.filterCountry.appendChild(option);
        });

        if (countries.includes(currentValue)) {
            this.elements.filterCountry.value = currentValue;
        }
    }

    /**
     * Update route button state
     */
    updateRouteButton() {
        if (!this.elements.generateRouteBtn) return;

        const count = this.selectedPlaces.length;
        this.elements.generateRouteBtn.disabled = count < 2;
        
        if (count === 0) {
            this.elements.generateRouteBtn.textContent = 'Select places to create route';
        } else if (count === 1) {
            this.elements.generateRouteBtn.textContent = 'Select one more place';
        } else {
            this.elements.generateRouteBtn.textContent = `Create route (${count} places)`;
        }
    }

    /**
     * Update map display
     * @param {Object} place - Place object
     */
    updateMap(place) {
        if (!this.elements.mapFrame) return;

        if (place) {
            const query = encodeURIComponent(`${place.name}${place.city ? ', ' + place.city : ''}${place.country ? ', ' + place.country : ''}`);
            this.elements.mapFrame.src = `https://maps.google.com/maps?q=${query}&output=embed`;
            
            if (this.elements.mapLocationName) {
                this.elements.mapLocationName.textContent = place.name;
            }
        }
    }

    /**
     * Set button loading state
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(button, loading) {
        if (!button) return;
        
        button.disabled = loading;
        if (loading) {
            button.classList.add('opacity-50');
        } else {
            button.classList.remove('opacity-50');
        }
    }

    /**
     * Set add place loading state
     * @param {boolean} loading - Loading state
     */
    setAddPlaceLoading(loading) {
        if (this.elements.addPlaceLoader) {
            if (loading) {
                this.elements.addPlaceLoader.classList.add('show');
            } else {
                this.elements.addPlaceLoader.classList.remove('show');
            }
        }
        
        if (this.elements.addPlaceBtnText) {
            this.elements.addPlaceBtnText.style.display = loading ? 'none' : 'inline';
        }
        
        if (this.elements.addPlaceBtn) {
            this.elements.addPlaceBtn.disabled = loading;
        }
    }

    /**
     * Show add place message
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, info)
     */
    showAddPlaceMessage(message, type = 'info') {
        if (!this.elements.addPlaceMessage) return;

        const colors = {
            success: 'text-green-600',
            error: 'text-red-600',
            info: 'text-blue-600'
        };

        this.elements.addPlaceMessage.textContent = message;
        this.elements.addPlaceMessage.className = `text-sm mt-2 ${colors[type] || colors.info}`;

        // Clear message after 3 seconds
        setTimeout(() => {
            if (this.elements.addPlaceMessage) {
                this.elements.addPlaceMessage.textContent = '';
            }
        }, 3000);
    }

    /**
     * Update auth status
     * @param {string} message - Status message
     */
    updateAuthStatus(message) {
        if (this.elements.authStatus) {
            this.elements.authStatus.textContent = message;
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type
     */
    showToast(message, type = 'info') {
        if (window.uiComponents) {
            window.uiComponents.showToast(message, type);
        } else {
            // Fallback to simple alert
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.updateAuthStatus(message);
        this.showToast(message, 'error');
    }

    /**
     * Get app status
     * @returns {Object} App status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isAuthenticated: !!this.currentUser,
            placesCount: this.places.length,
            selectedPlacesCount: this.selectedPlaces.length,
            isLoading: this.isLoading
        };
    }

    /**
     * Clean up the app
     */
    cleanup() {
        console.log('[TravelApp] Cleaning up...');
        
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        
        this.places = [];
        this.selectedPlaces = [];
        
        console.log('[TravelApp] Cleanup completed');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[TravelApp] DOM loaded, initializing app...');
    
    // Create global app instance
    window.travelApp = new TravelApp();
    
    try {
        await window.travelApp.initialize();
    } catch (error) {
        console.error('[TravelApp] Failed to initialize:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.travelApp) {
        window.travelApp.cleanup();
    }
});

// Export for debugging
window.TravelApp = TravelApp;
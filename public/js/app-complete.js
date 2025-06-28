// Complete Travel App with Multi-Language Support, Country Backgrounds, and Enhanced Features
class CompleteTravelApp {
    constructor() {
        this.currentUserId = null;
        this.placesData = [];
        this.selectedRouteOrder = [];
        this.currentCountryFilter = 'all';
        this.currentStatusFilter = 'all';
        this.currentLanguage = 'tr';
        this.countryBackgroundImage = null;
        this.isInitialized = false;
        
        // DOM Elements
        this.elements = {};
        
        // Initialize
        this.init();
    }
    
    async init() {
        try {
            await this.initializeLanguageManager();
            await this.initializeFirebase();
            this.setupEventListeners();
            this.setupUI();
            this.isInitialized = true;
            console.log('CompleteTravelApp initialized successfully');
        } catch (error) {
            console.error('Failed to initialize CompleteTravelApp:', error);
        }
    }
    
    async initializeLanguageManager() {
        // Initialize language manager
        if (window.languageManager) {
            this.currentLanguage = window.languageManager.getCurrentLanguage();
            window.languageManager.applyLanguage();
        }
    }
    
    async initializeFirebase() {
        if (typeof initializeApp === 'undefined') {
            console.error('Firebase not loaded');
            return;
        }
        
        try {
            // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyB6bIJOkooeRSKWtb09zdNmMIjHDbXCzYA",
                authDomain: "rotambenim.firebaseapp.com",
                projectId: "rotambenim",
                storageBucket: "rotambenim.firebasestorage.app",
                messagingSenderId: "374285362920",
                appId: "1:374285362920:web:b4058cf4a93e7337168b5d",
                measurementId: "G-0QVZ4LDYPJ"
            };
            
            this.app = initializeApp(firebaseConfig);
            this.auth = getAuth(this.app);
            this.db = getFirestore(this.app);
            
            // Set up auth state listener
            onAuthStateChanged(this.auth, (user) => {
                this.handleAuthStateChange(user);
            });
            
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }
    
    handleAuthStateChange(user) {
        if (user) {
            this.currentUserId = user.uid;
            this.updateAuthUI(user);
            this.loadUserPlaces();
        } else {
            this.currentUserId = null;
            this.updateAuthUI(null);
            this.clearPlacesData();
        }
    }
    
    updateAuthUI(user) {
        const authContainer = document.getElementById('authContainer');
        const googleSignInBtn = document.getElementById('googleSignInBtn');
        const userDisplay = document.getElementById('userDisplay');
        const userNameElement = document.getElementById('userName');
        const userPhotoElement = document.getElementById('userPhoto');
        const authStatusElement = document.getElementById('authStatus');
        
        if (user) {
            // User is signed in
            googleSignInBtn.classList.add('hidden');
            userDisplay.classList.remove('hidden');
            userNameElement.textContent = user.displayName || 'Kullanıcı';
            
            if (user.photoURL) {
                userPhotoElement.src = user.photoURL;
                userPhotoElement.classList.remove('hidden');
            } else {
                userPhotoElement.classList.add('hidden');
            }
            
            authStatusElement.textContent = window.languageManager.getText('welcome') + ', ' + (user.displayName || 'Kullanıcı');
        } else {
            // User is signed out
            googleSignInBtn.classList.remove('hidden');
            userDisplay.classList.add('hidden');
            authStatusElement.textContent = window.languageManager.getText('pleaseSignIn');
        }
    }
    
    setupEventListeners() {
        // Google Sign In
        const googleSignInBtn = document.getElementById('googleSignInBtn');
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', () => this.signInWithGoogle());
        }
        
        // Sign Out
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.signOut());
        }
        
        // Language selector
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Filters
        const countryFilter = document.getElementById('filterCountry');
        if (countryFilter) {
            countryFilter.addEventListener('change', (e) => {
                this.currentCountryFilter = e.target.value;
                this.updateCountryBackground();
                this.renderPlacesList();
            });
        }
        
        const statusFilter = document.getElementById('filterVisited');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentStatusFilter = e.target.value;
                this.renderPlacesList();
            });
        }
        
        // Add place
        const addPlaceBtn = document.getElementById('addPlaceBtn');
        if (addPlaceBtn) {
            addPlaceBtn.addEventListener('click', () => this.addNewPlace());
        }
        
        // Add country
        const addCountryBtn = document.getElementById('addCountryBtn');
        if (addCountryBtn) {
            addCountryBtn.addEventListener('click', () => this.addNewCountry());
        }
        
        // Create route
        const createRouteBtn = document.getElementById('generateRouteBtn');
        if (createRouteBtn) {
            createRouteBtn.addEventListener('click', () => this.createRoute());
        }
        
        // Tab switching
        const addPlaceTab = document.getElementById('addPlaceTab');
        const addCountryTab = document.getElementById('addCountryTab');
        
        if (addPlaceTab) {
            addPlaceTab.addEventListener('click', () => this.switchTab('place'));
        }
        if (addCountryTab) {
            addCountryTab.addEventListener('click', () => this.switchTab('country'));
        }
    }
    
    setupUI() {
        this.updateLanguageSelector();
        this.updateFilterOptions();
        this.updateTabContent();
    }
    
    updateLanguageSelector() {
        const languageSelector = document.getElementById('languageSelector');
        if (!languageSelector) return;
        
        languageSelector.innerHTML = '';
        const languages = window.languageManager.getSupportedLanguages();
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = window.languageManager.getText(lang === 'tr' ? 'turkish' : 'english');
            if (lang === this.currentLanguage) {
                option.selected = true;
            }
            languageSelector.appendChild(option);
        });
    }
    
    updateFilterOptions() {
        // Country filter will be populated when places are loaded
        const statusFilter = document.getElementById('filterVisited');
        if (statusFilter) {
            statusFilter.innerHTML = `
                <option value="all">${window.languageManager.getText('all')}</option>
                <option value="notvisited" selected>${window.languageManager.getText('notVisited')}</option>
                <option value="visited">${window.languageManager.getText('visited')}</option>
            `;
        }
    }
    
    updateTabContent() {
        const addPlaceTab = document.getElementById('addPlaceTab');
        const addCountryTab = document.getElementById('addCountryTab');
        const addPlaceContent = document.getElementById('addPlaceContent');
        const addCountryContent = document.getElementById('addCountryContent');
        
        if (addPlaceTab) addPlaceTab.textContent = window.languageManager.getText('addPlaceTab');
        if (addCountryTab) addCountryTab.textContent = window.languageManager.getText('addCountryTab');
        
        // Update placeholders
        const placeInput = document.getElementById('newPlaceNameInput');
        const countryInput = document.getElementById('newCountryNameInput');
        
        if (placeInput) placeInput.placeholder = window.languageManager.getText('placeNamePlaceholder');
        if (countryInput) countryInput.placeholder = window.languageManager.getText('placeholderCountry');
    }
    
    async signInWithGoogle() {
        if (!this.auth) {
            console.error('Auth not initialized');
            return;
        }
        
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(this.auth, provider);
        } catch (error) {
            console.error('Google sign in error:', error);
            const authStatus = document.getElementById('authStatus');
            if (authStatus) {
                authStatus.textContent = window.languageManager.getText('authError') + ': ' + error.message;
            }
        }
    }
    
    async signOut() {
        if (!this.auth) return;
        
        try {
            await signOut(this.auth);
            this.selectedRouteOrder = [];
            this.updateRouteButton();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }
    
    changeLanguage(language) {
        if (window.languageManager) {
            window.languageManager.setLanguage(language);
            this.currentLanguage = language;
            this.updateAllTexts();
        }
    }
    
    updateAllTexts() {
        // Update all text elements with new language
        this.updateLanguageSelector();
        this.updateFilterOptions();
        this.updateTabContent();
        this.renderPlacesList();
        this.updateRouteButton();
    }
    
    async loadUserPlaces() {
        if (!this.currentUserId || !this.db) return;
        
        try {
            const placesRef = collection(this.db, `artifacts/rotambenim/users/${this.currentUserId}/places`);
            const q = query(placesRef, orderBy("country"), orderBy("name"));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                this.placesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                this.populateCountryFilter();
                this.renderPlacesList();
                this.updateRouteButton();
            });
            
            // Store unsubscribe function
            this.unsubscribePlaces = unsubscribe;
            
        } catch (error) {
            console.error('Error loading places:', error);
        }
    }
    
    populateCountryFilter() {
        const countryFilter = document.getElementById('filterCountry');
        if (!countryFilter) return;
        
        const currentValue = countryFilter.value;
        countryFilter.innerHTML = `<option value="all">${window.languageManager.getText('allCountries')}</option>`;
        
        const countries = [...new Set(this.placesData.map(place => place.country).filter(Boolean))].sort();
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
        
        // Restore previous selection if still valid
        if (countries.includes(currentValue)) {
            countryFilter.value = currentValue;
        }
    }
    
    renderPlacesList() {
        const placesList = document.getElementById('placesList');
        if (!placesList) return;
        
        // Apply filters
        let filteredPlaces = [...this.placesData];
        
        if (this.currentCountryFilter !== 'all') {
            filteredPlaces = filteredPlaces.filter(place => place.country === this.currentCountryFilter);
        }
        
        if (this.currentStatusFilter !== 'all') {
            filteredPlaces = filteredPlaces.filter(place => {
                if (this.currentStatusFilter === 'visited') return place.visited;
                if (this.currentStatusFilter === 'notvisited') return !place.visited;
                return true;
            });
        }
        
        // Group by country
        const groupedPlaces = {};
        filteredPlaces.forEach(place => {
            const country = place.country || 'Diğer';
            if (!groupedPlaces[country]) {
                groupedPlaces[country] = [];
            }
            groupedPlaces[country].push(place);
        });
        
        // Render
        placesList.innerHTML = '';
        
        if (filteredPlaces.length === 0) {
            placesList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <p>${window.languageManager.getText('noPlacesFound')}</p>
                </div>
            `;
            return;
        }
        
        Object.keys(groupedPlaces).sort().forEach(country => {
            // Country header
            const countryHeader = document.createElement('div');
            countryHeader.className = 'country-header text-xl font-bold text-blue-800 mt-6 mb-3 pb-2 border-b-2 border-blue-200';
            countryHeader.textContent = country;
            placesList.appendChild(countryHeader);
            
            // Places in this country
            groupedPlaces[country].forEach(place => {
                const placeElement = this.createPlaceElement(place);
                placesList.appendChild(placeElement);
            });
        });
    }
    
    createPlaceElement(place) {
        const isSelected = this.selectedRouteOrder.find(p => p.id === place.id);
        
        const element = document.createElement('div');
        element.className = `place-item p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all duration-200 mb-3 ${
            isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
        }`;
        element.setAttribute('data-id', place.id);
        
        element.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-grow">
                    <h4 class="text-lg font-semibold text-gray-800">${place.name}</h4>
                    <p class="text-sm text-gray-600">${place.city ? place.city + ', ' : ''}${place.country}</p>
                    <div class="flex flex-wrap gap-1 mt-2">
                        ${place.category ? `<span class="category-tag">${place.category}</span>` : ''}
                    </div>
                    <p class="text-sm text-gray-700 mt-2 leading-relaxed">${place.description || ''}</p>
                    ${isSelected ? `<p class="text-xs text-blue-600 font-semibold mt-2">${window.languageManager.getText('routeOrder')}: ${isSelected.order}</p>` : ''}
                </div>
                <div class="ml-4 flex-shrink-0 flex flex-col items-center space-y-2">
                    <div class="flex items-center">
                        <input type="checkbox" id="visited-${place.id}" 
                               class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                               ${place.visited ? 'checked' : ''}>
                        <label for="visited-${place.id}" class="text-xs text-gray-500 ml-1">
                            ${place.visited ? window.languageManager.getText('visited') : window.languageManager.getText('notVisited')}
                        </label>
                    </div>
                    <button class="delete-btn text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                        ${window.languageManager.getText('delete')}
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners
        element.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox' || e.target.classList.contains('delete-btn')) {
                return;
            }
            this.togglePlaceSelection(place);
        });
        
        // Checkbox event
        const checkbox = element.querySelector(`#visited-${place.id}`);
        checkbox.addEventListener('change', (e) => {
            this.updatePlaceVisited(place.id, e.target.checked);
        });
        
        // Delete button event
        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            this.deletePlace(place);
        });
        
        return element;
    }
    
    togglePlaceSelection(place) {
        const existingIndex = this.selectedRouteOrder.findIndex(p => p.id === place.id);
        
        if (existingIndex > -1) {
            // Remove from selection
            this.selectedRouteOrder.splice(existingIndex, 1);
            // Update order numbers
            this.selectedRouteOrder.forEach((p, index) => p.order = index + 1);
        } else {
            // Add to selection
            this.selectedRouteOrder.push({
                id: place.id,
                name: place.name,
                order: this.selectedRouteOrder.length + 1
            });
        }
        
        this.renderPlacesList();
        this.updateRouteButton();
    }
    
    updateRouteButton() {
        const createRouteBtn = document.getElementById('generateRouteBtn');
        if (!createRouteBtn) return;
        
        if (this.selectedRouteOrder.length >= 2) {
            createRouteBtn.disabled = false;
            createRouteBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200';
        } else {
            createRouteBtn.disabled = true;
            createRouteBtn.className = 'bg-gray-400 text-white font-semibold py-2 px-4 rounded-md shadow-md cursor-not-allowed';
        }
        
        createRouteBtn.textContent = window.languageManager.getText('createRoute');
    }
    
    async updatePlaceVisited(placeId, visited) {
        if (!this.currentUserId || !this.db) return;
        
        try {
            const placeRef = doc(this.db, `artifacts/rotambenim/users/${this.currentUserId}/places`, placeId);
            await updateDoc(placeRef, { visited: visited });
        } catch (error) {
            console.error('Error updating place visited status:', error);
        }
    }
    
    async deletePlace(place) {
        if (!this.currentUserId || !this.db) return;
        
        if (!confirm(`${place.name} ${window.languageManager.getText('confirmDelete')}?`)) {
            return;
        }
        
        try {
            const placeRef = doc(this.db, `artifacts/rotambenim/users/${this.currentUserId}/places`, place.id);
            await deleteDoc(placeRef);
            
            // Remove from selected route if present
            this.selectedRouteOrder = this.selectedRouteOrder.filter(p => p.id !== place.id);
            this.selectedRouteOrder.forEach((p, index) => p.order = index + 1);
            
            this.updateRouteButton();
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    }
    
    createRoute() {
        if (this.selectedRouteOrder.length < 2) {
            alert(window.languageManager.getText('pleaseSelectPlaces'));
            return;
        }
        
        // Sort by order
        const sortedPlaces = [...this.selectedRouteOrder].sort((a, b) => a.order - b.order);
        
        // Create Google Maps URL
        let googleMapsUrl = "https://www.google.com/maps/dir/";
        
        sortedPlaces.forEach(place => {
            const placeData = this.placesData.find(p => p.id === place.id);
            if (placeData && placeData.mapQuery) {
                googleMapsUrl += encodeURIComponent(placeData.mapQuery) + "/";
            } else {
                googleMapsUrl += encodeURIComponent(place.name) + "/";
            }
        });
        
        // Display route link
        const routeContainer = document.getElementById('routeLinkContainer');
        if (routeContainer) {
            routeContainer.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-800 font-semibold mb-2">${window.languageManager.getText('routeCreated')}</p>
                    <a href="${googleMapsUrl}" target="_blank" 
                       class="text-blue-600 hover:text-blue-800 underline break-all">
                        ${googleMapsUrl}
                    </a>
                </div>
            `;
        }
        
        // Open in new tab
        window.open(googleMapsUrl, '_blank');
    }
    
    async addNewPlace() {
        if (!this.currentUserId) {
            alert(window.languageManager.getText('pleaseSignInToAdd'));
            return;
        }
        
        const placeInput = document.getElementById('newPlaceNameInput');
        const placeName = placeInput.value.trim();
        
        if (!placeName) {
            alert(window.languageManager.getText('enterPlaceName'));
            return;
        }
        
        // Check if place already exists
        const existingPlace = this.placesData.find(p => 
            p.name.toLowerCase() === placeName.toLowerCase()
        );
        
        if (existingPlace) {
            alert('Bu yer zaten listenizde mevcut!');
            return;
        }
        
        try {
            const newPlace = {
                name: placeName,
                city: '',
                country: '',
                description: 'Kullanıcı tarafından eklenen yer.',
                category: 'Kullanıcı Ekledi',
                visited: false,
                mapQuery: placeName,
                createdAt: new Date().toISOString(),
                userId: this.currentUserId
            };
            
            const placesRef = collection(this.db, `artifacts/rotambenim/users/${this.currentUserId}/places`);
            await addDoc(placesRef, newPlace);
            
            placeInput.value = '';
            alert(window.languageManager.getText('placeAdded'));
            
        } catch (error) {
            console.error('Error adding place:', error);
            alert('Yer eklenirken hata oluştu.');
        }
    }
    
    async addNewCountry() {
        if (!this.currentUserId) {
            alert(window.languageManager.getText('pleaseSignInToAdd'));
            return;
        }
        
        const countryInput = document.getElementById('newCountryNameInput');
        const countryName = countryInput.value.trim();
        
        if (!countryName) {
            alert(window.languageManager.getText('enterCountryName'));
            return;
        }
        
        // Check if country already exists in user's places
        const existingCountry = this.placesData.find(p => 
            p.country.toLowerCase() === countryName.toLowerCase()
        );
        
        if (existingCountry) {
            alert('Bu ülke zaten listenizde mevcut!');
            return;
        }
        
        // Get country data from service
        const countryData = window.countryPlaceService.getCountryData(countryName);
        
        if (!countryData) {
            alert('Bu ülke için veri bulunamadı. Lütfen farklı bir ülke deneyin.');
            return;
        }
        
        try {
            const placesRef = collection(this.db, `artifacts/rotambenim/users/${this.currentUserId}/places`);
            const batch = writeBatch(this.db);
            
            countryData.places.forEach(place => {
                const newPlace = {
                    ...place,
                    visited: false,
                    createdAt: new Date().toISOString(),
                    userId: this.currentUserId
                };
                
                const placeRef = doc(placesRef);
                batch.set(placeRef, newPlace);
            });
            
            await batch.commit();
            
            countryInput.value = '';
            alert(`${countryData.places.length} ${window.languageManager.getText('placeAdded')} ${countryName} ülkesinden!`);
            
        } catch (error) {
            console.error('Error adding country places:', error);
            alert('Ülke yerleri eklenirken hata oluştu.');
        }
    }
    
    switchTab(tab) {
        const addPlaceTab = document.getElementById('addPlaceTab');
        const addCountryTab = document.getElementById('addCountryTab');
        const addPlaceContent = document.getElementById('addPlaceContent');
        const addCountryContent = document.getElementById('addCountryContent');
        
        if (tab === 'place') {
            addPlaceTab.classList.add('bg-blue-600', 'text-white');
            addPlaceTab.classList.remove('bg-gray-200', 'text-gray-700');
            addCountryTab.classList.remove('bg-blue-600', 'text-white');
            addCountryTab.classList.add('bg-gray-200', 'text-gray-700');
            
            addPlaceContent.classList.remove('hidden');
            addCountryContent.classList.add('hidden');
        } else {
            addCountryTab.classList.add('bg-blue-600', 'text-white');
            addCountryTab.classList.remove('bg-gray-200', 'text-gray-700');
            addPlaceTab.classList.remove('bg-blue-600', 'text-white');
            addPlaceTab.classList.add('bg-gray-200', 'text-gray-700');
            
            addCountryContent.classList.remove('hidden');
            addPlaceContent.classList.add('hidden');
        }
    }
    
    async updateCountryBackground() {
        if (this.currentCountryFilter === 'all') {
            this.clearCountryBackground();
            return;
        }
        
        try {
            const imageData = await window.pexelsService.getCountryImage(this.currentCountryFilter);
            
            if (imageData) {
                this.setCountryBackground(imageData.url);
            } else {
                this.clearCountryBackground();
            }
        } catch (error) {
            console.error('Error updating country background:', error);
            this.clearCountryBackground();
        }
    }
    
    setCountryBackground(imageUrl) {
        const body = document.body;
        body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('${imageUrl}')`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundRepeat = 'no-repeat';
    }
    
    clearCountryBackground() {
        const body = document.body;
        body.style.backgroundImage = '';
        body.style.backgroundSize = '';
        body.style.backgroundPosition = '';
        body.style.backgroundAttachment = '';
        body.style.backgroundRepeat = '';
    }
    
    clearPlacesData() {
        this.placesData = [];
        this.selectedRouteOrder = [];
        this.renderPlacesList();
        this.updateRouteButton();
    }
    
    destroy() {
        if (this.unsubscribePlaces) {
            this.unsubscribePlaces();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.completeTravelApp = new CompleteTravelApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.completeTravelApp) {
        window.completeTravelApp.destroy();
    }
}); 
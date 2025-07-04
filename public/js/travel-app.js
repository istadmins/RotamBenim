/**
 * Enhanced Travel App
 * - Loads all user places from Firestore
 * - Adds detailed place info when adding a place
 * - Allows adding a country with 10+ famous places
 */

class TravelApp {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.places = [];
        this.selectedPlaces = [];
        this.isLoading = false;
        this.unsubscribe = null;
        this.countryDatabase = this.buildCountryDatabase();
        this.elements = {};
    }

    async initialize() {
        if (this.isInitialized) return;
        this.setupDOMElements();
        await this.initializeFirebase();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupDOMElements() {
        this.elements = {
            authContainer: document.getElementById('authContainer'),
            googleSignInBtn: document.getElementById('googleSignInBtn'),
            userDisplay: document.getElementById('userDisplay'),
            userName: document.getElementById('userName'),
            userPhoto: document.getElementById('userPhoto'),
            signOutBtn: document.getElementById('signOutBtn'),
            authStatus: document.getElementById('authStatus'),
            newPlaceInput: document.getElementById('newPlaceNameInput'),
            addPlaceBtn: document.getElementById('addPlaceBtn'),
            addPlaceBtnText: document.getElementById('addPlaceBtnText'),
            addPlaceLoader: document.getElementById('addPlaceLoader'),
            addPlaceMessage: document.getElementById('addPlaceMessage'),
            placesList: document.getElementById('placesList'),
            placesListStatus: document.getElementById('placesListStatus'),
            filterCountry: document.getElementById('filterCountry'),
            filterVisited: document.getElementById('filterVisited'),
            generateRouteBtn: document.getElementById('generateRouteBtn'),
            routeLinkContainer: document.getElementById('routeLinkContainer'),
            mapFrame: document.getElementById('mapFrame'),
            mapLocationName: document.getElementById('mapLocationName')
        };
    }

    async initializeFirebase() {
        if (!window.firebaseConfig) throw new Error('Firebase config missing');
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
        const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
        const { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, onSnapshot, query, orderBy } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
        this.app = initializeApp(window.firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.firebase = { GoogleAuthProvider, signInWithPopup, signOut, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, onSnapshot, query, orderBy };
        onAuthStateChanged(this.auth, (user) => this.handleAuthStateChange(user));
    }

    setupEventListeners() {
        if (this.elements.googleSignInBtn) this.elements.googleSignInBtn.onclick = () => this.handleSignIn();
        if (this.elements.signOutBtn) this.elements.signOutBtn.onclick = () => this.handleSignOut();
        if (this.elements.addPlaceBtn) this.elements.addPlaceBtn.onclick = () => this.handleAddPlace();
        if (this.elements.newPlaceInput) this.elements.newPlaceInput.onkeypress = (e) => { if (e.key === 'Enter') this.handleAddPlace(); };
    }

    async handleAuthStateChange(user) {
        this.currentUser = user;
        if (user) {
            this.showUserInterface(user);
            this.updateAuthStatus(`Welcome, ${user.displayName || 'User'}!`);
            await this.loadUserPlaces();
            if (this.elements.addPlaceBtn) this.elements.addPlaceBtn.disabled = false;
        } else {
            this.showSignInInterface();
            this.updateAuthStatus('Please sign in with Google to manage your travel itinerary');
            this.places = [];
            this.selectedPlaces = [];
            this.renderPlaces();
            if (this.unsubscribe) { this.unsubscribe(); this.unsubscribe = null; }
            if (this.elements.addPlaceBtn) this.elements.addPlaceBtn.disabled = true;
        }
    }

    showUserInterface(user) {
        if (this.elements.userDisplay && this.elements.googleSignInBtn) {
            if (this.elements.userName) this.elements.userName.textContent = user.displayName || 'User';
            if (this.elements.userPhoto && user.photoURL) { this.elements.userPhoto.src = user.photoURL; this.elements.userPhoto.classList.remove('hidden'); }
            this.elements.userDisplay.classList.remove('hidden');
            this.elements.userDisplay.classList.add('flex');
            this.elements.googleSignInBtn.classList.add('hidden');
        }
    }
    showSignInInterface() {
        if (this.elements.userDisplay && this.elements.googleSignInBtn) {
            this.elements.userDisplay.classList.add('hidden');
            this.elements.userDisplay.classList.remove('flex');
            this.elements.googleSignInBtn.classList.remove('hidden');
        }
    }
    async handleSignIn() {
        if (!this.auth || !this.firebase) return;
        try {
            this.updateAuthStatus('Signing in...');
            this.setButtonLoading(this.elements.googleSignInBtn, true);
            const provider = new this.firebase.GoogleAuthProvider();
            await this.firebase.signInWithPopup(this.auth, provider);
        } catch (error) {
            this.updateAuthStatus('Sign-in failed. Please try again.');
        } finally {
            this.setButtonLoading(this.elements.googleSignInBtn, false);
        }
    }
    async handleSignOut() {
        if (!this.auth || !this.firebase) return;
        try { await this.firebase.signOut(this.auth); } catch {}
    }

    async loadUserPlaces() {
        if (!this.currentUser || !this.db) return;
        const placesRef = this.firebase.collection(this.db, `users/${this.currentUser.uid}/places`);
        const q = this.firebase.query(placesRef, this.firebase.orderBy('country'), this.firebase.orderBy('name'));
        if (this.unsubscribe) { this.unsubscribe(); this.unsubscribe = null; }
        this.unsubscribe = this.firebase.onSnapshot(q, async (snapshot) => {
            this.places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // If user has no places and initial data exists, seed them
            if (this.places.length === 0 && window.initialPlacesData && Array.isArray(window.initialPlacesData)) {
                for (const place of window.initialPlacesData) {
                    await this.firebase.addDoc(placesRef, {
                        ...place,
                        createdAt: new Date().toISOString(),
                        userId: this.currentUser.uid
                    });
                }
                // After seeding, reload places (will trigger onSnapshot again)
                return;
            }
            this.renderPlaces();
            this.updateCountryFilter();
        });
    }

    async handleAddPlace() {
        if (!this.currentUser) return;
        const input = this.elements.newPlaceInput.value.trim();
        if (!input) return;
        // If input matches a country in the database, add all its places
        const countryPlaces = this.countryDatabase[input.toLowerCase()];
        if (countryPlaces) {
            await this.addCountryPlaces(input, countryPlaces);
            this.elements.newPlaceInput.value = '';
            return;
        }
        // Otherwise, add a single place with details
        const placeDetails = await this.getPlaceDetails(input);
        await this.addPlaceToFirestore(placeDetails);
        this.elements.newPlaceInput.value = '';
    }

    async addCountryPlaces(country, placesArr) {
        if (!this.currentUser) return;
        const placesRef = this.firebase.collection(this.db, `users/${this.currentUser.uid}/places`);
        for (const place of placesArr) {
            await this.firebase.addDoc(placesRef, {
                ...place,
                country: country,
                createdAt: new Date().toISOString(),
                userId: this.currentUser.uid
            });
        }
        this.showAddPlaceMessage(`${placesArr.length} places added for ${country}`, 'success');
    }

    async addPlaceToFirestore(place) {
        if (!this.currentUser) return;
        const placesRef = this.firebase.collection(this.db, `users/${this.currentUser.uid}/places`);
        await this.firebase.addDoc(placesRef, {
            ...place,
            createdAt: new Date().toISOString(),
            userId: this.currentUser.uid
        });
        this.showAddPlaceMessage(`"${place.name}" added!`, 'success');
    }

    async getPlaceDetails(input) {
        // Try to find in world/country database first (case-insensitive, partial match)
        const normalizedInput = input.trim().toLowerCase();
        let bestMatch = null;
        for (const country in this.countryDatabase) {
            for (const place of this.countryDatabase[country]) {
                if (place.name.toLowerCase() === normalizedInput) {
                    return place;
                }
                // Partial match (start or contains)
                if (!bestMatch && (place.name.toLowerCase().startsWith(normalizedInput) || place.name.toLowerCase().includes(normalizedInput))) {
                    bestMatch = place;
                }
            }
        }
        if (bestMatch) return bestMatch;
        // Fallback: minimal info
        return { name: input, city: '', country: '', category: 'User Added', description: 'Added by user', visited: false };
    }

    buildCountryDatabase() {
        // Example: Add more countries and places as needed
        return {
            japan: [
                { name: 'Tokyo Tower', city: 'Tokyo', country: 'Japan', category: 'Landmark', description: 'Iconic red and white tower in Tokyo', visited: false },
                { name: 'Fushimi Inari Shrine', city: 'Kyoto', country: 'Japan', category: 'Shrine', description: 'Famous for its thousands of vermilion torii gates', visited: false },
                { name: 'Mount Fuji', city: 'Honshu', country: 'Japan', category: 'Mountain', description: 'Japan’s tallest peak and iconic symbol', visited: false },
                { name: 'Kinkaku-ji', city: 'Kyoto', country: 'Japan', category: 'Temple', description: 'Golden Pavilion Zen Buddhist temple', visited: false },
                { name: 'Osaka Castle', city: 'Osaka', country: 'Japan', category: 'Castle', description: 'Historic castle with beautiful park', visited: false },
                { name: 'Hiroshima Peace Memorial', city: 'Hiroshima', country: 'Japan', category: 'Memorial', description: 'UNESCO site commemorating atomic bombing', visited: false },
                { name: 'Nara Park', city: 'Nara', country: 'Japan', category: 'Park', description: 'Famous for free-roaming deer and Todai-ji temple', visited: false },
                { name: 'Shibuya Crossing', city: 'Tokyo', country: 'Japan', category: 'Street', description: 'World’s busiest pedestrian crossing', visited: false },
                { name: 'Arashiyama Bamboo Grove', city: 'Kyoto', country: 'Japan', category: 'Nature', description: 'Scenic bamboo forest', visited: false },
                { name: 'Okinawa Churaumi Aquarium', city: 'Okinawa', country: 'Japan', category: 'Aquarium', description: 'One of the world’s largest aquariums', visited: false }
            ],
            turkey: [
                { name: 'Pamukkale', city: 'Denizli', country: 'Turkey', category: 'Natural Wonder', description: 'Famous white travertine terraces', visited: false },
                { name: 'Hagia Sophia', city: 'Istanbul', country: 'Turkey', category: 'Museum', description: 'Historic Byzantine basilica and mosque', visited: false },
                { name: 'Cappadocia', city: 'Nevşehir', country: 'Turkey', category: 'Region', description: 'Unique rock formations and hot air balloons', visited: false },
                { name: 'Ephesus', city: 'Izmir', country: 'Turkey', category: 'Ancient City', description: 'Ruins of a major Roman city', visited: false },
                { name: 'Blue Mosque', city: 'Istanbul', country: 'Turkey', category: 'Mosque', description: 'Sultan Ahmed Mosque, famous for blue tiles', visited: false },
                { name: 'Mount Ararat', city: 'Ağrı', country: 'Turkey', category: 'Mountain', description: 'Turkey’s highest peak, legendary resting place of Noah’s Ark', visited: false },
                { name: 'Sumela Monastery', city: 'Trabzon', country: 'Turkey', category: 'Monastery', description: 'Greek Orthodox monastery built into a cliff', visited: false },
                { name: 'Aspendos Theatre', city: 'Antalya', country: 'Turkey', category: 'Theatre', description: 'Well-preserved Roman theatre', visited: false },
                { name: 'Ani Ruins', city: 'Kars', country: 'Turkey', category: 'Ruins', description: 'Medieval Armenian city ruins', visited: false },
                { name: 'Grand Bazaar', city: 'Istanbul', country: 'Turkey', category: 'Market', description: 'One of the world’s largest and oldest covered markets', visited: false }
            ]
            // Add more countries as needed
        };
    }

    renderPlaces() {
        if (!this.elements.placesList) return;
        const countryFilter = this.elements.filterCountry?.value || 'all';
        const visitedFilter = this.elements.filterVisited?.value || 'all';
        let filteredPlaces = [...this.places];
        if (countryFilter !== 'all') filteredPlaces = filteredPlaces.filter(place => (place.country || '').toLowerCase() === countryFilter.toLowerCase());
        if (visitedFilter !== 'all') filteredPlaces = filteredPlaces.filter(place => visitedFilter === 'visited' ? place.visited : !place.visited);
        this.elements.placesList.innerHTML = '';
        if (filteredPlaces.length === 0) {
            this.elements.placesList.innerHTML = `<div class="text-center py-8"><p class="text-gray-500">No places found.</p></div>`;
            return;
        }
        // Group by country
        const placesByCountry = filteredPlaces.reduce((groups, place) => {
            const country = place.country || 'Unknown';
            if (!groups[country]) groups[country] = [];
            groups[country].push(place);
            return groups;
        }, {});
        Object.keys(placesByCountry).sort().forEach(country => {
            const countryHeader = document.createElement('h3');
            countryHeader.className = 'country-header';
            countryHeader.textContent = country;
            this.elements.placesList.appendChild(countryHeader);
            placesByCountry[country].forEach(place => {
                const placeElement = this.createPlaceElement(place);
                this.elements.placesList.appendChild(placeElement);
            });
        });
    }

    createPlaceElement(place) {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-item p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all duration-200';
        placeElement.setAttribute('data-id', place.id);
        placeElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-grow">
                    <h4 class="text-lg font-semibold text-sky-700">${Utils.escapeHTML(place.name)}</h4>
                    <p class="text-sm text-gray-500">${place.city ? Utils.escapeHTML(place.city) + ', ' : ''}${Utils.escapeHTML(place.country || 'Unknown')}</p>
                    ${place.category ? `<span class="category-tag">${Utils.escapeHTML(place.category)}</span>` : ''}
                    <p class="text-sm text-gray-600 mt-1">${Utils.escapeHTML(place.description || 'No description')}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex flex-col items-center space-y-2">
                    <div class="flex items-center">
                        <input type="checkbox" class="visited-checkbox h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" ${place.visited ? 'checked' : ''} data-id="${place.id}">
                        <label class="text-xs text-gray-500 ml-1">${place.visited ? 'Visited' : 'Not visited'}</label>
                    </div>
                    <button class="delete-place-btn text-xs" data-id="${place.id}">Delete</button>
                </div>
            </div>
        `;
        // Checkbox
        placeElement.querySelector('.visited-checkbox').addEventListener('change', (e) => {
            e.stopPropagation();
            this.togglePlaceVisited(place.id, e.target.checked);
        });
        // Delete
        placeElement.querySelector('.delete-place-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePlace(place);
        });
        return placeElement;
    }

    async togglePlaceVisited(placeId, visited) {
        if (!this.currentUser) return;
        const placeRef = this.firebase.doc(this.db, `users/${this.currentUser.uid}/places`, placeId);
        await this.firebase.updateDoc(placeRef, { visited });
    }
    async deletePlace(place) {
        if (!this.currentUser) return;
        if (!confirm(`Delete "${place.name}"?`)) return;
        const placeRef = this.firebase.doc(this.db, `users/${this.currentUser.uid}/places`, place.id);
        await this.firebase.deleteDoc(placeRef);
    }
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
        if (countries.includes(currentValue)) this.elements.filterCountry.value = currentValue;
    }
    setButtonLoading(button, loading) {
        if (!button) return;
        button.disabled = loading;
        if (loading) button.classList.add('opacity-50');
        else button.classList.remove('opacity-50');
    }
    showAddPlaceMessage(message, type = 'info') {
        if (!this.elements.addPlaceMessage) return;
        const colors = { success: 'text-green-600', error: 'text-red-600', info: 'text-blue-600' };
        this.elements.addPlaceMessage.textContent = message;
        this.elements.addPlaceMessage.className = `text-sm mt-2 ${colors[type] || colors.info}`;
        setTimeout(() => { if (this.elements.addPlaceMessage) this.elements.addPlaceMessage.textContent = ''; }, 3000);
    }
    updateAuthStatus(message) {
        if (this.elements.authStatus) this.elements.authStatus.textContent = message;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.travelApp = new TravelApp();
    await window.travelApp.initialize();
});
window.addEventListener('beforeunload', () => { if (window.travelApp) window.travelApp.cleanup && window.travelApp.cleanup(); });
window.TravelApp = TravelApp;

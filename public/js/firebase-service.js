/**
 * Firebase Service for RotamBenim application
 * Handles all Firebase operations including authentication and Firestore
 */

class FirebaseService {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.currentUser = null;
        this.isInitialized = false;
        this.authStateListeners = [];
        this.unsubscribers = new Map();
        
        // Configuration
        this.config = {
            appId: 'rotambenim',
            initialDataVersion: '1.5',
            retryAttempts: 3,
            retryDelay: 1000
        };
    }

    /**
     * Initialize Firebase services
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[FirebaseService] Already initialized');
            return;
        }

        try {
            console.log('[FirebaseService] Initializing Firebase...');

            // Validate configuration
            if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
                throw new Error('Firebase configuration is missing or invalid');
            }

            // Import Firebase modules dynamically
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
            const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
            const { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, onSnapshot, query, orderBy, setDoc, getDoc, writeBatch } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");

            // Initialize Firebase app
            this.app = initializeApp(firebaseConfig);
            this.auth = getAuth(this.app);
            this.db = getFirestore(this.app);

            // Store Firebase modules for later use
            this.firebaseModules = {
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
                orderBy,
                setDoc,
                getDoc,
                writeBatch
            };

            // Setup auth state listener
            this.setupAuthStateListener();

            this.isInitialized = true;
            console.log('[FirebaseService] Firebase initialized successfully');

        } catch (error) {
            console.error('[FirebaseService] Firebase initialization failed:', error);
            throw new Error(`Firebase initialization failed: ${error.message}`);
        }
    }

    /**
     * Setup authentication state listener
     */
    setupAuthStateListener() {
        const { onAuthStateChanged } = this.firebaseModules || {};
        if (!onAuthStateChanged) return;

        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            console.log('[FirebaseService] Auth state changed:', user ? `User: ${user.displayName}` : 'No user');
            
            // Notify all listeners
            this.authStateListeners.forEach(listener => {
                try {
                    listener(user);
                } catch (error) {
                    console.error('[FirebaseService] Error in auth state listener:', error);
                }
            });
        });
    }

    /**
     * Add auth state change listener
     * @param {Function} listener - Callback function
     */
    onAuthStateChange(listener) {
        if (typeof listener === 'function') {
            this.authStateListeners.push(listener);
        }
    }

    /**
     * Remove auth state change listener
     * @param {Function} listener - Callback function to remove
     */
    removeAuthStateListener(listener) {
        const index = this.authStateListeners.indexOf(listener);
        if (index > -1) {
            this.authStateListeners.splice(index, 1);
        }
    }

    /**
     * Sign in with Google
     * @returns {Promise<Object>} User object
     */
    async signInWithGoogle() {
        if (!this.isInitialized) {
            throw new Error('Firebase service not initialized');
        }

        try {
            const { GoogleAuthProvider, signInWithPopup } = this.firebaseModules;
            const provider = new GoogleAuthProvider();
            
            // Add additional scopes if needed
            provider.addScope('profile');
            provider.addScope('email');

            const result = await signInWithPopup(this.auth, provider);
            console.log('[FirebaseService] Google sign-in successful:', result.user.displayName);
            
            return result.user;
        } catch (error) {
            console.error('[FirebaseService] Google sign-in error:', error);
            
            // Handle specific error codes
            let userMessage = 'Sign-in failed. Please try again.';
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    userMessage = 'Sign-in was cancelled. Please try again.';
                    break;
                case 'auth/network-request-failed':
                    userMessage = 'Network error. Please check your internet connection.';
                    break;
                case 'auth/too-many-requests':
                    userMessage = 'Too many attempts. Please wait a moment and try again.';
                    break;
            }
            
            throw new Error(userMessage);
        }
    }

    /**
     * Sign out current user
     * @returns {Promise<void>}
     */
    async signOut() {
        if (!this.isInitialized) {
            throw new Error('Firebase service not initialized');
        }

        try {
            const { signOut } = this.firebaseModules;
            await signOut(this.auth);
            console.log('[FirebaseService] Sign-out successful');
        } catch (error) {
            console.error('[FirebaseService] Sign-out error:', error);
            throw new Error('Sign-out failed. Please try again.');
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user object
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get user's places collection reference
     * @returns {Object} Collection reference
     */
    getUserPlacesCollection() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const { collection } = this.firebaseModules;
        return collection(this.db, `artifacts/${this.config.appId}/users/${this.currentUser.uid}/places`);
    }

    /**
     * Get user's app state document reference
     * @param {string} docId - Document ID
     * @returns {Object} Document reference
     */
    getUserAppStateDoc(docId) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const { doc } = this.firebaseModules;
        return doc(this.db, `artifacts/${this.config.appId}/users/${this.currentUser.uid}/appState`, docId);
    }

    /**
     * Listen to places collection changes
     * @param {Function} callback - Callback function for changes
     * @returns {Function} Unsubscribe function
     */
    listenToPlaces(callback) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { onSnapshot, query, orderBy } = this.firebaseModules;
            const placesRef = this.getUserPlacesCollection();
            const q = query(placesRef, orderBy("country"), orderBy("name"));

            const unsubscribe = onSnapshot(q, 
                (snapshot) => {
                    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    callback(places);
                },
                (error) => {
                    console.error('[FirebaseService] Error listening to places:', error);
                    callback(null, error);
                }
            );

            // Store unsubscriber
            const listenerId = Utils.generateId();
            this.unsubscribers.set(listenerId, unsubscribe);

            return () => {
                unsubscribe();
                this.unsubscribers.delete(listenerId);
            };
        } catch (error) {
            console.error('[FirebaseService] Error setting up places listener:', error);
            throw error;
        }
    }

    /**
     * Add a new place
     * @param {Object} placeData - Place data
     * @returns {Promise<string>} Document ID
     */
    async addPlace(placeData) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { addDoc } = this.firebaseModules;
            const placesRef = this.getUserPlacesCollection();
            
            const newPlace = {
                ...placeData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: this.currentUser.uid
            };

            const docRef = await addDoc(placesRef, newPlace);
            console.log('[FirebaseService] Place added successfully:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('[FirebaseService] Error adding place:', error);
            throw new Error('Failed to add place. Please try again.');
        }
    }

    /**
     * Update a place
     * @param {string} placeId - Place ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<void>}
     */
    async updatePlace(placeId, updates) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { doc, updateDoc } = this.firebaseModules;
            const placeRef = doc(this.db, `artifacts/${this.config.appId}/users/${this.currentUser.uid}/places`, placeId);
            
            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(placeRef, updateData);
            console.log('[FirebaseService] Place updated successfully:', placeId);
        } catch (error) {
            console.error('[FirebaseService] Error updating place:', error);
            throw new Error('Failed to update place. Please try again.');
        }
    }

    /**
     * Delete a place
     * @param {string} placeId - Place ID
     * @returns {Promise<void>}
     */
    async deletePlace(placeId) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { doc, deleteDoc } = this.firebaseModules;
            const placeRef = doc(this.db, `artifacts/${this.config.appId}/users/${this.currentUser.uid}/places`, placeId);
            
            await deleteDoc(placeRef);
            console.log('[FirebaseService] Place deleted successfully:', placeId);
        } catch (error) {
            console.error('[FirebaseService] Error deleting place:', error);
            throw new Error('Failed to delete place. Please try again.');
        }
    }

    /**
     * Add multiple places in batch
     * @param {Array} placesData - Array of place data
     * @returns {Promise<void>}
     */
    async addPlacesBatch(placesData) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { writeBatch, doc, collection } = this.firebaseModules;
            const batch = writeBatch(this.db);
            const placesRef = collection(this.db, `artifacts/${this.config.appId}/users/${this.currentUser.uid}/places`);

            placesData.forEach(placeData => {
                const newPlaceRef = doc(placesRef);
                const newPlace = {
                    ...placeData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId: this.currentUser.uid
                };
                batch.set(newPlaceRef, newPlace);
            });

            await batch.commit();
            console.log('[FirebaseService] Batch places added successfully:', placesData.length);
        } catch (error) {
            console.error('[FirebaseService] Error adding places batch:', error);
            throw new Error('Failed to add places. Please try again.');
        }
    }

    /**
     * Check and initialize user data
     * @returns {Promise<void>}
     */
    async checkAndInitializeUserData() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { getDoc, setDoc } = this.firebaseModules;
            const flagDocRef = this.getUserAppStateDoc(`initialDataStatus_v${this.config.initialDataVersion}`);
            
            const docSnap = await getDoc(flagDocRef);
            
            if (!docSnap.exists()) {
                console.log('[FirebaseService] Initializing user data...');
                
                // Add initial data if available
                if (window.initialPlacesData && window.initialPlacesData.length > 0) {
                    await this.addPlacesBatch(window.initialPlacesData);
                }
                
                // Set initialization flag
                await setDoc(flagDocRef, { 
                    seeded: true, 
                    timestamp: new Date().toISOString(),
                    version: this.config.initialDataVersion
                });
                
                console.log('[FirebaseService] User data initialized successfully');
            }
        } catch (error) {
            console.error('[FirebaseService] Error initializing user data:', error);
            throw new Error('Failed to initialize user data.');
        }
    }

    /**
     * Get user statistics
     * @returns {Promise<Object>} User statistics
     */
    async getUserStats() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { getDocs } = this.firebaseModules;
            const placesRef = this.getUserPlacesCollection();
            const snapshot = await getDocs(placesRef);
            
            const places = snapshot.docs.map(doc => doc.data());
            const visitedCount = places.filter(place => place.visited).length;
            const countries = [...new Set(places.map(place => place.country).filter(Boolean))];
            
            return {
                totalPlaces: places.length,
                visitedPlaces: visitedCount,
                unvisitedPlaces: places.length - visitedCount,
                countries: countries.length,
                countriesList: countries.sort()
            };
        } catch (error) {
            console.error('[FirebaseService] Error getting user stats:', error);
            throw new Error('Failed to get user statistics.');
        }
    }

    /**
     * Export user data
     * @returns {Promise<Object>} Exported data
     */
    async exportUserData() {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            const { getDocs } = this.firebaseModules;
            const placesRef = this.getUserPlacesCollection();
            const snapshot = await getDocs(placesRef);
            
            const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return {
                user: {
                    uid: this.currentUser.uid,
                    displayName: this.currentUser.displayName,
                    email: this.currentUser.email
                },
                places,
                exportedAt: new Date().toISOString(),
                version: this.config.initialDataVersion
            };
        } catch (error) {
            console.error('[FirebaseService] Error exporting user data:', error);
            throw new Error('Failed to export user data.');
        }
    }

    /**
     * Clean up all listeners and resources
     */
    cleanup() {
        console.log('[FirebaseService] Cleaning up...');
        
        // Unsubscribe from all listeners
        this.unsubscribers.forEach(unsubscribe => {
            try {
                unsubscribe();
            } catch (error) {
                console.error('[FirebaseService] Error unsubscribing:', error);
            }
        });
        this.unsubscribers.clear();
        
        // Clear auth listeners
        this.authStateListeners = [];
        
        console.log('[FirebaseService] Cleanup completed');
    }

    /**
     * Get service status
     * @returns {Object} Service status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isAuthenticated: this.isAuthenticated(),
            currentUser: this.currentUser ? {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName,
                email: this.currentUser.email
            } : null,
            activeListeners: this.unsubscribers.size,
            authListeners: this.authStateListeners.length
        };
    }
}

// Create global instance
window.firebaseService = new FirebaseService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseService;
}
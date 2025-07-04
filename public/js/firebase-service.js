<<<<<<< HEAD
=======
/**
 * Firebase Service for RotamBenim application
 * Handles all Firebase operations including authentication and Firestore
 */

>>>>>>> parent of 19e146e (Initial commit)
class FirebaseService {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.currentUser = null;
<<<<<<< HEAD
        this.placesCollectionRef = null;
        this.unsubscribePlaces = null;
        this.authStateListeners = [];
        this.placesListeners = [];
        this.isInitialized = false;
=======
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
>>>>>>> parent of 19e146e (Initial commit)
    }

    /**
     * Initialize Firebase services
<<<<<<< HEAD
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        if (this.isInitialized) return true; // Zaten başlatıldıysa tekrar başlatma
        try {
            if (!firebaseConfig.apiKey) throw new Error('Firebase config eksik!');
            const { getApps, initializeApp } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
            let app;
            const apps = getApps();
            if (apps.length > 0) {
                app = apps[0];
            } else {
                app = initializeApp(firebaseConfig);
            }
            this.app = app;
            const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js');
            const { getFirestore } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js');
            this.auth = getAuth(this.app);
            this.db = getFirestore(this.app);
            onAuthStateChanged(this.auth, (user) => {
                this.currentUser = user;
                this.authStateListeners.forEach(fn => fn(user));
            });
            this.GoogleAuthProvider = GoogleAuthProvider;
            this.signInWithPopup = signInWithPopup;
            this.signOutFunc = signOut;
            this.isInitialized = true;
            return true;
        } catch (e) {
            Utils.logError(e, 'Firebase initialize');
            throw e;
=======
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
>>>>>>> parent of 19e146e (Initial commit)
        }
    }

    /**
<<<<<<< HEAD
     * Handle authentication state changes
     * @param {Object|null} user - Firebase user object
     */
    async handleAuthStateChange(user) {
        try {
            this.currentUser = user;
            
            if (user) {
                console.log('[FirebaseService] User signed in:', user.uid);
                
                // Set up Firestore collection reference for the user
                this.placesCollectionRef = this.GoogleAuthProvider.collection(
                    this.db, 
                    `artifacts/${APP_CONFIG.appId}/users/${user.uid}/places`
                );

                // Check and initialize user data
                await this.checkAndInitializeUserData();
                
                // Start listening to places
                await this.startPlacesListener();
                
            } else {
                console.log('[FirebaseService] User signed out');
                this.placesCollectionRef = null;
                this.stopPlacesListener();
            }

            // Notify all auth state listeners
=======
     * Setup authentication state listener
     */
    setupAuthStateListener() {
        const { onAuthStateChanged } = this.firebaseModules || {};
        if (!onAuthStateChanged) return;

        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            console.log('[FirebaseService] Auth state changed:', user ? `User: ${user.displayName}` : 'No user');
            
            // Notify all listeners
>>>>>>> parent of 19e146e (Initial commit)
            this.authStateListeners.forEach(listener => {
                try {
                    listener(user);
                } catch (error) {
                    console.error('[FirebaseService] Error in auth state listener:', error);
                }
            });
<<<<<<< HEAD

        } catch (error) {
            console.error('[FirebaseService] Error handling auth state change:', error);
            Utils.logError(error, { context: 'Auth state change', userId: user?.uid });
        }
=======
        });
>>>>>>> parent of 19e146e (Initial commit)
    }

    /**
     * Add auth state change listener
     * @param {Function} listener - Callback function
     */
<<<<<<< HEAD
    onAuthStateChange(fn) {
        this.authStateListeners.push(fn);
=======
    onAuthStateChange(listener) {
        if (typeof listener === 'function') {
            this.authStateListeners.push(listener);
        }
>>>>>>> parent of 19e146e (Initial commit)
    }

    /**
     * Remove auth state change listener
     * @param {Function} listener - Callback function to remove
     */
<<<<<<< HEAD
    offAuthStateChange(listener) {
=======
    removeAuthStateListener(listener) {
>>>>>>> parent of 19e146e (Initial commit)
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
<<<<<<< HEAD
        if (!this.auth) throw new Error('Firebase Auth yok!');
        const provider = new this.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        const result = await this.signInWithPopup(this.auth, provider);
        return result.user;
=======
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
>>>>>>> parent of 19e146e (Initial commit)
    }

    /**
     * Sign out current user
     * @returns {Promise<void>}
     */
    async signOut() {
<<<<<<< HEAD
        if (!this.auth) throw new Error('Firebase Auth yok!');
        await this.signOutFunc(this.auth);
    }

    /**
     * Check and initialize user data if needed
     * @returns {Promise<void>}
     */
    async checkAndInitializeUserData() {
        if (!this.currentUser || !this.db) {
            console.warn('[FirebaseService] Cannot initialize user data - user or db not available');
            return;
        }

        try {
            const userId = this.currentUser.uid;
            const flagDocRef = this.GoogleAuthProvider.doc(
                this.db, 
                `artifacts/${APP_CONFIG.appId}/users/${userId}/appState`, 
                `initialDataStatus_v${APP_CONFIG.currentDataVersion}`
            );

            const docSnap = await this.GoogleAuthProvider.getDoc(flagDocRef);
            
            if (!docSnap.exists() && INITIAL_PLACES_DATA.length > 0) {
                console.log('[FirebaseService] Initializing user data...');
                
                const batch = this.GoogleAuthProvider.writeBatch(this.db);
                
                INITIAL_PLACES_DATA.forEach(place => {
                    const newPlaceRef = this.GoogleAuthProvider.doc(
                        this.GoogleAuthProvider.collection(this.db, `artifacts/${APP_CONFIG.appId}/users/${userId}/places`)
                    );
                    batch.set(newPlaceRef, {
                        ...place,
                        createdAt: new Date().toISOString(),
                        userId: userId
                    });
                });

                await batch.commit();
                await this.GoogleAuthProvider.setDoc(flagDocRef, { 
                    seeded: true, 
                    timestamp: new Date().toISOString(),
                    version: APP_CONFIG.currentDataVersion
                });

                console.log(`[FirebaseService] Initialized ${INITIAL_PLACES_DATA.length} places for user`);
            }

        } catch (error) {
            console.error('[FirebaseService] Error initializing user data:', error);
            Utils.logError(error, { context: 'User data initialization', userId: this.currentUser?.uid });
=======
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
>>>>>>> parent of 19e146e (Initial commit)
        }
    }

    /**
<<<<<<< HEAD
     * Start listening to places collection
     * @returns {Promise<void>}
     */
    async startPlacesListener() {
        if (!this.placesCollectionRef) {
            console.warn('[FirebaseService] Cannot start places listener - collection ref not available');
            return;
        }

        try {
            // Stop existing listener if any
            this.stopPlacesListener();

            const q = this.GoogleAuthProvider.query(
                this.placesCollectionRef, 
                this.GoogleAuthProvider.orderBy("country"), 
                this.GoogleAuthProvider.orderBy("name")
            );

            this.unsubscribePlaces = this.GoogleAuthProvider.onSnapshot(q, 
                (snapshot) => {
                    const places = snapshot.docs.map(doc => ({ 
                        id: doc.id, 
                        ...doc.data() 
                    }));
                    
                    console.log(`[FirebaseService] Places updated: ${places.length} places`);
                    
                    // Notify all places listeners
                    this.placesListeners.forEach(listener => {
                        try {
                            listener(places);
                        } catch (error) {
                            console.error('[FirebaseService] Error in places listener:', error);
                        }
                    });
                },
                (error) => {
                    console.error('[FirebaseService] Places listener error:', error);
                    Utils.logError(error, { context: 'Places listener', userId: this.currentUser?.uid });
                    
                    // Notify listeners about the error
                    this.placesListeners.forEach(listener => {
                        try {
                            listener(null, error);
                        } catch (listenerError) {
                            console.error('[FirebaseService] Error in places error listener:', listenerError);
                        }
                    });
                }
            );

        } catch (error) {
            console.error('[FirebaseService] Error starting places listener:', error);
            Utils.logError(error, { context: 'Start places listener', userId: this.currentUser?.uid });
        }
    }

    /**
     * Stop listening to places collection
     */
    stopPlacesListener() {
        if (this.unsubscribePlaces) {
            console.log('[FirebaseService] Stopping places listener');
            this.unsubscribePlaces();
            this.unsubscribePlaces = null;
        }
    }

    /**
     * Add places change listener
     * @param {Function} listener - Callback function
     */
    onPlacesChange(listener) {
        this.placesListeners.push(listener);
    }

    /**
     * Remove places change listener
     * @param {Function} listener - Callback function to remove
     */
    offPlacesChange(listener) {
        const index = this.placesListeners.indexOf(listener);
        if (index > -1) {
            this.placesListeners.splice(index, 1);
        }
    }

    /**
     * Add a new place
     * @param {Object} placeData - Place data
     * @returns {Promise<string>} Document ID
     */
    async addPlace(placeData) {
        if (!this.placesCollectionRef || !this.currentUser) {
            throw new Error('User not authenticated or collection not available');
        }

        try {
            const newPlace = {
                ...placeData,
                createdAt: new Date().toISOString(),
                userId: this.currentUser.uid,
                visited: false,
                selectedForRoute: false
            };

            const docRef = await this.GoogleAuthProvider.addDoc(this.placesCollectionRef, newPlace);
            console.log('[FirebaseService] Place added:', docRef.id);
            
            return docRef.id;

        } catch (error) {
            console.error('[FirebaseService] Error adding place:', error);
            Utils.logError(error, { context: 'Add place', userId: this.currentUser?.uid, placeData });
            throw new Error(MESSAGES.places.addError + ': ' + error.message);
        }
    }

    /**
     * Update a place
     * @param {string} placeId - Place document ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<void>}
     */
    async updatePlace(placeId, updates) {
        if (!this.placesCollectionRef || !this.currentUser) {
            throw new Error('User not authenticated or collection not available');
        }

        try {
            const placeDocRef = this.GoogleAuthProvider.doc(this.db, this.placesCollectionRef.path, placeId);
            await this.GoogleAuthProvider.updateDoc(placeDocRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            
            console.log('[FirebaseService] Place updated:', placeId);

        } catch (error) {
            console.error('[FirebaseService] Error updating place:', error);
            Utils.logError(error, { context: 'Update place', userId: this.currentUser?.uid, placeId, updates });
            throw new Error(MESSAGES.places.updateError + ': ' + error.message);
        }
    }

    /**
     * Delete a place
     * @param {string} placeId - Place document ID
     * @returns {Promise<void>}
     */
    async deletePlace(placeId) {
        if (!this.placesCollectionRef || !this.currentUser) {
            throw new Error('User not authenticated or collection not available');
        }

        try {
            const placeDocRef = this.GoogleAuthProvider.doc(this.db, this.placesCollectionRef.path, placeId);
            await this.GoogleAuthProvider.deleteDoc(placeDocRef);
            
            console.log('[FirebaseService] Place deleted:', placeId);

        } catch (error) {
            console.error('[FirebaseService] Error deleting place:', error);
            Utils.logError(error, { context: 'Delete place', userId: this.currentUser?.uid, placeId });
            throw new Error(MESSAGES.places.deleteError + ': ' + error.message);
        }
    }

    /**
     * Get current user
     * @returns {Object|null} Current user object
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
=======
>>>>>>> parent of 19e146e (Initial commit)
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
<<<<<<< HEAD
     * Clean up resources
     */
    cleanup() {
        console.log('[FirebaseService] Cleaning up resources');
        this.stopPlacesListener();
        this.authStateListeners = [];
        this.placesListeners = [];
    }
}

// Create and export Firebase service instance
window.firebaseService = new FirebaseService();
=======
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
>>>>>>> parent of 19e146e (Initial commit)

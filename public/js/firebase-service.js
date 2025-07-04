class FirebaseService {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.currentUser = null;
        this.placesCollectionRef = null;
        this.unsubscribePlaces = null;
        this.authStateListeners = [];
        this.placesListeners = [];
        this.isInitialized = false;
    }

    /**
     * Initialize Firebase services
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
        }
    }

    /**
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
            this.authStateListeners.forEach(listener => {
                try {
                    listener(user);
                } catch (error) {
                    console.error('[FirebaseService] Error in auth state listener:', error);
                }
            });

        } catch (error) {
            console.error('[FirebaseService] Error handling auth state change:', error);
            Utils.logError(error, { context: 'Auth state change', userId: user?.uid });
        }
    }

    /**
     * Add auth state change listener
     * @param {Function} listener - Callback function
     */
    onAuthStateChange(fn) {
        this.authStateListeners.push(fn);
    }

    /**
     * Remove auth state change listener
     * @param {Function} listener - Callback function to remove
     */
    offAuthStateChange(listener) {
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
        if (!this.auth) throw new Error('Firebase Auth yok!');
        const provider = new this.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        const result = await this.signInWithPopup(this.auth, provider);
        return result.user;
    }

    /**
     * Sign out current user
     * @returns {Promise<void>}
     */
    async signOut() {
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
        }
    }

    /**
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
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
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
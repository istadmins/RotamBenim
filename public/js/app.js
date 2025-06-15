/**
 * Main application file for RotamBenim
 * Coordinates all modules and handles application lifecycle.
 * ---
 * v2.0 - Adapted for Full Page Scrolling UI
 */

// YENİ: FullpageManager'ı global scope'a ekliyoruz ki class içinden erişebilelim.
// Normalde bu tür bağımlılıklar daha farklı yönetilir (Dependency Injection), ama mevcut yapı için bu en basit çözüm.
// Eğer fullpage-manager.js bu dosyadan önce yükleniyorsa, window.FullpageManager olarak erişilebilir olacaktır.
const FullpageManager = window.FullpageManager;


class RotamBenimApp {
    constructor() {
        this.isInitialized = false;

        // DEĞİŞTİ: Modülleri yeni yapıya göre güncelliyoruz.
        // Eskiden kullanılan placeManager, routeManager gibi modüller artık doğrudan kullanılmıyor.
        // Onların işlevini FullpageManager üstleniyor.
        this.modules = {
            languageManager: window.languageManager,
            firebaseService: window.firebaseService,
            uiComponents: window.uiComponents,
            fullpageManager: null // Başlangıçta null, initialize içinde oluşturulacak
        };
        
        // DOM elements
        this.googleSignInBtn = document.getElementById('googleSignInBtn');
        this.userDisplay = document.getElementById('userDisplay');
        this.userNameElement = document.getElementById('userName');
        this.userPhotoElement = document.getElementById('userPhoto');
        this.signOutBtn = document.getElementById('signOutBtn');

        // YENİ: Yeni arayüzdeki durum ve yükleyici elemanları
        this.fullpageStatusElement = document.getElementById('fullpage-status');
        this.fullpageLoader = document.getElementById('fullpage-loader');
    }

    /**
     * Initialize the application
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('[RotamBenimApp] Application already initialized');
            return;
        }

        console.log('[RotamBenimApp] Starting application initialization...');
        
        try {
            // Dil ve UI bileşenlerini başlat
            this.modules.languageManager.initialize();
            this.modules.uiComponents.initialize();
            
            // YENİ: FullpageManager'ı pexelsApiKey ile başlatıyoruz.
            // config.js'de tanımlı olan pexelsApiKey'e eriştiğimizi varsayıyoruz.
            if (typeof pexelsApiKey !== 'undefined' && FullpageManager) {
                 this.modules.fullpageManager = new FullpageManager(pexelsApiKey);
            } else {
                throw new Error('Pexels API Key or FullpageManager is not defined.');
            }

            // Firebase servisini başlat
            await this.modules.firebaseService.initialize();
            
            // Kimlik doğrulama arayüzünü ayarla
            this.setupAuthenticationUI();
            
            // Hata ve performans izlemeyi ayarla
            this.setupErrorHandling();
            
            this.isInitialized = true;
            console.log('[RotamBenimApp] Application initialized successfully');
            
        } catch (error) {
            console.error('[RotamBenimApp] Application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Setup authentication UI
     */
    setupAuthenticationUI() {
        this.modules.firebaseService.onAuthStateChange((user) => {
            this.handleAuthStateChange(user);
        });

        if (this.googleSignInBtn) {
            this.googleSignInBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }

        if (this.signOutBtn) {
            this.signOutBtn.addEventListener('click', () => this.handleSignOut());
        }
    }

    /**
     * DEĞİŞTİ: Kimlik doğrulama durum değişikliklerini yeni arayüze göre yönetir.
     * @param {Object|null} user - Firebase user object
     */
    async handleAuthStateChange(user) {
        if (user) {
            // Kullanıcı giriş yaptı
            this.showUserInterface(user);
            this.updateFullpageStatus(`Welcome, ${user.displayName}! Loading destinations...`);
            this.fullpageLoader.classList.remove('hidden');

            try {
                // Firebase'den yerleri çek
                const places = await this.modules.firebaseService.getPlaces(user.uid);
                
                // FullpageManager'ı gelen yerlerle başlat
                await this.modules.fullpageManager.init(places);
                
                // Yükleme tamamlandı, yükleyiciyi gizle
                this.fullpageLoader.classList.add('hidden');
                
            } catch (error) {
                console.error('Error loading places for fullpage view:', error);
                this.updateFullpageStatus('Could not load your places. Please try again.');
                this.modules.uiComponents.showToast('Error loading places.', 'error');
            }

        } else {
            // Kullanıcı çıkış yaptı
            this.showSignInInterface();
            this.updateFullpageStatus('Please sign in with Google to see your destinations.');
            // Gerekirse fullpage-container içeriğini temizle
            const container = document.getElementById('fullpage-container');
            container.innerHTML = `
                <section class="h-screen w-full flex items-center justify-center scroll-snap-align-start bg-gray-900">
                    <div class="text-center">
                        <h2 class="text-4xl font-bold mb-4">Welcome to Your Travel List</h2>
                        <p id="fullpage-status">Please sign in with Google to see your destinations.</p>
                        <div id="fullpage-loader" class="loader mx-auto mt-4 hidden"></div>
                    </div>
                </section>
            `;
            // Elemanları yeniden ata
            this.fullpageStatusElement = document.getElementById('fullpage-status');
            this.fullpageLoader = document.getElementById('fullpage-loader');
        }
    }

    /**
     * Handle Google Sign-In
     */
    async handleGoogleSignIn() {
        try {
            this.updateFullpageStatus('Signing in...');
            this.googleSignInBtn.disabled = true;
            await this.modules.firebaseService.signInWithGoogle();
        } catch (error) {
            console.error('[RotamBenimApp] Google sign-in error:', error);
            this.updateFullpageStatus('Sign-in failed. Please try again.');
            this.modules.uiComponents.showToast(error.message || 'Sign-in failed.', 'error');
        } finally {
            this.googleSignInBtn.disabled = false;
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        try {
            await this.modules.firebaseService.signOut();
            this.modules.uiComponents.showToast('Successfully signed out.', 'success');
        } catch (error) {
            console.error('[RotamBenimApp] Sign-out error:', error);
            this.modules.uiComponents.showToast(error.message || 'Sign-out failed.', 'error');
        }
    }
    
    /**
     * Show user interface (authenticated state)
     */
    showUserInterface(user) {
        if (this.userDisplay && this.googleSignInBtn) {
            this.userNameElement.textContent = user.displayName || 'User';
            this.userPhotoElement.src = user.photoURL;
            this.userDisplay.style.display = 'flex';
            this.googleSignInBtn.style.display = 'none';
        }
    }

    /**
     * Show sign-in interface (unauthenticated state)
     */
    showSignInInterface() {
        if (this.userDisplay && this.googleSignInBtn) {
            this.userDisplay.style.display = 'none';
            this.googleSignInBtn.style.display = 'flex';
        }
    }

    /**
     * YENİ: Tam sayfa ekranındaki durum mesajını günceller.
     * @param {string} message - Status message
     */
    updateFullpageStatus(message) {
        if (this.fullpageStatusElement) {
            this.fullpageStatusElement.textContent = message;
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        const errorMessage = 'Failed to start application: ' + error.message;
        this.updateFullpageStatus(errorMessage);
        if (this.googleSignInBtn) this.googleSignInBtn.disabled = true;
        this.modules.uiComponents.showToast('Application could not start. Try refreshing.', 'error', 0);
    }

    /**
     * Setup global error handling (Bu fonksiyonu olduğu gibi koruyoruz)
     */
    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('[RotamBenimApp] Unhandled promise rejection:', event.reason);
            this.modules.uiComponents.showToast('An unexpected error occurred.', 'error');
        });

        window.addEventListener('error', (event) => {
            console.error('[RotamBenimApp] JavaScript error:', event.error);
        });
    }

    /**
     * ESKİ (Devre Dışı): Bu fonksiyonlar eski yapıya aitti. 
     * İhtiyaç duyulursa yeni yapıya adapte edilebilirler.
     */
    // getApplicationState() { ... }
    // exportApplicationData() { ... }
    // restart() { ... }
    // cleanup() { ... }
}


// DEĞİŞTİ: DOM yüklendiğinde uygulamayı başlatma mantığı basitleştirildi.
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[RotamBenimApp] DOM loaded, initializing application...');
    
    // Global app örneğini oluştur ve başlat
    window.rotamBenimApp = new RotamBenimApp();
    
    try {
        // Gerekli tüm script'lerin yüklendiğinden emin olmak için küçük bir gecikme
        setTimeout(async () => {
            await window.rotamBenimApp.initialize();
        }, 100);
    } catch (error) {
        console.error('[RotamBenimApp] Failed to initialize application from DOMContentLoaded:', error);
    }
});
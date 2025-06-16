/**
 * Country Background Manager
 * Handles dynamic background changes based on country selection
 */

class CountryBackgroundManager {
    constructor() {
        this.currentBackground = null;
        this.backgrounds = {};
        this.defaultBackground = 'bg-default';
        this.isInitialized = false;
    }

    /**
     * Initialize the background manager
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[CountryBackgroundManager] Initializing...');
        
        // Create background elements
        this.createBackgroundElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Set default background
        this.setBackground(this.defaultBackground);
        
        this.isInitialized = true;
        console.log('[CountryBackgroundManager] Initialized successfully');
    }

    /**
     * Create background elements for each country
     */
    createBackgroundElements() {
        // Define country backgrounds
        const countryClasses = [
            'bg-turkiye',
            'bg-italya',
            'bg-fransa',
            'bg-ispanya',
            'bg-yunanistan',
            'bg-almanya',
            'bg-default'
        ];
        
        // Create container for backgrounds if it doesn't exist
        let backgroundContainer = document.getElementById('backgroundContainer');
        if (!backgroundContainer) {
            backgroundContainer = document.createElement('div');
            backgroundContainer.id = 'backgroundContainer';
            document.body.appendChild(backgroundContainer);
        }
        
        // Create background elements
        countryClasses.forEach(bgClass => {
            const bgElement = document.createElement('div');
            bgElement.className = `country-background ${bgClass}`;
            backgroundContainer.appendChild(bgElement);
            
            // Store reference to the element
            this.backgrounds[bgClass] = bgElement;
        });
        
        // Add default overlay
        const overlay = document.createElement('div');
        overlay.className = 'bg-overlay';
        document.body.appendChild(overlay);
    }

    /**
     * Setup event listeners for country headers
     */
    setupEventListeners() {
        // Listen for DOM changes to attach listeners to new country headers
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    this.attachCountryHeaderListeners();
                }
            });
        });
        
        // Start observing the places list
        const placesList = document.getElementById('placesList');
        if (placesList) {
            observer.observe(placesList, { childList: true, subtree: true });
        }
        
        // Initial attachment
        this.attachCountryHeaderListeners();
    }

    /**
     * Attach event listeners to country headers
     */
    attachCountryHeaderListeners() {
        const countryHeaders = document.querySelectorAll('.country-header');
        
        countryHeaders.forEach(header => {
            // Skip if already processed
            if (header.dataset.bgProcessed) return;
            
            const countryName = header.textContent.trim().toLowerCase();
            const bgClass = this.getBackgroundClassForCountry(countryName);
            
            // Add hover listeners
            header.addEventListener('mouseenter', () => {
                this.setBackground(bgClass);
            });
            
            header.addEventListener('mouseleave', () => {
                this.setBackground(this.defaultBackground);
            });
            
            // Mark as processed
            header.dataset.bgProcessed = 'true';
        });
    }

    /**
     * Get background class for a country name
     * @param {string} countryName - Country name
     * @returns {string} Background class
     */
    getBackgroundClassForCountry(countryName) {
        const normalizedName = countryName.toLowerCase().trim();
        
        // Map country names to background classes
        const countryMap = {
            'türkiye': 'bg-turkiye',
            'turkey': 'bg-turkiye',
            'italia': 'bg-italya',
            'italy': 'bg-italya',
            'italya': 'bg-italya',
            'france': 'bg-fransa',
            'fransa': 'bg-fransa',
            'spain': 'bg-ispanya',
            'ispanya': 'bg-ispanya',
            'greece': 'bg-yunanistan',
            'yunanistan': 'bg-yunanistan',
            'germany': 'bg-almanya',
            'almanya': 'bg-almanya'
        };
        
        return countryMap[normalizedName] || this.defaultBackground;
    }

    /**
     * Set active background
     * @param {string} bgClass - Background class to activate
     */
    setBackground(bgClass) {
        // Deactivate current background
        if (this.currentBackground) {
            this.backgrounds[this.currentBackground].classList.remove('active');
        }
        
        // Activate new background
        if (this.backgrounds[bgClass]) {
            this.backgrounds[bgClass].classList.add('active');
            this.currentBackground = bgClass;
        } else {
            // Fallback to default
            this.backgrounds[this.defaultBackground].classList.add('active');
            this.currentBackground = this.defaultBackground;
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[CountryBackgroundManager] Cleaning up...');
        // Remove event listeners, clear intervals, etc.
    }
}

// Create and export background manager instance
window.countryBackgroundManager = new CountryBackgroundManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.countryBackgroundManager.initialize();
});
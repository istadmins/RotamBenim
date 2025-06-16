/**
 * Background Manager
 * Handles dynamic background images using Pexels API
 */

class BackgroundManager {
    constructor() {
        this.backgrounds = {};
        this.currentBackground = null;
        this.pexelsApiKey = ''; // Pexels API anahtarınızı buraya ekleyin
        this.isInitialized = false;
    }

    /**
     * Initialize the background manager
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[BackgroundManager] Initializing...');
        
        // Define country queries for Pexels
        this.countryQueries = {
            'turkiye': 'Turkey landmarks',
            'italya': 'Italy landmarks',
            'fransa': 'France landmarks',
            'ispanya': 'Spain landmarks',
            'yunanistan': 'Greece landmarks',
            'almanya': 'Germany landmarks',
            'default': 'World landmarks travel'
        };
        
        // Preload background images
        this.preloadBackgrounds();
        
        this.isInitialized = true;
        console.log('[BackgroundManager] Initialized successfully');
    }

    /**
     * Preload background images from Pexels
     */
    preloadBackgrounds() {
        Object.keys(this.countryQueries).forEach(country => {
            this.fetchBackgroundFromPexels(country);
        });
    }

    /**
     * Fetch background image from Pexels API
     * @param {string} country - Country key
     */
    fetchBackgroundFromPexels(country) {
        const query = this.countryQueries[country];
        
        // If no API key, use fallback images
        if (!this.pexelsApiKey) {
            console.log('[BackgroundManager] No Pexels API key provided, using fallback images');
            return;
        }
        
        fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
            headers: {
                'Authorization': this.pexelsApiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.photos && data.photos.length > 0) {
                const photo = data.photos[0];
                const imageUrl = photo.src.large2x || photo.src.large;
                
                // Create and store background element
                this.createBackgroundElement(country, imageUrl);
            }
        })
        .catch(error => {
            console.error('[BackgroundManager] Error fetching from Pexels:', error);
        });
    }

    /**
     * Create background element with image URL
     * @param {string} country - Country key
     * @param {string} imageUrl - Image URL
     */
    createBackgroundElement(country, imageUrl) {
        // Find all elements with this country class
        const elements = document.querySelectorAll(`.bg-${country}`);
        
        elements.forEach(element => {
            // Set background image
            element.style.backgroundImage = `url(${imageUrl})`;
        });
        
        // Store URL for future reference
        this.backgrounds[country] = imageUrl;
    }

    /**
     * Set active background for a section
     * @param {string} country - Country key
     */
    setBackground(country) {
        // If country doesn't exist in our queries, use default
        if (!this.countryQueries[country]) {
            country = 'default';
        }
        
        // If we haven't fetched this background yet, do it now
        if (!this.backgrounds[country]) {
            this.fetchBackgroundFromPexels(country);
        }
        
        this.currentBackground = country;
    }

    /**
     * Update background for a specific section
     * @param {HTMLElement} section - Section element
     * @param {string} country - Country key
     */
    updateSectionBackground(section, country) {
        if (!section) return;
        
        const bgElement = section.querySelector('.bg-overlay');
        if (bgElement) {
            // Remove all country classes
            Object.keys(this.countryQueries).forEach(key => {
                bgElement.classList.remove(`bg-${key}`);
            });
            
            // Add new country class
            bgElement.classList.add(`bg-${country}`);
            
            // Set background image if already loaded
            if (this.backgrounds[country]) {
                bgElement.style.backgroundImage = `url(${this.backgrounds[country]})`;
            } else {
                // Otherwise fetch it
                this.fetchBackgroundFromPexels(country);
            }
        }
    }
}

// Create and export background manager instance
window.backgroundManager = new BackgroundManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.backgroundManager.initialize();
});
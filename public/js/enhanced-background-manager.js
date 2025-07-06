/**
 * Enhanced Background Manager
 * Handles dynamic background images using Pexels API with country-based themes
 */

class EnhancedBackgroundManager {
    constructor() {
        this.backgrounds = new Map();
        this.currentCountry = null;
        this.pexelsApiKey = 'qLDLKWTXLouQCKT40OyIA982lb5kv0ftITaaLYbaOrx2FKNbGf5sZlYF'; // Replace with your Pexels API key
        this.isInitialized = false;
        this.cache = new Map();
        this.preloadedImages = new Set();
        
        // Country-specific search queries for Pexels
        this.countryQueries = {
            'turkey': ['Turkey landmarks', 'Istanbul', 'Cappadocia', 'Turkish architecture'],
            'france': ['France landmarks', 'Paris Eiffel Tower', 'French countryside', 'Loire Valley'],
            'italy': ['Italy landmarks', 'Rome Colosseum', 'Venice canals', 'Tuscany'],
            'spain': ['Spain landmarks', 'Barcelona Sagrada Familia', 'Madrid', 'Spanish architecture'],
            'greece': ['Greece landmarks', 'Santorini', 'Athens Parthenon', 'Greek islands'],
            'germany': ['Germany landmarks', 'Berlin', 'Neuschwanstein Castle', 'German architecture'],
            'netherlands': ['Netherlands landmarks', 'Amsterdam canals', 'Dutch windmills', 'Tulip fields'],
            'japan': ['Japan landmarks', 'Tokyo', 'Mount Fuji', 'Japanese temples'],
            'china': ['China landmarks', 'Great Wall of China', 'Beijing', 'Chinese architecture'],
            'usa': ['USA landmarks', 'New York skyline', 'Grand Canyon', 'American landmarks'],
            'uk': ['UK landmarks', 'London Big Ben', 'British countryside', 'English castles'],
            'bulgaria': ['Bulgaria landmarks', 'Sofia', 'Rila Monastery', 'Plovdiv', 'Bulgarian nature'],
            'default': ['World landmarks', 'Travel destinations', 'Beautiful landscapes', 'Adventure travel'],
            'austria': ['Austria landmarks', 'Vienna', 'Hallstatt', 'Austrian Alps'],
            'belgium': ['Belgium landmarks', 'Brussels', 'Bruges', 'Belgian architecture'],
            'croatia': ['Croatia landmarks', 'Dubrovnik', 'Plitvice Lakes', 'Croatian coast'],
            'czech republic': ['Czech Republic landmarks', 'Prague', 'Charles Bridge', 'Czech castles'],
            'denmark': ['Denmark landmarks', 'Copenhagen', 'Nyhavn', 'Danish castles'],
            'estonia': ['Estonia landmarks', 'Tallinn', 'Estonian nature', 'Estonian castles'],
            'finland': ['Finland landmarks', 'Helsinki', 'Finnish lakes', 'Lapland'],
            'hungary': ['Hungary landmarks', 'Budapest', 'Hungarian Parliament', 'Lake Balaton'],
            'ireland': ['Ireland landmarks', 'Dublin', 'Cliffs of Moher', 'Irish castles'],
            'latvia': ['Latvia landmarks', 'Riga', 'Krustkalns Bridge', 'Latvian countryside'],
            'lithuania': ['Lithuania landmarks', 'Vilnius', 'Gediminas Castle', 'Lithuanian castles'],
            'norway': ['Norway landmarks', 'Oslo', 'Trolltunga', 'Norwegian fjords'],
            'poland': ['Poland landmarks', 'Warsaw', 'Old Town', 'Polish architecture'],
            'portugal': ['Portugal landmarks', 'Lisbon', 'Sintra', 'Portuguese countryside'],
            'romania': ['Romania landmarks', 'Bucharest', 'Peles Castle', 'Transylvanian forests'],
            'slovakia': ['Slovakia landmarks', 'Bratislava', 'Old Town', 'Slovakian castles'],
            'slovenia': ['Slovenia landmarks', 'Ljubljana', 'Lake Bled', 'Slovenian Alps'],
            'sweden': ['Sweden landmarks', 'Stockholm', 'Gamla Stan', 'Swedish countryside'],
            'ukraine': ['Ukraine landmarks', 'Kyiv', 'St. Sophia Cathedral', 'Ukrainian countryside'],
            'avusturya': ['Austria landmarks', 'Vienna', 'Schönbrunn Palace', 'Austrian Alps'],
            'belçika': ['Belgium landmarks', 'Brussels', 'Manneken Pis', 'Belgian architecture'],
            'hirvatistan': ['Croatia landmarks', 'Zagreb', 'Plitvice Lakes', 'Croatian coast'],
            'çek cumhuriyeti': ['Czech Republic landmarks', 'Prague', 'Charles Bridge', 'Czech castles'],
            'danimarka': ['Denmark landmarks', 'Copenhagen', 'Tivoli Gardens', 'Danish countryside'],
            'estonya': ['Estonia landmarks', 'Tallinn', 'Pirita', 'Estonian nature'],
            'finlandiya': ['Finland landmarks', 'Helsinki', 'Kamppi', 'Finnish lakes'],
            'macaristan': ['Hungary landmarks', 'Budapest', 'Buda Castle', 'Lake Balaton'],
            'irlanda': ['Ireland landmarks', 'Dublin', 'Cliffs of Moher', 'Irish castles'],
            'letonya': ['Latvia landmarks', 'Riga', 'Rundale Palace', 'Latvian countryside'],
            'litvanya': ['Lithuania landmarks', 'Vilnius', 'Gediminas Castle', 'Lithuanian castles'],
            'norveç': ['Norway landmarks', 'Oslo', 'Trolltunga', 'Norwegian fjords'],
            'portekiz': ['Portugal landmarks', 'Lisbon', 'Sintra', 'Portuguese countryside'],
            'slovakya': ['Slovakia landmarks', 'Bratislava', 'Old Town', 'Slovakian castles'],
            'slovenya': ['Slovenia landmarks', 'Ljubljana', 'Lake Bled', 'Slovenian Alps'],
            'isveç': ['Sweden landmarks', 'Stockholm', 'Gamla Stan', 'Swedish countryside'],
            'ukrayna': ['Ukraine landmarks', 'Kyiv', 'St. Sophia Cathedral', 'Ukrainian countryside']
        };
        
        // Section to country mapping
        this.sectionCountryMap = {
            'hero': 'default',
            'add-place': 'turkey',
            'places-list': 'italy', 
            'map-view': 'france',
            'about': 'spain'
        };
        
        // Fallback images
        this.fallbackImages = {
            'turkey': 'https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'france': 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'italy': 'https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'spain': 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'greece': 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'germany': 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'netherlands': 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'japan': 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'china': 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'usa': 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'uk': 'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'bulgaria': 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'default': 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'austria': 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'belgium': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'croatia': 'https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1920',
            'czech republic': 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'denmark': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'estonia': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'finland': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'hungary': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'ireland': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'latvia': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'lithuania': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'norway': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'poland': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'portugal': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'romania': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'slovakia': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'slovenia': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'sweden': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
            'ukraine': 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920'
        };
    }

    /**
     * Initialize the background manager
     */
    async initialize() {
        if (this.isInitialized) return;
        
        console.log('[EnhancedBackgroundManager] Initializing...');
        
        try {
            // Check if we have a valid API key
            if (!this.pexelsApiKey || this.pexelsApiKey === 'YOUR_PEXELS_API_KEY') {
                console.warn('[EnhancedBackgroundManager] No valid Pexels API key provided, using fallback images');
                this.useFallbackImages();
            } else {
                // Preload backgrounds for all sections
                await this.preloadAllBackgrounds();
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('[EnhancedBackgroundManager] Initialized successfully');
            
        } catch (error) {
            console.error('[EnhancedBackgroundManager] Initialization failed:', error);
            this.useFallbackImages();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for place selection to update backgrounds
        document.addEventListener('placeSelected', (e) => {
            if (e.detail && e.detail.place && e.detail.place.country) {
                this.updateBackgroundForCountry(e.detail.place.country);
            }
        });

        // Listen for filter changes
        document.addEventListener('filterChanged', (e) => {
            if (e.detail && e.detail.country && e.detail.country !== 'all') {
                this.updateBackgroundForCountry(e.detail.country);
            }
        });

        // Listen for section changes from fullpage.js
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail && e.detail.sectionAnchor) {
                this.updateBackgroundForSection(e.detail.sectionAnchor);
            }
        });
    }

    /**
     * Preload backgrounds for all sections
     */
    async preloadAllBackgrounds() {
        const promises = Object.keys(this.sectionCountryMap).map(section => {
            const country = this.sectionCountryMap[section];
            return this.fetchBackgroundFromPexels(country, section);
        });

        try {
            await Promise.allSettled(promises);
            console.log('[EnhancedBackgroundManager] All backgrounds preloaded');
        } catch (error) {
            console.error('[EnhancedBackgroundManager] Error preloading backgrounds:', error);
        }
    }

    /**
     * Fetch background image from Pexels API
     * @param {string} country - Country key
     * @param {string} section - Section identifier (optional)
     */
    async fetchBackgroundFromPexels(country, section = null) {
        console.log('[fetchBackgroundFromPexels] country:', country, 'section:', section);
        // Check cache first
        const cacheKey = `${country}-${section || 'default'}`;
        if (this.cache.has(cacheKey)) {
            const cachedUrl = this.cache.get(cacheKey);
            console.log('[fetchBackgroundFromPexels] Using cachedUrl:', cachedUrl);
            this.applyBackground(country, cachedUrl, section);
            return cachedUrl;
        }

        const queries = this.countryQueries[country] || this.countryQueries.default;
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        console.log('[fetchBackgroundFromPexels] randomQuery:', randomQuery);
        
        try {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(randomQuery)}&per_page=15&orientation=landscape`,
                {
                    headers: {
                        'Authorization': this.pexelsApiKey
                    }
                }
            );
            console.log('[fetchBackgroundFromPexels] response.ok:', response.ok, 'status:', response.status);
            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('[fetchBackgroundFromPexels] data:', data);
            
            if (data.photos && data.photos.length > 0) {
                // Select a random photo from the results
                const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
                const imageUrl = randomPhoto.src.large2x || randomPhoto.src.large;
                console.log('[fetchBackgroundFromPexels] Got imageUrl:', imageUrl);
                // Cache the result
                this.cache.set(cacheKey, imageUrl);
                // Preload the image
                await this.preloadImage(imageUrl);
                // Apply the background
                this.applyBackground(country, imageUrl, section);
                return imageUrl;
            } else {
                console.warn('[fetchBackgroundFromPexels] No photos found for query:', randomQuery);
                throw new Error('No photos found');
            }
            
        } catch (error) {
            console.error(`[fetchBackgroundFromPexels] Error for ${country}:`, error);
            // Use fallback image
            const fallbackUrl = this.fallbackImages[country] || this.fallbackImages.default;
            console.log('[fetchBackgroundFromPexels] Using fallbackUrl:', fallbackUrl);
            this.applyBackground(country, fallbackUrl, section);
            return fallbackUrl;
        }
    }

    /**
     * Preload an image
     * @param {string} imageUrl - Image URL to preload
     */
    preloadImage(imageUrl) {
        return new Promise((resolve, reject) => {
            if (this.preloadedImages.has(imageUrl)) {
                resolve();
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.preloadedImages.add(imageUrl);
                resolve();
            };
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    /**
     * Apply background to elements
     * @param {string} country - Country key
     * @param {string} imageUrl - Image URL
     * @param {string} section - Section identifier (optional)
     */
    applyBackground(country, imageUrl, section = null) {
        if (section) {
            // Apply to specific section
            const sectionElement = document.querySelector(`[data-anchor="${section}"] .bg-overlay`);
            if (sectionElement) {
                this.setElementBackground(sectionElement, imageUrl);
            }
        } else {
            // Apply to all elements with this country class
            const elements = document.querySelectorAll(`.bg-${country}`);
            elements.forEach(element => {
                this.setElementBackground(element, imageUrl);
            });
        }

        // Store in backgrounds map
        this.backgrounds.set(country, imageUrl);
    }

    /**
     * Set background image for an element with smooth transition
     * @param {HTMLElement} element - Target element
     * @param {string} imageUrl - Image URL
     */
    setElementBackground(element, imageUrl) {
        console.log('[setElementBackground] element:', element, 'imageUrl:', imageUrl);
        if (!element) return;

        // Create a new image element to ensure it's loaded
        const img = new Image();
        img.onload = () => {
            // Add transition class
            element.style.transition = 'opacity 0.5s ease-in-out';
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.backgroundImage = `url(${imageUrl})`;
                element.style.opacity = '1';
            }, 250);
        };
        img.src = imageUrl;
    }

    /**
     * Update background for a specific country
     * @param {string} country - Country name
     */
    async updateBackgroundForCountry(country) {
        const normalizedCountry = this.normalizeCountryName(country);
        console.log('[updateBackgroundForCountry] country:', country, 'normalized:', normalizedCountry);
        if (this.currentCountry === normalizedCountry) return;
        this.currentCountry = normalizedCountry;
        const bgElement = document.querySelector('.bg-overlay');
        console.log('[updateBackgroundForCountry] bgElement:', bgElement);
        if (bgElement) {
            if (this.backgrounds.has(normalizedCountry)) {
                console.log('[updateBackgroundForCountry] Using cached background:', this.backgrounds.get(normalizedCountry));
                this.setElementBackground(bgElement, this.backgrounds.get(normalizedCountry));
            } else {
                console.log('[updateBackgroundForCountry] Fetching new background for:', normalizedCountry);
                await this.fetchBackgroundFromPexels(normalizedCountry);
            }
        }
    }

    /**
     * Update background for a specific section
     * @param {string} sectionAnchor - Section anchor
     */
    updateBackgroundForSection(sectionAnchor) {
        const country = this.sectionCountryMap[sectionAnchor] || 'default';
        
        // If we don't have this background yet, fetch it
        if (!this.backgrounds.has(country)) {
            this.fetchBackgroundFromPexels(country, sectionAnchor);
        }
    }

    /**
     * Normalize country name to match our keys
     * @param {string} country - Country name
     * @returns {string} Normalized country name
     */
    normalizeCountryName(country) {
        const countryMap = {
            'türkiye': 'turkey',
            'turkiye': 'turkey',
            'turkey': 'turkey',
            'fransa': 'france',
            'france': 'france',
            'italya': 'italy',
            'italy': 'italy',
            'ispanya': 'spain',
            'spain': 'spain',
            'yunanistan': 'greece',
            'greece': 'greece',
            'almanya': 'germany',
            'germany': 'germany',
            'hollanda': 'netherlands',
            'netherlands': 'netherlands',
            'japonya': 'japan',
            'japan': 'japan',
            'çin': 'china',
            'china': 'china',
            'amerika birleşik devletleri': 'usa',
            'usa': 'usa',
            'united states': 'usa',
            'birleşik krallık': 'uk',
            'uk': 'uk',
            'united kingdom': 'uk',
            'bulgaria': 'bulgaria',
            'austria': 'austria',
            'belçika': 'belgium',
            'belgium': 'belgium',
            'hirvatistan': 'croatia',
            'croatia': 'croatia',
            'çek cumhuriyeti': 'czech republic',
            'czech republic': 'czech republic',
            'danimarka': 'denmark',
            'denmark': 'denmark',
            'estonya': 'estonia',
            'estonia': 'estonia',
            'finlandiya': 'finland',
            'finland': 'finland',
            'macaristan': 'hungary',
            'hungary': 'hungary',
            'irlanda': 'ireland',
            'ireland': 'ireland',
            'letonya': 'latvia',
            'latvia': 'latvia',
            'litvanya': 'lithuania',
            'lithuania': 'lithuania',
            'norveç': 'norway',
            'norway': 'norway',
            'polonya': 'poland',
            'poland': 'poland',
            'portekiz': 'portugal',
            'portugal': 'portugal',
            'romanya': 'romania',
            'romania': 'romania',
            'slovakya': 'slovakia',
            'slovakia': 'slovakia',
            'slovenya': 'slovenia',
            'slovenia': 'slovenia',
            'isveç': 'sweden',
            'sweden': 'sweden',
            'ukrayna': 'ukraine',
            'ukraine': 'ukraine',
            'avusturya': 'austria',
            'austria': 'austria',
            'belçika': 'belgium',
            'belgium': 'belgium',
            'hirvatistan': 'croatia',
            'croatia': 'croatia',
            'çek cumhuriyeti': 'czech republic',
            'czech republic': 'czech republic',
            'danimarka': 'denmark',
            'denmark': 'denmark',
            'estonya': 'estonia',
            'estonia': 'estonia',
            'finlandiya': 'finland',
            'finland': 'finland',
            'macaristan': 'hungary',
            'hungary': 'hungary',
            'irlanda': 'ireland',
            'ireland': 'ireland',
            'letonya': 'latvia',
            'latvia': 'latvia',
            'litvanya': 'lithuania',
            'lithuania': 'lithuania',
            'norveç': 'norway',
            'norway': 'norway',
            'polonya': 'poland',
            'poland': 'poland',
            'portekiz': 'portugal',
            'portugal': 'portugal',
            'romanya': 'romania',
            'romania': 'romania',
            'slovakya': 'slovakia',
            'slovakia': 'slovakia',
            'slovenya': 'slovenia',
            'slovenia': 'slovenia',
            'isveç': 'sweden',
            'sweden': 'sweden',
            'ukrayna': 'ukraine',
            'ukraine': 'ukraine'
        };

        return countryMap[country.toLowerCase()] || 'default';
    }

    /**
     * Use fallback images when API is not available
     */
    useFallbackImages() {
        console.log('[EnhancedBackgroundManager] Using fallback images');
        
        Object.keys(this.sectionCountryMap).forEach(section => {
            const country = this.sectionCountryMap[section];
            const fallbackUrl = this.fallbackImages[country];
            this.applyBackground(country, fallbackUrl, section);
        });
    }

    /**
     * Get random background for a country
     * @param {string} country - Country key
     * @returns {Promise<string>} Image URL
     */
    async getRandomBackgroundForCountry(country) {
        const normalizedCountry = this.normalizeCountryName(country);
        return await this.fetchBackgroundFromPexels(normalizedCountry);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.preloadedImages.clear();
        console.log('[EnhancedBackgroundManager] Cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            cachedImages: this.cache.size,
            preloadedImages: this.preloadedImages.size,
            backgroundsLoaded: this.backgrounds.size
        };
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        console.log('[EnhancedBackgroundManager] Cleaning up...');
        this.clearCache();
        this.backgrounds.clear();
        this.currentCountry = null;
        this.isInitialized = false;
    }
}

// Create and export enhanced background manager instance
window.enhancedBackgroundManager = new EnhancedBackgroundManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedBackgroundManager.initialize();
});
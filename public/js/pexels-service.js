// Pexels API Service for Country Background Images
class PexelsService {
    constructor() {
        // Get API key from config
        this.apiKey = window.APP_CONFIG?.PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY';
        this.baseUrl = 'https://api.pexels.com/v1';
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        
        // Initialize with config
        this.initializeFromConfig();
    }
    
    // Initialize from config
    initializeFromConfig() {
        if (window.APP_CONFIG?.PEXELS_API_KEY && window.APP_CONFIG.PEXELS_API_KEY !== 'YOUR_PEXELS_API_KEY_HERE') {
            this.apiKey = window.APP_CONFIG.PEXELS_API_KEY;
        }
    }
    
    // Set API key (can be called from config)
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    
    // Get country background image
    async getCountryImage(countryName, options = {}) {
        const cacheKey = `country_${countryName.toLowerCase()}`;
        
        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }
        
        // Check if API key is valid
        if (!this.apiKey || this.apiKey === 'YOUR_PEXELS_API_KEY' || this.apiKey === 'YOUR_PEXELS_API_KEY_HERE') {
            console.warn('Pexels API key not configured. Please add your API key to config.js');
            return this.getFallbackImage(countryName);
        }
        
        try {
            const query = this.buildSearchQuery(countryName, options);
            const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
                headers: {
                    'Authorization': this.apiKey
                }
            });
            
            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.photos && data.photos.length > 0) {
                const photo = data.photos[0];
                const imageData = {
                    url: photo.src.large,
                    photographer: photo.photographer,
                    photographerUrl: photo.photographer_url,
                    alt: photo.alt || `${countryName} landscape`
                };
                
                // Cache the result
                this.setCache(cacheKey, imageData);
                return imageData;
            } else {
                console.warn(`No images found for ${countryName}`);
                return this.getFallbackImage(countryName);
            }
            
        } catch (error) {
            console.error('Error fetching country image:', error);
            return this.getFallbackImage(countryName);
        }
    }
    
    // Build search query for country
    buildSearchQuery(countryName, options = {}) {
        const queries = [
            `${countryName} landscape`,
            `${countryName} nature`,
            `${countryName} cityscape`,
            `${countryName} travel`
        ];
        
        // Add specific terms based on country
        const countrySpecificTerms = {
            'FRANSA': ['france', 'paris', 'eiffel tower', 'provence'],
            'İTALYA': ['italy', 'rome', 'venice', 'tuscany'],
            'İSPANYA': ['spain', 'barcelona', 'madrid', 'andalusia'],
            'ALMANYA': ['germany', 'berlin', 'munich', 'bavaria'],
            'HOLLANDA': ['netherlands', 'amsterdam', 'tulips', 'windmills'],
            'BELÇİKA': ['belgium', 'brussels', 'bruges', 'chocolate'],
            'İSVİÇRE': ['switzerland', 'alps', 'zurich', 'geneva'],
            'AVUSTURYA': ['austria', 'vienna', 'salzburg', 'tyrol'],
            'MACARİSTAN': ['hungary', 'budapest', 'danube', 'thermal baths'],
            'ÇEK CUMHURİYETİ': ['czech republic', 'prague', 'bohemia', 'castle'],
            'POLONYA': ['poland', 'warsaw', 'krakow', 'wieliczka'],
            'SLOVAKYA': ['slovakia', 'bratislava', 'tatras', 'castles'],
            'SLOVENYA': ['slovenia', 'ljubljana', 'lake bled', 'julian alps'],
            'HIRVATİSTAN': ['croatia', 'dubrovnik', 'plitvice', 'adriatic'],
            'YUNANİSTAN': ['greece', 'athens', 'santorini', 'acropolis'],
            'PORTEKİZ': ['portugal', 'lisbon', 'porto', 'algarve'],
            'İRLANDA': ['ireland', 'dublin', 'cliffs of moher', 'guinness'],
            'İNGİLTERE': ['england', 'london', 'stonehenge', 'cotswolds'],
            'İSKOÇYA': ['scotland', 'edinburgh', 'highlands', 'loch ness'],
            'GALLER': ['wales', 'cardiff', 'snowdonia', 'castles'],
            'NORVEÇ': ['norway', 'oslo', 'fjords', 'northern lights'],
            'İSVEÇ': ['sweden', 'stockholm', 'gothenburg', 'lapland'],
            'FİNLANDİYA': ['finland', 'helsinki', 'lapland', 'aurora'],
            'DANİMARKA': ['denmark', 'copenhagen', 'legoland', 'viking'],
            'İZLANDA': ['iceland', 'reykjavik', 'geysers', 'volcanoes']
        };
        
        const countryKey = countryName.toUpperCase();
        if (countrySpecificTerms[countryKey]) {
            queries.push(...countrySpecificTerms[countryKey]);
        }
        
        // Return the best query
        return queries[0];
    }
    
    // Get fallback image when API is not available
    getFallbackImage(countryName) {
        // Return a placeholder or default image
        return {
            url: `https://via.placeholder.com/1200x800/3b82f6/ffffff?text=${encodeURIComponent(countryName)}`,
            photographer: 'Placeholder',
            photographerUrl: '',
            alt: `${countryName} placeholder image`
        };
    }
    
    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }
    
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
    }
    
    // Get cache size
    getCacheSize() {
        return this.cache.size;
    }
    
    // Get multiple images for a country (for gallery)
    async getCountryImages(countryName, count = 5) {
        const cacheKey = `country_gallery_${countryName.toLowerCase()}`;
        
        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }
        
        if (!this.apiKey || this.apiKey === 'YOUR_PEXELS_API_KEY' || this.apiKey === 'YOUR_PEXELS_API_KEY_HERE') {
            return this.getFallbackGallery(countryName, count);
        }
        
        try {
            const query = this.buildSearchQuery(countryName);
            const response = await fetch(`${this.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, {
                headers: {
                    'Authorization': this.apiKey
                }
            });
            
            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.photos && data.photos.length > 0) {
                const images = data.photos.map(photo => ({
                    url: photo.src.large,
                    photographer: photo.photographer,
                    photographerUrl: photo.photographer_url,
                    alt: photo.alt || `${countryName} landscape`
                }));
                
                this.setCache(cacheKey, images);
                return images;
            } else {
                return this.getFallbackGallery(countryName, count);
            }
            
        } catch (error) {
            console.error('Error fetching country images:', error);
            return this.getFallbackGallery(countryName, count);
        }
    }
    
    // Get fallback gallery
    getFallbackGallery(countryName, count) {
        const images = [];
        for (let i = 0; i < count; i++) {
            images.push({
                url: `https://via.placeholder.com/1200x800/3b82f6/ffffff?text=${encodeURIComponent(countryName)}`,
                photographer: 'Placeholder',
                photographerUrl: '',
                alt: `${countryName} placeholder image ${i + 1}`
            });
        }
        return images;
    }
}

// Initialize Pexels service
window.pexelsService = new PexelsService(); 
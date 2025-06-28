// Pexels API Service for Country Background Images
class PexelsService {
    constructor() {
        // Pexels API Key - Replace with your actual API key
        this.apiKey = 'YOUR_PEXELS_API_KEY'; // TODO: Replace with actual API key
        this.baseUrl = 'https://api.pexels.com/v1';
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
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
        
        try {
            // Search for country-related images
            const searchQuery = `${countryName} landscape travel destination`;
            const response = await this.searchPhotos(searchQuery, {
                per_page: 1,
                orientation: 'landscape',
                size: 'large',
                ...options
            });
            
            if (response && response.photos && response.photos.length > 0) {
                const photo = response.photos[0];
                const imageData = {
                    url: photo.src.large,
                    photographer: photo.photographer,
                    photographerUrl: photo.photographer_url,
                    alt: photo.alt || `${countryName} landscape`,
                    width: photo.width,
                    height: photo.height
                };
                
                // Cache the result
                this.setCache(cacheKey, imageData);
                return imageData;
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching country image:', error);
            return null;
        }
    }
    
    // Search photos
    async searchPhotos(query, options = {}) {
        if (!this.apiKey || this.apiKey === 'YOUR_PEXELS_API_KEY') {
            console.warn('Pexels API key not configured. Using fallback images.');
            return this.getFallbackImage(query);
        }
        
        try {
            const params = new URLSearchParams({
                query: query,
                per_page: options.per_page || 1,
                page: options.page || 1
            });
            
            if (options.orientation) params.append('orientation', options.orientation);
            if (options.size) params.append('size', options.size);
            
            const response = await fetch(`${this.baseUrl}/search?${params}`, {
                headers: {
                    'Authorization': this.apiKey
                }
            });
            
            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Pexels API search error:', error);
            return this.getFallbackImage(query);
        }
    }
    
    // Get fallback image when API is not available
    getFallbackImage(query) {
        // Return a placeholder or default image
        return {
            photos: [{
                src: {
                    large: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'
                },
                photographer: 'Unsplash',
                photographer_url: 'https://unsplash.com',
                alt: 'Travel landscape',
                width: 800,
                height: 600
            }]
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
    
    clearCache() {
        this.cache.clear();
    }
    
    // Preload country images for better performance
    async preloadCountryImages(countries) {
        const promises = countries.map(country => 
            this.getCountryImage(country, { per_page: 1 })
        );
        
        try {
            await Promise.allSettled(promises);
            console.log('Country images preloaded');
        } catch (error) {
            console.error('Error preloading country images:', error);
        }
    }
}

// Global Pexels service instance
window.pexelsService = new PexelsService(); 
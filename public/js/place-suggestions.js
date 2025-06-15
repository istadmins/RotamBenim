/**
 * Place Suggestions Manager for RotamBenim application
 * Handles autocomplete functionality for place input
 */

class PlaceSuggestions {
    constructor() {
        this.suggestions = [];
        this.currentLanguage = 'tr';
        this.isInitialized = false;
        
        // DOM elements
        this.placeInput = null;
        this.suggestionsContainer = null;
        this.activeSuggestionIndex = -1;
        
        // Debounced search function
        this.debouncedSearch = Utils.debounce(this.searchSuggestions.bind(this), 300);
        
        // Popular places database for suggestions
        this.popularPlaces = this.buildPopularPlacesDatabase();
    }

    /**
     * Initialize place suggestions
     */
    initialize() {
        if (this.isInitialized) return;

        console.log('[PlaceSuggestions] Initializing...');
        
        this.placeInput = document.getElementById('newPlaceNameInput');
        if (!this.placeInput) {
            console.warn('[PlaceSuggestions] Place input not found');
            return;
        }

        this.createSuggestionsContainer();
        this.setupEventListeners();
        this.setupLanguageListener();
        
        this.isInitialized = true;
        console.log('[PlaceSuggestions] Initialized successfully');
    }

    /**
     * Create suggestions container
     */
    createSuggestionsContainer() {
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.id = 'placeSuggestions';
        this.suggestionsContainer.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto hidden';
        this.suggestionsContainer.style.top = '100%';
        this.suggestionsContainer.style.left = '0';
        
        // Make input container relative
        const inputContainer = this.placeInput.parentElement;
        inputContainer.style.position = 'relative';
        inputContainer.appendChild(this.suggestionsContainer);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Input events
        this.placeInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                this.debouncedSearch(query);
            } else {
                this.hideSuggestions();
            }
        });

        // Keyboard navigation
        this.placeInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Focus events
        this.placeInput.addEventListener('focus', () => {
            const query = this.placeInput.value.trim();
            if (query.length >= 2) {
                this.debouncedSearch(query);
            }
        });

        this.placeInput.addEventListener('blur', (e) => {
            // Delay hiding to allow click on suggestions
            setTimeout(() => {
                if (!this.suggestionsContainer.contains(document.activeElement)) {
                    this.hideSuggestions();
                }
            }, 150);
        });

        // Click outside to hide
        document.addEventListener('click', (e) => {
            if (!this.placeInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Setup language change listener
     */
    setupLanguageListener() {
        window.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.popularPlaces = this.buildPopularPlacesDatabase();
        });
    }

    /**
     * Build popular places database based on current language
     */
    buildPopularPlacesDatabase() {
        const places = [];
        
        // Add places from countries database
        Object.values(COUNTRIES_DATABASE).forEach(country => {
            country.places.forEach(place => {
                places.push({
                    name: place.name,
                    city: place.city,
                    country: country.name,
                    category: place.category,
                    description: place.description,
                    coordinates: place.coordinates,
                    source: 'database'
                });
            });
        });

        // Add additional popular places based on language
        if (this.currentLanguage === 'tr') {
            places.push(...this.getTurkishPopularPlaces());
        } else {
            places.push(...this.getEnglishPopularPlaces());
        }

        return places;
    }

    /**
     * Get Turkish popular places
     */
    getTurkishPopularPlaces() {
        return [
            { name: "Sümela Manastırı", city: "Trabzon", country: "TÜRKİYE", category: "Tarihi / Dini / Bizans / Doğa", description: "Sümela Manastırı, Trabzon'un Maçka ilçesinde Altındere Vadisi'nde yer alan ve kayalara oyulmuş Bizans dönemi manastırıdır. 4. yüzyılda kurulan manastır, Karadeniz'in en önemli tarihi ve dini yapılarından biridir. 300 metre yükseklikteki kayalık yamaca inşa edilen yapı, hem mimari hem de doğal güzellikleriyle büyüler. Freskleri ve ikonaları ile Ortodoks sanatının en güzel örneklerini barındırır.", source: "additional" },
            { name: "Göreme Açık Hava Müzesi", city: "Nevşehir", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Kapadokya'nın kalbi", source: "additional" },
            { name: "Aspendos Antik Tiyatrosu", city: "Antalya", country: "TÜRKİYE", category: "Tarihi / Antik", description: "En iyi korunmuş Roma tiyatrosu", source: "additional" },
            { name: "Safranbolu", city: "Karabük", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Osmanlı mimarisi örneği", source: "additional" },
            { name: "Bodrum Kalesi", city: "Muğla", country: "TÜRKİYE", category: "Tarihi / Kale", description: "Haçlı kalesi ve müze", source: "additional" },
            { name: "Pergamon Antik Kenti", city: "İzmir", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Antik Bergama kalıntıları", source: "additional" },
            { name: "Ani Harabeleri", city: "Kars", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Bin kilise şehri", source: "additional" },
            { name: "Xanthos-Letoon", city: "Antalya", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Likya medeniyeti kalıntıları", source: "additional" },
            { name: "Divriği Ulu Camii", city: "Sivas", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Selçuklu mimarisi şaheseri", source: "additional" },
            { name: "Hattuşa", city: "Çorum", country: "TÜRKİYE", category: "Tarihi / UNESCO", description: "Hitit başkenti kalıntıları", source: "additional" }
        ];
    }

    /**
     * Get English popular places
     */
    getEnglishPopularPlaces() {
        return [
            { name: "Machu Picchu", city: "Cusco", country: "PERU", category: "Historical / UNESCO", description: "Ancient Incan citadel", source: "additional" },
            { name: "Petra", city: "Ma'an", country: "JORDAN", category: "Historical / UNESCO", description: "Rose-red city carved in stone", source: "additional" },
            { name: "Taj Mahal", city: "Agra", country: "INDIA", category: "Historical / UNESCO", description: "Marble mausoleum of love", source: "additional" },
            { name: "Angkor Wat", city: "Siem Reap", country: "CAMBODIA", category: "Historical / UNESCO", description: "Largest religious monument", source: "additional" },
            { name: "Christ the Redeemer", city: "Rio de Janeiro", country: "BRAZIL", category: "Religious / Landmark", description: "Iconic statue overlooking Rio", source: "additional" },
            { name: "Chichen Itza", city: "Yucatan", country: "MEXICO", category: "Historical / UNESCO", description: "Maya pyramid complex", source: "additional" },
            { name: "Easter Island", city: "Hanga Roa", country: "CHILE", category: "Historical / UNESCO", description: "Mysterious moai statues", source: "additional" },
            { name: "Bagan", city: "Mandalay", country: "MYANMAR", category: "Historical / Buddhist", description: "Thousands of ancient temples", source: "additional" },
            { name: "Borobudur", city: "Java", country: "INDONESIA", category: "Historical / UNESCO", description: "Buddhist temple complex", source: "additional" },
            { name: "Halong Bay", city: "Quang Ninh", country: "VIETNAM", category: "Nature / UNESCO", description: "Emerald waters and limestone pillars", source: "additional" }
        ];
    }

    /**
     * Search for place suggestions
     */
    searchSuggestions(query) {
        const normalizedQuery = this.normalizeText(query);
        const suggestions = [];

        // Search in popular places database
        this.popularPlaces.forEach(place => {
            const normalizedName = this.normalizeText(place.name);
            const normalizedCity = this.normalizeText(place.city);
            const normalizedCountry = this.normalizeText(place.country);

            // Check if query matches name, city, or country
            if (normalizedName.includes(normalizedQuery) || 
                normalizedCity.includes(normalizedQuery) || 
                normalizedCountry.includes(normalizedQuery)) {
                
                // Calculate relevance score
                let score = 0;
                if (normalizedName.startsWith(normalizedQuery)) score += 10;
                else if (normalizedName.includes(normalizedQuery)) score += 5;
                if (normalizedCity.startsWith(normalizedQuery)) score += 3;
                if (normalizedCountry.includes(normalizedQuery)) score += 1;

                suggestions.push({
                    ...place,
                    score: score
                });
            }
        });

        // Sort by relevance score
        suggestions.sort((a, b) => b.score - a.score);

        // Limit to top 8 suggestions
        this.suggestions = suggestions.slice(0, 8);
        this.displaySuggestions();
    }

    /**
     * Display suggestions
     */
    displaySuggestions() {
        if (this.suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestionsContainer.innerHTML = '';
        this.activeSuggestionIndex = -1;

        this.suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0';
            suggestionElement.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-grow">
                        <div class="font-semibold text-gray-900">${Utils.escapeHTML(suggestion.name)}</div>
                        <div class="text-sm text-gray-600">${Utils.escapeHTML(suggestion.city)}, ${Utils.escapeHTML(suggestion.country)}</div>
                        <div class="text-xs text-gray-500 mt-1">${Utils.escapeHTML(suggestion.category)}</div>
                    </div>
                    <div class="ml-2 flex-shrink-0">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                </div>
            `;

            suggestionElement.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });

            suggestionElement.addEventListener('mouseenter', () => {
                this.setActiveSuggestion(index);
            });

            this.suggestionsContainer.appendChild(suggestionElement);
        });

        this.showSuggestions();
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyNavigation(e) {
        if (!this.suggestionsContainer.classList.contains('hidden')) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateUp();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.activeSuggestionIndex >= 0) {
                        this.selectSuggestion(this.suggestions[this.activeSuggestionIndex]);
                    }
                    break;
                case 'Escape':
                    this.hideSuggestions();
                    break;
            }
        }
    }

    /**
     * Navigate down in suggestions
     */
    navigateDown() {
        if (this.activeSuggestionIndex < this.suggestions.length - 1) {
            this.setActiveSuggestion(this.activeSuggestionIndex + 1);
        }
    }

    /**
     * Navigate up in suggestions
     */
    navigateUp() {
        if (this.activeSuggestionIndex > 0) {
            this.setActiveSuggestion(this.activeSuggestionIndex - 1);
        }
    }

    /**
     * Set active suggestion
     */
    setActiveSuggestion(index) {
        // Remove previous active state
        const previousActive = this.suggestionsContainer.querySelector('.bg-blue-100');
        if (previousActive) {
            previousActive.classList.remove('bg-blue-100');
            previousActive.classList.add('hover:bg-gray-100');
        }

        // Set new active state
        this.activeSuggestionIndex = index;
        const suggestionElements = this.suggestionsContainer.children;
        if (suggestionElements[index]) {
            suggestionElements[index].classList.add('bg-blue-100');
            suggestionElements[index].classList.remove('hover:bg-gray-100');
            
            // Scroll into view if needed
            suggestionElements[index].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    /**
     * Select a suggestion
     */
    selectSuggestion(suggestion) {
        this.placeInput.value = suggestion.name;
        this.hideSuggestions();
        
        // Trigger input event to validate
        this.placeInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Focus back to input
        this.placeInput.focus();
        
        // Move cursor to end
        this.placeInput.setSelectionRange(this.placeInput.value.length, this.placeInput.value.length);
    }

    /**
     * Show suggestions container
     */
    showSuggestions() {
        this.suggestionsContainer.classList.remove('hidden');
    }

    /**
     * Hide suggestions container
     */
    hideSuggestions() {
        this.suggestionsContainer.classList.add('hidden');
        this.activeSuggestionIndex = -1;
    }

    /**
     * Normalize text for comparison
     */
    normalizeText(text) {
        if (!text) return '';
        
        return text
            .toLowerCase()
            .trim()
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ');
    }

    /**
     * Get current suggestions
     */
    getCurrentSuggestions() {
        return this.suggestions;
    }

    /**
     * Clear suggestions
     */
    clearSuggestions() {
        this.suggestions = [];
        this.hideSuggestions();
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[PlaceSuggestions] Cleaning up...');
        
        if (this.suggestionsContainer && this.suggestionsContainer.parentNode) {
            this.suggestionsContainer.parentNode.removeChild(this.suggestionsContainer);
        }
    }
}

// Create and export place suggestions instance
window.placeSuggestions = new PlaceSuggestions();
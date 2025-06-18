/**
 * Enhanced Place Suggestions with Pexels API integration
 * Provides intelligent place suggestions and dynamic country images
 */

class EnhancedPlaceSuggestions {
    constructor() {
        this.isInitialized = false;
        this.suggestions = [];
        this.currentQuery = '';
        this.debounceTimer = null;
        this.countryImages = new Map();
        
        // DOM elements
        this.placeInput = null;
        this.suggestionsDropdown = null;
        this.activeSuggestionIndex = -1;
        
        // Configuration
        this.config = {
            pexelsApiKey: 'qLDLKWTXLouQCKT40OyIA982lb5kv0ftITaaLYbaOrx2FKNbGf5sZlYF',
            debounceDelay: 300,
            minQueryLength: 2,
            maxSuggestions: 8
        };
        
        // World places database
        this.worldPlaces = this.buildWorldPlacesDatabase();
    }

    /**
     * Initialize the enhanced place suggestions
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[EnhancedPlaceSuggestions] Already initialized');
            return;
        }

        this.setupDOMElements();
        this.setupEventListeners();
        this.setupCountryImageHovers();
        
        this.isInitialized = true;
        console.log('[EnhancedPlaceSuggestions] Enhanced Place Suggestions initialized');
    }

    /**
     * Setup DOM elements
     */
    setupDOMElements() {
        this.placeInput = document.getElementById('newPlaceNameInput');
        this.suggestionsDropdown = document.getElementById('suggestionsDropdown');
        
        if (!this.placeInput) {
            console.warn('[EnhancedPlaceSuggestions] Place input not found');
            return;
        }
        
        if (!this.suggestionsDropdown) {
            console.warn('[EnhancedPlaceSuggestions] Suggestions dropdown not found');
            return;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.placeInput) return;

        // Input event with debouncing
        this.placeInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            this.currentQuery = query;
            
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.handleSearch(query);
            }, this.config.debounceDelay);
        });

        // Focus event
        this.placeInput.addEventListener('focus', () => {
            if (this.currentQuery.length >= this.config.minQueryLength) {
                this.showSuggestions();
            }
        });

        // Blur event (with delay to allow clicking on suggestions)
        this.placeInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });

        // Keyboard navigation
        this.placeInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.placeInput.contains(e.target) && !this.suggestionsDropdown.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Setup country image hovers
     */
    setupCountryImageHovers() {
        // This will be called when places are rendered
        document.addEventListener('placesListRendered', () => {
            this.attachCountryImageHovers();
        });
    }

    /**
     * Attach hover events to country headers
     */
    attachCountryImageHovers() {
        const countryHeaders = document.querySelectorAll('.country-header');
        
        countryHeaders.forEach(header => {
            const countryName = header.textContent.trim();
            
            header.addEventListener('mouseenter', async () => {
                await this.showCountryImage(header, countryName);
            });
            
            header.addEventListener('mouseleave', () => {
                this.hideCountryImage(header);
            });
        });
    }

    /**
     * Handle search input
     * @param {string} query - Search query
     */
    async handleSearch(query) {
        if (query.length < this.config.minQueryLength) {
            this.hideSuggestions();
            return;
        }

        try {
            const suggestions = await this.searchPlaces(query);
            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error('[EnhancedPlaceSuggestions] Error searching places:', error);
        }
    }

    /**
     * Search for places based on query
     * @param {string} query - Search query
     * @returns {Array} Array of place suggestions
     */
    async searchPlaces(query) {
        const normalizedQuery = Utils.normalizeText(query);
        const suggestions = [];

        // Search in world places database
        this.worldPlaces.forEach(place => {
            const normalizedName = Utils.normalizeText(place.name);
            const normalizedCity = Utils.normalizeText(place.city || '');
            const normalizedCountry = Utils.normalizeText(place.country || '');

            let score = 0;
            let matchType = '';

            // Calculate relevance score
            if (normalizedName.startsWith(normalizedQuery)) {
                score += 10;
                matchType = 'name';
            } else if (normalizedName.includes(normalizedQuery)) {
                score += 7;
                matchType = 'name';
            } else if (normalizedCity.startsWith(normalizedQuery)) {
                score += 8;
                matchType = 'city';
            } else if (normalizedCity.includes(normalizedQuery)) {
                score += 5;
                matchType = 'city';
            } else if (normalizedCountry.startsWith(normalizedQuery)) {
                score += 6;
                matchType = 'country';
            } else if (normalizedCountry.includes(normalizedQuery)) {
                score += 3;
                matchType = 'country';
            }

            if (score > 0) {
                suggestions.push({
                    ...place,
                    score,
                    matchType
                });
            }
        });

        // Sort by score and limit results
        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, this.config.maxSuggestions);
    }

    /**
     * Display suggestions in dropdown
     * @param {Array} suggestions - Array of suggestions
     */
    displaySuggestions(suggestions) {
        if (!this.suggestionsDropdown) return;

        this.suggestions = suggestions;
        this.activeSuggestionIndex = -1;

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestionsDropdown.innerHTML = '';

        suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.setAttribute('data-index', index);

            const flagEmoji = this.getCountryFlag(suggestion.country);
            const matchTypeIcon = this.getMatchTypeIcon(suggestion.matchType);

            suggestionElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-grow">
                        <div class="flex items-center">
                            <span class="text-lg mr-2">${flagEmoji}</span>
                            <div>
                                <div class="font-semibold text-gray-900">${Utils.escapeHTML(suggestion.name)}</div>
                                <div class="text-sm text-gray-600">
                                    ${suggestion.city ? Utils.escapeHTML(suggestion.city) + ', ' : ''}${Utils.escapeHTML(suggestion.country)}
                                </div>
                                ${suggestion.category ? `<div class="text-xs text-gray-500 mt-1">${Utils.escapeHTML(suggestion.category)}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="ml-3 text-gray-400">
                        ${matchTypeIcon}
                    </div>
                </div>
            `;

            // Click handler
            suggestionElement.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });

            this.suggestionsDropdown.appendChild(suggestionElement);
        });

        this.showSuggestions();
    }

    /**
     * Get country flag emoji
     * @param {string} country - Country name
     * @returns {string} Flag emoji
     */
    getCountryFlag(country) {
        const flags = {
            'FRANCE': '🇫🇷',
            'ITALY': '🇮🇹',
            'SPAIN': '🇪🇸',
            'GERMANY': '���🇪',
            'NETHERLANDS': '🇳🇱',
            'UNITED KINGDOM': '🇬🇧',
            'GREECE': '🇬🇷',
            'PORTUGAL': '🇵🇹',
            'AUSTRIA': '🇦🇹',
            'SWITZERLAND': '🇨🇭',
            'TURKEY': '🇹🇷',
            'CZECH REPUBLIC': '🇨🇿',
            'POLAND': '🇵🇱',
            'HUNGARY': '🇭🇺',
            'CROATIA': '🇭🇷',
            'NORWAY': '🇳🇴',
            'SWEDEN': '🇸🇪',
            'DENMARK': '🇩🇰',
            'FINLAND': '🇫🇮',
            'ICELAND': '🇮🇸',
            'IRELAND': '🇮🇪',
            'BELGIUM': '🇧🇪',
            'LUXEMBOURG': '🇱🇺',
            'MONACO': '🇲🇨',
            'VATICAN': '🇻🇦',
            'SAN MARINO': '🇸🇲',
            'ANDORRA': '🇦🇩',
            'LIECHTENSTEIN': '🇱🇮',
            'MALTA': '🇲🇹',
            'CYPRUS': '🇨🇾',
            'ROMANIA': '🇷🇴',
            'BULGARIA': '🇧🇬',
            'SERBIA': '🇷🇸',
            'MONTENEGRO': '🇲🇪',
            'BOSNIA AND HERZEGOVINA': '🇧🇦',
            'ALBANIA': '🇦🇱',
            'NORTH MACEDONIA': '🇲🇰',
            'SLOVENIA': '🇸🇮',
            'SLOVAKIA': '🇸🇰',
            'ESTONIA': '🇪🇪',
            'LATVIA': '🇱🇻',
            'LITHUANIA': '🇱🇹',
            'BELARUS': '🇧🇾',
            'UKRAINE': '🇺🇦',
            'MOLDOVA': '🇲🇩',
            'RUSSIA': '🇷🇺',
            'GEORGIA': '🇬🇪',
            'ARMENIA': '🇦🇲',
            'AZERBAIJAN': '🇦🇿',
            'USA': '🇺🇸',
            'CANADA': '🇨🇦',
            'MEXICO': '🇲🇽',
            'BRAZIL': '🇧🇷',
            'ARGENTINA': '🇦🇷',
            'CHILE': '🇨🇱',
            'PERU': '🇵🇪',
            'COLOMBIA': '🇨🇴',
            'VENEZUELA': '🇻🇪',
            'ECUADOR': '🇪🇨',
            'BOLIVIA': '🇧🇴',
            'URUGUAY': '🇺🇾',
            'PARAGUAY': '🇵🇾',
            'GUYANA': '🇬🇾',
            'SURINAME': '🇸🇷',
            'FRENCH GUIANA': '🇬🇫',
            'JAPAN': '🇯🇵',
            'CHINA': '🇨🇳',
            'SOUTH KOREA': '🇰🇷',
            'THAILAND': '🇹🇭',
            'VIETNAM': '🇻🇳',
            'SINGAPORE': '🇸🇬',
            'MALAYSIA': '🇲🇾',
            'INDONESIA': '🇮🇩',
            'PHILIPPINES': '🇵🇭',
            'INDIA': '🇮🇳',
            'NEPAL': '🇳🇵',
            'BHUTAN': '🇧🇹',
            'SRI LANKA': '🇱🇰',
            'MALDIVES': '🇲🇻',
            'AUSTRALIA': '🇦🇺',
            'NEW ZEALAND': '🇳🇿',
            'FIJI': '🇫🇯',
            'EGYPT': '🇪🇬',
            'MOROCCO': '🇲🇦',
            'SOUTH AFRICA': '🇿🇦',
            'KENYA': '🇰🇪',
            'TANZANIA': '🇹🇿',
            'MADAGASCAR': '🇲🇬',
            'MAURITIUS': '🇲🇺',
            'SEYCHELLES': '🇸🇨'
        };
        
        return flags[country?.toUpperCase()] || '🌍';
    }

    /**
     * Get match type icon
     * @param {string} matchType - Type of match
     * @returns {string} Icon HTML
     */
    getMatchTypeIcon(matchType) {
        const icons = {
            name: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>',
            city: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
            country: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        };
        
        return icons[matchType] || icons.name;
    }

    /**
     * Select a suggestion
     * @param {Object} suggestion - Selected suggestion
     */
    selectSuggestion(suggestion) {
        if (!this.placeInput) return;

        this.placeInput.value = suggestion.name;
        this.hideSuggestions();
        
        // Dispatch custom event
        const event = new CustomEvent('suggestionSelected', {
            detail: { suggestion }
        });
        document.dispatchEvent(event);
        
        // Focus back to input for better UX
        this.placeInput.focus();
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyNavigation(e) {
        if (!this.suggestionsDropdown.classList.contains('show')) return;

        const suggestionItems = this.suggestionsDropdown.querySelectorAll('.suggestion-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.activeSuggestionIndex = Math.min(this.activeSuggestionIndex + 1, suggestionItems.length - 1);
                this.updateActiveSuggestion();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, -1);
                this.updateActiveSuggestion();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.activeSuggestionIndex >= 0 && this.suggestions[this.activeSuggestionIndex]) {
                    this.selectSuggestion(this.suggestions[this.activeSuggestionIndex]);
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    /**
     * Update active suggestion highlighting
     */
    updateActiveSuggestion() {
        const suggestionItems = this.suggestionsDropdown.querySelectorAll('.suggestion-item');
        
        suggestionItems.forEach((item, index) => {
            if (index === this.activeSuggestionIndex) {
                item.classList.add('bg-blue-50');
            } else {
                item.classList.remove('bg-blue-50');
            }
        });
    }

    /**
     * Show suggestions dropdown
     */
    showSuggestions() {
        if (this.suggestionsDropdown) {
            this.suggestionsDropdown.classList.add('show');
        }
    }

    /**
     * Hide suggestions dropdown
     */
    hideSuggestions() {
        if (this.suggestionsDropdown) {
            this.suggestionsDropdown.classList.remove('show');
        }
        this.activeSuggestionIndex = -1;
    }

    /**
     * Show country image on hover
     * @param {HTMLElement} header - Country header element
     * @param {string} countryName - Country name
     */
    async showCountryImage(header, countryName) {
        // Check if image already exists
        let imageElement = header.querySelector('.country-image');
        
        if (!imageElement) {
            imageElement = document.createElement('div');
            imageElement.className = 'country-image';
            header.appendChild(imageElement);
        }

        // Check cache first
        if (this.countryImages.has(countryName)) {
            const imageUrl = this.countryImages.get(countryName);
            imageElement.style.backgroundImage = `url(${imageUrl})`;
            return;
        }

        // Fetch image from Pexels
        try {
            const imageUrl = await this.fetchCountryImage(countryName);
            if (imageUrl) {
                this.countryImages.set(countryName, imageUrl);
                imageElement.style.backgroundImage = `url(${imageUrl})`;
            }
        } catch (error) {
            console.error('[EnhancedPlaceSuggestions] Error fetching country image:', error);
        }
    }

    /**
     * Hide country image
     * @param {HTMLElement} header - Country header element
     */
    hideCountryImage(header) {
        const imageElement = header.querySelector('.country-image');
        if (imageElement) {
            // Keep the element but hide it for next time
        }
    }

    /**
     * Fetch country image from Pexels API
     * @param {string} countryName - Country name
     * @returns {Promise<string>} Image URL
     */
    async fetchCountryImage(countryName) {
        try {
            const searchQuery = `${countryName} landmark tourism`;
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`, {
                headers: {
                    'Authorization': this.config.pexelsApiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.photos && data.photos.length > 0) {
                return data.photos[0].src.medium;
            }
            
            return null;
        } catch (error) {
            console.error('[EnhancedPlaceSuggestions] Pexels API error:', error);
            return null;
        }
    }

    /**
     * Build world places database
     * @returns {Array} Array of world places
     */
    buildWorldPlacesDatabase() {
        return [
            // Famous places starting with "Pam"
            { name: "Pamukkale", city: "Denizli", country: "TURKEY", category: "Natural Wonder / UNESCO", description: "Cotton Castle thermal pools" },
            { name: "Pamplona", city: "Pamplona", country: "SPAIN", category: "Historic City", description: "Famous for Running of the Bulls" },
            { name: "Panama City", city: "Panama City", country: "PANAMA", category: "Capital City", description: "Modern skyline and historic Casco Viejo" },
            { name: "Pampas", city: "Buenos Aires Province", country: "ARGENTINA", category: "Natural Region", description: "Fertile grasslands" },
            
            // Paris and France
            { name: "Paris", city: "Paris", country: "FRANCE", category: "Capital City", description: "City of Light, Eiffel Tower, Louvre" },
            { name: "Palace of Versailles", city: "Versailles", country: "FRANCE", category: "Palace / UNESCO", description: "Opulent royal palace and gardens" },
            { name: "Palais des Papes", city: "Avignon", country: "FRANCE", category: "Historic Palace", description: "Papal palace in Avignon" },
            
            // Italy
            { name: "Pantheon", city: "Rome", country: "ITALY", category: "Ancient Monument", description: "Ancient Roman temple" },
            { name: "Palazzo Ducale", city: "Venice", country: "ITALY", category: "Palace", description: "Doge's Palace in Venice" },
            { name: "Palermo", city: "Palermo", country: "ITALY", category: "Historic City", description: "Capital of Sicily" },
            
            // Spain
            { name: "Park Güell", city: "Barcelona", country: "SPAIN", category: "Park / UNESCO", description: "Gaudí's colorful park" },
            { name: "Prado Museum", city: "Madrid", country: "SPAIN", category: "Museum", description: "World-famous art museum" },
            { name: "Palma", city: "Palma", country: "SPAIN", category: "Island City", description: "Capital of Mallorca" },
            
            // Germany
            { name: "Parthenon", city: "Athens", country: "GREECE", category: "Ancient Temple / UNESCO", description: "Ancient Greek temple" },
            { name: "Paros", city: "Paros", country: "GREECE", category: "Island", description: "Beautiful Greek island" },
            
            // United Kingdom
            { name: "Palace of Westminster", city: "London", country: "UNITED KINGDOM", category: "Government Building / UNESCO", description: "Houses of Parliament and Big Ben" },
            { name: "Peak District", city: "Derbyshire", country: "UNITED KINGDOM", category: "National Park", description: "Beautiful countryside" },
            
            // Netherlands
            { name: "Paradiso", city: "Amsterdam", country: "NETHERLANDS", category: "Music Venue", description: "Famous concert hall" },
            
            // Other European places
            { name: "Prague", city: "Prague", country: "CZECH REPUBLIC", category: "Capital City / UNESCO", description: "City of a Hundred Spires" },
            { name: "Porto", city: "Porto", country: "PORTUGAL", category: "Historic City / UNESCO", description: "Port wine and beautiful architecture" },
            
            // Asia
            { name: "Petra", city: "Ma'an", country: "JORDAN", category: "Archaeological Site / UNESCO", description: "Rose-red city carved in stone" },
            { name: "Palawan", city: "Puerto Princesa", country: "PHILIPPINES", category: "Island Province", description: "Paradise island with pristine beaches" },
            { name: "Phuket", city: "Phuket", country: "THAILAND", category: "Island", description: "Popular beach destination" },
            
            // Americas
            { name: "Patagonia", city: "Multiple", country: "ARGENTINA", category: "Natural Region", description: "Dramatic landscapes and glaciers" },
            { name: "Pacific Coast Highway", city: "California", country: "USA", category: "Scenic Route", description: "Stunning coastal drive" },
            
            // Africa
            { name: "Pyramids of Giza", city: "Giza", country: "EGYPT", category: "Ancient Wonder / UNESCO", description: "Last remaining Wonder of the Ancient World" },
            
            // More famous places for better suggestions
            { name: "London", city: "London", country: "UNITED KINGDOM", category: "Capital City", description: "Big Ben, Tower Bridge, British Museum" },
            { name: "Rome", city: "Rome", country: "ITALY", category: "Capital City / UNESCO", description: "Eternal City, Colosseum, Vatican" },
            { name: "Barcelona", city: "Barcelona", country: "SPAIN", category: "Historic City", description: "Gaudí architecture, beaches" },
            { name: "Amsterdam", city: "Amsterdam", country: "NETHERLANDS", category: "Capital City", description: "Canals, museums, tulips" },
            { name: "Vienna", city: "Vienna", country: "AUSTRIA", category: "Capital City / UNESCO", description: "Imperial palaces, classical music" },
            { name: "Santorini", city: "Santorini", country: "GREECE", category: "Island", description: "White buildings, blue domes, sunsets" },
            { name: "Dubrovnik", city: "Dubrovnik", country: "CROATIA", category: "Historic City / UNESCO", description: "Pearl of the Adriatic" },
            { name: "Edinburgh", city: "Edinburgh", country: "UNITED KINGDOM", category: "Historic City / UNESCO", description: "Castle, Royal Mile, festivals" },
            { name: "Florence", city: "Florence", country: "ITALY", category: "Historic City / UNESCO", description: "Renaissance art and architecture" },
            { name: "Bruges", city: "Bruges", country: "BELGIUM", category: "Historic City / UNESCO", description: "Medieval charm, canals" },
            { name: "Lisbon", city: "Lisbon", country: "PORTUGAL", category: "Capital City", description: "Trams, tiles, fado music" },
            { name: "Stockholm", city: "Stockholm", country: "SWEDEN", category: "Capital City", description: "Archipelago, Nobel Prize, ABBA" },
            { name: "Copenhagen", city: "Copenhagen", country: "DENMARK", category: "Capital City", description: "Little Mermaid, hygge, design" },
            { name: "Reykjavik", city: "Reykjavik", country: "ICELAND", category: "Capital City", description: "Northern Lights, Blue Lagoon" },
            { name: "Budapest", city: "Budapest", country: "HUNGARY", category: "Capital City / UNESCO", description: "Thermal baths, Danube, Parliament" },
            { name: "Krakow", city: "Krakow", country: "POLAND", category: "Historic City / UNESCO", description: "Medieval square, Wawel Castle" },
            { name: "Istanbul", city: "Istanbul", country: "TURKEY", category: "Historic City / UNESCO", description: "Hagia Sophia, Bosphorus, bazaars" },
            { name: "Athens", city: "Athens", country: "GREECE", category: "Capital City / UNESCO", description: "Acropolis, ancient history" },
            { name: "Dublin", city: "Dublin", country: "IRELAND", category: "Capital City", description: "Guinness, literature, Temple Bar" },
            { name: "Oslo", city: "Oslo", country: "NORWAY", category: "Capital City", description: "Fjords, Vikings, modern architecture" },
            { name: "Helsinki", city: "Helsinki", country: "FINLAND", category: "Capital City", description: "Design, saunas, archipelago" },
            { name: "Tallinn", city: "Tallinn", country: "ESTONIA", category: "Capital City / UNESCO", description: "Medieval old town" },
            { name: "Riga", city: "Riga", country: "LATVIA", category: "Capital City / UNESCO", description: "Art Nouveau architecture" },
            { name: "Vilnius", city: "Vilnius", country: "LITHUANIA", category: "Capital City / UNESCO", description: "Baroque old town" }
        ];
    }

    /**
     * Get enhanced place suggestions status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            currentQuery: this.currentQuery,
            suggestionsCount: this.suggestions.length,
            cachedImages: this.countryImages.size,
            worldPlacesCount: this.worldPlaces.length
        };
    }

    /**
     * Clean up enhanced place suggestions
     */
    cleanup() {
        console.log('[EnhancedPlaceSuggestions] Cleaning up...');
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.hideSuggestions();
        this.countryImages.clear();
        
        console.log('[EnhancedPlaceSuggestions] Cleanup completed');
    }
}

// Create global instance
window.enhancedPlaceSuggestions = new EnhancedPlaceSuggestions();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedPlaceSuggestions;
}
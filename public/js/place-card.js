/**
 * Place Card Component
 * Creates and manages place cards for the new UI
 */

class PlaceCardManager {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the place card manager
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[PlaceCardManager] Initializing...');
        
        // Setup event delegation for place cards
        this.setupEventDelegation();
        
        this.isInitialized = true;
        console.log('[PlaceCardManager] Initialized successfully');
    }

    /**
     * Setup event delegation for place cards
     */
    setupEventDelegation() {
        const placesList = document.getElementById('placesList');
        
        if (placesList) {
            placesList.addEventListener('click', (e) => {
                const placeCard = e.target.closest('.place-card');
                if (placeCard) {
                    // Handle different click targets within the card
                    if (e.target.classList.contains('visit-toggle') || e.target.closest('.visit-toggle')) {
                        this.handleVisitToggle(placeCard);
                    } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                        this.handleDeleteClick(placeCard);
                    } else {
                        this.handleCardClick(placeCard);
                    }
                }
            });
        }
    }

    /**
     * Create a place card element
     * @param {Object} place - Place data
     * @returns {HTMLElement} Place card element
     */
    createPlaceCard(place) {
        const isSelectedForRoute = window.routeManager && window.routeManager.isPlaceSelected(place.id);
        
        const card = document.createElement('div');
        card.className = `place-card ${isSelectedForRoute ? 'selected-for-route' : ''}`;
        card.setAttribute('data-id', place.id);
        
        // Create card content
        card.innerHTML = `
            <div class="place-card-content">
                <h3 class="place-name">${place.name || 'Unnamed Place'}</h3>
                <p class="place-location">${place.city ? place.city + ', ' : ''}${place.country || 'Unknown'}</p>
                ${place.category ? `<span class="place-category">${place.category}</span>` : ''}
                <p class="place-description">${place.description || 'No description available.'}</p>
                ${isSelectedForRoute ? `<p class="route-order">Route Order: ${window.routeManager.getPlaceOrder(place.id)}</p>` : ''}
            </div>
            <div class="place-card-actions">
                <label class="visit-toggle">
                    <input type="checkbox" ${place.visited ? 'checked' : ''}>
                    <span>${place.visited ? 'Visited' : 'Not Visited'}</span>
                </label>
                <button class="delete-btn" aria-label="Delete place">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `;
        
        return card;
    }

    /**
     * Handle card click
     * @param {HTMLElement} card - Place card element
     */
    handleCardClick(card) {
        const placeId = card.getAttribute('data-id');
        
        if (!placeId || !window.placeManager) return;
        
        const place = window.placeManager.getPlaceById(placeId);
        
        if (place) {
            // Toggle selection for route
            if (window.routeManager) {
                window.routeManager.togglePlaceSelection(place);
            }
            
            // Update map
            if (window.placeManager.updateMap) {
                window.placeManager.updateMap(place);
            }
            
            // Add micro-animation
            card.classList.add('card-pulse');
            setTimeout(() => {
                card.classList.remove('card-pulse');
            }, 300);
        }
    }

    /**
     * Handle visit toggle
     * @param {HTMLElement} card - Place card element
     */
    handleVisitToggle(card) {
        const placeId = card.getAttribute('data-id');
        const checkbox = card.querySelector('input[type="checkbox"]');
        
        if (!placeId || !checkbox || !window.placeManager) return;
        
        const isVisited = checkbox.checked;
        
        // Update visited status
        if (window.placeManager.handleVisitedToggle) {
            window.placeManager.handleVisitedToggle(placeId, isVisited);
        }
    }

    /**
     * Handle delete click
     * @param {HTMLElement} card - Place card element
     */
    handleDeleteClick(card) {
        const placeId = card.getAttribute('data-id');
        
        if (!placeId || !window.placeManager) return;
        
        const place = window.placeManager.getPlaceById(placeId);
        
        if (place && window.placeManager.handleDeletePlace) {
            window.placeManager.handleDeletePlace(place);
        }
    }

    /**
     * Render place cards for the places list
     * @param {Array} places - Array of place objects
     * @param {HTMLElement} container - Container element
     */
    renderPlaceCards(places, container) {
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        if (!places || places.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-300 p-6">No places found. Add some places to get started!</p>';
            return;
        }
        
        // Group places by country
        const placesByCountry = this.groupPlacesByCountry(places);
        
        // Render places by country
        Object.keys(placesByCountry).sort().forEach(country => {
            // Create country section
            const countrySection = document.createElement('div');
            countrySection.className = 'country-section';
            
            // Create country header
            const countryHeader = document.createElement('h3');
            countryHeader.className = 'country-header';
            countryHeader.textContent = country;
            countrySection.appendChild(countryHeader);
            
            // Create places container
            const placesContainer = document.createElement('div');
            placesContainer.className = 'country-places';
            
            // Add place cards
            placesByCountry[country].forEach(place => {
                const card = this.createPlaceCard(place);
                placesContainer.appendChild(card);
            });
            
            countrySection.appendChild(placesContainer);
            container.appendChild(countrySection);
        });
    }

    /**
     * Group places by country
     * @param {Array} places - Array of place objects
     * @returns {Object} Places grouped by country
     */
    groupPlacesByCountry(places) {
        return places.reduce((groups, place) => {
            const country = place.country || 'Other';
            if (!groups[country]) {
                groups[country] = [];
            }
            groups[country].push(place);
            return groups;
        }, {});
    }
}

// Create and export place card manager instance
window.placeCardManager = new PlaceCardManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.placeCardManager.initialize();
});
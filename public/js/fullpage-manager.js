/**
 * FullPage Manager for RotamBenim application
 * Handles fullpage scrolling and background transitions
 */

class FullPageManager {
    constructor() {
        this.fullpage = null;
        this.isInitialized = false;
        this.currentCountry = null;
        this.countryBackgrounds = {
            'TÜRKİYE': 'url("images/backgrounds/turkey.jpg")',
            'FRANSA': 'url("images/backgrounds/france.jpg")',
            'ITALY': 'url("images/backgrounds/italy.jpg")',
            'SPAIN': 'url("images/backgrounds/spain.jpg")',
            'GERMANY': 'url("images/backgrounds/germany.jpg")',
            'NETHERLANDS': 'url("images/backgrounds/netherlands.jpg")',
            'JAPONYA': 'url("images/backgrounds/japan.jpg")',
            'ÇİN': 'url("images/backgrounds/china.jpg")',
            'AMERİKA BİRLEŞİK DEVLETLERİ': 'url("images/backgrounds/usa.jpg")',
            'BİRLEŞİK KRALLIK': 'url("images/backgrounds/uk.jpg")',
            'GREECE': 'url("images/backgrounds/greece.jpg")',
            'default': 'url("images/backgrounds/default.jpg")'
        };
        
        // DOM elements
        this.mainContainer = document.querySelector('.main-container');
        this.backgroundOverlay = null;
    }

    /**
     * Initialize fullpage scrolling
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[FullPageManager] Initializing...');
        
        this.createBackgroundOverlay();
        this.setupFullPageJS();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('[FullPageManager] Initialized successfully');
    }
    
    /**
     * Create background overlay element
     */
    createBackgroundOverlay() {
        // Create background overlay
        this.backgroundOverlay = document.createElement('div');
        this.backgroundOverlay.className = 'background-overlay';
        document.body.insertBefore(this.backgroundOverlay, document.body.firstChild);
        
        // Set default background
        this.setBackground('default');
    }
    
    /**
     * Setup fullpage.js
     */
    setupFullPageJS() {
        if (!window.fullpage) {
            console.warn('[FullPageManager] fullpage.js not loaded');
            return;
        }
        
        // Convert main sections to fullpage sections
        this.convertToFullPageSections();
        
        // Initialize fullpage.js
        this.fullpage = new fullpage('#fullpage', {
            licenseKey: 'YOUR_KEY_HERE', // Replace with your license key or use 'OPEN-SOURCE-GPLV3-LICENSE' for non-commercial
            navigation: true,
            navigationPosition: 'right',
            scrollingSpeed: 1000,
            easing: 'easeInOutCubic',
            css3: true,
            scrollOverflow: true,
            responsiveWidth: 768, // Disable fullpage on mobile
            afterLoad: (origin, destination, direction) => {
                this.handleSectionChange(destination);
            }
        });
    }
    
    /**
     * Convert existing content to fullpage sections
     */
    convertToFullPageSections() {
        // Create fullpage container
        const fullpageContainer = document.createElement('div');
        fullpageContainer.id = 'fullpage';
        
        // Get main content sections
        const header = document.querySelector('header');
        const mainContent = document.querySelector('main');
        const mapSection = document.querySelector('aside');
        
        // Create sections
        if (header) {
            const headerSection = document.createElement('div');
            headerSection.className = 'section header-section';
            headerSection.appendChild(header.cloneNode(true));
            fullpageContainer.appendChild(headerSection);
        }
        
        if (mainContent) {
            const contentSection = document.createElement('div');
            contentSection.className = 'section content-section';
            contentSection.appendChild(mainContent.cloneNode(true));
            fullpageContainer.appendChild(contentSection);
        }
        
        if (mapSection) {
            const mapSectionElement = document.createElement('div');
            mapSectionElement.className = 'section map-section';
            mapSectionElement.appendChild(mapSection.cloneNode(true));
            fullpageContainer.appendChild(mapSectionElement);
        }
        
        // Replace main container content with fullpage container
        if (this.mainContainer) {
            // Store original content
            const originalContent = this.mainContainer.innerHTML;
            
            // Clear and add fullpage container
            this.mainContainer.innerHTML = '';
            this.mainContainer.appendChild(fullpageContainer);
            
            // Re-initialize event listeners and references
            document.dispatchEvent(new CustomEvent('fullpageInitialized', {
                detail: { originalContent }
            }));
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for place selection to update background
        document.addEventListener('placeSelected', (e) => {
            if (e.detail && e.detail.place) {
                this.handlePlaceSelection(e.detail.place);
            }
        });
        
        // Listen for filter changes
        document.addEventListener('filterChanged', (e) => {
            if (e.detail && e.detail.country) {
                this.handleCountryFilter(e.detail.country);
            }
        });
    }
    
    /**
     * Handle section change
     * @param {Object} destination - Destination section
     */
    handleSectionChange(destination) {
        // Add animation classes to elements in the current section
        const currentSection = destination.item;
        const animatedElements = currentSection.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }
    
    /**
     * Handle place selection
     * @param {Object} place - Selected place
     */
    handlePlaceSelection(place) {
        if (place && place.country && this.countryBackgrounds[place.country]) {
            this.setBackground(place.country);
        }
    }
    
    /**
     * Handle country filter change
     * @param {string} country - Selected country
     */
    handleCountryFilter(country) {
        if (country !== 'all') {
            this.setBackground(country);
        } else {
            this.setBackground('default');
        }
    }
    
    /**
     * Set background based on country
     * @param {string} country - Country name
     */
    setBackground(country) {
        if (this.currentCountry === country) return;
        
        this.currentCountry = country;
        
        if (!this.backgroundOverlay) return;
        
        // Fade out current background
        this.backgroundOverlay.classList.add('fade-out');
        
        setTimeout(() => {
            // Set new background
            const background = this.countryBackgrounds[country] || this.countryBackgrounds.default;
            this.backgroundOverlay.style.backgroundImage = background;
            
            // Fade in new background
            this.backgroundOverlay.classList.remove('fade-out');
            this.backgroundOverlay.classList.add('fade-in');
            
            // Remove animation class after transition
            setTimeout(() => {
                this.backgroundOverlay.classList.remove('fade-in');
            }, 1000);
        }, 500);
    }
    
    /**
     * Move to specific section
     * @param {number} sectionIndex - Section index
     */
    moveToSection(sectionIndex) {
        if (this.fullpage) {
            this.fullpage.moveTo(sectionIndex);
        }
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[FullPageManager] Cleaning up...');
        
        if (this.fullpage) {
            this.fullpage.destroy('all');
            this.fullpage = null;
        }
    }
}

// Create and export fullpage manager instance
window.fullpageManager = new FullPageManager();
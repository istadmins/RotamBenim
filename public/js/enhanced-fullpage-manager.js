/**
 * Enhanced FullPage Manager for RotamBenim application
 * Handles fullpage scrolling with smooth animations and background transitions
 */

class EnhancedFullPageManager {
    constructor() {
        this.fullpage = null;
        this.isInitialized = false;
        this.currentSection = 0;
        this.isScrolling = false;
        this.isMobile = window.innerWidth <= 768;
        
        // Animation settings
        this.animationDuration = 800;
        this.animationEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Section information
        this.sections = [
            { anchor: 'hero', name: 'Hero' },
            { anchor: 'add-place', name: 'Add Place' },
            { anchor: 'places-list', name: 'Places List' },
            { anchor: 'map-view', name: 'Map View' },
            { anchor: 'about', name: 'About' }
        ];
    }

    /**
     * Initialize fullpage scrolling
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[EnhancedFullPageManager] Initializing...');
        
        // Check if we're on mobile
        this.checkMobileDevice();
        
        if (this.isMobile) {
            console.log('[EnhancedFullPageManager] Mobile device detected, using alternative scrolling');
            this.initializeMobileScrolling();
        } else {
            this.initializeFullPageJS();
        }
        
        this.setupEventListeners();
        this.setupScrollIndicator();
        this.setupNavigationDots();
        
        this.isInitialized = true;
        console.log('[EnhancedFullPageManager] Initialized successfully');
    }

    /**
     * Check if device is mobile
     */
    checkMobileDevice() {
        this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Initialize FullPage.js for desktop
     */
    initializeFullPageJS() {
        if (!window.fullpage) {
            console.error('[EnhancedFullPageManager] fullpage.js not loaded');
            return;
        }

        try {
            this.fullpage = new fullpage('#fullpage', {
                // License
                licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
                
                // Navigation
                navigation: true,
                navigationPosition: 'right',
                navigationTooltips: this.sections.map(s => s.name),
                showActiveTooltip: true,
                
                // Scrolling
                scrollingSpeed: this.animationDuration,
                easing: 'easeInOutCubic',
                css3: true,
                
                // Sections
                anchors: this.sections.map(s => s.anchor),
                
                // Responsive
                responsiveWidth: 768,
                
                // Callbacks
                onLeave: (origin, destination, direction) => {
                    this.handleSectionLeave(origin, destination, direction);
                },
                afterLoad: (origin, destination, direction) => {
                    this.handleSectionLoad(origin, destination, direction);
                },
                afterResize: (width, height) => {
                    this.handleResize(width, height);
                }
            });

            console.log('[EnhancedFullPageManager] FullPage.js initialized');
            
        } catch (error) {
            console.error('[EnhancedFullPageManager] Error initializing FullPage.js:', error);
            this.initializeMobileScrolling();
        }
    }

    /**
     * Initialize mobile scrolling (fallback)
     */
    initializeMobileScrolling() {
        console.log('[EnhancedFullPageManager] Initializing mobile scrolling');
        
        // Enable normal scrolling
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        
        // Set up intersection observer for section animations
        this.setupIntersectionObserver();
        
        // Update sections for mobile
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.height = 'auto';
            section.style.minHeight = '100vh';
            section.style.padding = '2rem 0';
        });
    }

    /**
     * Setup intersection observer for mobile animations
     */
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -20% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const sectionIndex = Array.from(document.querySelectorAll('.section')).indexOf(section);
                    
                    // Trigger animations
                    this.animateSection(section, sectionIndex);
                    
                    // Update navigation
                    this.updateNavigation(sectionIndex);
                    
                    // Notify background manager
                    const anchor = section.getAttribute('data-anchor');
                    if (anchor) {
                        document.dispatchEvent(new CustomEvent('sectionChanged', {
                            detail: { sectionAnchor: anchor, sectionIndex }
                        }));
                    }
                }
            });
        }, options);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Handle section leave
     * @param {Object} origin - Origin section
     * @param {Object} destination - Destination section
     * @param {string} direction - Scroll direction
     */
    handleSectionLeave(origin, destination, direction) {
        this.isScrolling = true;
        
        // Remove animations from current section
        const currentSection = origin.item;
        this.removeAnimationsFromSection(currentSection);
        
        // Update scroll indicator
        this.updateScrollIndicator(destination.index);
        
        console.log(`[EnhancedFullPageManager] Leaving section ${origin.index} to ${destination.index}`);
    }

    /**
     * Handle section load
     * @param {Object} origin - Origin section
     * @param {Object} destination - Destination section
     * @param {string} direction - Scroll direction
     */
    handleSectionLoad(origin, destination, direction) {
        this.currentSection = destination.index;
        this.isScrolling = false;
        
        // Animate new section
        const newSection = destination.item;
        this.animateSection(newSection, destination.index);
        
        // Update navigation
        this.updateNavigation(destination.index);
        
        // Notify background manager
        const anchor = destination.anchor;
        if (anchor) {
            document.dispatchEvent(new CustomEvent('sectionChanged', {
                detail: { sectionAnchor: anchor, sectionIndex: destination.index }
            }));
        }
        
        console.log(`[EnhancedFullPageManager] Loaded section ${destination.index} (${anchor})`);
    }

    /**
     * Animate section elements
     * @param {HTMLElement} section - Section element
     * @param {number} sectionIndex - Section index
     */
    animateSection(section, sectionIndex) {
        // Add active class to section
        section.classList.add('active');
        
        // Animate content card
        const contentCard = section.querySelector('.content-card');
        if (contentCard) {
            setTimeout(() => {
                contentCard.classList.add('animated');
            }, 100);
        }
        
        // Animate elements with animation classes
        const animatedElements = section.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, 200 + (index * 100));
        });
        
        // Special animations for specific sections
        this.handleSpecialSectionAnimations(section, sectionIndex);
    }

    /**
     * Remove animations from section
     * @param {HTMLElement} section - Section element
     */
    removeAnimationsFromSection(section) {
        section.classList.remove('active');
        
        const contentCard = section.querySelector('.content-card');
        if (contentCard) {
            contentCard.classList.remove('animated');
        }
        
        const animatedElements = section.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            element.classList.remove('animated');
        });
    }

    /**
     * Handle special animations for specific sections
     * @param {HTMLElement} section - Section element
     * @param {number} sectionIndex - Section index
     */
    handleSpecialSectionAnimations(section, sectionIndex) {
        const anchor = section.getAttribute('data-anchor');
        
        switch (anchor) {
            case 'hero':
                this.animateHeroSection(section);
                break;
            case 'places-list':
                this.animatePlacesListSection(section);
                break;
            case 'map-view':
                this.animateMapSection(section);
                break;
        }
    }

    /**
     * Animate hero section
     * @param {HTMLElement} section - Hero section
     */
    animateHeroSection(section) {
        const title = section.querySelector('.title-gradient');
        if (title) {
            title.style.transform = 'translateY(50px)';
            title.style.opacity = '0';
            
            setTimeout(() => {
                title.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                title.style.transform = 'translateY(0)';
                title.style.opacity = '1';
            }, 300);
        }
    }

    /**
     * Animate places list section
     * @param {HTMLElement} section - Places list section
     */
    animatePlacesListSection(section) {
        const placeItems = section.querySelectorAll('.place-item');
        placeItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            }, 100 + (index * 50));
        });
    }

    /**
     * Animate map section
     * @param {HTMLElement} section - Map section
     */
    animateMapSection(section) {
        const mapContainer = section.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.style.transform = 'scale(0.9)';
            mapContainer.style.opacity = '0';
            
            setTimeout(() => {
                mapContainer.style.transition = 'all 0.6s ease-out';
                mapContainer.style.transform = 'scale(1)';
                mapContainer.style.opacity = '1';
            }, 400);
        }
    }

    /**
     * Setup scroll indicator
     */
    setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator-progress');
        if (indicator) {
            this.scrollIndicator = indicator;
        }
    }

    /**
     * Update scroll indicator
     * @param {number} sectionIndex - Current section index
     */
    updateScrollIndicator(sectionIndex) {
        if (this.scrollIndicator) {
            const progress = ((sectionIndex + 1) / this.sections.length) * 100;
            this.scrollIndicator.style.width = `${progress}%`;
        }
    }

    /**
     * Setup navigation dots
     */
    setupNavigationDots() {
        // FullPage.js handles this automatically
        // We can customize the appearance via CSS
    }

    /**
     * Update navigation state
     * @param {number} sectionIndex - Current section index
     */
    updateNavigation(sectionIndex) {
        // Update navigation state
        const navItems = document.querySelectorAll('#fp-nav ul li');
        navItems.forEach((item, index) => {
            if (index === sectionIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update main navigation
        const mainNav = document.getElementById('main-nav');
        if (mainNav) {
            if (sectionIndex > 0) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        
        // Handle scroll down indicator click
        const scrollDown = document.querySelector('.scroll-down');
        if (scrollDown) {
            scrollDown.addEventListener('click', () => {
                this.moveToNextSection();
            });
        }
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        const wasMobile = this.isMobile;
        this.checkMobileDevice();
        
        if (wasMobile !== this.isMobile) {
            // Device type changed, reinitialize
            this.cleanup();
            setTimeout(() => {
                this.initialize();
            }, 100);
        }
    }

    /**
     * Handle resize callback from FullPage.js
     * @param {number} width - Window width
     * @param {number} height - Window height
     */
    handleResize(width, height) {
        console.log(`[EnhancedFullPageManager] Resized to ${width}x${height}`);
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNavigation(e) {
        if (this.isScrolling) return;
        
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                this.moveToNextSection();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.moveToPreviousSection();
                break;
            case 'Home':
                e.preventDefault();
                this.moveToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.moveToSection(this.sections.length - 1);
                break;
        }
    }

    /**
     * Move to next section
     */
    moveToNextSection() {
        if (this.fullpage) {
            this.fullpage.moveSectionDown();
        } else {
            // Mobile fallback
            const nextSection = document.querySelectorAll('.section')[this.currentSection + 1];
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Move to previous section
     */
    moveToPreviousSection() {
        if (this.fullpage) {
            this.fullpage.moveSectionUp();
        } else {
            // Mobile fallback
            const prevSection = document.querySelectorAll('.section')[this.currentSection - 1];
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Move to specific section
     * @param {number} sectionIndex - Section index
     */
    moveToSection(sectionIndex) {
        if (this.fullpage) {
            this.fullpage.moveTo(sectionIndex + 1); // FullPage.js uses 1-based indexing
        } else {
            // Mobile fallback
            const section = document.querySelectorAll('.section')[sectionIndex];
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Move to section by anchor
     * @param {string} anchor - Section anchor
     */
    moveToSectionByAnchor(anchor) {
        const sectionIndex = this.sections.findIndex(s => s.anchor === anchor);
        if (sectionIndex !== -1) {
            this.moveToSection(sectionIndex);
        }
    }

    /**
     * Get current section info
     * @returns {Object} Current section info
     */
    getCurrentSection() {
        return {
            index: this.currentSection,
            anchor: this.sections[this.currentSection]?.anchor,
            name: this.sections[this.currentSection]?.name
        };
    }

    /**
     * Enable/disable scrolling
     * @param {boolean} enabled - Whether scrolling should be enabled
     */
    setScrollingEnabled(enabled) {
        if (this.fullpage) {
            if (enabled) {
                this.fullpage.setAllowScrolling(true);
            } else {
                this.fullpage.setAllowScrolling(false);
            }
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[EnhancedFullPageManager] Cleaning up...');
        
        if (this.fullpage) {
            this.fullpage.destroy('all');
            this.fullpage = null;
        }
        
        // Reset styles
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.height = '';
            section.style.minHeight = '';
            section.style.padding = '';
            section.classList.remove('active');
        });
        
        this.isInitialized = false;
    }
}

// Create and export enhanced fullpage manager instance
window.enhancedFullPageManager = new EnhancedFullPageManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.enhancedFullPageManager.initialize();
    }, 100);
});
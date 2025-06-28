/**
 * Parallax Scroll Manager
 * Handles parallax scrolling effects and section transitions
 */

class ParallaxScrollManager {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollIndicator = null;
        this.navBar = null;
        this.isInitialized = false;
        this.backgroundManager = window.backgroundManager;
    }

    /**
     * Initialize the parallax scroll manager
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('[ParallaxScrollManager] Initializing...');
        
        // Get all sections
        this.sections = document.querySelectorAll('.section');
        this.scrollIndicator = document.querySelector('.scroll-indicator-progress');
        this.navBar = document.getElementById('main-nav');
        
        if (this.sections.length === 0) {
            console.warn('[ParallaxScrollManager] No sections found');
            return;
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial update
        this.updateScrollIndicator();
        this.updateNavBar();
        
        // Set current section based on scroll position
        this.setCurrentSectionFromScroll();
        
        this.isInitialized = true;
        console.log('[ParallaxScrollManager] Initialized successfully');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Scroll event
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Resize event
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Setup scroll down buttons
        const scrollDownBtns = document.querySelectorAll('.scroll-down');
        scrollDownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        });
        
        // Setup navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            });
        });
    }

    /**
     * Handle scroll event
     */
    handleScroll() {
        if (this.isScrolling) return;
        
        // Update scroll indicator
        this.updateScrollIndicator();
        
        // Update navigation bar
        this.updateNavBar();
        
        // Update current section
        this.setCurrentSectionFromScroll();
        
        // Apply parallax effect
        this.applyParallaxEffect();
    }

    /**
     * Handle resize event
     */
    handleResize() {
        // Update current section
        this.setCurrentSectionFromScroll();
    }

    /**
     * Update scroll indicator
     */
    updateScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        
        this.scrollIndicator.style.width = `${scrollProgress}%`;
    }

    /**
     * Update navigation bar
     */
    updateNavBar() {
        if (!this.navBar) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            this.navBar.classList.add('scrolled');
        } else {
            this.navBar.classList.remove('scrolled');
        }
    }

    /**
     * Set current section based on scroll position
     */
    setCurrentSectionFromScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop - windowHeight / 2 && scrollTop < sectionTop + sectionHeight - windowHeight / 2) {
                this.currentSection = i;
                this.updateBackgrounds();
                break;
            }
        }
    }

    /**
     * Apply parallax effect to backgrounds
     */
    applyParallaxEffect() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        this.sections.forEach(section => {
            const bgOverlay = section.querySelector('.bg-overlay');
            if (bgOverlay) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const offset = scrollTop - sectionTop;
                const parallaxSpeed = 0.5;
                
                // Only apply effect if section is in view
                if (offset > -sectionHeight && offset < window.innerHeight) {
                    bgOverlay.style.transform = `translateY(${offset * parallaxSpeed}px)`;
                }
            }
        });
    }

    /**
     * Update backgrounds based on current section
     */
    updateBackgrounds() {
        // If background manager exists, update background
        if (this.backgroundManager) {
            const currentSection = this.sections[this.currentSection];
            const bgOverlay = currentSection.querySelector('.bg-overlay');
            
            if (bgOverlay) {
                const bgClass = Array.from(bgOverlay.classList).find(cls => cls.startsWith('bg-'));
                if (bgClass) {
                    const country = bgClass.replace('bg-', '');
                    this.backgroundManager.setBackground(country);
                }
            }
        }
    }

    /**
     * Scroll to specific section
     * @param {HTMLElement} section - Target section
     */
    scrollToSection(section) {
        if (!section) return;
        
        this.isScrolling = true;
        
        const targetPosition = section.offsetTop;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    /**
     * Scroll to next section
     */
    scrollToNextSection() {
        const nextSection = this.currentSection + 1;
        
        if (nextSection < this.sections.length) {
            this.scrollToSection(this.sections[nextSection]);
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        console.log('[ParallaxScrollManager] Cleaning up...');
        // Remove event listeners if needed
    }
}

// Create and export parallax scroll manager instance
window.parallaxScrollManager = new ParallaxScrollManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.parallaxScrollManager.initialize();
});
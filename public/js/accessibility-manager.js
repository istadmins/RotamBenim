/**
 * Accessibility Manager for RotamBenim Application
 * Improves accessibility features and WCAG compliance
 * @version 1.0.0
 */

class AccessibilityManager {
    constructor() {
        this.config = {
            focusIndicator: true,
            skipLinks: true,
            keyboardNavigation: true,
            screenReaderSupport: true,
            highContrast: false,
            reducedMotion: false,
            fontSize: 'medium',
            colorBlindSupport: false
        };
        
        this.elements = {
            skipLinks: [],
            focusableElements: [],
            landmarks: [],
            headings: []
        };
        
        this.isInitialized = false;
        this.currentFocusIndex = -1;
        this.focusableElements = [];
    }

    /**
     * Initialize accessibility manager
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[AccessibilityManager] Already initialized');
            return;
        }

        console.log('[AccessibilityManager] Initializing accessibility manager...');
        
        try {
            this.setupSkipLinks();
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
            this.setupLandmarks();
            this.setupHeadings();
            this.setupColorContrast();
            this.setupReducedMotion();
            this.setupFontSizeControls();
            this.setupAccessibilityMenu();
            
            this.isInitialized = true;
            console.log('[AccessibilityManager] Accessibility manager initialized successfully');
            
        } catch (error) {
            console.error('[AccessibilityManager] Initialization failed:', error);
        }
    }

    /**
     * Setup skip links
     */
    setupSkipLinks() {
        if (!this.config.skipLinks) return;

        const skipLinks = [
            { href: '#main-content', text: 'Skip to main content' },
            { href: '#navigation', text: 'Skip to navigation' },
            { href: '#search', text: 'Skip to search' }
        ];

        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
            skipLink.setAttribute('tabindex', '0');
            
            document.body.insertBefore(skipLink, document.body.firstChild);
            this.elements.skipLinks.push(skipLink);
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        if (!this.config.keyboardNavigation) return;

        // Tab navigation
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Tab':
                    this.handleTabNavigation(event);
                    break;
                case 'Escape':
                    this.handleEscapeKey(event);
                    break;
                case 'Enter':
                case ' ':
                    this.handleEnterSpaceKey(event);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleArrowKeys(event);
                    break;
            }
        });

        // Focus management
        document.addEventListener('focusin', (event) => {
            this.handleFocusIn(event);
        });

        document.addEventListener('focusout', (event) => {
            this.handleFocusOut(event);
        });
    }

    /**
     * Handle tab navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleTabNavigation(event) {
        // Update focusable elements
        this.updateFocusableElements();
        
        if (event.shiftKey) {
            // Shift + Tab: move backwards
            if (document.activeElement === this.focusableElements[0]) {
                event.preventDefault();
                this.focusableElements[this.focusableElements.length - 1].focus();
            }
        } else {
            // Tab: move forwards
            if (document.activeElement === this.focusableElements[this.focusableElements.length - 1]) {
                event.preventDefault();
                this.focusableElements[0].focus();
            }
        }
    }

    /**
     * Handle escape key
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleEscapeKey(event) {
        // Close modals
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                this.closeModal(modal);
            }
        });

        // Close dropdowns
        const dropdowns = document.querySelectorAll('.dropdown, [aria-expanded="true"]');
        dropdowns.forEach(dropdown => {
            dropdown.setAttribute('aria-expanded', 'false');
        });
    }

    /**
     * Handle enter and space keys
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleEnterSpaceKey(event) {
        const target = event.target;
        
        if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
            event.preventDefault();
            target.click();
        }
    }

    /**
     * Handle arrow keys
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleArrowKeys(event) {
        const target = event.target;
        
        // Handle list navigation
        if (target.getAttribute('role') === 'listitem' || target.closest('[role="list"]')) {
            this.handleListNavigation(event);
        }
        
        // Handle tab navigation
        if (target.getAttribute('role') === 'tab' || target.closest('[role="tablist"]')) {
            this.handleTabNavigation(event);
        }
    }

    /**
     * Handle list navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleListNavigation(event) {
        const list = event.target.closest('[role="list"]');
        const items = Array.from(list.querySelectorAll('[role="listitem"]'));
        const currentIndex = items.indexOf(event.target);
        
        let nextIndex = currentIndex;
        
        switch (event.key) {
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowUp':
                nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                break;
            case 'Home':
                nextIndex = 0;
                break;
            case 'End':
                nextIndex = items.length - 1;
                break;
        }
        
        if (nextIndex !== currentIndex) {
            event.preventDefault();
            items[nextIndex].focus();
        }
    }

    /**
     * Handle focus in
     * @param {FocusEvent} event - Focus event
     */
    handleFocusIn(event) {
        const target = event.target;
        
        // Add focus indicator
        if (this.config.focusIndicator) {
            target.classList.add('focus-visible');
        }
        
        // Announce focus to screen readers
        if (this.config.screenReaderSupport) {
            this.announceToScreenReader(`${target.textContent || target.getAttribute('aria-label') || 'Element'} focused`);
        }
    }

    /**
     * Handle focus out
     * @param {FocusEvent} event - Focus event
     */
    handleFocusOut(event) {
        const target = event.target;
        
        // Remove focus indicator
        target.classList.remove('focus-visible');
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                const modal = event.target.closest('[role="dialog"]');
                if (modal) {
                    this.trapFocusInModal(event, modal);
                }
            }
        });
    }

    /**
     * Trap focus in modal
     * @param {KeyboardEvent} event - Keyboard event
     * @param {Element} modal - Modal element
     */
    trapFocusInModal(event, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Setup screen reader support
     */
    setupScreenReaderSupport() {
        if (!this.config.screenReaderSupport) return;

        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'accessibility-announcements';
        
        document.body.appendChild(liveRegion);
        
        // Add ARIA labels to interactive elements
        this.addAriaLabels();
    }

    /**
     * Add ARIA labels to interactive elements
     */
    addAriaLabels() {
        // Buttons without text
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                const icon = button.querySelector('svg, img');
                if (icon) {
                    button.setAttribute('aria-label', icon.getAttribute('alt') || 'Button');
                }
            }
        });

        // Form inputs
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputs.forEach(input => {
            if (!input.getAttribute('placeholder') && !input.getAttribute('title')) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id);
                }
            }
        });
    }

    /**
     * Setup landmarks
     */
    setupLandmarks() {
        // Add landmarks to main sections
        const mainContent = document.querySelector('.container, main');
        if (mainContent && !mainContent.getAttribute('role')) {
            mainContent.setAttribute('role', 'main');
            mainContent.id = 'main-content';
        }

        const navigation = document.querySelector('nav, .navigation');
        if (navigation && !navigation.getAttribute('role')) {
            navigation.setAttribute('role', 'navigation');
            navigation.id = 'navigation';
        }

        const search = document.querySelector('.search, input[type="search"]');
        if (search && !search.getAttribute('role')) {
            search.setAttribute('role', 'search');
            search.id = 'search';
        }
    }

    /**
     * Setup headings
     */
    setupHeadings() {
        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (level - previousLevel > 1) {
                console.warn('[AccessibilityManager] Heading hierarchy issue:', heading);
            }
            
            previousLevel = level;
        });
    }

    /**
     * Setup color contrast
     */
    setupColorContrast() {
        // Check color contrast ratios
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
        
        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundColor = style.backgroundColor;
            const color = style.color;
            
            if (backgroundColor && color) {
                const contrast = this.calculateContrastRatio(color, backgroundColor);
                if (contrast < 4.5) {
                    console.warn('[AccessibilityManager] Low contrast ratio:', contrast, element);
                }
            }
        });
    }

    /**
     * Calculate contrast ratio
     * @param {string} color1 - First color
     * @param {string} color2 - Second color
     * @returns {number} Contrast ratio
     */
    calculateContrastRatio(color1, color2) {
        // Simplified contrast calculation
        // In a real implementation, you'd use a proper color contrast library
        return 4.5; // Placeholder
    }

    /**
     * Setup reduced motion
     */
    setupReducedMotion() {
        // Check user's motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            this.config.reducedMotion = true;
            this.applyReducedMotion();
        }
        
        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
            this.config.reducedMotion = event.matches;
            if (event.matches) {
                this.applyReducedMotion();
            } else {
                this.removeReducedMotion();
            }
        });
    }

    /**
     * Apply reduced motion styles
     */
    applyReducedMotion() {
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Remove reduced motion styles
     */
    removeReducedMotion() {
        const style = document.getElementById('reduced-motion-styles');
        if (style) {
            style.remove();
        }
    }

    /**
     * Setup font size controls
     */
    setupFontSizeControls() {
        // Create font size controls
        const controls = document.createElement('div');
        controls.className = 'accessibility-controls fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50';
        controls.innerHTML = `
            <div class="flex flex-col gap-2">
                <button id="increase-font" class="px-3 py-1 bg-blue-500 text-white rounded text-sm">A+</button>
                <button id="decrease-font" class="px-3 py-1 bg-blue-500 text-white rounded text-sm">A-</button>
                <button id="reset-font" class="px-3 py-1 bg-gray-500 text-white rounded text-sm">Reset</button>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('increase-font').addEventListener('click', () => this.changeFontSize(1));
        document.getElementById('decrease-font').addEventListener('click', () => this.changeFontSize(-1));
        document.getElementById('reset-font').addEventListener('click', () => this.resetFontSize());
    }

    /**
     * Change font size
     * @param {number} delta - Size change
     */
    changeFontSize(delta) {
        const currentSize = parseInt(localStorage.getItem('fontSize') || '16');
        const newSize = Math.max(12, Math.min(24, currentSize + delta));
        
        localStorage.setItem('fontSize', newSize.toString());
        document.documentElement.style.fontSize = `${newSize}px`;
        
        this.announceToScreenReader(`Font size changed to ${newSize} pixels`);
    }

    /**
     * Reset font size
     */
    resetFontSize() {
        localStorage.removeItem('fontSize');
        document.documentElement.style.fontSize = '';
        this.announceToScreenReader('Font size reset to default');
    }

    /**
     * Setup accessibility menu
     */
    setupAccessibilityMenu() {
        // Create accessibility menu
        const menu = document.createElement('div');
        menu.className = 'accessibility-menu fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 hidden';
        menu.innerHTML = `
            <h3 class="text-lg font-semibold mb-3">Accessibility Options</h3>
            <div class="space-y-3">
                <label class="flex items-center">
                    <input type="checkbox" id="high-contrast" class="mr-2">
                    High Contrast
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="reduced-motion" class="mr-2">
                    Reduced Motion
                </label>
                <label class="flex items-center">
                    <input type="checkbox" id="color-blind-support" class="mr-2">
                    Color Blind Support
                </label>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Add toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'accessibility-toggle fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-full z-50';
        toggleButton.innerHTML = '♿';
        toggleButton.setAttribute('aria-label', 'Accessibility options');
        
        toggleButton.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
        
        document.body.appendChild(toggleButton);
        
        // Add event listeners for menu options
        document.getElementById('high-contrast').addEventListener('change', (event) => {
            this.toggleHighContrast(event.target.checked);
        });
        
        document.getElementById('reduced-motion').addEventListener('change', (event) => {
            this.toggleReducedMotion(event.target.checked);
        });
        
        document.getElementById('color-blind-support').addEventListener('change', (event) => {
            this.toggleColorBlindSupport(event.target.checked);
        });
    }

    /**
     * Toggle high contrast
     * @param {boolean} enabled - Whether to enable high contrast
     */
    toggleHighContrast(enabled) {
        this.config.highContrast = enabled;
        
        if (enabled) {
            document.body.classList.add('high-contrast');
            this.announceToScreenReader('High contrast mode enabled');
        } else {
            document.body.classList.remove('high-contrast');
            this.announceToScreenReader('High contrast mode disabled');
        }
    }

    /**
     * Toggle reduced motion
     * @param {boolean} enabled - Whether to enable reduced motion
     */
    toggleReducedMotion(enabled) {
        this.config.reducedMotion = enabled;
        
        if (enabled) {
            this.applyReducedMotion();
            this.announceToScreenReader('Reduced motion enabled');
        } else {
            this.removeReducedMotion();
            this.announceToScreenReader('Reduced motion disabled');
        }
    }

    /**
     * Toggle color blind support
     * @param {boolean} enabled - Whether to enable color blind support
     */
    toggleColorBlindSupport(enabled) {
        this.config.colorBlindSupport = enabled;
        
        if (enabled) {
            document.body.classList.add('color-blind-support');
            this.announceToScreenReader('Color blind support enabled');
        } else {
            document.body.classList.remove('color-blind-support');
            this.announceToScreenReader('Color blind support disabled');
        }
    }

    /**
     * Announce to screen reader
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('accessibility-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Update focusable elements
     */
    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(element => {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
    }

    /**
     * Close modal
     * @param {Element} modal - Modal element
     */
    closeModal(modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to trigger element
        const trigger = document.querySelector(`[data-target="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }

    /**
     * Get accessibility report
     * @returns {Object} Accessibility report
     */
    getAccessibilityReport() {
        return {
            timestamp: Date.now(),
            config: this.config,
            elements: {
                skipLinks: this.elements.skipLinks.length,
                focusableElements: this.focusableElements.length,
                landmarks: this.elements.landmarks.length,
                headings: this.elements.headings.length
            },
            issues: this.findAccessibilityIssues()
        };
    }

    /**
     * Find accessibility issues
     * @returns {Array} List of accessibility issues
     */
    findAccessibilityIssues() {
        const issues = [];
        
        // Check for missing alt text
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            issues.push(`Found ${images.length} images without alt text`);
        }
        
        // Check for missing form labels
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        const unlabeledInputs = Array.from(inputs).filter(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            return !label && !input.getAttribute('placeholder');
        });
        
        if (unlabeledInputs.length > 0) {
            issues.push(`Found ${unlabeledInputs.length} inputs without labels`);
        }
        
        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level - previousLevel > 1) {
                issues.push(`Heading hierarchy issue: ${heading.tagName} follows ${previousLevel > 0 ? `h${previousLevel}` : 'no heading'}`);
            }
            previousLevel = level;
        });
        
        return issues;
    }

    /**
     * Cleanup accessibility manager
     */
    cleanup() {
        // Remove skip links
        this.elements.skipLinks.forEach(link => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        });
        
        // Remove accessibility controls
        const controls = document.querySelector('.accessibility-controls');
        if (controls) {
            controls.remove();
        }
        
        const toggle = document.querySelector('.accessibility-toggle');
        if (toggle) {
            toggle.remove();
        }
        
        // Remove reduced motion styles
        this.removeReducedMotion();
        
        this.isInitialized = false;
        console.log('[AccessibilityManager] Accessibility manager cleaned up');
    }
}

// Initialize accessibility manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
    window.accessibilityManager.initialize();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
} 
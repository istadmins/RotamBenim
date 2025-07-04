/**
 * UI Components service for RotamBenim application
 * Handles common UI operations like toasts, modals, loading states, etc.
 */

class UIComponents {
    constructor() {
        this.toasts = new Map();
        this.modals = new Map();
        this.loadingStates = new Map();
        this.isInitialized = false;
        
        // Configuration
        this.config = {
            toastDuration: 3000,
            animationDuration: 300,
            maxToasts: 5
        };
    }

    /**
     * Initialize UI components
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[UIComponents] Already initialized');
            return;
        }

        this.createToastContainer();
        this.setupGlobalStyles();
        this.setupKeyboardHandlers();
        
        this.isInitialized = true;
        console.log('[UIComponents] UI Components initialized');
    }

    /**
     * Create toast container if it doesn't exist
     */
    createToastContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'fixed top-4 right-4 z-50 space-y-2 pointer-events-none';
            document.body.appendChild(container);
        }
        this.toastContainer = container;
    }

    /**
     * Setup global styles for UI components
     */
    setupGlobalStyles() {
        const styleId = 'ui-components-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Toast Styles */
            .toast {
                pointer-events: auto;
                transform: translateX(100%);
                transition: all 0.3s ease-in-out;
                max-width: 400px;
                word-wrap: break-word;
            }
            
            .toast.show {
                transform: translateX(0);
            }
            
            .toast.hide {
                transform: translateX(100%);
                opacity: 0;
            }
            
            .toast-success {
                background-color: #10b981;
                border-left: 4px solid #059669;
            }
            
            .toast-error {
                background-color: #ef4444;
                border-left: 4px solid #dc2626;
            }
            
            .toast-warning {
                background-color: #f59e0b;
                border-left: 4px solid #d97706;
            }
            
            .toast-info {
                background-color: #3b82f6;
                border-left: 4px solid #2563eb;
            }

            /* Modal Styles */
            .modal-overlay {
                backdrop-filter: blur(4px);
                animation: fadeIn 0.3s ease-out;
            }
            
            .modal-content {
                animation: slideInUp 0.3s ease-out;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Loading Styles */
            .loading-overlay {
                backdrop-filter: blur(2px);
            }
            
            .loading-spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Button Styles */
            .btn-primary {
                background-color: #3b82f6;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .btn-primary:hover {
                background-color: #2563eb;
            }
            
            .btn-secondary {
                background-color: #6b7280;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .btn-secondary:hover {
                background-color: #4b5563;
            }

            /* Utility Classes */
            .highlight-duplicate {
                animation: highlightPulse 2s ease-in-out;
                border: 2px solid #f59e0b !important;
            }
            
            @keyframes highlightPulse {
                0%, 100% { background-color: transparent; }
                50% { background-color: rgba(245, 158, 11, 0.1); }
            }
            
            .card-pulse {
                animation: cardPulse 0.3s ease-in-out;
            }
            
            @keyframes cardPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup keyboard handlers for UI components
     */
    setupKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals and clear toasts
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.clearAllToasts();
            }
        });
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds (0 for persistent)
     * @returns {string} Toast ID
     */
    showToast(message, type = 'info', duration = null) {
        const toastId = Utils.generateId();
        const toastDuration = duration !== null ? duration : this.config.toastDuration;

        // Limit number of toasts
        if (this.toasts.size >= this.config.maxToasts) {
            const oldestToast = this.toasts.keys().next().value;
            this.hideToast(oldestToast);
        }

        const toast = document.createElement('div');
        toast.id = `toast-${toastId}`;
        toast.className = `toast toast-${type} text-white p-4 rounded-lg shadow-lg flex items-start justify-between`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 mr-3">
                    ${icon}
                </div>
                <div class="flex-grow">
                    <p class="text-sm font-medium">${Utils.escapeHTML(message)}</p>
                </div>
            </div>
            <button class="ml-4 flex-shrink-0 text-white hover:text-gray-200 focus:outline-none" onclick="window.uiComponents.hideToast('${toastId}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;

        this.toastContainer.appendChild(toast);
        this.toasts.set(toastId, { element: toast, type, message });

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-hide if duration is set
        if (toastDuration > 0) {
            setTimeout(() => {
                this.hideToast(toastId);
            }, toastDuration);
        }

        return toastId;
    }

    /**
     * Get icon for toast type
     * @param {string} type - Toast type
     * @returns {string} SVG icon
     */
    getToastIcon(type) {
        const icons = {
            success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>`,
            error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>`,
            warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>`,
            info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * Hide specific toast
     * @param {string} toastId - Toast ID
     */
    hideToast(toastId) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) return;

        const toast = toastData.element;
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(toastId);
        }, this.config.animationDuration);
    }

    /**
     * Clear all toasts
     */
    clearAllToasts() {
        this.toasts.forEach((_, toastId) => {
            this.hideToast(toastId);
        });
    }

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {string} title - Dialog title
     * @param {Object} options - Dialog options
     * @returns {Promise<boolean>} User's choice
     */
    showConfirmDialog(message, title = 'Confirm', options = {}) {
        return new Promise((resolve) => {
            const modalId = Utils.generateId();
            const {
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                confirmClass = 'btn-primary',
                cancelClass = 'btn-secondary'
            } = options;

            const modal = document.createElement('div');
            modal.id = `modal-${modalId}`;
            modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            
            modal.innerHTML = `
                <div class="modal-content bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">${Utils.escapeHTML(title)}</h3>
                        <p class="text-gray-600 mb-6">${Utils.escapeHTML(message)}</p>
                        <div class="flex justify-end space-x-3">
                            <button id="cancel-${modalId}" class="${cancelClass}">${Utils.escapeHTML(cancelText)}</button>
                            <button id="confirm-${modalId}" class="${confirmClass}">${Utils.escapeHTML(confirmText)}</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            this.modals.set(modalId, { element: modal, resolve });

            // Event listeners
            document.getElementById(`confirm-${modalId}`).addEventListener('click', () => {
                this.closeModal(modalId);
                resolve(true);
            });

            document.getElementById(`cancel-${modalId}`).addEventListener('click', () => {
                this.closeModal(modalId);
                resolve(false);
            });

            // Close on overlay click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modalId);
                    resolve(false);
                }
            });
        });
    }

    /**
     * Show custom modal
     * @param {string} content - Modal content HTML
     * @param {Object} options - Modal options
     * @returns {string} Modal ID
     */
    showModal(content, options = {}) {
        const modalId = Utils.generateId();
        const {
            title = '',
            size = 'md',
            closable = true,
            overlay = true
        } = options;

        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl'
        };

        const modal = document.createElement('div');
        modal.id = `modal-${modalId}`;
        modal.className = `modal-overlay fixed inset-0 ${overlay ? 'bg-black bg-opacity-50' : ''} flex items-center justify-center z-50`;
        
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4">
                ${title ? `
                    <div class="flex items-center justify-between p-4 border-b">
                        <h3 class="text-lg font-semibold text-gray-900">${Utils.escapeHTML(title)}</h3>
                        ${closable ? `
                            <button class="text-gray-400 hover:text-gray-600 focus:outline-none" onclick="window.uiComponents.closeModal('${modalId}')">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
                <div class="p-6">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        this.modals.set(modalId, { element: modal });

        // Close on overlay click if closable
        if (closable && overlay) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modalId);
                }
            });
        }

        return modalId;
    }

    /**
     * Close specific modal
     * @param {string} modalId - Modal ID
     */
    closeModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        const modal = modalData.element;
        modal.style.opacity = '0';

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            this.modals.delete(modalId);
            
            // Restore body scroll if no modals are open
            if (this.modals.size === 0) {
                document.body.style.overflow = '';
            }
        }, this.config.animationDuration);
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        this.modals.forEach((_, modalId) => {
            this.closeModal(modalId);
        });
    }

    /**
     * Show loading state
     * @param {string} message - Loading message
     * @param {string} target - Target element ID (optional)
     * @returns {string} Loading ID
     */
    showLoading(message = 'Loading...', target = null) {
        const loadingId = Utils.generateId();
        
        const loading = document.createElement('div');
        loading.id = `loading-${loadingId}`;
        loading.className = 'loading-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40';
        
        loading.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
                <div class="loading-spinner"></div>
                <span class="text-gray-700">${Utils.escapeHTML(message)}</span>
            </div>
        `;

        if (target) {
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.style.position = 'relative';
                loading.className = 'absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10';
                targetElement.appendChild(loading);
            } else {
                document.body.appendChild(loading);
            }
        } else {
            document.body.appendChild(loading);
        }

        this.loadingStates.set(loadingId, { element: loading, target });
        return loadingId;
    }

    /**
     * Hide loading state
     * @param {string} loadingId - Loading ID
     */
    hideLoading(loadingId) {
        const loadingData = this.loadingStates.get(loadingId);
        if (!loadingData) return;

        const loading = loadingData.element;
        if (loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
        this.loadingStates.delete(loadingId);
    }

    /**
     * Show empty state
     * @param {HTMLElement} container - Container element
     * @param {string} message - Empty state message
     * @param {string} icon - Icon HTML (optional)
     */
    showEmptyState(container, message, icon = '') {
        container.innerHTML = `
            <div class="text-center py-8">
                ${icon}
                <p class="text-gray-500 text-lg mb-2">${Utils.escapeHTML(message)}</p>
            </div>
        `;
    }

    /**
     * Animate element
     * @param {HTMLElement} element - Element to animate
     * @param {string} animation - Animation class
     * @param {number} duration - Animation duration
     */
    animateElement(element, animation, duration = 300) {
        element.classList.add(animation);
        setTimeout(() => {
            element.classList.remove(animation);
        }, duration);
    }

    /**
     * Smooth scroll to element
     * @param {string|HTMLElement} target - Target element or selector
     * @param {Object} options - Scroll options
     */
    scrollToElement(target, options = {}) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const {
            behavior = 'smooth',
            block = 'start',
            inline = 'nearest',
            offset = 0
        } = options;

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior
        });
    }

    /**
     * Get component status
     * @returns {Object} Component status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            activeToasts: this.toasts.size,
            activeModals: this.modals.size,
            activeLoadingStates: this.loadingStates.size
        };
    }

    /**
     * Clean up all UI components
     */
    cleanup() {
        console.log('[UIComponents] Cleaning up...');
        
        this.clearAllToasts();
        this.closeAllModals();
        
        this.loadingStates.forEach((_, loadingId) => {
            this.hideLoading(loadingId);
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('[UIComponents] Cleanup completed');
    }
}

// Create global instance
window.uiComponents = new UIComponents();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
}
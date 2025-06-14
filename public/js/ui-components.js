/**
 * UI Components for RotamBenim application
 * Handles UI interactions, notifications, and component management
 */

class UIComponents {
    constructor() {
        this.toastContainer = document.getElementById('toastContainer');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.activeToasts = new Map();
        this.toastCounter = 0;
    }

    /**
     * Show loading overlay
     * @param {string} message - Loading message
     */
    showLoading(message = MESSAGES.general.loading) {
        if (this.loadingOverlay) {
            const messageElement = this.loadingOverlay.querySelector('span');
            if (messageElement) {
                messageElement.textContent = message;
            }
            this.loadingOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     * @returns {string} Toast ID
     */
    showToast(message, type = 'info', duration = APP_CONFIG.toastDuration) {
        if (!this.toastContainer) {
            console.warn('[UIComponents] Toast container not found');
            return null;
        }

        const toastId = `toast-${++this.toastCounter}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast ${type} fade-in`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    ${icon}
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-gray-900">${Utils.escapeHTML(message)}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150" onclick="uiComponents.removeToast('${toastId}')" aria-label="Bildirimi kapat">
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.toastContainer.appendChild(toast);
        this.activeToasts.set(toastId, toast);

        // Auto-remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toastId);
            }, duration);
        }

        return toastId;
    }

    /**
     * Get icon for toast type
     * @param {string} type - Toast type
     * @returns {string} SVG icon HTML
     */
    getToastIcon(type) {
        const icons = {
            success: `<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * Remove toast notification
     * @param {string} toastId - Toast ID
     */
    removeToast(toastId) {
        const toast = this.activeToasts.get(toastId);
        if (toast) {
            toast.classList.add('removing');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.activeToasts.delete(toastId);
            }, 300);
        }
    }

    /**
     * Clear all toasts
     */
    clearAllToasts() {
        this.activeToasts.forEach((toast, toastId) => {
            this.removeToast(toastId);
        });
    }

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {string} title - Dialog title
     * @returns {Promise<boolean>} User confirmation
     */
    async showConfirmDialog(message, title = 'Onay') {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 fade-in">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">${Utils.escapeHTML(title)}</h3>
                    <p class="text-gray-600 mb-6">${Utils.escapeHTML(message)}</p>
                    <div class="flex justify-end space-x-3">
                        <button id="cancelBtn" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                            ${MESSAGES.general.cancel}
                        </button>
                        <button id="confirmBtn" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200">
                            ${MESSAGES.general.confirm}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);
            document.body.style.overflow = 'hidden';

            const confirmBtn = dialog.querySelector('#confirmBtn');
            const cancelBtn = dialog.querySelector('#cancelBtn');

            const cleanup = () => {
                document.body.removeChild(dialog);
                document.body.style.overflow = '';
            };

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Close on escape key
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleKeyDown);
                    cleanup();
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleKeyDown);

            // Focus on confirm button
            confirmBtn.focus();
        });
    }

    /**
     * Create skeleton loader
     * @param {number} lines - Number of skeleton lines
     * @returns {string} Skeleton HTML
     */
    createSkeleton(lines = 3) {
        let skeletonHTML = '<div class="animate-pulse">';
        for (let i = 0; i < lines; i++) {
            const width = Math.random() * 40 + 60; // Random width between 60-100%
            skeletonHTML += `<div class="skeleton h-4 bg-gray-200 rounded mb-2" style="width: ${width}%"></div>`;
        }
        skeletonHTML += '</div>';
        return skeletonHTML;
    }

    /**
     * Show empty state
     * @param {HTMLElement} container - Container element
     * @param {string} message - Empty state message
     * @param {string} icon - Icon HTML (optional)
     */
    showEmptyState(container, message, icon = '') {
        if (!container) return;
        
        container.innerHTML = `
            <div class="text-center py-12">
                ${icon ? `<div class="mb-4">${icon}</div>` : ''}
                <p class="text-gray-500 text-lg">${Utils.escapeHTML(message)}</p>
            </div>
        `;
    }

    /**
     * Show error state
     * @param {HTMLElement} container - Container element
     * @param {string} message - Error message
     * @param {Function} retryCallback - Retry function (optional)
     */
    showErrorState(container, message, retryCallback = null) {
        if (!container) return;

        const retryButton = retryCallback ? `
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200" onclick="(${retryCallback.toString()})()">
                ${MESSAGES.general.retry}
            </button>
        ` : '';

        container.innerHTML = `
            <div class="text-center py-12">
                <div class="mb-4">
                    <svg class="h-12 w-12 text-red-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <p class="text-gray-600 text-lg mb-2">Bir hata oluştu</p>
                <p class="text-gray-500 text-sm">${Utils.escapeHTML(message)}</p>
                ${retryButton}
            </div>
        `;
    }

    /**
     * Animate element entrance
     * @param {HTMLElement} element - Element to animate
     * @param {string} animation - Animation class
     */
    animateIn(element, animation = 'fade-in') {
        if (!element) return;
        element.classList.add(animation);
    }

    /**
     * Animate element exit
     * @param {HTMLElement} element - Element to animate
     * @param {string} animation - Animation class
     * @returns {Promise<void>} Animation completion promise
     */
    animateOut(element, animation = 'fade-out') {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            element.classList.add(animation);
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }

    /**
     * Update button loading state
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     * @param {string} loadingText - Loading text (optional)
     */
    setButtonLoading(button, loading, loadingText = '') {
        if (!button) return;

        const textElement = button.querySelector('span:not(.loader)');
        const loaderElement = button.querySelector('.loader');

        if (loading) {
            button.disabled = true;
            if (textElement && loadingText) {
                textElement.textContent = loadingText;
            }
            if (loaderElement) {
                loaderElement.classList.remove('hidden');
            }
        } else {
            button.disabled = false;
            if (loaderElement) {
                loaderElement.classList.add('hidden');
            }
        }
    }

    /**
     * Create badge element
     * @param {string} text - Badge text
     * @param {string} type - Badge type (primary, secondary, success, warning, error)
     * @returns {HTMLElement} Badge element
     */
    createBadge(text, type = 'primary') {
        const badge = document.createElement('span');
        const typeClasses = {
            primary: 'bg-blue-100 text-blue-800',
            secondary: 'bg-gray-100 text-gray-800',
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            error: 'bg-red-100 text-red-800'
        };
        
        badge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type] || typeClasses.primary}`;
        badge.textContent = text;
        
        return badge;
    }

    /**
     * Create progress bar
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} color - Progress bar color
     * @returns {HTMLElement} Progress bar element
     */
    createProgressBar(progress, color = 'bg-blue-600') {
        const container = document.createElement('div');
        container.className = 'w-full bg-gray-200 rounded-full h-2';
        
        const bar = document.createElement('div');
        bar.className = `${color} h-2 rounded-full transition-all duration-300`;
        bar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        
        container.appendChild(bar);
        return container;
    }

    /**
     * Smooth scroll to element with offset
     * @param {string|HTMLElement} target - Target element or selector
     * @param {number} offset - Offset from top
     */
    scrollToElement(target, offset = 80) {
        Utils.scrollToElement(target, offset);
    }

    /**
     * Copy text to clipboard and show feedback
     * @param {string} text - Text to copy
     * @param {string} successMessage - Success message
     */
    async copyToClipboard(text, successMessage = 'Panoya kopyalandı!') {
        const success = await Utils.copyToClipboard(text);
        if (success) {
            this.showToast(successMessage, 'success', 2000);
        } else {
            this.showToast('Kopyalama başarısız', 'error', 3000);
        }
    }

    /**
     * Initialize tooltips (if using a tooltip library)
     */
    initializeTooltips() {
        // This would initialize tooltips if using a library like Tippy.js
        // For now, we'll use native title attributes
        const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
        elementsWithTooltips.forEach(element => {
            element.title = element.getAttribute('data-tooltip');
        });
    }

    /**
     * Handle responsive navigation
     */
    initializeResponsiveFeatures() {
        // Handle mobile menu toggles, responsive behaviors, etc.
        const handleResize = Utils.throttle(() => {
            const deviceType = Utils.getDeviceType();
            document.body.setAttribute('data-device', deviceType);
        }, 250);

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    }

    /**
     * Initialize accessibility features
     */
    initializeAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Ana içeriğe geç';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key handling
            if (e.key === 'Escape') {
                // Close any open modals, dropdowns, etc.
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    // Close modal logic would go here
                }
            }
        });

        // Announce dynamic content changes to screen readers
        this.announceToScreenReader = Utils.debounce((message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }, 100);
    }

    /**
     * Initialize all UI components
     */
    initialize() {
        console.log('[UIComponents] Initializing UI components...');
        this.initializeTooltips();
        this.initializeResponsiveFeatures();
        this.initializeAccessibility();
        console.log('[UIComponents] UI components initialized');
    }
}

// Create and export UI components instance
window.uiComponents = new UIComponents();
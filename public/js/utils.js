/**
 * Utility functions for RotamBenim application
 * Contains helper functions for common operations
 */

class Utils {
    /**
     * Debounce function to limit the rate of function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute immediately
     * @returns {Function} Debounced function
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle function to limit function execution frequency
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Sanitize HTML to prevent XSS attacks
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Escape HTML entities
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    static escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Format date to Turkish locale
     * @param {Date|string} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date string
     */
    static formatDate(date, options = {}) {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        };
        return new Intl.DateTimeFormat('tr-TR', defaultOptions).format(dateObj);
    }

    /**
     * Generate a random ID
     * @param {number} length - Length of the ID
     * @returns {string} Random ID
     */
    static generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * Check if a value is empty (null, undefined, empty string, empty array, empty object)
     * @param {*} value - Value to check
     * @returns {boolean} True if empty
     */
    static isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @param {string} suffix - Suffix to add (default: '...')
     * @returns {string} Truncated text
     */
    static truncateText(text, maxLength, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    /**
     * Convert string to slug (URL-friendly format)
     * @param {string} str - String to convert
     * @returns {string} Slug
     */
    static slugify(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    /**
     * Get query parameter from URL
     * @param {string} param - Parameter name
     * @returns {string|null} Parameter value
     */
    static getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Set query parameter in URL without page reload
     * @param {string} param - Parameter name
     * @param {string} value - Parameter value
     */
    static setQueryParam(param, value) {
        const url = new URL(window.location);
        if (value) {
            url.searchParams.set(param, value);
        } else {
            url.searchParams.delete(param);
        }
        window.history.replaceState({}, '', url);
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                textArea.remove();
                return success;
            }
        } catch (error) {
            console.error('Failed to copy text:', error);
            return false;
        }
    }

    /**
     * Format file size in human readable format
     * @param {number} bytes - Size in bytes
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted size
     */
    static formatFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if device is iOS
     * @returns {boolean} True if iOS device
     */
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    /**
     * Get device type
     * @returns {string} Device type (mobile, tablet, desktop)
     */
    static getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    /**
     * Smooth scroll to element
     * @param {string|Element} target - Target element or selector
     * @param {number} offset - Offset from top
     */
    static scrollToElement(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Wait for specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after specified time
     */
    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Retry function with exponential backoff
     * @param {Function} fn - Function to retry
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise} Promise that resolves with function result
     */
    static async retry(fn, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (i === maxRetries) break;
                
                const delay = baseDelay * Math.pow(2, i);
                await Utils.wait(delay);
            }
        }
        
        throw lastError;
    }

    /**
     * Format number with Turkish locale
     * @param {number} number - Number to format
     * @param {Object} options - Intl.NumberFormat options
     * @returns {string} Formatted number
     */
    static formatNumber(number, options = {}) {
        return new Intl.NumberFormat('tr-TR', options).format(number);
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     * @param {Object} coord1 - First coordinate {lat, lng}
     * @param {Object} coord2 - Second coordinate {lat, lng}
     * @returns {number} Distance in kilometers
     */
    static calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = Utils.toRadians(coord2.lat - coord1.lat);
        const dLng = Utils.toRadians(coord2.lng - coord1.lng);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Utils.toRadians(coord1.lat)) * Math.cos(Utils.toRadians(coord2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees - Degrees to convert
     * @returns {number} Radians
     */
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Get browser information
     * @returns {Object} Browser information
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';

        if (ua.includes('Chrome')) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Firefox')) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Safari')) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Edge')) {
            browser = 'Edge';
            version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }

        return { browser, version, userAgent: ua };
    }

    /**
     * Log error with context information
     * @param {Error} error - Error object
     * @param {Object} context - Additional context
     */
    static logError(error, context = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...context
        };
        
        console.error('Application Error:', errorInfo);
        
        // In production, you might want to send this to an error tracking service
        // like Sentry, LogRocket, or your own logging endpoint
    }
}

// Export Utils class
window.Utils = Utils;
<<<<<<< HEAD
// Basit yardımcı fonksiyonlar
window.Utils = {
  logError: function(error, context) {
    console.error('[Utils]', context || '', error);
  },
  debounce: function (func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
};

// Basit toast fonksiyonu
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('toastContainer')) {
    const toastDiv = document.createElement('div');
    toastDiv.id = 'toastContainer';
    toastDiv.style.position = 'fixed';
    toastDiv.style.top = '1rem';
    toastDiv.style.right = '1rem';
    toastDiv.style.zIndex = '9999';
    document.body.appendChild(toastDiv);
  }
});

window.showToast = function(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.background = type === 'error' ? '#f87171' : (type === 'success' ? '#4ade80' : '#60a5fa');
  toast.style.color = '#fff';
  toast.style.padding = '12px 20px';
  toast.style.marginTop = '8px';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
  toast.style.fontWeight = 'bold';
  toast.style.fontSize = '1rem';
  toast.style.opacity = '0.95';
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
}; 
=======
/**
 * Utility functions for RotamBenim application
 */

class Utils {
    /**
     * Debounce function to limit the rate of function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Whether to execute immediately
     * @returns {Function} Debounced function
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
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
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    static escapeHTML(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitize input text
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    static sanitizeInput(text) {
        if (typeof text !== 'string') return '';
        return text.trim().replace(/[<>]/g, '');
    }

    /**
     * Format date to readable string
     * @param {Date|string} date - Date to format
     * @param {string} locale - Locale for formatting
     * @returns {string} Formatted date
     */
    static formatDate(date, locale = 'en-US') {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            return dateObj.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('[Utils] Error formatting date:', error);
            return 'Invalid Date';
        }
    }

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if empty
     */
    static isEmpty(obj) {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        return Object.keys(obj).length === 0;
    }

    /**
     * Normalize text for comparison (remove accents, lowercase, trim)
     * @param {string} text - Text to normalize
     * @returns {string} Normalized text
     */
    static normalizeText(text) {
        if (typeof text !== 'string') return '';
        return text
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove accents
    }

    /**
     * Calculate string similarity using Levenshtein distance
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} Similarity score (0-1)
     */
    static calculateSimilarity(str1, str2) {
        const s1 = Utils.normalizeText(str1);
        const s2 = Utils.normalizeText(str2);
        
        if (s1 === s2) return 1;
        if (s1.length === 0 || s2.length === 0) return 0;

        const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));

        for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= s2.length; j++) {
            for (let i = 1; i <= s1.length; i++) {
                const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        const maxLength = Math.max(s1.length, s2.length);
        return (maxLength - matrix[s2.length][s1.length]) / maxLength;
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Format file size to human readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get browser information
     * @returns {Object} Browser info
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
     * Check if device is mobile
     * @returns {boolean} True if mobile
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Get device type
     * @returns {string} Device type
     */
    static getDeviceType() {
        if (Utils.isMobile()) return 'mobile';
        if (window.innerWidth <= 768) return 'tablet';
        return 'desktop';
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
                const result = document.execCommand('copy');
                textArea.remove();
                return result;
            }
        } catch (error) {
            console.error('[Utils] Error copying to clipboard:', error);
            return false;
        }
    }

    /**
     * Log error with context
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

        console.error('[Utils] Error logged:', errorInfo);

        // In production, you might want to send this to an error tracking service
        // like Sentry, LogRocket, or your own logging endpoint
        if (window.errorTracker) {
            window.errorTracker.log(errorInfo);
        }
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
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) {
                    throw lastError;
                }
                
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`[Utils] Retry attempt ${attempt + 1}/${maxRetries + 1} failed, retrying in ${delay}ms:`, error.message);
                
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * Create a promise that resolves after specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after delay
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Format number with locale-specific formatting
     * @param {number} number - Number to format
     * @param {string} locale - Locale for formatting
     * @returns {string} Formatted number
     */
    static formatNumber(number, locale = 'en-US') {
        try {
            return new Intl.NumberFormat(locale).format(number);
        } catch (error) {
            console.error('[Utils] Error formatting number:', error);
            return number.toString();
        }
    }

    /**
     * Get query parameters from URL
     * @returns {Object} Query parameters
     */
    static getQueryParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }

    /**
     * Set query parameter in URL without page reload
     * @param {string} key - Parameter key
     * @param {string} value - Parameter value
     */
    static setQueryParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    }

    /**
     * Remove query parameter from URL
     * @param {string} key - Parameter key to remove
     */
    static removeQueryParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }
}

// Make Utils available globally
window.Utils = Utils;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
>>>>>>> parent of 19e146e (Initial commit)

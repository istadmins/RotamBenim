/**
 * Enhanced Utility Functions for RotamBenim Application
 * Advanced utilities for performance, security, and user experience
 * @version 2.0.0
 */

class UtilsEnhanced {
    /**
     * Enhanced debounce with immediate execution option and cancel capability
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {Object} options - Options object
     * @returns {Object} Debounced function with cancel method
     */
    static debounce(func, wait, options = {}) {
        const { immediate = false, maxWait = null } = options;
        let timeout;
        let lastCallTime = 0;
        let lastInvokeTime = 0;
        
        const debounced = function executedFunction(...args) {
            const time = Date.now();
            const isInvoking = shouldInvoke(time);
            
            lastCallTime = time;
            
            if (isInvoking) {
                if (!timeout) {
                    lastInvokeTime = time;
                    func.apply(this, args);
                } else {
                    timeout = setTimeout(timerExpired, wait);
                }
            } else if (!timeout) {
                timeout = setTimeout(timerExpired, wait);
            }
        };
        
        function shouldInvoke(time) {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;
            
            return (lastCallTime === time) || (timeSinceLastCall >= wait) || 
                   (timeSinceLastCall < 0) || (maxWait !== null && timeSinceLastInvoke >= maxWait);
        }
        
        function timerExpired() {
            const time = Date.now();
            if (shouldInvoke(time)) {
                return invokeFunc(time);
            }
            timeout = setTimeout(timerExpired, remainingWait(time));
        }
        
        function invokeFunc(time) {
            lastInvokeTime = time;
            timeout = undefined;
            if (immediate) {
                func.apply(this, arguments);
            }
        }
        
        function remainingWait(time) {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;
            const timeWaiting = wait - timeSinceLastCall;
            
            return maxWait !== null ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        
        debounced.cancel = function() {
            if (timeout !== undefined) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        };
        
        debounced.flush = function() {
            return timeout !== undefined ? invokeFunc(Date.now()) : undefined;
        };
        
        return debounced;
    }

    /**
     * Enhanced throttle with leading and trailing options
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @param {Object} options - Options object
     * @returns {Object} Throttled function with cancel method
     */
    static throttle(func, limit, options = {}) {
        const { leading = true, trailing = true } = options;
        let timeout;
        let previous = 0;
        
        const throttled = function executedFunction(...args) {
            const now = Date.now();
            
            if (!previous && !leading) previous = now;
            
            const remaining = limit - (now - previous);
            
            if (remaining <= 0 || remaining > limit) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = undefined;
                }
                previous = now;
                func.apply(this, args);
            } else if (!timeout && trailing) {
                timeout = setTimeout(() => {
                    previous = leading ? Date.now() : 0;
                    timeout = undefined;
                    func.apply(this, args);
                }, remaining);
            }
        };
        
        throttled.cancel = function() {
            if (timeout !== undefined) {
                clearTimeout(timeout);
                timeout = undefined;
            }
            previous = 0;
        };
        
        throttled.flush = function() {
            return timeout !== undefined ? throttled(Date.now()) : undefined;
        };
        
        return throttled;
    }

    /**
     * Enhanced HTML escaping with more comprehensive protection
     * @param {string} text - Text to escape
     * @param {Object} options - Options for escaping
     * @returns {string} Escaped HTML
     */
    static escapeHTML(text, options = {}) {
        if (typeof text !== 'string') return '';
        
        const { preserveNewlines = false, preserveSpaces = false } = options;
        
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
        
        if (preserveNewlines) {
            escaped = escaped.replace(/\n/g, '<br>');
        }
        
        if (preserveSpaces) {
            escaped = escaped.replace(/ /g, '&nbsp;');
        }
        
        return escaped;
    }

    /**
     * Enhanced input sanitization with validation
     * @param {string} text - Text to sanitize
     * @param {Object} options - Sanitization options
     * @returns {string} Sanitized text
     */
    static sanitizeInput(text, options = {}) {
        if (typeof text !== 'string') return '';
        
        const {
            maxLength = 1000,
            allowHtml = false,
            allowUrls = false,
            trim = true,
            normalize = true
        } = options;
        
        let sanitized = text;
        
        if (trim) {
            sanitized = sanitized.trim();
        }
        
        if (normalize) {
            sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        
        if (!allowHtml) {
            sanitized = this.escapeHTML(sanitized);
        }
        
        if (!allowUrls) {
            // Remove URLs
            sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, '');
        }
        
        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        return sanitized;
    }

    /**
     * Enhanced date formatting with multiple formats
     * @param {Date|string} date - Date to format
     * @param {string|Object} format - Format string or options object
     * @returns {string} Formatted date
     */
    static formatDate(date, format = 'default') {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            
            if (isNaN(dateObj.getTime())) {
                throw new Error('Invalid date');
            }
            
            const formats = {
                default: {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                },
                short: {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                },
                time: {
                    hour: '2-digit',
                    minute: '2-digit'
                },
                full: {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                },
                relative: () => this.getRelativeTime(dateObj)
            };
            
            const formatConfig = typeof format === 'string' ? formats[format] : format;
            
            if (typeof formatConfig === 'function') {
                return formatConfig();
            }
            
            return dateObj.toLocaleDateString('en-US', formatConfig);
            
        } catch (error) {
            console.error('[UtilsEnhanced] Error formatting date:', error);
            return 'Invalid Date';
        }
    }

    /**
     * Get relative time (e.g., "2 hours ago")
     * @param {Date} date - Date to get relative time for
     * @returns {string} Relative time string
     */
    static getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        
        return this.formatDate(date, 'short');
    }

    /**
     * Enhanced unique ID generation with prefix support
     * @param {string} prefix - Prefix for the ID
     * @param {number} length - Length of the random part
     * @returns {string} Unique ID
     */
    static generateId(prefix = '', length = 8) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 2 + length);
        return `${prefix}${timestamp}${random}`;
    }

    /**
     * Enhanced deep clone with circular reference handling
     * @param {*} obj - Object to clone
     * @param {WeakMap} hash - Hash for circular reference detection
     * @returns {*} Cloned object
     */
    static deepClone(obj, hash = new WeakMap()) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof RegExp) return new RegExp(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item, hash));
        
        // Handle circular references
        if (hash.has(obj)) return hash.get(obj);
        
        const clonedObj = {};
        hash.set(obj, clonedObj);
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key], hash);
            }
        }
        
        return clonedObj;
    }

    /**
     * Enhanced object validation
     * @param {*} obj - Object to validate
     * @param {Object} schema - Validation schema
     * @returns {Object} Validation result
     */
    static validateObject(obj, schema) {
        const errors = [];
        
        for (const [key, rules] of Object.entries(schema)) {
            const value = obj[key];
            
            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${key} is required`);
                continue;
            }
            
            if (value !== undefined && value !== null) {
                if (rules.type && typeof value !== rules.type) {
                    errors.push(`${key} must be of type ${rules.type}`);
                }
                
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`${key} must be at least ${rules.minLength} characters`);
                }
                
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors.push(`${key} must be no more than ${rules.maxLength} characters`);
                }
                
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`${key} format is invalid`);
                }
                
                if (rules.enum && !rules.enum.includes(value)) {
                    errors.push(`${key} must be one of: ${rules.enum.join(', ')}`);
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Enhanced text similarity with multiple algorithms
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @param {string} algorithm - Algorithm to use
     * @returns {number} Similarity score (0-1)
     */
    static calculateSimilarity(str1, str2, algorithm = 'levenshtein') {
        const s1 = this.normalizeText(str1);
        const s2 = this.normalizeText(str2);
        
        if (s1 === s2) return 1;
        if (s1.length === 0 || s2.length === 0) return 0;
        
        switch (algorithm) {
            case 'levenshtein':
                return this.levenshteinSimilarity(s1, s2);
            case 'jaro':
                return this.jaroSimilarity(s1, s2);
            case 'cosine':
                return this.cosineSimilarity(s1, s2);
            default:
                return this.levenshteinSimilarity(s1, s2);
        }
    }

    /**
     * Levenshtein distance similarity
     */
    static levenshteinSimilarity(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        const maxLength = Math.max(str1.length, str2.length);
        return (maxLength - matrix[str2.length][str1.length]) / maxLength;
    }

    /**
     * Jaro similarity
     */
    static jaroSimilarity(str1, str2) {
        if (str1 === str2) return 1;
        
        const matchWindow = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
        if (matchWindow < 0) return 0;
        
        const str1Matches = new Array(str1.length).fill(false);
        const str2Matches = new Array(str2.length).fill(false);
        
        let matches = 0;
        let transpositions = 0;
        
        // Find matches
        for (let i = 0; i < str1.length; i++) {
            const start = Math.max(0, i - matchWindow);
            const end = Math.min(str2.length, i + matchWindow + 1);
            
            for (let j = start; j < end; j++) {
                if (str2Matches[j] || str1[i] !== str2[j]) continue;
                str1Matches[i] = true;
                str2Matches[j] = true;
                matches++;
                break;
            }
        }
        
        if (matches === 0) return 0;
        
        // Find transpositions
        let k = 0;
        for (let i = 0; i < str1.length; i++) {
            if (!str1Matches[i]) continue;
            while (!str2Matches[k]) k++;
            if (str1[i] !== str2[k]) transpositions++;
            k++;
        }
        
        return (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3;
    }

    /**
     * Cosine similarity
     */
    static cosineSimilarity(str1, str2) {
        const getCharFrequency = (str) => {
            const freq = {};
            for (const char of str) {
                freq[char] = (freq[char] || 0) + 1;
            }
            return freq;
        };
        
        const freq1 = getCharFrequency(str1);
        const freq2 = getCharFrequency(str2);
        
        const allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
        
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        for (const char of allChars) {
            const f1 = freq1[char] || 0;
            const f2 = freq2[char] || 0;
            dotProduct += f1 * f2;
            norm1 += f1 * f1;
            norm2 += f2 * f2;
        }
        
        if (norm1 === 0 || norm2 === 0) return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * Enhanced email validation
     * @param {string} email - Email to validate
     * @param {Object} options - Validation options
     * @returns {Object} Validation result
     */
    static validateEmail(email, options = {}) {
        const { checkDisposable = false, checkMX = false } = options;
        
        if (typeof email !== 'string') {
            return { isValid: false, error: 'Email must be a string' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: 'Invalid email format' };
        }
        
        const [localPart, domain] = email.split('@');
        
        if (localPart.length > 64 || domain.length > 253) {
            return { isValid: false, error: 'Email too long' };
        }
        
        if (localPart.length === 0 || domain.length === 0) {
            return { isValid: false, error: 'Invalid email structure' };
        }
        
        // Check for disposable domains (basic check)
        if (checkDisposable) {
            const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
            if (disposableDomains.some(d => domain.toLowerCase().includes(d))) {
                return { isValid: false, error: 'Disposable email not allowed' };
            }
        }
        
        return { isValid: true };
    }

    /**
     * Enhanced URL validation and parsing
     * @param {string} url - URL to validate
     * @param {Object} options - Validation options
     * @returns {Object} Validation result
     */
    static validateURL(url, options = {}) {
        const { allowedProtocols = ['http:', 'https:'], requireProtocol = true } = options;
        
        try {
            const urlObj = new URL(url);
            
            if (requireProtocol && !urlObj.protocol) {
                return { isValid: false, error: 'Protocol is required' };
            }
            
            if (allowedProtocols.length > 0 && !allowedProtocols.includes(urlObj.protocol)) {
                return { isValid: false, error: `Protocol must be one of: ${allowedProtocols.join(', ')}` };
            }
            
            return { 
                isValid: true, 
                url: urlObj,
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
                pathname: urlObj.pathname
            };
        } catch {
            return { isValid: false, error: 'Invalid URL format' };
        }
    }

    /**
     * Enhanced file size formatting
     * @param {number} bytes - Size in bytes
     * @param {Object} options - Formatting options
     * @returns {string} Formatted size
     */
    static formatFileSize(bytes, options = {}) {
        const { precision = 2, binary = false } = options;
        
        if (bytes === 0) return '0 Bytes';
        
        const k = binary ? 1024 : 1000;
        const sizes = binary ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'] : ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + sizes[i];
    }

    /**
     * Enhanced browser detection
     * @returns {Object} Browser information
     */
    static getBrowserInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        let browser = 'Unknown';
        let version = 'Unknown';
        let os = 'Unknown';
        
        // Detect browser
        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
            version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
            version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browser = 'Safari';
            version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Edge')) {
            browser = 'Edge';
            version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }
        
        // Detect OS
        if (userAgent.includes('Windows')) {
            os = 'Windows';
        } else if (userAgent.includes('Mac')) {
            os = 'macOS';
        } else if (userAgent.includes('Linux')) {
            os = 'Linux';
        } else if (userAgent.includes('Android')) {
            os = 'Android';
        } else if (userAgent.includes('iOS')) {
            os = 'iOS';
        }
        
        return {
            browser,
            version,
            os,
            platform,
            userAgent,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            doNotTrack: navigator.doNotTrack
        };
    }

    /**
     * Enhanced device detection
     * @returns {Object} Device information
     */
    static getDeviceInfo() {
        const browserInfo = this.getBrowserInfo();
        const screenInfo = {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        };
        
        const windowInfo = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
        };
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(browserInfo.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(browserInfo.userAgent);
        const isDesktop = !isMobile && !isTablet;
        
        return {
            ...browserInfo,
            screen: screenInfo,
            window: windowInfo,
            isMobile,
            isTablet,
            isDesktop,
            deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }

    /**
     * Enhanced clipboard operations with fallbacks
     * @param {string} text - Text to copy
     * @param {Object} options - Copy options
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text, options = {}) {
        const { fallback = true, showNotification = true } = options;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                if (showNotification) {
                    this.showNotification('Text copied to clipboard', 'success');
                }
                return true;
            } else if (fallback) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful && showNotification) {
                    this.showNotification('Text copied to clipboard', 'success');
                }
                return successful;
            }
        } catch (error) {
            console.error('[UtilsEnhanced] Copy to clipboard failed:', error);
            if (showNotification) {
                this.showNotification('Failed to copy text', 'error');
            }
        }
        
        return false;
    }

    /**
     * Enhanced error logging with context
     * @param {Error} error - Error to log
     * @param {Object} context - Additional context
     * @param {Object} options - Logging options
     */
    static logError(error, context = {}, options = {}) {
        const { level = 'error', includeStack = true, includeTimestamp = true } = options;
        
        const errorInfo = {
            message: error.message,
            name: error.name,
            ...(includeStack && { stack: error.stack }),
            ...(includeTimestamp && { timestamp: new Date().toISOString() }),
            context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };
        
        // Log to console
        console[level]('[UtilsEnhanced] Error logged:', errorInfo);
        
        // Store in localStorage for debugging
        try {
            const errorLog = JSON.parse(localStorage.getItem('rotambenim_error_log') || '[]');
            errorLog.push(errorInfo);
            
            // Keep only last 50 errors
            if (errorLog.length > 50) {
                errorLog.splice(0, errorLog.length - 50);
            }
            
            localStorage.setItem('rotambenim_error_log', JSON.stringify(errorLog));
        } catch (e) {
            console.error('[UtilsEnhanced] Failed to store error log:', e);
        }
    }

    /**
     * Enhanced retry mechanism with exponential backoff
     * @param {Function} fn - Function to retry
     * @param {Object} options - Retry options
     * @returns {Promise} Function result
     */
    static async retry(fn, options = {}) {
        const {
            maxRetries = 3,
            baseDelay = 1000,
            maxDelay = 10000,
            backoffMultiplier = 2,
            retryCondition = (error) => true
        } = options;
        
        let lastError;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries || !retryCondition(error)) {
                    throw error;
                }
                
                const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
                console.warn(`[UtilsEnhanced] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
                
                await this.sleep(delay);
            }
        }
        
        throw lastError;
    }

    /**
     * Enhanced sleep function with progress callback
     * @param {number} ms - Milliseconds to sleep
     * @param {Function} onProgress - Progress callback
     * @returns {Promise} Promise that resolves after sleep
     */
    static sleep(ms, onProgress = null) {
        return new Promise((resolve) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / ms, 1);
                
                if (onProgress) {
                    onProgress(progress);
                }
                
                if (progress >= 1) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        });
    }

    /**
     * Enhanced number formatting
     * @param {number} number - Number to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted number
     */
    static formatNumber(number, options = {}) {
        const {
            locale = 'en-US',
            style = 'decimal',
            minimumFractionDigits = 0,
            maximumFractionDigits = 2,
            notation = 'standard'
        } = options;
        
        try {
            return new Intl.NumberFormat(locale, {
                style,
                minimumFractionDigits,
                maximumFractionDigits,
                notation
            }).format(number);
        } catch (error) {
            console.error('[UtilsEnhanced] Number formatting failed:', error);
            return number.toString();
        }
    }

    /**
     * Enhanced URL parameter handling
     * @param {string} url - URL to parse
     * @returns {Object} URL parameters
     */
    static getURLParams(url = window.location.href) {
        try {
            const urlObj = new URL(url);
            const params = {};
            
            for (const [key, value] of urlObj.searchParams) {
                params[key] = value;
            }
            
            return params;
        } catch (error) {
            console.error('[UtilsEnhanced] URL parsing failed:', error);
            return {};
        }
    }

    /**
     * Set URL parameter
     * @param {string} key - Parameter key
     * @param {string} value - Parameter value
     * @param {string} url - URL to modify
     * @returns {string} Modified URL
     */
    static setURLParam(key, value, url = window.location.href) {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.set(key, value);
            return urlObj.toString();
        } catch (error) {
            console.error('[UtilsEnhanced] URL modification failed:', error);
            return url;
        }
    }

    /**
     * Remove URL parameter
     * @param {string} key - Parameter key to remove
     * @param {string} url - URL to modify
     * @returns {string} Modified URL
     */
    static removeURLParam(key, url = window.location.href) {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.delete(key);
            return urlObj.toString();
        } catch (error) {
            console.error('[UtilsEnhanced] URL parameter removal failed:', error);
            return url;
        }
    }

    /**
     * Show notification (fallback for when UI components aren't available)
     * @param {string} message - Message to show
     * @param {string} type - Notification type
     * @param {number} duration - Duration in milliseconds
     */
    static showNotification(message, type = 'info', duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }

    /**
     * Enhanced text normalization
     * @param {string} text - Text to normalize
     * @param {Object} options - Normalization options
     * @returns {string} Normalized text
     */
    static normalizeText(text, options = {}) {
        if (typeof text !== 'string') return '';
        
        const {
            lowercase = true,
            trim = true,
            removeAccents = true,
            removeSpecialChars = false,
            collapseWhitespace = true
        } = options;
        
        let normalized = text;
        
        if (lowercase) {
            normalized = normalized.toLowerCase();
        }
        
        if (trim) {
            normalized = normalized.trim();
        }
        
        if (removeAccents) {
            normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        
        if (removeSpecialChars) {
            normalized = normalized.replace(/[^\w\s]/g, '');
        }
        
        if (collapseWhitespace) {
            normalized = normalized.replace(/\s+/g, ' ');
        }
        
        return normalized;
    }

    /**
     * Check if object is empty (enhanced)
     * @param {*} obj - Object to check
     * @param {Object} options - Check options
     * @returns {boolean} True if empty
     */
    static isEmpty(obj, options = {}) {
        const { checkArrays = true, checkStrings = true, checkNull = true } = options;
        
        if (obj == null) return checkNull;
        if (Array.isArray(obj)) return checkArrays && obj.length === 0;
        if (typeof obj === 'string') return checkStrings && obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        
        return false;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UtilsEnhanced;
}

// Make available globally
window.UtilsEnhanced = UtilsEnhanced; 
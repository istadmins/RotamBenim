/**
 * Security Manager for RotamBenim Application
 * Handles input validation, XSS prevention, and security best practices
 * @version 1.0.0
 */

class SecurityManager {
    constructor() {
        this.config = {
            maxInputLength: 1000,
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
            allowedAttributes: {
                'a': ['href', 'title', 'target'],
                'img': ['src', 'alt', 'title']
            },
            blockedPatterns: [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi,
                /data:text\/html/gi,
                /vbscript:/gi,
                /expression\s*\(/gi
            ],
            rateLimits: {
                requests: 100,
                window: 60000 // 1 minute
            }
        };
        
        this.requestCounts = new Map();
        this.blockedIPs = new Set();
        this.suspiciousActivities = [];
        this.isInitialized = false;
    }

    /**
     * Initialize security manager
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[SecurityManager] Already initialized');
            return;
        }

        console.log('[SecurityManager] Initializing security manager...');
        
        try {
            this.setupSecurityHeaders();
            this.setupInputValidation();
            this.setupRateLimiting();
            this.setupCSP();
            this.setupSecurityMonitoring();
            
            this.isInitialized = true;
            console.log('[SecurityManager] Security manager initialized successfully');
            
        } catch (error) {
            console.error('[SecurityManager] Initialization failed:', error);
        }
    }

    /**
     * Setup security headers
     */
    setupSecurityHeaders() {
        // Add security headers if possible
        if (typeof document !== 'undefined') {
            // Set referrer policy
            const meta = document.createElement('meta');
            meta.name = 'referrer';
            meta.content = 'strict-origin-when-cross-origin';
            document.head.appendChild(meta);
        }
    }

    /**
     * Setup input validation
     */
    setupInputValidation() {
        // Override innerHTML to prevent XSS
        this.overrideInnerHTML();
        
        // Setup form validation
        this.setupFormValidation();
    }

    /**
     * Override innerHTML to prevent XSS
     */
    overrideInnerHTML() {
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string') {
                    const sanitized = SecurityManager.sanitizeHTML(value);
                    originalInnerHTML.set.call(this, sanitized);
                } else {
                    originalInnerHTML.set.call(this, value);
                }
            },
            get: originalInnerHTML.get
        });
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const inputs = form.querySelectorAll('input, textarea, select');
            
            for (const input of inputs) {
                if (!this.validateInput(input)) {
                    event.preventDefault();
                    this.showSecurityWarning('Invalid input detected');
                    return false;
                }
            }
        });
    }

    /**
     * Setup rate limiting
     */
    setupRateLimiting() {
        // Track requests per IP (simplified - in real app, use server-side)
        setInterval(() => {
            this.requestCounts.clear();
        }, this.config.rateLimits.window);
    }

    /**
     * Setup Content Security Policy
     */
    setupCSP() {
        // Add CSP meta tag if not present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const cspMeta = document.createElement('meta');
            cspMeta.httpEquiv = 'Content-Security-Policy';
            cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data: https:; connect-src 'self' https://firebase.googleapis.com;";
            document.head.appendChild(cspMeta);
        }
    }

    /**
     * Setup security monitoring
     */
    setupSecurityMonitoring() {
        // Monitor for suspicious activities
        this.monitorSuspiciousActivities();
        
        // Monitor for DOM modifications
        this.monitorDOMModifications();
    }

    /**
     * Monitor suspicious activities
     */
    monitorSuspiciousActivities() {
        // Monitor for eval usage
        const originalEval = window.eval;
        window.eval = function(code) {
            SecurityManager.logSuspiciousActivity('eval_usage', { code });
            return originalEval(code);
        };

        // Monitor for Function constructor
        const originalFunction = window.Function;
        window.Function = function(...args) {
            SecurityManager.logSuspiciousActivity('function_constructor', { args });
            return originalFunction.apply(this, args);
        };
    }

    /**
     * Monitor DOM modifications
     */
    monitorDOMModifications() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkForSuspiciousElements(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Check for suspicious elements
     * @param {Element} element - Element to check
     */
    checkForSuspiciousElements(element) {
        // Check for script tags
        if (element.tagName.toLowerCase() === 'script') {
            this.logSuspiciousActivity('suspicious_script', { element: element.outerHTML });
        }

        // Check for suspicious attributes
        const suspiciousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
        suspiciousAttributes.forEach(attr => {
            if (element.hasAttribute(attr)) {
                this.logSuspiciousActivity('suspicious_attribute', { 
                    attribute: attr, 
                    value: element.getAttribute(attr) 
                });
            }
        });
    }

    /**
     * Validate input
     * @param {HTMLElement} input - Input element
     * @returns {boolean} Validation result
     */
    validateInput(input) {
        const value = input.value;
        const type = input.type;
        const name = input.name;

        // Check length
        if (value.length > this.config.maxInputLength) {
            this.logSecurityEvent('input_too_long', { 
                field: name, 
                length: value.length, 
                maxLength: this.config.maxInputLength 
            });
            return false;
        }

        // Check for blocked patterns
        for (const pattern of this.config.blockedPatterns) {
            if (pattern.test(value)) {
                this.logSecurityEvent('blocked_pattern', { 
                    field: name, 
                    pattern: pattern.source 
                });
                return false;
            }
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                return this.validateEmail(value);
            case 'url':
                return this.validateURL(value);
            case 'number':
                return this.validateNumber(value);
            default:
                return true;
        }
    }

    /**
     * Validate email
     * @param {string} email - Email to validate
     * @returns {boolean} Validation result
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.logSecurityEvent('invalid_email', { email });
            return false;
        }
        return true;
    }

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} Validation result
     */
    validateURL(url) {
        try {
            const urlObj = new URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                this.logSecurityEvent('invalid_url_protocol', { url, protocol: urlObj.protocol });
                return false;
            }
            return true;
        } catch {
            this.logSecurityEvent('invalid_url_format', { url });
            return false;
        }
    }

    /**
     * Validate number
     * @param {string} number - Number to validate
     * @returns {boolean} Validation result
     */
    validateNumber(number) {
        const num = parseFloat(number);
        if (isNaN(num)) {
            this.logSecurityEvent('invalid_number', { number });
            return false;
        }
        return true;
    }

    /**
     * Sanitize HTML content
     * @param {string} html - HTML to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        if (typeof html !== 'string') return html;

        // Remove blocked patterns
        let sanitized = html;
        for (const pattern of SecurityManager.config.blockedPatterns) {
            sanitized = sanitized.replace(pattern, '');
        }

        // Create temporary element for parsing
        const temp = document.createElement('div');
        temp.innerHTML = sanitized;

        // Remove script tags and event handlers
        const scripts = temp.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        // Remove event handlers
        const elements = temp.querySelectorAll('*');
        elements.forEach(element => {
            const attributes = element.attributes;
            for (let i = attributes.length - 1; i >= 0; i--) {
                const attr = attributes[i];
                if (attr.name.startsWith('on') || attr.name === 'javascript:') {
                    element.removeAttribute(attr.name);
                }
            }
        });

        return temp.innerHTML;
    }

    /**
     * Sanitize user input
     * @param {string} input - Input to sanitize
     * @param {Object} options - Sanitization options
     * @returns {string} Sanitized input
     */
    sanitizeInput(input, options = {}) {
        if (typeof input !== 'string') return '';

        const {
            allowHTML = false,
            maxLength = this.config.maxInputLength,
            trim = true,
            normalize = true
        } = options;

        let sanitized = input;

        if (trim) {
            sanitized = sanitized.trim();
        }

        if (normalize) {
            sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }

        if (!allowHTML) {
            sanitized = this.escapeHTML(sanitized);
        } else {
            sanitized = SecurityManager.sanitizeHTML(sanitized);
        }

        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHTML(text) {
        if (typeof text !== 'string') return '';
        
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Check rate limit
     * @param {string} identifier - Request identifier
     * @returns {boolean} Whether request is allowed
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const windowStart = now - this.config.rateLimits.window;
        
        // Clean old entries
        for (const [key, timestamp] of this.requestCounts.entries()) {
            if (timestamp < windowStart) {
                this.requestCounts.delete(key);
            }
        }
        
        // Check current count
        const count = Array.from(this.requestCounts.values())
            .filter(timestamp => timestamp > windowStart).length;
        
        if (count >= this.config.rateLimits.requests) {
            this.logSecurityEvent('rate_limit_exceeded', { identifier, count });
            return false;
        }
        
        // Add current request
        this.requestCounts.set(`${identifier}_${now}`, now);
        return true;
    }

    /**
     * Log security event
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    logSecurityEvent(event, data = {}) {
        const securityEvent = {
            event,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };

        console.warn('[SecurityManager] Security event:', securityEvent);
        
        // Store in localStorage for monitoring
        try {
            const events = JSON.parse(localStorage.getItem('rotambenim_security_events') || '[]');
            events.push(securityEvent);
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('rotambenim_security_events', JSON.stringify(events));
        } catch (error) {
            console.error('[SecurityManager] Failed to store security event:', error);
        }
    }

    /**
     * Log suspicious activity
     * @param {string} activity - Activity type
     * @param {Object} data - Activity data
     */
    static logSuspiciousActivity(activity, data = {}) {
        const suspiciousActivity = {
            activity,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.error('[SecurityManager] Suspicious activity detected:', suspiciousActivity);
        
        // Store in localStorage
        try {
            const activities = JSON.parse(localStorage.getItem('rotambenim_suspicious_activities') || '[]');
            activities.push(suspiciousActivity);
            
            // Keep only last 50 activities
            if (activities.length > 50) {
                activities.splice(0, activities.length - 50);
            }
            
            localStorage.setItem('rotambenim_suspicious_activities', JSON.stringify(activities));
        } catch (error) {
            console.error('[SecurityManager] Failed to store suspicious activity:', error);
        }
    }

    /**
     * Show security warning
     * @param {string} message - Warning message
     */
    showSecurityWarning(message) {
        console.warn('[SecurityManager] Security warning:', message);
        
        // Show user-friendly warning
        const warning = document.createElement('div');
        warning.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        warning.textContent = `Security Warning: ${message}`;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 5000);
    }

    /**
     * Get security report
     * @returns {Object} Security report
     */
    getSecurityReport() {
        try {
            const securityEvents = JSON.parse(localStorage.getItem('rotambenim_security_events') || '[]');
            const suspiciousActivities = JSON.parse(localStorage.getItem('rotambenim_suspicious_activities') || '[]');
            
            return {
                timestamp: Date.now(),
                events: {
                    total: securityEvents.length,
                    recent: securityEvents.slice(-10),
                    byType: this.getEventCountByType(securityEvents)
                },
                suspiciousActivities: {
                    total: suspiciousActivities.length,
                    recent: suspiciousActivities.slice(-10),
                    byType: this.getEventCountByType(suspiciousActivities)
                },
                blockedIPs: Array.from(this.blockedIPs),
                requestCounts: this.requestCounts.size
            };
        } catch (error) {
            console.error('[SecurityManager] Failed to generate security report:', error);
            return { error: 'Failed to generate report' };
        }
    }

    /**
     * Get event count by type
     * @param {Array} events - Events array
     * @returns {Object} Event counts
     */
    getEventCountByType(events) {
        const counts = {};
        events.forEach(event => {
            const type = event.event || event.activity;
            counts[type] = (counts[type] || 0) + 1;
        });
        return counts;
    }

    /**
     * Clear security logs
     */
    clearLogs() {
        localStorage.removeItem('rotambenim_security_events');
        localStorage.removeItem('rotambenim_suspicious_activities');
        this.suspiciousActivities = [];
        this.requestCounts.clear();
        this.blockedIPs.clear();
        
        console.log('[SecurityManager] Security logs cleared');
    }

    /**
     * Cleanup security manager
     */
    cleanup() {
        this.isInitialized = false;
        this.requestCounts.clear();
        this.blockedIPs.clear();
        this.suspiciousActivities = [];
        
        console.log('[SecurityManager] Security manager cleaned up');
    }
}

// Initialize security manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
    window.securityManager.initialize();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
} 
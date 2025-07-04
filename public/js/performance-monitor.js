/**
 * Performance Monitor for RotamBenim Application
 * Tracks performance metrics, memory usage, and user interactions
 * @version 1.0.0
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            startTime: Date.now(),
            pageLoadTime: 0,
            domContentLoaded: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            memoryUsage: [],
            userInteractions: [],
            errors: [],
            performanceMarks: new Map(),
            performanceMeasures: new Map()
        };
        
        this.observers = {
            performance: null,
            memory: null,
            longTasks: null,
            layoutShifts: null,
            firstInput: null
        };
        
        this.isInitialized = false;
        this.maxMemoryEntries = 100;
        this.maxInteractionEntries = 200;
        this.maxErrorEntries = 50;
        
        // Performance thresholds
        this.thresholds = {
            slowTask: 50, // ms
            memoryWarning: 0.8, // 80% of heap size limit
            slowInteraction: 100 // ms
        };
    }

    /**
     * Initialize performance monitoring
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('[PerformanceMonitor] Already initialized');
            return;
        }

        console.log('[PerformanceMonitor] Initializing performance monitoring...');
        
        try {
            this.setupPerformanceObservers();
            this.setupMemoryMonitoring();
            this.setupUserInteractionTracking();
            this.setupErrorTracking();
            this.setupPerformanceMarks();
            
            this.isInitialized = true;
            console.log('[PerformanceMonitor] Performance monitoring initialized successfully');
            
        } catch (error) {
            console.error('[PerformanceMonitor] Initialization failed:', error);
        }
    }

    /**
     * Setup performance observers
     */
    setupPerformanceObservers() {
        if (!('PerformanceObserver' in window)) {
            console.warn('[PerformanceMonitor] PerformanceObserver not supported');
            return;
        }

        // Largest Contentful Paint
        try {
            this.observers.largestContentfulPaint = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                console.log('[PerformanceMonitor] LCP:', this.metrics.largestContentfulPaint, 'ms');
            });
            this.observers.largestContentfulPaint.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
            console.warn('[PerformanceMonitor] LCP observer not supported');
        }

        // Layout Shifts
        try {
            this.observers.layoutShifts = new PerformanceObserver((list) => {
                let cumulativeLayoutShift = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        cumulativeLayoutShift += entry.value;
                    }
                }
                this.metrics.cumulativeLayoutShift = cumulativeLayoutShift;
            });
            this.observers.layoutShifts.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.warn('[PerformanceMonitor] Layout shift observer not supported');
        }

        // First Input Delay
        try {
            this.observers.firstInput = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const firstInput = entries[0];
                this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
                console.log('[PerformanceMonitor] FID:', this.metrics.firstInputDelay, 'ms');
            });
            this.observers.firstInput.observe({ entryTypes: ['first-input'] });
        } catch (error) {
            console.warn('[PerformanceMonitor] First input observer not supported');
        }

        // Long Tasks
        try {
            this.observers.longTasks = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > this.thresholds.slowTask) {
                        console.warn('[PerformanceMonitor] Long task detected:', {
                            duration: entry.duration,
                            startTime: entry.startTime,
                            name: entry.name
                        });
                        
                        this.metrics.errors.push({
                            type: 'longTask',
                            duration: entry.duration,
                            timestamp: Date.now(),
                            message: `Long task: ${entry.duration}ms`
                        });
                    }
                }
            });
            this.observers.longTasks.observe({ entryTypes: ['longtask'] });
        } catch (error) {
            console.warn('[PerformanceMonitor] Long task observer not supported');
        }
    }

    /**
     * Setup memory monitoring
     */
    setupMemoryMonitoring() {
        if (!('memory' in performance)) {
            console.warn('[PerformanceMonitor] Memory API not supported');
            return;
        }

        // Monitor memory usage every 30 seconds
        setInterval(() => {
            const memory = performance.memory;
            const memoryEntry = {
                timestamp: Date.now(),
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
                percentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
            };

            this.metrics.memoryUsage.push(memoryEntry);

            // Keep only recent entries
            if (this.metrics.memoryUsage.length > this.maxMemoryEntries) {
                this.metrics.memoryUsage.shift();
            }

            // Check for memory warnings
            if (memoryEntry.percentage > this.thresholds.memoryWarning) {
                console.warn('[PerformanceMonitor] High memory usage:', memoryEntry.percentage * 100, '%');
                
                this.metrics.errors.push({
                    type: 'memoryWarning',
                    percentage: memoryEntry.percentage,
                    timestamp: Date.now(),
                    message: `High memory usage: ${(memoryEntry.percentage * 100).toFixed(1)}%`
                });
            }
        }, 30000);
    }

    /**
     * Setup user interaction tracking
     */
    setupUserInteractionTracking() {
        const interactionEvents = ['click', 'input', 'scroll', 'keydown', 'mousemove'];
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                const interaction = {
                    type: eventType,
                    target: event.target.tagName || 'unknown',
                    timestamp: Date.now(),
                    path: this.getEventPath(event)
                };

                this.metrics.userInteractions.push(interaction);

                // Keep only recent interactions
                if (this.metrics.userInteractions.length > this.maxInteractionEntries) {
                    this.metrics.userInteractions.shift();
                }
            }, { passive: true });
        });

        // Track slow interactions
        let interactionStartTime = 0;
        document.addEventListener('click', () => {
            interactionStartTime = performance.now();
        });

        document.addEventListener('click', () => {
            const interactionTime = performance.now() - interactionStartTime;
            if (interactionTime > this.thresholds.slowInteraction) {
                console.warn('[PerformanceMonitor] Slow interaction detected:', interactionTime, 'ms');
                
                this.metrics.errors.push({
                    type: 'slowInteraction',
                    duration: interactionTime,
                    timestamp: Date.now(),
                    message: `Slow interaction: ${interactionTime.toFixed(2)}ms`
                });
            }
        });
    }

    /**
     * Setup error tracking
     */
    setupErrorTracking() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.trackError('globalError', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('unhandledRejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Console error tracking
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.trackError('consoleError', {
                message: args.join(' '),
                arguments: args
            });
            originalConsoleError.apply(console, args);
        };
    }

    /**
     * Setup performance marks
     */
    setupPerformanceMarks() {
        // Mark page load events
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.domContentLoaded = performance.now();
                performance.mark('dom-content-loaded');
            });
        } else {
            this.metrics.domContentLoaded = performance.now();
            performance.mark('dom-content-loaded');
        }

        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now();
            performance.mark('page-loaded');
            performance.measure('page-load', 'dom-content-loaded', 'page-loaded');
        });
    }

    /**
     * Track custom performance mark
     * @param {string} name - Mark name
     * @param {Object} data - Additional data
     */
    mark(name, data = {}) {
        if (!this.isInitialized) return;

        const timestamp = performance.now();
        this.metrics.performanceMarks.set(name, {
            timestamp,
            data,
            time: Date.now()
        });

        performance.mark(name);
        console.log(`[PerformanceMonitor] Mark: ${name} at ${timestamp}ms`);
    }

    /**
     * Measure performance between two marks
     * @param {string} name - Measure name
     * @param {string} startMark - Start mark name
     * @param {string} endMark - End mark name
     * @param {Object} data - Additional data
     */
    measure(name, startMark, endMark, data = {}) {
        if (!this.isInitialized) return;

        try {
            const measure = performance.measure(name, startMark, endMark);
            this.metrics.performanceMeasures.set(name, {
                duration: measure.duration,
                startTime: measure.startTime,
                endTime: measure.endTime,
                data,
                timestamp: Date.now()
            });

            console.log(`[PerformanceMonitor] Measure: ${name} = ${measure.duration}ms`);
        } catch (error) {
            console.error(`[PerformanceMonitor] Failed to measure ${name}:`, error);
        }
    }

    /**
     * Track error
     * @param {string} type - Error type
     * @param {Object} data - Error data
     */
    trackError(type, data = {}) {
        const error = {
            type,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.metrics.errors.push(error);

        // Keep only recent errors
        if (this.metrics.errors.length > this.maxErrorEntries) {
            this.metrics.errors.shift();
        }

        console.error(`[PerformanceMonitor] Error tracked: ${type}`, data);
    }

    /**
     * Get event path for interaction tracking
     * @param {Event} event - DOM event
     * @returns {string} Event path
     */
    getEventPath(event) {
        const path = [];
        let element = event.target;
        
        while (element && element !== document.body) {
            path.unshift(element.tagName.toLowerCase());
            element = element.parentElement;
        }
        
        return path.slice(0, 3).join(' > '); // Limit to 3 levels
    }

    /**
     * Get performance report
     * @returns {Object} Performance report
     */
    getReport() {
        const currentMemory = this.getCurrentMemoryUsage();
        const recentErrors = this.metrics.errors.slice(-10);
        const recentInteractions = this.metrics.userInteractions.slice(-20);
        
        return {
            uptime: Date.now() - this.metrics.startTime,
            pageLoadTime: this.metrics.pageLoadTime,
            domContentLoaded: this.metrics.domContentLoaded,
            largestContentfulPaint: this.metrics.largestContentfulPaint,
            cumulativeLayoutShift: this.metrics.cumulativeLayoutShift,
            firstInputDelay: this.metrics.firstInputDelay,
            memory: currentMemory,
            errors: {
                total: this.metrics.errors.length,
                recent: recentErrors,
                byType: this.getErrorCountByType()
            },
            interactions: {
                total: this.metrics.userInteractions.length,
                recent: recentInteractions,
                byType: this.getInteractionCountByType()
            },
            performance: {
                marks: Array.from(this.metrics.performanceMarks.entries()),
                measures: Array.from(this.metrics.performanceMeasures.entries())
            },
            thresholds: this.thresholds
        };
    }

    /**
     * Get current memory usage
     * @returns {Object|null} Memory usage data
     */
    getCurrentMemoryUsage() {
        if (!('memory' in performance)) return null;

        const memory = performance.memory;
        return {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            percentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
            formatted: {
                used: this.formatBytes(memory.usedJSHeapSize),
                total: this.formatBytes(memory.totalJSHeapSize),
                limit: this.formatBytes(memory.jsHeapSizeLimit)
            }
        };
    }

    /**
     * Get error count by type
     * @returns {Object} Error counts
     */
    getErrorCountByType() {
        const counts = {};
        this.metrics.errors.forEach(error => {
            counts[error.type] = (counts[error.type] || 0) + 1;
        });
        return counts;
    }

    /**
     * Get interaction count by type
     * @returns {Object} Interaction counts
     */
    getInteractionCountByType() {
        const counts = {};
        this.metrics.userInteractions.forEach(interaction => {
            counts[interaction.type] = (counts[interaction.type] || 0) + 1;
        });
        return counts;
    }

    /**
     * Format bytes to human readable format
     * @param {number} bytes - Bytes to format
     * @returns {string} Formatted string
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Check if performance is good
     * @returns {Object} Performance health check
     */
    checkPerformanceHealth() {
        const report = this.getReport();
        const issues = [];
        
        // Check page load time
        if (report.pageLoadTime > 3000) {
            issues.push('Slow page load time');
        }
        
        // Check LCP
        if (report.largestContentfulPaint > 2500) {
            issues.push('Slow largest contentful paint');
        }
        
        // Check FID
        if (report.firstInputDelay > 100) {
            issues.push('Slow first input delay');
        }
        
        // Check memory usage
        if (report.memory && report.memory.percentage > 0.8) {
            issues.push('High memory usage');
        }
        
        // Check error rate
        if (report.errors.total > 10) {
            issues.push('High error rate');
        }
        
        return {
            isHealthy: issues.length === 0,
            issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
    }

    /**
     * Export performance data
     * @returns {Object} Exportable performance data
     */
    exportData() {
        return {
            timestamp: Date.now(),
            metrics: this.metrics,
            report: this.getReport(),
            health: this.checkPerformanceHealth()
        };
    }

    /**
     * Reset performance metrics
     */
    reset() {
        this.metrics = {
            startTime: Date.now(),
            pageLoadTime: 0,
            domContentLoaded: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            memoryUsage: [],
            userInteractions: [],
            errors: [],
            performanceMarks: new Map(),
            performanceMeasures: new Map()
        };
        
        console.log('[PerformanceMonitor] Performance metrics reset');
    }

    /**
     * Cleanup performance monitoring
     */
    cleanup() {
        // Disconnect all observers
        Object.values(this.observers).forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        this.observers = {
            performance: null,
            memory: null,
            longTasks: null,
            layoutShifts: null,
            firstInput: null
        };
        
        this.isInitialized = false;
        console.log('[PerformanceMonitor] Performance monitoring cleaned up');
    }
}

// Initialize performance monitor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
    window.performanceMonitor.initialize();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} 
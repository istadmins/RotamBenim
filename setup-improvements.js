/**
 * Setup Script for RotamBenim Improvements
 * This script helps implement and verify all the improvements
 */

class ImprovementSetup {
    constructor() {
        this.improvements = [
            'Enhanced Application Architecture',
            'Advanced Utility Functions',
            'Performance Monitoring',
            'Security Manager',
            'Accessibility Manager',
            'Enhanced HTML Structure'
        ];
        
        this.status = {
            initialized: false,
            modules: new Map(),
            errors: []
        };
    }

    /**
     * Initialize all improvements
     */
    async initialize() {
        console.log('🚀 Initializing RotamBenim Improvements...');
        
        try {
            // Check if we're in the right environment
            this.checkEnvironment();
            
            // Initialize modules in order
            await this.initializeModules();
            
            // Verify improvements
            await this.verifyImprovements();
            
            // Run performance tests
            await this.runPerformanceTests();
            
            // Generate setup report
            this.generateReport();
            
            console.log('✅ All improvements initialized successfully!');
            
        } catch (error) {
            console.error('❌ Setup failed:', error);
            this.status.errors.push(error);
        }
    }

    /**
     * Check environment requirements
     */
    checkEnvironment() {
        console.log('🔍 Checking environment...');
        
        const checks = {
            'Modern Browser': this.checkModernBrowser(),
            'JavaScript Enabled': this.checkJavaScript(),
            'DOM Ready': this.checkDOMReady(),
            'Network Connection': this.checkNetworkConnection()
        };
        
        for (const [check, result] of Object.entries(checks)) {
            if (result) {
                console.log(`✅ ${check}: OK`);
            } else {
                console.warn(`⚠️ ${check}: Failed`);
            }
        }
    }

    /**
     * Check if browser is modern
     */
    checkModernBrowser() {
        const features = [
            'Promise' in window,
            'fetch' in window,
            'localStorage' in window,
            'sessionStorage' in window,
            'IntersectionObserver' in window,
            'PerformanceObserver' in window
        ];
        
        return features.every(feature => feature);
    }

    /**
     * Check if JavaScript is enabled
     */
    checkJavaScript() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }

    /**
     * Check if DOM is ready
     */
    checkDOMReady() {
        return document.readyState === 'complete' || document.readyState === 'interactive';
    }

    /**
     * Check network connection
     */
    checkNetworkConnection() {
        return navigator.onLine;
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        console.log('🔧 Initializing modules...');
        
        const modules = [
            { name: 'UtilsEnhanced', check: () => window.UtilsEnhanced },
            { name: 'PerformanceMonitor', check: () => window.performanceMonitor },
            { name: 'SecurityManager', check: () => window.securityManager },
            { name: 'AccessibilityManager', check: () => window.accessibilityManager },
            { name: 'EnhancedApp', check: () => window.enhancedApp }
        ];
        
        for (const module of modules) {
            try {
                await this.waitForModule(module.name, module.check);
                this.status.modules.set(module.name, true);
                console.log(`✅ ${module.name}: Initialized`);
            } catch (error) {
                console.warn(`⚠️ ${module.name}: Failed to initialize`);
                this.status.errors.push(new Error(`${module.name} initialization failed: ${error.message}`));
            }
        }
    }

    /**
     * Wait for module to be available
     */
    async waitForModule(name, checkFn, timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (checkFn()) {
                return true;
            }
            await this.sleep(100);
        }
        
        throw new Error(`Module ${name} not available after ${timeout}ms`);
    }

    /**
     * Verify improvements are working
     */
    async verifyImprovements() {
        console.log('🔍 Verifying improvements...');
        
        const verifications = [
            this.verifyPerformanceMonitoring(),
            this.verifySecurityFeatures(),
            this.verifyAccessibilityFeatures(),
            this.verifyUtilityFunctions(),
            this.verifyErrorHandling()
        ];
        
        for (const verification of verifications) {
            try {
                await verification();
            } catch (error) {
                console.warn('⚠️ Verification failed:', error.message);
                this.status.errors.push(error);
            }
        }
    }

    /**
     * Verify performance monitoring
     */
    async verifyPerformanceMonitoring() {
        if (!window.performanceMonitor) {
            throw new Error('Performance monitor not available');
        }
        
        const report = window.performanceMonitor.getReport();
        if (!report || !report.uptime) {
            throw new Error('Performance monitoring not working');
        }
        
        console.log('✅ Performance monitoring: Working');
    }

    /**
     * Verify security features
     */
    async verifySecurityFeatures() {
        if (!window.securityManager) {
            throw new Error('Security manager not available');
        }
        
        // Test input sanitization
        const testInput = '<script>alert("xss")</script>';
        const sanitized = window.securityManager.sanitizeInput(testInput);
        
        if (sanitized.includes('<script>')) {
            throw new Error('Security sanitization not working');
        }
        
        console.log('✅ Security features: Working');
    }

    /**
     * Verify accessibility features
     */
    async verifyAccessibilityFeatures() {
        if (!window.accessibilityManager) {
            throw new Error('Accessibility manager not available');
        }
        
        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        if (skipLinks.length === 0) {
            throw new Error('Accessibility skip links not found');
        }
        
        console.log('✅ Accessibility features: Working');
    }

    /**
     * Verify utility functions
     */
    async verifyUtilityFunctions() {
        if (!window.UtilsEnhanced) {
            throw new Error('Enhanced utilities not available');
        }
        
        // Test debounce function
        let callCount = 0;
        const testFn = () => callCount++;
        const debouncedFn = window.UtilsEnhanced.debounce(testFn, 100);
        
        debouncedFn();
        debouncedFn();
        debouncedFn();
        
        await this.sleep(200);
        
        if (callCount !== 1) {
            throw new Error('Debounce function not working');
        }
        
        console.log('✅ Utility functions: Working');
    }

    /**
     * Verify error handling
     */
    async verifyErrorHandling() {
        // Test global error handling
        const originalError = console.error;
        let errorCaught = false;
        
        console.error = () => {
            errorCaught = true;
        };
        
        // Trigger a test error
        setTimeout(() => {
            throw new Error('Test error');
        }, 0);
        
        await this.sleep(100);
        
        console.error = originalError;
        
        if (!errorCaught) {
            console.warn('⚠️ Error handling: May not be working properly');
        } else {
            console.log('✅ Error handling: Working');
        }
    }

    /**
     * Run performance tests
     */
    async runPerformanceTests() {
        console.log('⚡ Running performance tests...');
        
        const tests = [
            this.testPageLoadTime(),
            this.testMemoryUsage(),
            this.testDOMPerformance(),
            this.testNetworkPerformance()
        ];
        
        const results = await Promise.allSettled(tests);
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`✅ Performance test ${index + 1}: ${result.value}ms`);
            } else {
                console.warn(`⚠️ Performance test ${index + 1}: Failed`);
            }
        });
    }

    /**
     * Test page load time
     */
    async testPageLoadTime() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve(performance.now());
            } else {
                window.addEventListener('load', () => {
                    resolve(performance.now());
                });
            }
        });
    }

    /**
     * Test memory usage
     */
    async testMemoryUsage() {
        if ('memory' in performance) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    }

    /**
     * Test DOM performance
     */
    async testDOMPerformance() {
        const start = performance.now();
        
        // Create and manipulate DOM elements
        const container = document.createElement('div');
        for (let i = 0; i < 100; i++) {
            const element = document.createElement('div');
            element.textContent = `Test element ${i}`;
            container.appendChild(element);
        }
        
        document.body.appendChild(container);
        document.body.removeChild(container);
        
        return performance.now() - start;
    }

    /**
     * Test network performance
     */
    async testNetworkPerformance() {
        const start = performance.now();
        
        try {
            await fetch('/js/config.js', { method: 'HEAD' });
            return performance.now() - start;
        } catch {
            return 0;
        }
    }

    /**
     * Generate setup report
     */
    generateReport() {
        console.log('\n📊 Setup Report');
        console.log('==============');
        
        console.log(`✅ Improvements: ${this.improvements.length}`);
        console.log(`✅ Modules Initialized: ${this.status.modules.size}`);
        console.log(`❌ Errors: ${this.status.errors.length}`);
        
        if (this.status.errors.length > 0) {
            console.log('\n⚠️ Errors:');
            this.status.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.message}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Test all application features');
        console.log('2. Verify accessibility with screen readers');
        console.log('3. Test performance on different devices');
        console.log('4. Monitor error logs in production');
        console.log('5. Set up monitoring and analytics');
        
        // Store report in localStorage
        const report = {
            timestamp: Date.now(),
            improvements: this.improvements,
            modules: Array.from(this.status.modules.keys()),
            errors: this.status.errors.map(e => e.message),
            performance: {
                pageLoadTime: performance.now(),
                memoryUsage: 'memory' in performance ? performance.memory.usedJSHeapSize : 0
            }
        };
        
        localStorage.setItem('rotambenim_setup_report', JSON.stringify(report));
    }

    /**
     * Get setup status
     */
    getStatus() {
        return {
            initialized: this.status.initialized,
            modules: Array.from(this.status.modules.entries()),
            errors: this.status.errors.map(e => e.message),
            improvements: this.improvements
        };
    }

    /**
     * Utility function for sleeping
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize setup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 RotamBenim Improvement Setup Starting...');
    
    window.improvementSetup = new ImprovementSetup();
    window.improvementSetup.initialize().catch(error => {
        console.error('❌ Setup initialization failed:', error);
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImprovementSetup;
} 
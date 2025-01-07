class AwsAiAssistant {
    constructor() {
      this.floatingButton = null;
      this.aiPanel = null;
      this.initialized = false;
    }
  
    async initialize() {
      if (this.initialized) return;
      
      // Load required components
      await Promise.all([
        this.loadComponent('FloatingButton'),
        this.loadComponent('AiPanel')
      ]);
  
      // Initialize components
      this.floatingButton = new FloatingButton();
      this.aiPanel = new AiPanel();
  
      // Set up message listeners
      this.setupMessageListeners();
  
      // Load settings
      await this.loadSettings();
  
      this.initialized = true;
    }
  
    async loadComponent(componentName) {
      try {
        const module = await import(`./components/${componentName}.js`);
        return module.default;
      } catch (error) {
        console.error(`Failed to load ${componentName}:`, error);
        throw error;
      }
    }
  
    setupMessageListeners() {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
          case 'TOGGLE_PANEL':
            this.aiPanel.toggle();
            break;
          case 'ASK_AI':
            this.aiPanel.toggle(true);
            const input = document.querySelector('.aws-ai-input');
            if (input) {
              input.value = message.text;
              input.focus();
            }
            break;
        }
      });
    }
  
    async loadSettings() {
      const settings = await chrome.storage.sync.get([
        'showTooltips',
        'keyboard'
      ]);
  
      // Apply settings
      if (!settings.keyboard) {
        document.removeEventListener('keydown', this.handleKeyPress);
      }
  
      if (!settings.showTooltips) {
        document.documentElement.style.setProperty('--tooltip-display', 'none');
      }
    }
  
    // Utility method to check if current page is AWS Console
    isAwsConsole() {
      return window.location.hostname.includes('console.aws.amazon.com');
    }
  }
  
  // Initialize on page load if we're in AWS Console
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAssistant);
  } else {
    initializeAssistant();
  }
  
  async function initializeAssistant() {
    try {
      // Check if we're in AWS Console
      if (!window.location.hostname.includes('console.aws.amazon.com')) {
        return;
      }
  
      // Create and initialize the assistant
      const assistant = new AwsAiAssistant();
      await assistant.initialize();
  
      // Track successful initialization
      trackEvent('assistant_initialized', {
        url: window.location.pathname,
        service: document.querySelector('[data-service-name]')?.dataset.serviceName
      });
  
      // Set up mutation observer for dynamic content changes
      const observer = new MutationObserver(debounce(() => {
        // Update context when AWS Console content changes
        if (assistant.aiPanel) {
          assistant.aiPanel.updateContext();
        }
      }, 500));
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
      // Handle navigation events for single-page app
      window.addEventListener('popstate', () => {
        if (assistant.aiPanel) {
          assistant.aiPanel.updateContext();
        }
      });
  
    } catch (error) {
      console.error('Failed to initialize AWS AI Assistant:', error);
      trackEvent('assistant_initialization_failed', {
        error: error.message,
        url: window.location.pathname
      });
    }
  }
  
  // Utility functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function trackEvent(eventName, properties = {}) {
    try {
      chrome.runtime.sendMessage({
        type: 'TRACK_EVENT',
        eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }
  
  // Add analytics utility
  const analytics = {
    trackEvent: (eventName, properties = {}) => {
      try {
        chrome.runtime.sendMessage({
          type: 'TRACK_EVENT',
          eventName,
          properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            url: window.location.pathname,
            service: document.querySelector('[data-service-name]')?.dataset.serviceName
          }
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    },
  
    trackError: (error, context = {}) => {
      analytics.trackEvent('error', {
        message: error.message,
        stack: error.stack,
        ...context
      });
    }
  };
  
  // Export for use in other modules
  export { analytics };
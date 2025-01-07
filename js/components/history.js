class History {
    constructor() {
      this.maxEntries = 50;
      this.entries = [];
      this.initialize();
    }
  
    async initialize() {
      // Load history from storage
      const data = await chrome.storage.local.get('awsAiHistory');
      this.entries = data.awsAiHistory || [];
    }
  
    async addEntry(question, answer) {
      const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        question,
        answer,
        service: document.querySelector('[data-service-name]')?.dataset.serviceName,
        url: window.location.href
      };
  
      this.entries.unshift(entry);
      
      // Maintain max entries limit
      if (this.entries.length > this.maxEntries) {
        this.entries = this.entries.slice(0, this.maxEntries);
      }
  
      // Save to storage
      await chrome.storage.local.set({ awsAiHistory: this.entries });
  
      // Dispatch event for UI update
      document.dispatchEvent(new CustomEvent('aws-ai-history-updated'));
    }
  
    getEntries(limit = 10) {
      return this.entries.slice(0, limit);
    }
  
    async clearHistory() {
      this.entries = [];
      await chrome.storage.local.set({ awsAiHistory: [] });
      document.dispatchEvent(new CustomEvent('aws-ai-history-updated'));
    }
  }
  
  // Make available globally
  window.awsAiHistory = new History();
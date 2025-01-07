class MultiProviderAI {
    constructor() {
      this.providers = {
        gpt: {
          name: 'GPT',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          handleRequest: this.handleGPTRequest.bind(this)
        },
        claude: {
          name: 'Claude',
          endpoint: 'https://api.anthropic.com/v1/complete',
          handleRequest: this.handleClaudeRequest.bind(this)
        },
        gemini: {
          name: 'Gemini',
          endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
          handleRequest: this.handleGeminiRequest.bind(this)
        }
      };
      
      this.currentProvider = null;
      this.initialize();
    }
  
    async initialize() {
      const settings = await chrome.storage.sync.get(['aiProvider', 'apiKeys']);
      this.currentProvider = settings.aiProvider || 'gpt';
      this.apiKeys = settings.apiKeys || {};
    }
  
    async getCompletion(prompt, context) {
      if (!this.currentProvider || !this.providers[this.currentProvider]) {
        throw new Error('AI provider not configured');
      }
  
      const provider = this.providers[this.currentProvider];
      if (!this.apiKeys[this.currentProvider]) {
        throw new Error(`API key not configured for ${provider.name}`);
      }
  
      return provider.handleRequest(prompt, context);
    }
  
    async handleGPTRequest(prompt, context) {
      const response = await fetch(this.providers.gpt.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.gpt}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(context)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });
  
      if (!response.ok) {
        throw new Error('GPT API request failed');
      }
  
      const data = await response.json();
      return data.choices[0].message.content;
    }
  
    async handleClaudeRequest(prompt, context) {
      const response = await fetch(this.providers.claude.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKeys.claude
        },
        body: JSON.stringify({
          prompt: `${this.getSystemPrompt(context)}\n\nHuman: ${prompt}\n\nAssistant:`,
          model: 'claude-2',
          max_tokens_to_sample: 1000
        })
      });
  
      if (!response.ok) {
        throw new Error('Claude API request failed');
      }
  
      const data = await response.json();
      return data.completion;
    }
  
    async handleGeminiRequest(prompt, context) {
      const response = await fetch(`${this.providers.gemini.endpoint}?key=${this.apiKeys.gemini}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${this.getSystemPrompt(context)}\n\n${prompt}`
            }]
          }]
        })
      });
  
      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }
  
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  
    getSystemPrompt(context) {
      return `You are an AWS Console assistant helping with navigation and task automation.
  Current context:
  - Service: ${context.service || 'Unknown'}
  - Region: ${context.region || 'Unknown'}
  - Page: ${context.page || 'Unknown'}
  - User Role: ${context.userRole || 'Unknown'}
  
  Provide clear, step-by-step guidance for AWS Console tasks while following security best practices.`;
    }
  
    async setProvider(providerName) {
      if (!this.providers[providerName]) {
        throw new Error('Invalid provider');
      }
      
      this.currentProvider = providerName;
      await chrome.storage.sync.set({ aiProvider: providerName });
    }
  
    async setApiKey(provider, apiKey) {
      if (!this.providers[provider]) {
        throw new Error('Invalid provider');
      }
      
      this.apiKeys[provider] = apiKey;
      await chrome.storage.sync.set({ apiKeys: this.apiKeys });
    }
  
    getAvailableProviders() {
      return Object.keys(this.providers).map(key => ({
        id: key,
        name: this.providers[key].name
      }));
    }
  }
  
  export default new MultiProviderAI();
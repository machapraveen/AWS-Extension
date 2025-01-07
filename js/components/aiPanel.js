class AiPanel {
    constructor() {
      this.panel = null;
      this.isActive = false;
      this.currentContext = null;
      this.initialize();
    }
  
    initialize() {
      this.panel = document.createElement('div');
      this.panel.className = 'aws-ai-panel';
      this.panel.innerHTML = `
        <div class="aws-ai-panel-header">
          <span>AWS AI Assistant</span>
          <button class="aws-ai-close">×</button>
        </div>
        <div class="aws-ai-panel-content">
          <div class="aws-ai-messages"></div>
          <div class="aws-ai-input-container">
            <textarea 
              placeholder="Ask about AWS services or for suggestions..."
              rows="3"
              class="aws-ai-input"
            ></textarea>
            <button class="aws-ai-send">Send</button>
          </div>
        </div>
      `;
  
      document.body.appendChild(this.panel);
      this.attachEventListeners();
    }
  
    attachEventListeners() {
      const closeBtn = this.panel.querySelector('.aws-ai-close');
      const sendBtn = this.panel.querySelector('.aws-ai-send');
      const input = this.panel.querySelector('.aws-ai-input');
  
      closeBtn.addEventListener('click', () => this.toggle(false));
      sendBtn.addEventListener('click', () => this.handleSend());
      document.addEventListener('aws-ai-toggle', () => this.toggle());
  
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }
  
    async handleSend() {
      const input = this.panel.querySelector('.aws-ai-input');
      const message = input.value.trim();
      if (!message) return;
  
      const messagesContainer = this.panel.querySelector('.aws-ai-messages');
      
      // Add user message
      this.addMessage(message, 'user');
      input.value = '';
  
      // Get AI response
      try {
        const response = await window.awsAiApi.getCompletion(message, this.currentContext);
        this.addMessage(response, 'assistant');
        
        // Save to history
        window.awsAiHistory.addEntry(message, response);
      } catch (error) {
        this.addMessage('Sorry, there was an error processing your request.', 'error');
      }
    }
  
    addMessage(content, type) {
      const messagesContainer = this.panel.querySelector('.aws-ai-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `aws-ai-message aws-ai-message-${type}`;
      messageDiv.textContent = content;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  
    toggle(force = null) {
      this.isActive = force !== null ? force : !this.isActive;
      this.panel.classList.toggle('active', this.isActive);
      
      if (this.isActive) {
        this.updateContext();
        this.panel.querySelector('.aws-ai-input').focus();
      }
    }
  
    updateContext() {
      // Get current AWS Console context
      this.currentContext = {
        service: document.querySelector('[data-service-name]')?.dataset.serviceName,
        region: document.querySelector('[data-region-name]')?.dataset.regionName,
        page: window.location.pathname
      };
    }
  }
  
  export default AiPanel;
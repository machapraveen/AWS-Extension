class FloatingButton {
    constructor() {
      this.button = null;
      this.isVisible = false;
      this.initialize();
    }
  
    initialize() {
      // Create button element
      this.button = document.createElement('div');
      this.button.className = 'aws-ai-fab';
      this.button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      `;
  
      // Add event listeners
      this.button.addEventListener('click', this.handleClick.bind(this));
      document.addEventListener('keydown', this.handleKeyPress.bind(this));
  
      // Add to DOM
      document.body.appendChild(this.button);
    }
  
    handleClick(event) {
      event.preventDefault();
      // Dispatch custom event for other components to listen to
      const toggleEvent = new CustomEvent('aws-ai-toggle');
      document.dispatchEvent(toggleEvent);
    }
  
    handleKeyPress(event) {
      // Toggle on Ctrl+Shift+Space
      if (event.ctrlKey && event.shiftKey && event.code === 'Space') {
        this.handleClick(event);
      }
    }
  
    show() {
      this.button.style.display = 'flex';
      this.isVisible = true;
    }
  
    hide() {
      this.button.style.display = 'none';
      this.isVisible = false;
    }
  
    setPosition(x, y) {
      this.button.style.right = `${x}px`;
      this.button.style.bottom = `${y}px`;
    }
  }
  
  // Export for use in other files
  export default FloatingButton;
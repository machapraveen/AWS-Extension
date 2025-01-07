class InteractiveCursor {
    constructor() {
      this.cursor = null;
      this.isActive = false;
      this.currentStep = 0;
      this.steps = [];
      this.initialize();
    }
  
    initialize() {
      this.cursor = document.createElement('div');
      this.cursor.className = 'aws-ai-cursor';
      this.cursor.innerHTML = `
        <div class="cursor-pointer"></div>
        <div class="cursor-tooltip"></div>
      `;
      document.body.appendChild(this.cursor);
      
      this.attachEventListeners();
    }
  
    attachEventListeners() {
      document.addEventListener('mousemove', this.handleMouseMove.bind(this));
      document.addEventListener('click', this.handleClick.bind(this));
      
      // Handle keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.isActive) return;
        
        switch(e.key) {
          case 'ArrowRight':
            this.nextStep();
            break;
          case 'ArrowLeft':
            this.previousStep();
            break;
          case 'Escape':
            this.deactivate();
            break;
        }
      });
    }
  
    handleMouseMove(e) {
      if (!this.isActive) return;
      
      // Smooth cursor following
      requestAnimationFrame(() => {
        this.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    }
  
    handleClick(e) {
      if (!this.isActive) return;
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        this.highlightElement(element);
      }
    }
  
    highlightElement(element) {
      // Remove previous highlights
      document.querySelectorAll('.aws-ai-highlighted').forEach(el => {
        el.classList.remove('aws-ai-highlighted');
      });
      
      element.classList.add('aws-ai-highlighted');
      this.showTooltip(element);
    }
  
    showTooltip(element) {
      const tooltip = this.cursor.querySelector('.cursor-tooltip');
      const elementInfo = this.getElementInfo(element);
      
      tooltip.innerHTML = `
        <div class="tooltip-title">${elementInfo.title}</div>
        <div class="tooltip-description">${elementInfo.description}</div>
      `;
      
      tooltip.style.display = 'block';
    }
  
    getElementInfo(element) {
      // Get context-aware information about the element
      const info = {
        title: element.getAttribute('aria-label') || element.title || element.textContent,
        description: ''
      };
      
      // Add AWS-specific context
      if (element.closest('[data-service-name]')) {
        info.description += `Service: ${element.closest('[data-service-name]').dataset.serviceName}\n`;
      }
      
      return info;
    }
  
    setSteps(steps) {
      this.steps = steps;
      this.currentStep = 0;
      this.showCurrentStep();
    }
  
    showCurrentStep() {
      if (!this.steps[this.currentStep]) return;
      
      const step = this.steps[this.currentStep];
      const element = document.querySelector(step.selector);
      
      if (element) {
        this.highlightElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.showCurrentStep();
      }
    }
  
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.showCurrentStep();
      }
    }
  
    activate() {
      this.isActive = true;
      this.cursor.style.display = 'block';
      document.body.classList.add('aws-ai-cursor-active');
    }
  
    deactivate() {
      this.isActive = false;
      this.cursor.style.display = 'none';
      document.body.classList.remove('aws-ai-cursor-active');
      
      // Remove highlights
      document.querySelectorAll('.aws-ai-highlighted').forEach(el => {
        el.classList.remove('aws-ai-highlighted');
      });
    }
  
    toggle() {
      if (this.isActive) {
        this.deactivate();
      } else {
        this.activate();
      }
    }
  }
  
  export default new InteractiveCursor();
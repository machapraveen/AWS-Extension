class TemplateManager {
    constructor() {
      this.templates = new Map();
      this.customTemplates = new Map();
      this.initialize();
    }
  
    async initialize() {
      // Load built-in templates
      await this.loadBuiltInTemplates();
      // Load custom templates from storage
      await this.loadCustomTemplates();
    }
  
    async loadBuiltInTemplates() {
      // Service-specific templates
      this.templates.set('iam-policy', {
        name: 'IAM Policy Generator',
        description: 'Generate secure IAM policies',
        template: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Action: [],
            Resource: []
          }]
        }
      });
  
      this.templates.set('cloudformation', {
        name: 'CloudFormation Stack',
        description: 'Common CloudFormation templates',
        template: {
          AWSTemplateFormatVersion: '2010-09-09',
          Description: '',
          Parameters: {},
          Resources: {}
        }
      });
    }
  
    async loadCustomTemplates() {
      const data = await chrome.storage.sync.get('customTemplates');
      if (data.customTemplates) {
        Object.entries(data.customTemplates).forEach(([key, value]) => {
          this.customTemplates.set(key, value);
        });
      }
    }
  
    getTemplate(serviceType, templateName) {
      return this.templates.get(`${serviceType}-${templateName}`) || 
             this.customTemplates.get(`${serviceType}-${templateName}`);
    }
  
    async saveCustomTemplate(serviceType, templateName, template) {
      const key = `${serviceType}-${templateName}`;
      this.customTemplates.set(key, template);
      
      // Save to storage
      const allCustomTemplates = Object.fromEntries(this.customTemplates);
      await chrome.storage.sync.set({ customTemplates: allCustomTemplates });
    }
  
    getAllTemplatesForService(serviceType) {
      const serviceTemplates = new Map();
      
      // Get built-in templates
      for (const [key, template] of this.templates) {
        if (key.startsWith(serviceType)) {
          serviceTemplates.set(key, template);
        }
      }
      
      // Get custom templates
      for (const [key, template] of this.customTemplates) {
        if (key.startsWith(serviceType)) {
          serviceTemplates.set(key, template);
        }
      }
      
      return serviceTemplates;
    }
  }
  
  export default new TemplateManager();
document.addEventListener('DOMContentLoaded', async () => {
    // Load current settings
    const settings = await chrome.storage.sync.get([
      'apiKey',
      'apiEndpoint',
      'showTooltips',
      'keyboard'
    ]);
  
    // Populate form fields
    document.getElementById('apiKey').value = settings.apiKey || '';
    document.getElementById('apiEndpoint').value = settings.apiEndpoint || '';
    document.getElementById('showTooltips').checked = settings.showTooltips !== false;
    document.getElementById('keyboard').checked = settings.keyboard !== false;
  
    // Handle save settings
    document.getElementById('saveSettings').addEventListener('click', async () => {
      const newSettings = {
        apiKey: document.getElementById('apiKey').value,
        apiEndpoint: document.getElementById('apiEndpoint').value,
        showTooltips: document.getElementById('showTooltips').checked,
        keyboard: document.getElementById('keyboard').checked
      };
  
      try {
        await chrome.storage.sync.set(newSettings);
        
        // Update API instance
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'UPDATE_SETTINGS',
          settings: newSettings
        });
  
        // Show success message
        const status = document.createElement('div');
        status.textContent = 'Settings saved successfully!';
        status.style.color = 'green';
        status.style.marginTop = '8px';
        document.querySelector('.container').appendChild(status);
        setTimeout(() => status.remove(), 2000);
  
      } catch (error) {
        console.error('Failed to save settings:', error);
        const status = document.createElement('div');
        status.textContent = 'Failed to save settings. Please try again.';
        status.style.color = 'red';
        status.style.marginTop = '8px';
        document.querySelector('.container').appendChild(status);
      }
    });
  
    // Handle clear history
    document.getElementById('clearHistory').addEventListener('click', async () => {
      if (confirm('Are you sure you want to clear all history?')) {
        try {
          await chrome.storage.local.remove('awsAiHistory');
          
          // Notify content script
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          chrome.tabs.sendMessage(tabs[0].id, { action: 'CLEAR_HISTORY' });
  
          // Show success message
          const status = document.createElement('div');
          status.textContent = 'History cleared successfully!';
          status.style.color = 'green';
          status.style.marginTop = '8px';
          document.querySelector('.container').appendChild(status);
          setTimeout(() => status.remove(), 2000);
  
        } catch (error) {
          console.error('Failed to clear history:', error);
          const status = document.createElement('div');
          status.textContent = 'Failed to clear history. Please try again.';
          status.style.color = 'red';
          status.style.marginTop = '8px';
          document.querySelector('.container').appendChild(status);
        }
      }
    });
  });
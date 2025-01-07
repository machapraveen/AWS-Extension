// Initialize context menu on installation or update
chrome.runtime.onInstalled.addListener(() => {
    // Create context menu item
    chrome.contextMenus.create({
      id: 'awsAiAssistant',
      title: 'Ask AWS AI Assistant',
      contexts: ['selection']
    });
  
    // Set default settings
    chrome.storage.sync.get(
      {
        showTooltips: true,
        keyboard: true,
        apiEndpoint: 'https://api.openai.com/v1/chat/completions'
      },
      (items) => {
        chrome.storage.sync.set(items);
      }
    );
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'awsAiAssistant' && tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'ASK_AI',
        text: info.selectionText || ''
      });
    }
  });
  
  // Handle keyboard commands
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle_ai_panel') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'TOGGLE_PANEL' });
        }
      });
    }
  });
  
  // Handle messages from content scripts
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'GET_TAB_INFO':
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          sendResponse({ tabId: tabs[0]?.id });
        });
        return true; // Will respond asynchronously
  
      case 'TRACK_EVENT':
        // Handle analytics event tracking
        console.log('Event tracked:', request.eventName, request.properties);
        sendResponse({ success: true });
        return false;
  
      default:
        sendResponse({ error: 'Unknown message type' });
        return false;
    }
  });
  
  // Handle extension update or installation
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('Extension installed');
    } else if (details.reason === 'update') {
      console.log('Extension updated');
    }
  });
  
  // Error handling for service worker
  self.onerror = (error) => {
    console.error('Service Worker Error:', error);
  };
  
  self.onunhandledrejection = (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
  };
  
  // Keep service worker alive
  self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
  });
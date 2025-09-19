// Minimal test version to check Chrome APIs
console.log('=== PIRATE DOWNLOADER TEST ===');

// Basic Chrome API availability check
setTimeout(() => {
  console.log('Chrome available:', typeof chrome !== 'undefined');
  
  if (typeof chrome !== 'undefined') {
    console.log('Runtime available:', typeof chrome.runtime !== 'undefined');
    console.log('Downloads available:', typeof chrome.downloads !== 'undefined');
    console.log('Notifications available:', typeof chrome.notifications !== 'undefined');
    
    // Try to register a simple download listener
    if (chrome.downloads && chrome.downloads.onCreated) {
      chrome.downloads.onCreated.addListener((item) => {
        console.log('Download detected:', item.filename);
      });
      console.log('Download listener registered successfully');
    }
    
    // Try to create a test notification (without icon first)
    if (chrome.notifications && chrome.notifications.create) {
      chrome.notifications.create('test-basic', {
        type: 'basic',
        title: 'Pirate Test',
        message: 'APIs are working!'
      }, (id) => {
        if (chrome.runtime.lastError) {
          console.error('Notification error:', chrome.runtime.lastError.message);
        } else {
          console.log('Test notification created:', id);
          setTimeout(() => chrome.notifications.clear(id), 2000);
        }
      });
    }
  } else {
    console.error('Chrome object not available!');
  }
}, 100);

// Make a test function available
function testBasicNotification() {
  if (chrome && chrome.notifications) {
    chrome.notifications.create('manual-test', {
      type: 'basic',
      title: 'Manual Test',
      message: 'Testing from console'
    }, (id) => {
      if (chrome.runtime.lastError) {
        console.error('Manual test error:', chrome.runtime.lastError.message);
      } else {
        console.log('Manual test notification created:', id);
      }
    });
  } else {
    console.error('Chrome notifications not available');
  }
}

// Expose test function globally
self.testBasicNotification = testBasicNotification;

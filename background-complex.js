// Global state management for tracking active downloads
const activeDownloads = new Map();

// Fuse icons mapping based on progress percentage
const fuseIcons = {
  0: 'icons/fuse-0.png',
  25: 'icons/fuse-25.png',
  50: 'icons/fuse-50.png',
  75: 'icons/fuse-75.png',
  100: 'icons/fuse-100.png'
};

// Function to determine which fuse icon to use based on progress percentage
function getFuseIcon(progressPercent) {
  if (progressPercent >= 100) return fuseIcons[100];
  if (progressPercent >= 75) return fuseIcons[75];
  if (progressPercent >= 50) return fuseIcons[50];
  if (progressPercent >= 25) return fuseIcons[25];
  return fuseIcons[0];
}

// Function to get the fuse state key (for comparison)
function getFuseState(progressPercent) {
  if (progressPercent >= 100) return 100;
  if (progressPercent >= 75) return 75;
  if (progressPercent >= 50) return 50;
  if (progressPercent >= 25) return 25;
  return 0;
}

// Initialize extension when service worker starts
function initializeExtension() {
  console.log('Pirate Downloader: Service worker initialized');
  
  // Check if required APIs are available
  if (!chrome.downloads || !chrome.notifications) {
    console.error('Pirate Downloader: Required APIs not available');
    return;
  }
  
  setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
  // Listener for when a new download starts
  if (chrome.downloads && chrome.downloads.onCreated) {
    chrome.downloads.onCreated.addListener((downloadItem) => {
      try {
        const notificationId = `download-progress-${downloadItem.id}`;
        const filename = downloadItem.filename || 'Unknown file';
        
        // Create initial progress notification
        chrome.notifications.create(notificationId, {
          type: 'basic',
          title: 'Plundering in Progress...',
          message: filename,
          iconUrl: 'icons/fuse-0.png',
          silent: true
        });
        
        // Add download to global state tracker
        activeDownloads.set(downloadItem.id, {
          notificationId: notificationId,
          filename: filename,
          currentFuseState: 0,
          isComplete: false
        });
      } catch (error) {
        console.error('Pirate Downloader: Error in onCreated listener:', error);
      }
    });
  }

  // Listener for download progress and completion changes
  if (chrome.downloads && chrome.downloads.onChanged) {
    chrome.downloads.onChanged.addListener((delta) => {
      try {
        const downloadId = delta.id;
        const downloadInfo = activeDownloads.get(downloadId);
        
        if (!downloadInfo) {
          return; // Not tracking this download
        }
        
        // Handle progress updates
        if (delta.bytesReceived) {
          // Get current download information to calculate progress
          chrome.downloads.search({ id: downloadId }, (downloads) => {
            if (downloads.length === 0) return;
            
            const download = downloads[0];
            if (!download.totalBytes || download.totalBytes <= 0) return;
            
            const progressPercent = Math.round((download.bytesReceived / download.totalBytes) * 100);
            const newFuseState = getFuseState(progressPercent);
            
            // Only update notification if fuse state has changed
            if (newFuseState !== downloadInfo.currentFuseState) {
              const newIconUrl = getFuseIcon(progressPercent);
              
              chrome.notifications.update(downloadInfo.notificationId, {
                iconUrl: newIconUrl
              });
              
              // Update the stored fuse state
              downloadInfo.currentFuseState = newFuseState;
              activeDownloads.set(downloadId, downloadInfo);
            }
          });
        }
        
        // Handle completion status
        if (delta.state && delta.state.current === 'complete' && !downloadInfo.isComplete) {
          // Mark as complete to prevent duplicate completion notifications
          downloadInfo.isComplete = true;
          activeDownloads.set(downloadId, downloadInfo);
          
          // Clear the progress notification
          chrome.notifications.clear(downloadInfo.notificationId);
          
          // Create completion notification
          const completionNotificationId = `download-complete-${downloadId}`;
          chrome.notifications.create(completionNotificationId, {
            type: 'basic',
            title: 'Treasure Acquired!',
            message: downloadInfo.filename,
            iconUrl: 'icons/treasure-chest.png',
            silent: true
          });
          
          // Remove from active downloads after a short delay
          setTimeout(() => {
            activeDownloads.delete(downloadId);
          }, 1000);
        }
        
        // Handle failed or interrupted downloads
        if (delta.state && (delta.state.current === 'interrupted' || delta.state.current === 'cancelled')) {
          // Clear the progress notification
          chrome.notifications.clear(downloadInfo.notificationId);
          
          // Remove from active downloads
          activeDownloads.delete(downloadId);
        }
      } catch (error) {
        console.error('Pirate Downloader: Error in onChanged listener:', error);
      }
    });
  }

  // Listener for when downloads are erased from history (cleanup)
  if (chrome.downloads && chrome.downloads.onErased) {
    chrome.downloads.onErased.addListener((downloadId) => {
      try {
        const downloadInfo = activeDownloads.get(downloadId);
        
        if (downloadInfo) {
          // Clear any associated notifications
          chrome.notifications.clear(downloadInfo.notificationId);
          chrome.notifications.clear(`download-complete-${downloadId}`);
          
          // Remove from global state tracker
          activeDownloads.delete(downloadId);
        }
      } catch (error) {
        console.error('Pirate Downloader: Error in onErased listener:', error);
      }
    });
  }

  // Optional: Handle notification clicks
  if (chrome.notifications && chrome.notifications.onClicked) {
    chrome.notifications.onClicked.addListener((notificationId) => {
      try {
        // Clear the notification when clicked
        chrome.notifications.clear(notificationId);
      } catch (error) {
        console.error('Pirate Downloader: Error in notification click handler:', error);
      }
    });
  }

  // Optional: Auto-clear completion notifications after a certain time
  if (chrome.notifications && chrome.notifications.onShown) {
    chrome.notifications.onShown.addListener((notificationId) => {
      try {
        if (notificationId.startsWith('download-complete-')) {
          // Auto-clear completion notifications after 5 seconds
          setTimeout(() => {
            chrome.notifications.clear(notificationId);
          }, 5000);
        }
      } catch (error) {
        console.error('Pirate Downloader: Error in notification shown handler:', error);
      }
    });
  }
}

// Initialize the extension
try {
  if (chrome && chrome.runtime) {
    initializeExtension();
  } else {
    console.error('Pirate Downloader: Chrome runtime not available');
  }
} catch (error) {
  console.error('Pirate Downloader: Failed to initialize extension:', error);
}

// Test function to check APIs (callable from console)
function testPirateAPIs() {
  console.log('=== Pirate Downloader API Test ===');
  console.log('Chrome object:', typeof chrome);
  console.log('Chrome runtime:', typeof chrome?.runtime);
  console.log('Chrome downloads:', typeof chrome?.downloads);
  console.log('Chrome notifications:', typeof chrome?.notifications);
  
  // Test notification creation
  if (chrome?.notifications) {
    chrome.notifications.create('test-pirate-api', {
      type: 'basic',
      title: 'Ahoy! API Test',
      message: 'Chrome APIs are working!',
      iconUrl: 'icons/treasure-chest.png',
      silent: true
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification failed:', chrome.runtime.lastError);
      } else {
        console.log('✅ Notification created successfully:', notificationId);
        setTimeout(() => chrome.notifications.clear(notificationId), 3000);
      }
    });
  } else {
    console.error('❌ Chrome notifications API not available');
  }
}

// Make test function globally available
window.testPirateAPIs = testPirateAPIs;
console.log('🏴‍☠️ Pirate Downloader: Starting...');

// Test Chrome APIs availability immediately
console.log('Chrome object:', typeof chrome);
console.log('Chrome runtime:', typeof chrome?.runtime);
console.log('Chrome downloads:', typeof chrome?.downloads);
console.log('Chrome notifications:', typeof chrome?.notifications);

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

// Test notification function
function testNotification() {
  console.log('Testing notification...');
  if (chrome && chrome.notifications) {
    chrome.notifications.create('test-pirate', {
      type: 'basic',
      title: 'Ahoy! Test Success',
      message: 'Pirate Downloader is working!',
      iconUrl: 'icons/treasure-chest.png',
      silent: true
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification failed:', chrome.runtime.lastError);
      } else {
        console.log('✅ Test notification created:', notificationId);
        setTimeout(() => {
          chrome.notifications.clear(notificationId);
        }, 3000);
      }
    });
  } else {
    console.error('❌ Chrome notifications not available');
  }
}

// Setup event listeners
function setupListeners() {
  console.log('Setting up download listeners...');
  
  // Check if downloads API is available
  if (!chrome.downloads) {
    console.error('❌ Chrome downloads API not available');
    return;
  }
  
  // Listener for when a new download starts
  chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log('🏴‍☠️ Download started:', downloadItem.filename);
    
    const notificationId = `download-progress-${downloadItem.id}`;
    const filename = downloadItem.filename || 'Unknown file';
    
    // Create initial progress notification
    if (chrome.notifications) {
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
    }
  });

  // Listener for download progress and completion changes
  chrome.downloads.onChanged.addListener((delta) => {
    const downloadId = delta.id;
    const downloadInfo = activeDownloads.get(downloadId);
    
    if (!downloadInfo) {
      return; // Not tracking this download
    }
    
    // Handle progress updates
    if (delta.bytesReceived) {
      chrome.downloads.search({ id: downloadId }, (downloads) => {
        if (downloads.length === 0) return;
        
        const download = downloads[0];
        if (!download.totalBytes || download.totalBytes <= 0) return;
        
        const progressPercent = Math.round((download.bytesReceived / download.totalBytes) * 100);
        const newFuseState = getFuseState(progressPercent);
        
        console.log(`🔥 Download ${downloadId} progress: ${progressPercent}%`);
        
        // Only update notification if fuse state has changed
        if (newFuseState !== downloadInfo.currentFuseState && chrome.notifications) {
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
      console.log('💰 Download completed:', downloadInfo.filename);
      
      // Mark as complete
      downloadInfo.isComplete = true;
      activeDownloads.set(downloadId, downloadInfo);
      
      if (chrome.notifications) {
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
        
        // Remove from active downloads after a delay
        setTimeout(() => {
          activeDownloads.delete(downloadId);
        }, 1000);
      }
    }
  });

  // Listener for when downloads are erased from history (cleanup)
  chrome.downloads.onErased.addListener((downloadId) => {
    const downloadInfo = activeDownloads.get(downloadId);
    
    if (downloadInfo && chrome.notifications) {
      // Clear any associated notifications
      chrome.notifications.clear(downloadInfo.notificationId);
      chrome.notifications.clear(`download-complete-${downloadId}`);
      
      // Remove from global state tracker
      activeDownloads.delete(downloadId);
    }
  });
  
  console.log('✅ Download listeners setup complete');
}

// Initialize everything
if (chrome && chrome.runtime) {
  console.log('🏴‍☠️ Pirate Downloader: Initializing...');
  setupListeners();
  
  // Make test function available globally
  self.testNotification = testNotification;
  
  console.log('🏴‍☠️ Pirate Downloader: Ready for action!');
  console.log('💡 Run testNotification() to test notifications');
} else {
  console.error('❌ Chrome runtime not available');
}
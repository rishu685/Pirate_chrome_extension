console.log('🏴‍☠️ Pirate Downloader: Ahoy! Starting the adventure...');

// Global state management for tracking active downloads
const activeDownloads = new Map();

// Fuse icons mapping based on progress percentage
const fuseIcons = {
  0: 'icons/fuse-0.svg',
  25: 'icons/fuse-25.svg',
  50: 'icons/fuse-50.svg',
  75: 'icons/fuse-75.svg',
  100: 'icons/fuse-100.svg'
};

// Function to determine which fuse icon to use based on progress percentage
function getFuseIcon(progressPercent) {
  if (progressPercent >= 100) return fuseIcons[100];
  if (progressPercent >= 75) return fuseIcons[75];
  if (progressPercent >= 50) return fuseIcons[50];
  if (progressPercent >= 25) return fuseIcons[25];
  return fuseIcons[0];
}

// Function to get treasure chest icon for completion
function getTreasureIcon() {
  return 'icons/treasure-chest.svg';
}

// Function to get the fuse state key (for comparison)
function getFuseState(progressPercent) {
  if (progressPercent >= 100) return 100;
  if (progressPercent >= 75) return 75;
  if (progressPercent >= 50) return 50;
  if (progressPercent >= 25) return 25;
  return 0;
}

// Test function for notifications
function testPirateNotification() {
  console.log('🧪 Testing pirate notification...');
  chrome.notifications.create('pirate-test-' + Date.now(), {
    type: 'basic',
    title: 'Ahoy Matey!',
    message: 'Pirate Downloader is ready for action!'
  }, (id) => {
    if (chrome.runtime.lastError) {
      console.error('Test notification failed:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ Pirate test notification successful:', id);
      setTimeout(() => chrome.notifications.clear(id), 3000);
    }
  });
}

// Initialize the pirate extension
if (chrome && chrome.downloads && chrome.notifications) {
  console.log('🏴‍☠️ All pirate APIs ready!');
  
  // Listener for when a new download starts
  chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log('🏴‍☠️ Plundering has begun! File:', downloadItem.filename);
    
    const notificationId = `download-progress-${downloadItem.id}`;
    const filename = downloadItem.filename || 'Unknown treasure';
    
    // Create initial progress notification (without icon first to test)
    chrome.notifications.create(notificationId, {
      type: 'basic',
      title: 'Plundering in Progress...',
      message: `Acquiring: ${filename}`
    }, (id) => {
      if (chrome.runtime.lastError) {
        console.error('Progress notification failed:', chrome.runtime.lastError.message);
      } else {
        console.log('✅ Progress notification created:', id);
      }
    });
    
    // Add download to global state tracker
    activeDownloads.set(downloadItem.id, {
      notificationId: notificationId,
      filename: filename,
      currentFuseState: 0,
      isComplete: false
    });
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
        
        console.log(`🔥 Fuse burning: ${progressPercent}% complete`);
        
        // Only update notification if fuse state has changed
        if (newFuseState !== downloadInfo.currentFuseState) {
          // For now, just update the message (no icon to avoid errors)
          chrome.notifications.update(downloadInfo.notificationId, {
            message: `Acquiring: ${downloadInfo.filename} (${progressPercent}%)`
          });
          
          // Update the stored fuse state
          downloadInfo.currentFuseState = newFuseState;
          activeDownloads.set(downloadId, downloadInfo);
        }
      });
    }
    
    // Handle completion status
    if (delta.state && delta.state.current === 'complete' && !downloadInfo.isComplete) {
      console.log('💰 Treasure acquired!', downloadInfo.filename);
      
      // Mark as complete
      downloadInfo.isComplete = true;
      activeDownloads.set(downloadId, downloadInfo);
      
      // Clear the progress notification
      chrome.notifications.clear(downloadInfo.notificationId);
      
      // Create completion notification
      const completionNotificationId = `download-complete-${downloadId}`;
      chrome.notifications.create(completionNotificationId, {
        type: 'basic',
        title: 'Treasure Acquired!',
        message: `Successfully plundered: ${downloadInfo.filename}`
      }, (id) => {
        if (chrome.runtime.lastError) {
          console.error('Completion notification failed:', chrome.runtime.lastError.message);
        } else {
          console.log('✅ Treasure notification created:', id);
          // Auto-clear after 5 seconds
          setTimeout(() => chrome.notifications.clear(id), 5000);
        }
      });
      
      // Remove from active downloads after a delay
      setTimeout(() => {
        activeDownloads.delete(downloadId);
      }, 1000);
    }
  });

  // Cleanup listener
  chrome.downloads.onErased.addListener((downloadId) => {
    const downloadInfo = activeDownloads.get(downloadId);
    if (downloadInfo) {
      chrome.notifications.clear(downloadInfo.notificationId);
      chrome.notifications.clear(`download-complete-${downloadId}`);
      activeDownloads.delete(downloadId);
    }
  });
  
  // Make test function available
  self.testPirateNotification = testPirateNotification;
  
  console.log('🏴‍☠️ Pirate Downloader ready! Try testPirateNotification() to test');
  console.log('⚓ Start downloading files to see the pirate magic!');
  
} else {
  console.error('❌ Pirate APIs not available!');
}
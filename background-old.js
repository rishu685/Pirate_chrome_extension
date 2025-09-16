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
  chrome.downloads.onCreated.addListener((downloadItem) => {
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
    
    // Remove from active downloads after a short delay to ensure completion notification is shown
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
});

// Listener for when downloads are erased from history (cleanup)
chrome.downloads.onErased.addListener((downloadId) => {
  const downloadInfo = activeDownloads.get(downloadId);
  
  if (downloadInfo) {
    // Clear any associated notifications
    chrome.notifications.clear(downloadInfo.notificationId);
    chrome.notifications.clear(`download-complete-${downloadId}`);
    
    // Remove from global state tracker
    activeDownloads.delete(downloadId);
  }
});

// Optional: Handle notification clicks (could be used to show download folder, etc.)
chrome.notifications.onClicked.addListener((notificationId) => {
  // Clear the notification when clicked
  chrome.notifications.clear(notificationId);
  
  // If it's a completion notification, you could add logic here to:
  // - Open the downloads folder
  // - Show the downloaded file
  // - etc.
});

// Optional: Auto-clear completion notifications after a certain time
chrome.notifications.onShown.addListener((notificationId) => {
  if (notificationId.startsWith('download-complete-')) {
    // Auto-clear completion notifications after 5 seconds
    setTimeout(() => {
      chrome.notifications.clear(notificationId);
    }, 5000);
  }
});
console.log('🧪 SIMPLE TEST EXTENSION STARTED');

// Test 1: Check if Chrome APIs exist
console.log('TEST 1: API Availability');
console.log('- Chrome object:', typeof chrome);
console.log('- Downloads API:', typeof chrome?.downloads);
console.log('- Notifications API:', typeof chrome?.notifications);

// Test 2: Try to create a basic notification
console.log('\nTEST 2: Basic Notification');
if (chrome?.notifications) {
  chrome.notifications.create('test-simple', {
    type: 'basic',
    title: 'Test Success!',
    message: 'Chrome APIs are working!'
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Notification failed:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ Notification created successfully:', notificationId);
      // Auto-clear after 3 seconds
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
        console.log('✅ Notification cleared');
      }, 3000);
    }
  });
} else {
  console.error('❌ Notifications API not available');
}

// Test 3: Set up download listener
console.log('\nTEST 3: Download Listener');
if (chrome?.downloads?.onCreated) {
  chrome.downloads.onCreated.addListener((downloadItem) => {
    console.log('🔽 DOWNLOAD DETECTED!');
    console.log('- File:', downloadItem.filename);
    console.log('- URL:', downloadItem.url);
    console.log('- ID:', downloadItem.id);
    
    // Create download notification
    chrome.notifications.create(`download-${downloadItem.id}`, {
      type: 'basic',
      title: 'Download Started!',
      message: `Downloading: ${downloadItem.filename || 'Unknown file'}`
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Download notification failed:', chrome.runtime.lastError.message);
      } else {
        console.log('✅ Download notification created:', notificationId);
      }
    });
  });
  
  console.log('✅ Download listener registered');
} else {
  console.error('❌ Downloads API not available');
}

// Test 4: Manual test functions
function testNotification() {
  console.log('🧪 Running manual notification test...');
  chrome.notifications.create('manual-test-' + Date.now(), {
    type: 'basic',
    title: 'Manual Test',
    message: 'This is a manual test notification'
  }, (id) => {
    if (chrome.runtime.lastError) {
      console.error('Manual test failed:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ Manual test successful:', id);
    }
  });
}

function showStatus() {
  console.log('\n📊 EXTENSION STATUS:');
  console.log('- Chrome APIs available:', !!(chrome?.downloads && chrome?.notifications));
  console.log('- Ready for downloads:', !!chrome?.downloads?.onCreated);
  console.log('- Ready for notifications:', !!chrome?.notifications?.create);
}

// Make test functions globally available
self.testNotification = testNotification;
self.showStatus = showStatus;

// Show initial status
setTimeout(showStatus, 500);

console.log('\n💡 MANUAL TESTS AVAILABLE:');
console.log('- Run: testNotification()');
console.log('- Run: showStatus()');
console.log('\n🎯 TO TEST DOWNLOADS:');
console.log('1. Go to any website');
console.log('2. Right-click a file link');
console.log('3. Select "Save link as..."');
console.log('4. Watch console for download detection!');
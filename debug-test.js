// Test script to check notification permissions and API availability
// Run this in the browser console (F12 -> Console) to debug

console.log('=== Pirate Downloader Debug Info ===');


console.log('Chrome object available:', typeof chrome !== 'undefined');
console.log('Chrome downloads API:', typeof chrome?.downloads !== 'undefined');
console.log('Chrome notifications API:', typeof chrome?.notifications !== 'undefined');


if ('Notification' in window) {
  console.log('Browser notification permission:', Notification.permission);
  if (Notification.permission === 'default') {
    console.log('⚠️ Notifications not granted - may need permission');
  } else if (Notification.permission === 'granted') {
    console.log('✅ Notifications are allowed');
  } else {
    console.log('❌ Notifications are blocked');
  }
} else {
  console.log('❌ Browser does not support notifications');
}

// Test creating a simple notification (if in extension context)
if (typeof chrome !== 'undefined' && chrome.notifications) {
  chrome.notifications.create('test-notification', {
    type: 'basic',
    title: 'Test Notification',
    message: 'If you see this, notifications are working!',
    iconUrl: 'icons/icon128.png',
    silent: true
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification creation failed:', chrome.runtime.lastError);
    } else {
      console.log('✅ Test notification created:', notificationId);
      // Clear it after 3 seconds
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 3000);
    }
  });
}

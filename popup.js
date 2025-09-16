document.addEventListener("DOMContentLoaded", function() {
  const testBtn = document.getElementById("testBtn");
  const status = document.getElementById("status");
  
  testBtn.addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "test"}, function(response) {
      status.textContent = "🏴‍☠️ Test notification sent!";
      setTimeout(() => {
        status.textContent = "Ready for plundering!";
      }, 3000);
    });
  });
  
  // Update status with current downloads
  chrome.downloads.search({state: "in_progress"}, function(downloads) {
    if (downloads.length > 0) {
      status.textContent = `🔥 ${downloads.length} downloads in progress!`;
    }
  });
});

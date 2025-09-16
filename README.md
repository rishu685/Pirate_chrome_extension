Demo screenshots for reference:

<img width="288" height="55" alt="Screenshot 2025-09-16 at 10 28 28 AM" src="https://github.com/user-attachments/assets/cb6f384c-d387-4333-a0af-233cf88f8a46" />


<img width="294" height="93" alt="Screenshot 2025-09-16 at 10 28 41 AM" src="https://github.com/user-attachments/assets/cf532173-36ed-417f-9f53-7399bc04fdc5" />



<img width="1468" height="901" alt="Screenshot 2025-09-16 at 10 29 28 AM" src="https://github.com/user-attachments/assets/cd428829-c3d1-4fde-bc2d-2f247924d1e9" />



# 🏴‍☠️ Pirate Downloader Chrome Extension

A fun, pirate-themed Chrome extension that transforms your download experience with animated cannon fuse progress indicators and treasure completion notifications.

## 🚀 Installation Guide

### Step 1: Prepare the Extension
1. Make sure you have all the required files in the `Pirate-Downloader-Extension` folder:
   - `manifest.json`
   - `background.js`
   - `icons/` folder (with icon files)

### Step 2: Add Icon Images
Currently, the extension has placeholder `.txt` files for icons. You need to replace these with actual PNG images:

**Required Icons:**
- `icons/icon128.png` - Main extension icon (128x128px)
- `icons/treasure-chest.png` - Completion notification icon (64x64px or 128x128px)
- `icons/fuse-0.png` - Unlit fuse (0% progress)
- `icons/fuse-25.png` - 25% burnt fuse
- `icons/fuse-50.png` - 50% burnt fuse
- `icons/fuse-75.png` - 75% burnt fuse
- `icons/fuse-100.png` - Fully burnt fuse (100% progress)

### Step 3: Load Extension into Chrome

1. **Open Chrome Extensions Page:**
   - Type `chrome://extensions/` in your address bar, OR
   - Click the three dots menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension:**
   - Click "Load unpacked" button
   - Navigate to and select the `Pirate-Downloader-Extension` folder
   - Click "Select Folder"

4. **Verify Installation:**
   - You should see "Pirate Downloader" appear in your extensions list
   - The extension should be enabled by default

## 🎮 How to Use

### Testing the Extension
1. **Start a Download:**
   - Download any file from the internet (right-click → Save as, or click download links)
   - You should immediately see a notification: "Plundering in Progress..." with a fuse icon

2. **Watch the Progress:**
   - As the download progresses, the fuse icon will change to show burning progress
   - Icons change at 0%, 25%, 50%, 75%, and 100% completion

3. **Completion Notification:**
   - When download finishes, you'll see "Treasure Acquired!" with a treasure chest icon
   - This notification auto-clears after 5 seconds

### Features
- **Silent Notifications:** Won't interrupt your work with sounds
- **Progress Animation:** Visual fuse burning animation based on download progress
- **Smart Updates:** Only updates notification when progress state actually changes
- **Automatic Cleanup:** Handles cancelled/failed downloads gracefully

## 🔧 Troubleshooting

### Extension Not Working?
1. **Check Permissions:** Make sure the extension has "Downloads" and "Notifications" permissions
2. **Reload Extension:** Go to `chrome://extensions/`, find Pirate Downloader, click the reload icon
3. **Check Developer Console:** Click "Inspect views: background page" to see any error messages

### No Notifications Appearing?
1. **Enable Chrome Notifications:** 
   - Go to Chrome Settings → Privacy and security → Site Settings → Notifications
   - Make sure notifications are allowed
2. **Check System Notifications:** Ensure your OS allows Chrome to show notifications

### Icons Not Showing?
1. Make sure all `.png` icon files exist in the `icons/` folder
2. Check that file names match exactly (case-sensitive)
3. Reload the extension after adding icons

## 🎨 Customization

You can customize the extension by:
- **Changing Icons:** Replace the PNG files with your own pirate-themed designs
- **Modifying Messages:** Edit the notification text in `background.js`
- **Adjusting Progress Thresholds:** Change when different fuse icons appear
- **Adding Sound Effects:** Extend the code to include audio (if desired)

## 📝 Technical Details

- **Manifest Version:** 3 (latest Chrome extension standard)
- **Permissions:** Downloads, Notifications
- **Background:** Service Worker (background.js)
- **Supported:** Chrome 88+ (Manifest V3 compatible)

## 🐛 Known Limitations

- Requires manual icon creation (placeholder files provided)
- Only works with downloads initiated through Chrome
- Notifications follow system notification settings

Enjoy your pirate-themed downloads! 🏴‍☠️⚓

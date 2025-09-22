# Pirate Downloader Chrome Extension 🏴‍☠️

A fun, pirate-themed Chrome extension that transforms your download experience with animated progress indicators and treasure-themed completion notifications.

## 🚀 Features

- **Cannon Fuse Progress Animation**: Downloads show a burning fuse that progresses from 0% to 100%
- **Treasure Acquired Notifications**: Completion notifications with pirate-themed messages
- **Smart Progress Tracking**: Efficient state management with minimal resource usage
- **Silent Operation**: Non-intrusive notifications that don't interrupt your workflow

## 📁 Project Structure

```
Pirate-Downloader-Extension/
├── manifest.json          # Extension configuration and permissions
├── background.js          # Main service worker with download logic
├── icons/                 # Extension and notification icons
│   ├── icon128.png       # Main extension icon
│   ├── treasure-chest.png # Completion notification icon
│   ├── fuse-0.png        # 0% progress fuse icon
│   ├── fuse-25.png       # 25% progress fuse icon
│   ├── fuse-50.png       # 50% progress fuse icon
│   ├── fuse-75.png       # 75% progress fuse icon
│   └── fuse-100.png      # 100% progress fuse icon
├── README.md             # Installation and usage guide
└── setup.sh              # Quick setup verification script
```

## 🛠 Installation

1. Clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder
5. Start downloading files to see the pirate magic!

## 🎮 Usage

The extension automatically activates when you download files:

1. **Start Download**: Right-click any file link → "Save link as..."
2. **Watch Progress**: See "Plundering in Progress..." with animated fuse
3. **Completion**: Enjoy "Treasure Acquired!" notification

## 🔧 Technical Details

- **Manifest Version**: 3 (Latest Chrome Extension Standard)
- **Required Permissions**: Downloads, Notifications
- **Background**: Service Worker for efficient resource usage
- **Compatible**: Chrome 88+ (Manifest V3 compatible browsers)

## 🏴‍☠️ Development

This extension was built with a focus on:
- Clean, maintainable code structure
- Efficient event handling and state management
- Comprehensive error handling and logging
- User-friendly installation and debugging

**Ahoy! Enjoy your pirate-themed downloads!** 

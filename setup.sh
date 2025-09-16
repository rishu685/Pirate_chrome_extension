#!/bin/bash

echo "🏴‍☠️ Pirate Downloader Extension Setup Helper 🏴‍☠️"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Please run this script from the Pirate-Downloader-Extension directory"
    echo "   Current directory should contain manifest.json"
    exit 1
fi

echo "✅ Found manifest.json - you're in the right directory!"
echo ""

# Check for icon files
echo "🔍 Checking for required icon files..."
missing_icons=()

icons=("icon128.png" "treasure-chest.png" "fuse-0.png" "fuse-25.png" "fuse-50.png" "fuse-75.png" "fuse-100.png")

for icon in "${icons[@]}"; do
    if [ ! -f "icons/$icon" ]; then
        missing_icons+=("$icon")
    fi
done

if [ ${#missing_icons[@]} -gt 0 ]; then
    echo "⚠️  Missing icon files:"
    for icon in "${missing_icons[@]}"; do
        echo "   - icons/$icon"
    done
    echo ""
    echo "📝 Note: You need to create these PNG images before the extension will work properly."
    echo "   Check the .txt files in the icons/ folder for design descriptions."
    echo ""
else
    echo "✅ All required icon files found!"
    echo ""
fi

echo "🚀 Installation Steps:"
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder: $(pwd)"
echo "5. The extension will be installed and ready to use!"
echo ""

echo "🧪 Testing:"
echo "- Download any file to see the pirate-themed notifications"
echo "- Watch the fuse burn as download progresses"
echo "- Enjoy the 'Treasure Acquired!' completion message"
echo ""

echo "📚 For detailed instructions, see README.md"
echo ""
echo "Happy plundering! ⚓"
#!/bin/bash

echo "🔧 Fixing and setting up LookAway for Windows..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node --version)"
    echo "Please upgrade Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create assets directory
echo "📁 Creating assets directory..."
mkdir -p assets

# Check for required assets
if [ ! -f "assets/icon.png" ] || [ ! -f "assets/tray-icon.png" ] || [ ! -f "assets/icon.ico" ]; then
    echo "⚠️  Missing required assets. Creating placeholder icons..."
    
    # Create simple placeholder icons using ImageMagick or curl
    if command -v convert &> /dev/null; then
        # Using ImageMagick
        convert -size 256x256 xc:#667eea -fill white -gravity center -pointsize 48 -annotate 0 "LA" assets/icon.png
        convert -size 32x32 xc:#667eea -fill white -gravity center -pointsize 8 -annotate 0 "LA" assets/tray-icon.png
    else
        # Using curl to download placeholder images
        echo "📥 Downloading placeholder icons..."
        curl -s -o assets/icon.png "https://via.placeholder.com/256x256/667eea/ffffff?text=LA" || echo "⚠️  Could not download icon.png"
        curl -s -o assets/tray-icon.png "https://via.placeholder.com/32x32/667eea/ffffff?text=LA" || echo "⚠️  Could not download tray-icon.png"
    fi
    
    # Create a simple ICO file (this is a basic approach)
    if [ ! -f "assets/icon.ico" ]; then
        echo "⚠️  Please create assets/icon.ico manually or download from an icon converter"
        echo "   You can use online converters like https://convertio.co/png-ico/"
    fi
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi

echo "✅ Build successful!"

# Ask if user wants to start development mode
read -p "🚀 Start development mode? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🎯 Starting development mode..."
    npm run dev
else
    echo "📋 To start development mode later, run: npm run dev"
    echo "📋 To build for production, run: npm run electron:build:win:nsis"
fi

echo "✨ Setup complete!" 
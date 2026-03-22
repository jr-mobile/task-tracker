#!/bin/bash

# Build script for Task Tracker
echo "Building Task Tracker..."

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build

# Build backend
echo "Building backend..."
cd ../backend
npm install

echo "Build complete!"
echo "Run 'npm run dev' from the root directory to start the application."
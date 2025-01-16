#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if the user is logged in to npm
if ! npm whoami &> /dev/null; then
  echo "⚠️  Not logged into npm. Logging in..."
  npm login
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ No package.json found! Run 'npm init' first."
  exit 1
fi

# Read package name and version
PACKAGE_NAME=$(node -p "require('./package.json').name")
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "📦 Package Name: $PACKAGE_NAME"
echo "🔢 Current Version: $CURRENT_VERSION"

# Ask user for version bump type
echo "Select version bump type: (patch/minor/major)"
read VERSION_BUMP

if [[ "$VERSION_BUMP" != "patch" && "$VERSION_BUMP" != "minor" && "$VERSION_BUMP" != "major" ]]; then
  echo "❌ Invalid version type! Use 'patch', 'minor', or 'major'."
  exit 1
fi

# Bump version
npm version $VERSION_BUMP -m "Bump version to %s"

# Publish the package
echo "🚀 Publishing package to npm..."
npm publish --access public

echo "✅ Published successfully!"

# Show package URL
echo "🔗 Check it here: https://www.npmjs.com/package/$PACKAGE_NAME"

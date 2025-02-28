#!/bin/zsh
set -e  # Exit immediately if any command fails

# Get the directory where the script lives
NODE_DIR="$(cd "$(dirname "$0")" && pwd)"
N8N_CUSTOM_DIR="/Users/tylerthompson/.n8n/custom"  # This is where n8n looks for custom nodes

echo "📂 Node directory detected as: $NODE_DIR"

# Create n8n custom directory if it doesn't exist
echo "🔧 Setting up n8n custom directory..."
mkdir -p "$N8N_CUSTOM_DIR"

# Remove problematic .ignored directory if it exists
IGNORED_DIR="/Users/tylerthompson/node_modules/.ignored"
if [ -d "$IGNORED_DIR" ]; then
    echo "🗑️  Removing .ignored directory..."
    rm -rf "$IGNORED_DIR"
fi

echo "🏗️  Building node..."
cd "$NODE_DIR" || exit 1
pnpm run build

echo "🔗 Setting up custom node in n8n..."
# Remove existing directory/symlink if it exists
rm -rf "$N8N_CUSTOM_DIR/n8n-nodes-output-to-console"
# Create the directory
mkdir -p "$N8N_CUSTOM_DIR/n8n-nodes-output-to-console"
# Copy the necessary files
cp -R dist package.json "$N8N_CUSTOM_DIR/n8n-nodes-output-to-console/"

echo "🚀 Starting n8n..."
n8n start

echo "✅ All commands executed successfully!"

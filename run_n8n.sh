#!/bin/zsh
set -e  # Exit immediately if any command fails

# Define directories
NODE_DIR="/Users/tylerthompson/Repository/custom-nodes/n8n-nodes-output-to-console"
N8N_DIR="/Users/tylerthompson/.n8n/custom"

echo "Switching to Node directory: $NODE_DIR"
cd "$NODE_DIR" || exit 1
pnpm run build
pnpm link --global

echo "Switching to N8N directory: $N8N_DIR"
cd "$N8N_DIR" || exit 1
pnpm install
n8n start

echo "✅ All commands executed successfully!"

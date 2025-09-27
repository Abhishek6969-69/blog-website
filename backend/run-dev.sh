#!/bin/bash

# Ensure we're using the correct Node.js version
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js v22
nvm use 22.20.0

# Set PATH explicitly
export PATH="/Users/abhishekyadav/.nvm/versions/node/v22.20.0/bin:$PATH"

# Set NVM environment variables
export NVM_BIN="/Users/abhishekyadav/.nvm/versions/node/v22.20.0/bin"
export NVM_INC="/Users/abhishekyadav/.nvm/versions/node/v22.20.0/include/node"

echo "Using Node.js version: $(node --version)"
echo "Using npm version: $(npm --version)"

# Run wrangler
npx wrangler dev
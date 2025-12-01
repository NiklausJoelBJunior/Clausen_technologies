#!/bin/bash

# Clausen School Management System - Release Script
# This script automates the release process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Clausen School Management System - Release v2.0.0  ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from clausen-desktop-app directory${NC}"
    exit 1
fi

# Check if GitHub token is set
if [ -z "$GH_TOKEN" ]; then
    echo -e "${YELLOW}Warning: GH_TOKEN environment variable is not set${NC}"
    echo -e "For automatic publishing to GitHub, you need to set your GitHub Personal Access Token:"
    echo -e "${BLUE}export GH_TOKEN=\"your_github_token_here\"${NC}"
    echo ""
    read -p "Do you want to continue without automatic publishing? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}Current version: ${CURRENT_VERSION}${NC}"
echo ""

# Check git status
echo -e "${BLUE}Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}You have uncommitted changes:${NC}"
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}Changes committed${NC}"
    fi
else
    echo -e "${GREEN}Working directory is clean${NC}"
fi
echo ""

# Create git tag
echo -e "${BLUE}Creating git tag v${CURRENT_VERSION}...${NC}"
if git rev-parse "v${CURRENT_VERSION}" >/dev/null 2>&1; then
    echo -e "${YELLOW}Tag v${CURRENT_VERSION} already exists${NC}"
    read -p "Do you want to delete and recreate it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "v${CURRENT_VERSION}"
        git push origin ":refs/tags/v${CURRENT_VERSION}" 2>/dev/null || true
    else
        echo -e "${RED}Aborting release${NC}"
        exit 1
    fi
fi

git tag -a "v${CURRENT_VERSION}" -m "Release version ${CURRENT_VERSION}"
echo -e "${GREEN}Tag created${NC}"
echo ""

# Push to GitHub
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push origin main
git push origin "v${CURRENT_VERSION}"
echo -e "${GREEN}Pushed to GitHub${NC}"
echo ""

# Detect platform and build
echo -e "${BLUE}Detecting platform...${NC}"
PLATFORM=$(uname -s)
echo -e "Platform: ${GREEN}${PLATFORM}${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm ci
echo -e "${GREEN}Dependencies installed${NC}"
echo ""

# Build application
echo -e "${BLUE}Building application...${NC}"
npm run build
echo -e "${GREEN}Build complete${NC}"
echo ""

# Build and publish based on platform
case "$PLATFORM" in
    Darwin)
        echo -e "${BLUE}Building macOS application...${NC}"
        npm run build:mac
        echo -e "${GREEN}macOS build complete${NC}"
        ;;
    Linux)
        echo -e "${BLUE}Building Linux application...${NC}"
        npm run build:linux
        echo -e "${GREEN}Linux build complete${NC}"
        ;;
    MINGW*|MSYS*|CYGWIN*)
        echo -e "${BLUE}Building Windows application...${NC}"
        npm run build:win
        echo -e "${GREEN}Windows build complete${NC}"
        ;;
    *)
        echo -e "${RED}Unknown platform: ${PLATFORM}${NC}"
        echo "Please run the appropriate build command manually:"
        echo "  npm run build:mac   (for macOS)"
        echo "  npm run build:win   (for Windows)"
        echo "  npm run build:linux (for Linux)"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Release Complete! 🎉                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Release Information:${NC}"
echo -e "  Version: ${GREEN}v${CURRENT_VERSION}${NC}"
echo -e "  Platform: ${GREEN}${PLATFORM}${NC}"
echo -e "  GitHub Release: ${BLUE}https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/tag/v${CURRENT_VERSION}${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Check GitHub Releases page to verify upload"
echo "  2. Add release notes on GitHub"
echo "  3. Test the installer on a clean machine"
echo "  4. Announce the release to users"
echo "  5. Monitor for update notifications in existing apps"
echo ""
echo -e "${YELLOW}Build artifacts can be found in: ./dist/${NC}"
echo ""

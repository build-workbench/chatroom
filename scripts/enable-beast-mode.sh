#!/bin/bash
# =============================================================================
# ChatRoom Docs - Enable Beast Mode
# Run this script to activate the ULTIMATE GitHub Pages workflow
# =============================================================================

set -e

echo "🔥🔥🔥 CHATROOM DOCS - BEAST MODE ACTIVATION 🔥🔥🔥"
echo "======================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d ".github/workflows" ]; then
    echo -e "${RED}❌ Error: Must run from project root${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Features being activated:${NC}"
echo "  ✅ Hyper-parallel build matrix (4 concurrent builds)"
echo "  ✅ Aggressive optimization mode"
echo "  ✅ Multi-cloud deployment (GitHub Pages + Cloudflare)"
echo "  ✅ Intelligent caching with pnpm"
echo "  ✅ Quality gates (links, performance, SEO, security)"
echo "  ✅ PR preview deployments"
echo "  ✅ Service Worker + PWA support"
echo "  ✅ Security headers injection"
echo "  ✅ Post-deploy monitoring"
echo ""

# Backup old workflow
echo -e "${YELLOW}📦 Backing up current workflow...${NC}"
if [ -f ".github/workflows/pages.yml" ]; then
    cp .github/workflows/pages.yml ".github/workflows/pages.yml.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}  ✓ Backup created${NC}"
fi

# Install new workflow
echo -e "${YELLOW}🚀 Installing ULTIMATE workflow...${NC}"
if [ -f ".github/workflows/pages-ultimate.yml" ]; then
    mv .github/workflows/pages-ultimate.yml .github/workflows/pages.yml
    echo -e "${GREEN}  ✓ Ultimate workflow activated${NC}"
else
    echo -e "${RED}  ❌ pages-ultimate.yml not found${NC}"
    exit 1
fi

# Update package.json to use pnpm
echo -e "${YELLOW}📦 Updating package configuration...${NC}"
if [ -f "docs/package.json" ]; then
    # Already updated in previous step
    echo -e "${GREEN}  ✓ Package config ready${NC}"
fi

# Create pnpm lock if needed
echo -e "${YELLOW}🔧 Checking package manager...${NC}"
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}  ✓ pnpm detected${NC}"
else
    echo -e "${YELLOW}  ⚠ pnpm not found. Install with: npm install -g pnpm${NC}"
fi

# Check for required secrets
echo ""
echo -e "${YELLOW}🔐 Required GitHub Secrets:${NC}"
echo "  For full functionality, add these secrets in GitHub Settings:"
echo "  • CLOUDFLARE_API_TOKEN (for PR previews)"
echo "  • CLOUDFLARE_ACCOUNT_ID (for PR previews)"
echo ""

# Summary
echo -e "${GREEN}=======================================================${NC}"
echo -e "${GREEN}✅ BEAST MODE ACTIVATED!${NC}"
echo -e "${GREEN}=======================================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the new workflow: .github/workflows/pages.yml"
echo "  2. Commit and push:"
echo "       git add ."
echo "       git commit -m 'docs: activate beast mode workflow'"
echo "       git push"
echo "  3. (Optional) Add Cloudflare secrets for PR previews"
echo ""
echo -e "${BLUE}🎉 Your docs will now build with ULTIMATE POWER!${NC}"
echo ""

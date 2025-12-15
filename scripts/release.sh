#!/bin/bash

# Release script for direct-payment-pci-dss-webserver
# Usage: release.sh [patch|minor|major]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if ! command -v gh >/dev/null 2>&1; then
    print_warning "GitHub CLI not found. Please create a release manually."
    exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: ./scripts/release.sh [patch|minor|major]"
    echo "  patch: increment patch version (0.0.5 -> 0.0.6)"
    echo "  minor: increment minor version (0.0.5 -> 0.1.0)"
    echo "  major: increment major version (0.0.5 -> 1.0.0)"
    exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
    print_warning "GitHub CLI not authenticated. Please run 'gh auth login' to authenticate."
    exit 1
fi

print_status() {
    if [ -n "$CI" ]; then
        echo -e "$1"
    else
        echo -e "${GREEN}[INFO]${NC} $1"
    fi
}

print_error() {
    if [ -n "$CI" ]; then
        echo -e "$1"
    else
        echo -e "${RED}[ERROR]${NC} $1"
    fi
}

print_warning() {
    if [ -n "$CI" ]; then
        echo -e "$1"
    else
        echo -e "${YELLOW}[WARNING]${NC} $1"
    fi
}

increment_version() {
    local version=$1
    local increment_type=$2

    IFS='.' read -ra VERSION_PARTS <<< "$version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}

    case $increment_type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            print_error "Invalid increment type. Use 'patch', 'minor', or 'major'"
            exit 1
            ;;
    esac

    echo "$major.$minor.$patch"
}

print_status "Switching to main branch"
git switch main > /dev/null
print_status "Pulling latest changes from main branch"
git pull origin main --quiet

INCREMENT_TYPE="$1"

if [[ ! "$INCREMENT_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid argument. Use 'patch', 'minor', or 'major'"
    echo "Usage: ./scripts/release.sh [patch|minor|major]"
    exit 1
fi

CURRENT_VERSION=$(node -p "require('./package.json').version")
VERSION=$(increment_version "$CURRENT_VERSION" "$INCREMENT_TYPE")

print_status "Current version: $CURRENT_VERSION"
print_status "Incrementing $INCREMENT_TYPE version..."
print_status "New version will be: $VERSION"

if [ -z "$CI" ]; then
    read -p "Continue with version $VERSION? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Release cancelled"
        exit 0
    fi
fi

print_status "Updating package.json version to \"$VERSION\""
npm version "$VERSION" > /dev/null

print_status "Pushing version bump to main branch"
git push origin main --quiet --follow-tags

print_status "Creating GitHub release"
gh release create "v${VERSION}" --generate-notes

if [ $? -ne 0 ]; then
    print_error "Failed to create pull request for the release."
    exit 1
fi

print_status "GitHub release created successfully!"

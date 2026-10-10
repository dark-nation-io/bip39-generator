#!/bin/bash
# Run this ON the server (ssh root@51.77.117.66 -p 20005)
# It installs a GitHub Actions self-hosted runner that auto-deploys on push

set -e

REPO="dark-nation-io/bip39-generator"
RUNNER_DIR="/opt/actions-runner"

# Get a runner registration token from GitHub
echo "Getting runner registration token..."
echo "You need a GitHub PAT with repo scope. Enter it:"
read -s GH_TOKEN

TOKEN=$(curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO/actions/runners/registration-token" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

if [ -z "$TOKEN" ] || [ "$TOKEN" = "None" ]; then
  echo "Failed to get registration token. Check your PAT has repo scope."
  exit 1
fi

echo "Got registration token."

# Install runner
mkdir -p $RUNNER_DIR && cd $RUNNER_DIR

ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
  RUNNER_ARCH="x64"
elif [ "$ARCH" = "aarch64" ]; then
  RUNNER_ARCH="arm64"
fi

echo "Downloading runner for $RUNNER_ARCH..."
curl -o actions-runner.tar.gz -L "https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-${RUNNER_ARCH}-2.321.0.tar.gz"
tar xzf actions-runner.tar.gz
rm actions-runner.tar.gz

# Configure (non-interactive)
RUNNER_ALLOW_RUNASROOT=1 ./config.sh --url "https://github.com/$REPO" --token "$TOKEN" --name "bip39-server" --labels "self-hosted,linux" --unattended --replace

# Install and start as a service
RUNNER_ALLOW_RUNASROOT=1 ./svc.sh install
RUNNER_ALLOW_RUNASROOT=1 ./svc.sh start

echo ""
echo "=========================================="
echo "  Self-hosted runner installed and running!"
echo "  Push to main branch to trigger deploy."
echo "=========================================="

#!/usr/bin/env bash
set -euo pipefail

# This script is intentionally read-only. It validates the local SAM template
# and confirms that the current CLI identity can access AWS before any deploy.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGION="${AWS_REGION:-ap-southeast-3}"
SAM_BIN="${SAM_BIN:-sam}"
AWS_BIN="${AWS_BIN:-aws}"

if ! command -v "$SAM_BIN" >/dev/null 2>&1; then
  echo "SAM CLI not found. Set SAM_BIN or install AWS SAM CLI." >&2
  exit 1
fi

if ! command -v "$AWS_BIN" >/dev/null 2>&1; then
  echo "AWS CLI not found. Set AWS_BIN or install AWS CLI." >&2
  exit 1
fi

echo "==> Validating SAM template for ${REGION}"
SAM_CLI_TELEMETRY=0 AWS_DEFAULT_REGION="$REGION" \
  "$SAM_BIN" validate --template-file "$ROOT_DIR/infra/template.yaml" --region "$REGION" --lint

echo "==> Checking AWS CLI identity (read-only)"
AWS_REGION="$REGION" "$AWS_BIN" sts get-caller-identity --output json

echo "==> Preflight passed. No AWS resources were created."
echo "Next step requires an explicit cost review before running sam deploy."

#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENTS=(production preview development)

STALE_URL_AND_POSTGRES_VARS=(
  NEXT_PUBLIC_SITE_URL
  NEXT_PUBLIC_API_URL
  API_URL
  NEXT_PUBLIC_VERCEL_URL
  VERCEL_URL
  POSTGRES_URL
  POSTGRES_PRISMA_URL
  POSTGRES_URL_NON_POOLING
  POSTGRES_URL_NON_POOLING_DATABASE
  POSTGRES_URL_NON_POOLING_HOST
  POSTGRES_URL_NON_POOLING_PASSWORD
  POSTGRES_URL_NON_POOLING_USER
  POSTGRES_URL_NON_POOLING_URL_NO_SSL
  POSTGRES_URL_NON_POOLING_URL_NON_POOLING
  POSTGRES_URL_NON_POOLING_URL
)

UNUSED_BY_CURRENT_CODE_VARS=(
  OPENAI_API_KEY
  SMTP_HOST
  SMTP_PORT
  SMTP_USER
  SMTP_PASSWORD
  SMTP_FROM_EMAIL
)

INCLUDE_UNUSED_BY_CURRENT_CODE=0

for arg in "$@"; do
  case "$arg" in
    --include-unused-by-current-code)
      INCLUDE_UNUSED_BY_CURRENT_CODE=1
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Usage: $0 [--include-unused-by-current-code]" >&2
      exit 1
      ;;
  esac
done

vars_to_remove=("${STALE_URL_AND_POSTGRES_VARS[@]}")

if [[ "$INCLUDE_UNUSED_BY_CURRENT_CODE" == "1" ]]; then
  vars_to_remove+=("${UNUSED_BY_CURRENT_CODE_VARS[@]}")
fi

echo "Removing stale Vercel environment variables from: ${ENVIRONMENTS[*]}"
echo

for environment in "${ENVIRONMENTS[@]}"; do
  echo "Environment: $environment"
  for name in "${vars_to_remove[@]}"; do
    if vercel env rm "$name" "$environment" --yes >/dev/null 2>&1; then
      echo "  removed $name"
    else
      echo "  skipped $name"
    fi
  done
  echo
done

echo "Done. Current environment variable lists:"
for environment in "${ENVIRONMENTS[@]}"; do
  echo
  vercel env ls "$environment"
done

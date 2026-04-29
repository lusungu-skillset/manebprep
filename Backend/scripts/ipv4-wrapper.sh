#!/bin/sh
# IPv4 Resolution Wrapper Script
# This script ensures DATABASE_URL uses an IPv4 address before starting the app

set -e

echo "🔧 Checking DATABASE_URL configuration..."

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set - starting without database connection"
  exec "$@"
fi

# Extract hostname from DATABASE_URL
# Format: postgresql://user:pass@host:port/dbname
HOSTNAME=$(echo "$DATABASE_URL" | sed -E 's|^postgresql://[^@]+@([^/:]+).*$|\1|')

if [ -z "$HOSTNAME" ]; then
  echo "⚠️  Could not parse hostname from DATABASE_URL"
  exec "$@"
fi

echo "📍 Resolved hostname: $HOSTNAME"

# Try to resolve to IPv4
echo "🔍 Resolving $HOSTNAME to IPv4..."

# Use getent (preferred) or nslookup as fallback
if command -v getent > /dev/null 2>&1; then
  IPV4=$(getent hosts "$HOSTNAME" | grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | awk '{print $1}' | head -n1)
elif command -v nslookup > /dev/null 2>&1; then
  IPV4=$(nslookup "$HOSTNAME" 8.8.8.8 | grep "Address" | grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}' | head -n1 | awk '{print $2}')
else
  echo "⚠️  getent and nslookup not available - proceeding with original hostname"
  exec "$@"
fi

if [ -z "$IPV4" ]; then
  echo "⚠️  Could not resolve $HOSTNAME to IPv4 - proceeding with original URL"
  exec "$@"
fi

echo "✅ Resolved $HOSTNAME to IPv4: $IPV4"

# Replace hostname with IPv4 in DATABASE_URL
DATABASE_URL=$(echo "$DATABASE_URL" | sed "s/$HOSTNAME/$IPV4/")
export DATABASE_URL

echo "📡 Updated DATABASE_URL to use IPv4 address"
echo "🚀 Starting application with IPv4-resolved database URL..."

# Execute the main application
exec "$@"

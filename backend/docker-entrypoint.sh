#!/bin/sh
set -e
echo "⏳ Starting up..."

CONN="${ConnectionStrings__Default:-$DB_CONNECTION_STRING}"
if [ -z "$CONN" ]; then
  echo "❌ Error: Connection string is missing!" >&2
  exit 1
fi

cd /app
echo "📦 Applying migrations..."
dotnet backend.dll ef database update --connection "$CONN" --verbose 2>&1 || {
  echo "❌ Migration failed. See above logs." >&2
  exit 1
}
echo "✅ Migrations applied."

exec dotnet backend.dll

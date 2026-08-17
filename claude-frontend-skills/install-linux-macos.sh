#!/usr/bin/env bash
set -e
SOURCE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/.claude/skills"
mkdir -p "$TARGET"

for dir in "$SOURCE"/*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  cp -R "$dir" "$TARGET/$name"
  echo "Installed: $name"
done

echo
echo "Claude frontend skills installed in: $TARGET"

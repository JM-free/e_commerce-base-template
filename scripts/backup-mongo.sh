#!/bin/bash
set -euo pipefail

# MongoDB backup script for culicula
# Usage: Run daily via cron
# Cron entry (as deploy user):
#   0 3 * * * /home/deploy/culicula/scripts/backup-mongo.sh >> /home/deploy/culicula/mongo-backups/backup.log 2>&1

BACKUP_DIR="$(dirname "$0")/../mongo-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

mongodump \
  --uri="${DATABASE_URI}" \
  --archive="$BACKUP_DIR/base_$TIMESTAMP.gz" \
  --gzip

echo "[$(date)] Backup created: base_$TIMESTAMP.gz ($(du -h "$BACKUP_DIR/base_$TIMESTAMP.gz" | cut -f1))"

# Delete backups older than retention period
deleted=$(find "$BACKUP_DIR" -name "base_*.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
if [ "$deleted" -gt 0 ]; then
  echo "[$(date)] Deleted $deleted backup(s) older than $RETENTION_DAYS days"
fi

echo "[$(date)] Backup complete"

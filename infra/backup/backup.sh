#!/bin/sh
set -e

BACKUP_DIR="/backups"
DB_NAME="${POSTGRES_DB:-falcon_school}"
DB_USER="${POSTGRES_USER:-falcon}"
DB_HOST="${POSTGRES_HOST:-postgres}"
RETENTION_DAYS=30
RETENTION_WEEKS=12
RETENTION_MONTHS=6

DATE=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)
DAY_OF_MONTH=$(date +%d)

mkdir -p "$BACKUP_DIR/daily" "$BACKUP_DIR/weekly" "$BACKUP_DIR/monthly"

# Dump
pg_dump "postgresql://${DB_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:5432/${DB_NAME}" \
  --no-owner --no-acl --format=custom \
  --file="$BACKUP_DIR/daily/${DB_NAME}_${DATE}.dump"

echo "Daily backup created: ${BACKUP_DIR}/daily/${DB_NAME}_${DATE}.dump"

# Weekly (Sunday)
if [ "$DAY_OF_WEEK" = "7" ]; then
  cp "$BACKUP_DIR/daily/${DB_NAME}_${DATE}.dump" \
     "$BACKUP_DIR/weekly/${DB_NAME}_week_${DATE}.dump"
  echo "Weekly backup created"
fi

# Monthly (1st)
if [ "$DAY_OF_MONTH" = "01" ]; then
  cp "$BACKUP_DIR/daily/${DB_NAME}_${DATE}.dump" \
     "$BACKUP_DIR/monthly/${DB_NAME}_month_${DATE}.dump"
  echo "Monthly backup created"
fi

# Cleanup old backups
find "$BACKUP_DIR/daily"   -name "*.dump" -type f -mtime +${RETENTION_DAYS}   -delete
find "$BACKUP_DIR/weekly"  -name "*.dump" -type f -mtime +$((RETENTION_WEEKS * 7)) -delete
find "$BACKUP_DIR/monthly" -name "*.dump" -type f -mtime +$((RETENTION_MONTHS * 30)) -delete

echo "Backup retention cleanup completed"
echo "Backup size: $(du -sh "$BACKUP_DIR/daily/${DB_NAME}_${DATE}.dump" | cut -f1)"

#!/usr/bin/env bash
# بکاپ روزانه‌ی MySQL (روی سرور prod در /opt/roohbakhsh اجرا می‌شود).
# نصب cron:  30 3 * * * /opt/roohbakhsh/backup.sh >> /opt/roohbakhsh/backups/backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")"
DC="docker compose -f docker-compose.prod.yml"
ROOT_PW=$(grep '^DB_ROOT_PASSWORD=' .env | cut -d= -f2-)
DB=$(grep '^DB_DATABASE=' .env | cut -d= -f2-)
DIR="$(pwd)/backups"
mkdir -p "$DIR"
TS=$(date +%Y%m%d-%H%M%S)
FILE="$DIR/${DB}-${TS}.sql.gz"
$DC exec -T mysql mysqldump -uroot -p"$ROOT_PW" \
  --single-transaction --routines --triggers --default-character-set=utf8mb4 \
  "$DB" </dev/null 2>/dev/null | gzip > "$FILE"
# نگه‌داشتن ۱۴ روز آخر
find "$DIR" -name "*.sql.gz" -mtime +14 -delete
echo "$(date '+%F %T')  OK  $FILE  ($(du -h "$FILE" | cut -f1))"

## Backup

pg_dump -U vsb_user -d vsb_apex -f E:\Code\vsb-apex\backup_before_upload.sql

## Clear

psql -U vsb_user -d vsb_apex -c "TRUNCATE TABLE attendance_records, results, internal_tests, placement RESTART IDENTITY CASCADE;"

## Restore

psql -U vsb_user -d vsb_apex -f E:\Code\vsb-apex\backup_before_upload.sql
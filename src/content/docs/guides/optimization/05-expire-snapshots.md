---
title: "Expire Apache Iceberg Snapshots"
description: "A runnable procedure for expiring old Apache Iceberg snapshots with the expire_snapshots Spark procedure, using older_than and retain_last, and checking the result in the snapshots and files metadata tables."
---

Every commit to an Iceberg table creates a snapshot, and every snapshot keeps its data files alive for time travel. Left alone, metadata grows with every write and storage keeps files that no current query reads. The `expire_snapshots` procedure removes old snapshots and deletes the files that only those snapshots needed. It never deletes a file that a remaining snapshot still uses.

This procedure continues from [Compact data files](/guides/optimization/03-compaction/): the `local.db.logs` table there has several small-file snapshots followed by a compaction, which is exactly the case where expiration frees storage.

## Prerequisites

- Apache Spark 4.1 (Scala 2.13) with Java 17 or 21, or Spark 3.5 with the matching runtime.
- Iceberg 1.11.0 Spark runtime: `org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0` (Spark 3.5: `org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.11.0`).
- The `local.db.logs` table from the compaction procedure, or any Iceberg table with more than one snapshot.

```bash
spark-sql --packages org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0 \
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions \
  --conf spark.sql.catalog.local=org.apache.iceberg.spark.SparkCatalog \
  --conf spark.sql.catalog.local.type=hadoop \
  --conf spark.sql.catalog.local.warehouse=$PWD/warehouse
```

## How the arguments work

| Argument | Default | Meaning |
| --- | --- | --- |
| `table` | required | Table to clean up |
| `older_than` | 5 days ago | Snapshots committed before this timestamp are candidates |
| `retain_last` | 1 | Number of ancestor snapshots kept regardless of `older_than` |
| `snapshot_ids` | none | Expire these specific snapshot IDs instead |
| `max_concurrent_deletes` | no thread pool | Threads used to delete files |
| `stream_results` | false | Stream the file list to the driver by partition; set `true` on big tables to avoid driver out-of-memory errors |
| `clean_expired_metadata` | not set | When `true`, also removes partition specs and schemas no snapshot references |

If you pass neither `older_than` nor `retain_last`, the procedure uses the table properties `history.expire.max-snapshot-age-ms` (default 5 days) and `history.expire.min-snapshots-to-keep` (default 1). Snapshots referenced by a branch or tag are never removed by this call, and the current snapshot always stays.

## Steps

1. List the snapshots and note the count and the oldest `snapshot_id`.

   ```sql
   SELECT committed_at, snapshot_id, operation
   FROM local.db.logs.snapshots
   ORDER BY committed_at;
   ```

   For the compaction example you see several `append` rows followed by one `replace`.

2. Count every data file the table's snapshots still reference, current or not.

   ```sql
   SELECT count(DISTINCT file_path) AS referenced_files
   FROM local.db.logs.all_data_files;
   ```

   After the compaction example this is the six small files plus the one compacted file.

3. Expire. Because this lab's snapshots are minutes old, set `older_than` to the current time instead of relying on the 5 day default. Replace the timestamp with a moment after your last commit.

   ```sql
   CALL local.system.expire_snapshots(
     table       => 'db.logs',
     older_than  => TIMESTAMP '2026-09-29 23:59:59',
     retain_last => 1
   );
   ```

   On production tables pick a window that matches how far back you need time travel, for example seven days, and keep a few snapshots with `retain_last`.

   The call returns `deleted_data_files_count`, `deleted_position_delete_files_count`, `deleted_equality_delete_files_count`, `deleted_manifest_files_count`, `deleted_manifest_lists_count`, and `deleted_statistics_files_count`. For the compaction example expect `deleted_data_files_count` = `6`.

4. To remove one specific snapshot instead (never the current one):

   ```sql
   CALL local.system.expire_snapshots(
     table        => 'db.logs',
     snapshot_ids => ARRAY(1234567890123456789)
   );
   ```

5. Make the policy the table default so scheduled jobs can call the procedure with only `table`:

   ```sql
   ALTER TABLE local.db.logs SET TBLPROPERTIES (
     'history.expire.max-snapshot-age-ms'   = '604800000',
     'history.expire.min-snapshots-to-keep' = '5'
   );
   ```

## Done when

1. Only the retained snapshots remain:

   ```sql
   SELECT count(*) AS snapshots FROM local.db.logs.snapshots;
   ```

   Expected: `1` for this lab (equal to `retain_last` when every other snapshot is older than `older_than`), and the remaining row is the `replace` from compaction.

2. Files referenced only by expired snapshots are gone:

   ```sql
   SELECT count(DISTINCT file_path) AS referenced_files
   FROM local.db.logs.all_data_files;
   ```

   Expected: `1`, the compacted file, down from 7 in step 2.

3. Current data is untouched:

   ```sql
   SELECT count(*) FROM local.db.logs;
   ```

   Expected: `6`.

4. Time travel to an expired snapshot fails. Use the oldest `snapshot_id` you noted in step 1:

   ```sql
   SELECT * FROM local.db.logs VERSION AS OF 1234567890123456789;
   ```

   Expected: an error saying the snapshot cannot be found.

## Cautions

- Tables created with the `snapshot` migration procedure share files with their source table, so Iceberg blocks `expire_snapshots` on them.
- Files that were brought in with `add_files` belong to Iceberg afterward. Expiring the snapshots that last referenced them deletes them from storage.
- Expiration does not remove orphan files left by failed writes. That is the separate `remove_orphan_files` procedure.
- To pick a retention window and schedule for your own table, the [table maintenance calculator](/tools/maintenance-calculator/) turns your commit rate and time travel needs into table properties and `CALL` statements.

## Sources

Verified against the Apache Iceberg 1.11.0 documentation:

- [Spark Procedures: expire_snapshots](https://iceberg.apache.org/docs/latest/spark-procedures/#expire_snapshots)
- [Spark Queries: inspecting tables](https://iceberg.apache.org/docs/latest/spark-queries/)
- [Table configuration: history.expire properties](https://iceberg.apache.org/docs/latest/configuration/)

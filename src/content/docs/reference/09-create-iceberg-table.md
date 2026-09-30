---
title: "Create an Apache Iceberg Table with Spark SQL"
description: "A runnable procedure for creating a partitioned Apache Iceberg table in Spark SQL with hidden partition transforms, loading rows, and checking the result in the metadata tables."
---

This procedure creates a partitioned Apache Iceberg table from the `spark-sql` shell, writes a few rows, and confirms the table is healthy by reading its metadata tables. It uses a local, path-based catalog so you can run it on a laptop before pointing the same SQL at a production catalog.

## Prerequisites

- Apache Spark 4.1 (Scala 2.13) with Java 17 or 21. Spark 3.5 works too if you swap the runtime package shown below.
- The Iceberg Spark runtime for Iceberg 1.11.0: `org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0`. For Spark 3.5 use `org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.11.0`.
- Write access to a local directory for the warehouse.

Start the shell with the runtime package, the Iceberg SQL extensions, and a catalog named `local`:

```bash
spark-sql --packages org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0 \
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions \
  --conf spark.sql.catalog.local=org.apache.iceberg.spark.SparkCatalog \
  --conf spark.sql.catalog.local.type=hadoop \
  --conf spark.sql.catalog.local.warehouse=$PWD/warehouse
```

To use a Hive Metastore or REST catalog instead, change the `type` and add a `uri`, for example `--conf spark.sql.catalog.local.type=rest --conf spark.sql.catalog.local.uri=http://localhost:8181`. Every step below stays the same.

## Steps

1. Create a namespace to hold the table.

   ```sql
   CREATE NAMESPACE IF NOT EXISTS local.db;
   ```

2. Create the table. `USING iceberg` makes it an Iceberg table, and the `PARTITIONED BY` clause uses transforms, so readers filter on `event_ts` and `user_id` and never need to know how the data is laid out on disk (hidden partitioning).

   ```sql
   CREATE TABLE local.db.events (
       event_id   bigint,
       user_id    bigint,
       event_type string,
       event_ts   timestamp)
   USING iceberg
   PARTITIONED BY (day(event_ts), bucket(16, user_id));
   ```

   The other transforms are `year(ts)`, `month(ts)`, `hour(ts)`, and `truncate(L, col)`. New tables use format version 2 by default.

3. Write rows in a single statement, which produces exactly one commit.

   ```sql
   INSERT INTO local.db.events VALUES
     (1, 101, 'login',    TIMESTAMP '2026-09-28 08:15:00'),
     (2, 102, 'purchase', TIMESTAMP '2026-09-28 09:30:00'),
     (3, 101, 'logout',   TIMESTAMP '2026-09-29 17:45:00'),
     (4, 103, 'login',    TIMESTAMP '2026-09-29 18:05:00');
   ```

4. Query the table with a filter on the source column. Iceberg maps the predicate to the `day(event_ts)` partition for you.

   ```sql
   SELECT event_type, count(*) AS events
   FROM local.db.events
   WHERE event_ts >= TIMESTAMP '2026-09-29 00:00:00'
   GROUP BY event_type;
   ```

## Done when

Run each check. If all four match, the table exists, is partitioned the way you declared, and has one clean commit.

1. One snapshot, an `append`, with four records:

   ```sql
   SELECT snapshot_id, operation,
          summary['added-records'] AS added_records,
          summary['total-records'] AS total_records
   FROM local.db.events.snapshots;
   ```

   Expected: one row, `operation` = `append`, `added_records` = `4`, `total_records` = `4`.

2. The history has that snapshot as the current state:

   ```sql
   SELECT made_current_at, snapshot_id, parent_id, is_current_ancestor
   FROM local.db.events.history;
   ```

   Expected: one row, `parent_id` is `NULL`, `is_current_ancestor` is `true`, and `snapshot_id` matches check 1.

3. The data files add up to the rows you wrote:

   ```sql
   SELECT count(*) AS data_files, sum(record_count) AS records
   FROM local.db.events.files;
   ```

   Expected: `records` = `4` and `data_files` is at least `1`.

4. The partitions reflect the transforms:

   ```sql
   SELECT partition, record_count, file_count
   FROM local.db.events.partitions;
   ```

   Expected: each `partition` value is a struct with a day field and a bucket field, and `record_count` sums to `4` across rows. The two days in the sample mean you see at least two distinct day values.

## Next steps

- [Compact data files](/guides/optimization/03-compaction/) once many small writes pile up.
- [Expire snapshots](/guides/optimization/05-expire-snapshots/) to cap metadata growth and storage cost.
- [Migrate a Hive table](/guides/migration/02-icebergmigration/) instead of starting from an empty table.

## Sources

Verified against the Apache Iceberg 1.11.0 documentation:

- [Spark Getting Started](https://iceberg.apache.org/docs/latest/spark-getting-started/)
- [Spark DDL](https://iceberg.apache.org/docs/latest/spark-ddl/)
- [Spark Queries: inspecting tables](https://iceberg.apache.org/docs/latest/spark-queries/)
- [Releases](https://iceberg.apache.org/releases/)

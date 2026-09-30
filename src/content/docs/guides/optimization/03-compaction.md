---
title: "Compact Apache Iceberg Data Files"
description: "A runnable procedure for compacting small files in an Apache Iceberg table with the rewrite_data_files Spark procedure, including bin-pack, sort, and filtered rewrites, with checks against the metadata tables."
---

Every streaming micro-batch or small `INSERT` adds data files to an Iceberg table. Many small files mean more manifest entries to plan over and more file opens per query. Compaction rewrites those files into fewer, larger ones with the `rewrite_data_files` procedure. The table's data does not change; only its layout does.

This procedure builds a table with deliberately small files, compacts it, and proves the result with the metadata tables.

## Prerequisites

- Apache Spark 4.1 (Scala 2.13) with Java 17 or 21. Spark 3.5 works if you swap the runtime package.
- Iceberg 1.11.0 Spark runtime: `org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0` (Spark 3.5: `org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.11.0`).
- On Spark 3.x, `CALL` needs the Iceberg SQL extensions. Spark 4.x runs procedures natively, but procedure names are case sensitive there, so keep them lowercase.

```bash
spark-sql --packages org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0 \
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions \
  --conf spark.sql.catalog.local=org.apache.iceberg.spark.SparkCatalog \
  --conf spark.sql.catalog.local.type=hadoop \
  --conf spark.sql.catalog.local.warehouse=$PWD/warehouse
```

## Steps

1. Create a table and write to it in several small commits. Each `INSERT` produces at least one new data file.

   ```sql
   CREATE NAMESPACE IF NOT EXISTS local.db;

   CREATE TABLE local.db.logs (id bigint, level string, msg string)
   USING iceberg;

   INSERT INTO local.db.logs VALUES (1, 'INFO',  'start');
   INSERT INTO local.db.logs VALUES (2, 'INFO',  'load');
   INSERT INTO local.db.logs VALUES (3, 'WARN',  'retry');
   INSERT INTO local.db.logs VALUES (4, 'INFO',  'load');
   INSERT INTO local.db.logs VALUES (5, 'ERROR', 'timeout');
   INSERT INTO local.db.logs VALUES (6, 'INFO',  'done');
   ```

2. Record the starting point. Write down both numbers.

   ```sql
   SELECT count(*) AS data_files, sum(record_count) AS records,
          avg(file_size_in_bytes) AS avg_bytes
   FROM local.db.logs.files;
   ```

   Expected: `data_files` of 6 or more and `records` = `6`.

3. Run the compaction. The default strategy is `binpack`, which combines small files toward the target size (the table's `write.target-file-size-bytes`, 512 MB by default). A file group is rewritten once it holds `min-input-files` files (default 5); setting it to 2 makes the example deterministic.

   ```sql
   CALL local.system.rewrite_data_files(
     table   => 'db.logs',
     strategy => 'binpack',
     options => map('min-input-files', '2')
   );
   ```

   The call returns `rewritten_data_files_count`, `added_data_files_count`, `rewritten_bytes_count`, `failed_data_files_count`, and `removed_delete_files_count`. For this sample expect `rewritten_data_files_count` to equal the file count from step 2 and `added_data_files_count` to be `1`.

4. Use the variants you need on real tables:

   ```sql
   -- Only rewrite files that may hold rows matching a predicate (usually a partition range)
   CALL local.system.rewrite_data_files(
     table => 'db.logs',
     where => 'level = "ERROR"'
   );

   -- Sort rows while compacting so min/max stats prune better
   CALL local.system.rewrite_data_files(
     table      => 'db.logs',
     strategy   => 'sort',
     sort_order => 'level ASC NULLS LAST, id DESC NULLS LAST'
   );

   -- Z-order on two columns
   CALL local.system.rewrite_data_files(
     table      => 'db.logs',
     strategy   => 'sort',
     sort_order => 'zorder(level, id)'
   );

   -- Large tables: commit in pieces and cap the output file size at 256 MB
   CALL local.system.rewrite_data_files(
     table   => 'db.logs',
     options => map(
       'partial-progress.enabled', 'true',
       'partial-progress.max-commits', '10',
       'target-file-size-bytes', '268435456')
   );
   ```

   `sort_order` defaults to the table's own sort order when you pick `sort` without it.

## Done when

1. The newest snapshot is a `replace` that removed the small files and added the compacted one:

   ```sql
   SELECT committed_at, operation,
          summary['deleted-data-files'] AS deleted_files,
          summary['added-data-files']   AS added_files,
          summary['total-data-files']   AS total_files
   FROM local.db.logs.snapshots
   ORDER BY committed_at DESC
   LIMIT 1;
   ```

   Expected: `operation` = `replace`, `deleted_files` equals the step 2 file count, `added_files` = `1`, `total_files` = `1`.

2. The current file listing shrank and the row count did not change:

   ```sql
   SELECT count(*) AS data_files, sum(record_count) AS records
   FROM local.db.logs.files;
   ```

   Expected: `data_files` = `1`, `records` = `6`.

3. The compaction is part of the current lineage:

   ```sql
   SELECT made_current_at, snapshot_id, is_current_ancestor
   FROM local.db.logs.history
   ORDER BY made_current_at DESC
   LIMIT 1;
   ```

   Expected: `is_current_ancestor` = `true`, and `snapshot_id` matches the snapshot from check 1.

The old small files are still in storage because earlier snapshots reference them. They go away when those snapshots expire, which is the next procedure: [Expire snapshots](/guides/optimization/05-expire-snapshots/).

## Operating it

- Schedule compaction per partition with `where` instead of rewriting the whole table each run.
- Tables with row-level deletes can also clean up delete files: add `'remove-dangling-deletes', 'true'` to `options`.
- Run compaction before snapshot expiration so the replaced files become eligible for deletion in the same maintenance window.
- To choose a cadence and target file size for your own table, the [table maintenance calculator](/tools/maintenance-calculator/) works them out from ingest volume and commit rate and writes the `CALL` statements.

## Further reading

- [Create an Iceberg table](/reference/09-create-iceberg-table/)
- [What is an Agentic Lakehouse?](/guides/agentic/01-agentic-ai-lakehouse/)
- [Blog: Maintaining Iceberg Tables: Compaction, Expiring Snapshots, and More](https://www.dremio.com/blog/maintaining-iceberg-tables-compaction-expiring-snapshots-and-more/)
- [Blog: Compaction in Apache Iceberg: Fine-Tuning Your Iceberg Table's Data Files](https://www.dremio.com/blog/compaction-in-apache-iceberg-fine-tuning-your-iceberg-tables-data-files/)

## Sources

Verified against the Apache Iceberg 1.11.0 documentation:

- [Spark Procedures: rewrite_data_files](https://iceberg.apache.org/docs/latest/spark-procedures/#rewrite_data_files)
- [Spark Queries: inspecting tables](https://iceberg.apache.org/docs/latest/spark-queries/)
- [Table configuration](https://iceberg.apache.org/docs/latest/configuration/)
- [Table spec: snapshot operations and summary fields](https://iceberg.apache.org/spec/)

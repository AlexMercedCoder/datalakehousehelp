---
title: "Migrate a Hive Table to Apache Iceberg"
description: "A runnable procedure for moving a Hive table to Apache Iceberg in Spark SQL with the snapshot, migrate, and add_files procedures, including the risks of in-place migration and checks against the metadata tables."
---

Iceberg can adopt the Parquet, ORC, or Avro files a Hive table already has, so moving to Iceberg does not require rewriting data. Spark ships three procedures for this, and they behave very differently. Pick the right one before you run anything.

## snapshot, migrate, or add_files

| Procedure | What it does | Source Hive table afterward | Use it when |
| --- | --- | --- | --- |
| `snapshot` | Creates a new Iceberg table that points at the source table's data files. New writes land in the new table's location. | Unchanged and still writable. | You want to test Iceberg reads and writes against real data without touching production. |
| `migrate` | Replaces the Hive table with an Iceberg table of the same name, copying schema, partitioning, properties, and location. | Renamed to a backup (`<table>_BACKUP_`) unless you pass `drop_backup => true`. | You are ready to cut over and every reader and writer can handle Iceberg. |
| `add_files` | Registers files from a Hive table or a path into an Iceberg table that already exists. Does not create a table. | Unchanged, but Iceberg now treats those files as its own. | You need to import specific partitions, or the target table already exists with its own layout. |

### The risk with migrate

`migrate` is the one-way door. After it runs, the table name your jobs and dashboards use resolves to an Iceberg table, and:

- Any engine or job that reads the table as plain Hive, without Iceberg support, stops working against it.
- Writers that are still running against the old Hive table can fail or write to the backup. Stop them first.
- It fails on bucketed tables and on any partition stored in a format other than Parquet, ORC, or Avro.
- The backup Hive table and the new Iceberg table point at the same data files. If the backup is a managed Hive table, dropping it can delete files the Iceberg table now depends on. Check the backup with `DESCRIBE FORMATTED` and only remove it once you know dropping it leaves the data in place.

`snapshot` has the opposite risk: the snapshot table does not own its files. Iceberg blocks `expire_snapshots` on it, and a `DELETE` on the original Hive table removes files the snapshot still reads. `add_files` does not check that file schemas match the Iceberg table, and later `expire_snapshots` runs can physically delete the files it imported.

The steps below use `snapshot` to test and `migrate` to cut over.

## Prerequisites

- Apache Spark 4.1 (Scala 2.13) with Java 17 or 21, built with Hive support and able to reach your Hive Metastore (`hive-site.xml` on the classpath, or `hive.metastore.uris` set). Spark 3.5 works with the matching runtime.
- Iceberg 1.11.0 Spark runtime: `org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0` (Spark 3.5: `org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.11.0`).
- The Spark session catalog replaced with Iceberg's `SparkSessionCatalog`, so the same catalog can load both the Hive source and the Iceberg result.

```bash
spark-sql --packages org.apache.iceberg:iceberg-spark-runtime-4.1_2.13:1.11.0 \
  --conf spark.sql.catalogImplementation=hive \
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions \
  --conf spark.sql.catalog.spark_catalog=org.apache.iceberg.spark.SparkSessionCatalog \
  --conf spark.sql.catalog.spark_catalog.type=hive
```

The examples use a Hive table `db.sales` partitioned by `sale_date`. Substitute your own names.

## Steps

1. Confirm the source can be migrated. Look at the storage format, the table type, and bucketing.

   ```sql
   DESCRIBE FORMATTED db.sales;
   ```

   You need a Parquet, ORC, or Avro SerDe and `Num Buckets` of `-1` (not bucketed). Note whether `Type` is `MANAGED` or `EXTERNAL`.

2. Record the baseline you will compare against.

   ```sql
   SELECT count(*) AS row_count FROM db.sales;
   SHOW PARTITIONS db.sales;
   ```

3. Create a test copy with `snapshot`. The Hive table is not modified.

   ```sql
   CALL spark_catalog.system.snapshot(
     source_table => 'db.sales',
     table        => 'db.sales_iceberg_test'
   );
   ```

   The output `imported_files_count` is the number of Hive data files now tracked by the test table.

4. Test against the snapshot: run your real queries on `db.sales_iceberg_test`, compare counts with step 2, and try a write (writes go to the test table's own location). Then remove it. Use a plain `DROP TABLE`, never `PURGE`, because the files belong to the Hive table.

   ```sql
   SELECT count(*) FROM db.sales_iceberg_test;
   DROP TABLE db.sales_iceberg_test;
   ```

5. Stop every job that writes to `db.sales`, and check that every reader supports Iceberg.

6. Migrate in place, keeping the backup.

   ```sql
   CALL spark_catalog.system.migrate(table => 'db.sales');
   ```

   The output `migrated_files_count` is the number of files appended to the new Iceberg table. The original Hive table is kept as `db.sales_BACKUP_`. Pass `properties => map('key', 'value')` to set table properties, `backup_table_name => '...'` to choose the backup name, or `drop_backup => true` to skip the backup (not recommended).

7. Restart writers against `db.sales`. They now write through Iceberg.

### Importing selected partitions with add_files

If you only want some partitions, or the Iceberg table already exists, create the target and import into it:

```sql
CREATE TABLE db.sales_ib (id bigint, amount decimal(10,2), sale_date string)
USING iceberg
PARTITIONED BY (sale_date);

CALL spark_catalog.system.add_files(
  table            => 'db.sales_ib',
  source_table     => 'db.sales',
  partition_filter => map('sale_date', '2026-09-01')
);
```

`check_duplicate_files` defaults to `true`, which stops the same file from being added twice. To import straight from a directory, use a path source such as ``source_table => '`parquet`.`s3://bucket/path/to/table`'``.

## Done when

Run these after step 6.

1. Row counts match the step 2 baseline:

   ```sql
   SELECT count(*) AS row_count FROM db.sales;
   ```

   Expected: the same number you recorded before migrating.

2. The table has Iceberg metadata tables and exactly one `append` snapshot holding the migrated files:

   ```sql
   SELECT operation,
          summary['added-data-files'] AS added_files,
          summary['total-records']    AS total_records
   FROM db.sales.snapshots;
   ```

   Expected: one row, `operation` = `append`, `added_files` equals `migrated_files_count`, `total_records` equals the baseline row count. A plain Hive table would fail this query, because `.snapshots` only exists on Iceberg tables.

3. The file listing matches the migration output:

   ```sql
   SELECT count(*) AS data_files, sum(record_count) AS records
   FROM db.sales.files;
   ```

   Expected: `data_files` = `migrated_files_count`, `records` = the baseline row count.

4. The history starts at the migration:

   ```sql
   SELECT made_current_at, snapshot_id, parent_id, is_current_ancestor
   FROM db.sales.history;
   ```

   Expected: one row, `parent_id` is `NULL`, `is_current_ancestor` = `true`.

5. Old files resolve by column name. Migrated files have no Iceberg field IDs, so `migrate` stores a name mapping:

   ```sql
   SHOW TBLPROPERTIES db.sales ('schema.name-mapping.default');
   ```

   Expected: a JSON value listing each column of the original schema.

6. The backup exists:

   ```sql
   SHOW TABLES IN db LIKE 'sales*';
   ```

   Expected: both `sales` and the backup table. The Hive Metastore stores names in lowercase, so the backup lists as `sales_backup_`.

## Other sources

- **Any table or file format:** `CREATE TABLE ... USING iceberg AS SELECT ...` (CTAS) rewrites the data into a new Iceberg table. It costs a full rewrite but works from any source Spark can read, and lets you choose a new partition spec.
- **Delta Lake and Apache Hudi:** Iceberg has a Delta Lake migration module (see Delta Lake Migration in the Iceberg docs), and metadata translation projects such as Apache XTable can expose Delta or Hudi tables as Iceberg. The blog posts below walk through each path.

## Further reading

- [Create an Iceberg table](/reference/09-create-iceberg-table/)
- [Blog: How to Migrate a Hive Table to an Iceberg Table](https://www.dremio.com/blog/how-to-migrate-a-hive-table-to-an-iceberg-table/)
- [Blog: Migrating a Hive Table to an Iceberg Table Hands-on Tutorial](https://www.dremio.com/blog/migrating-a-hive-table-to-an-iceberg-table-hands-on-tutorial/)
- [Blog: Delta Lake to Apache Iceberg Migration](https://www.dremio.com/blog/3-ways-to-convert-a-delta-lake-table-into-an-apache-iceberg-table/)
- [Blog: How to Convert CSV into Apache Iceberg](https://www.dremio.com/blog/how-to-convert-csv-files-into-an-apache-iceberg-table-with-dremio/)
- [Blog: How to convert JSON into Apache Iceberg](https://www.dremio.com/blog/how-to-convert-json-files-into-an-apache-iceberg-table-with-dremio/)

## Sources

Verified against the Apache Iceberg 1.11.0 documentation:

- [Spark Procedures: table migration (snapshot, migrate, add_files)](https://iceberg.apache.org/docs/latest/spark-procedures/#table-migration)
- [Spark Configuration: catalogs and SparkSessionCatalog](https://iceberg.apache.org/docs/latest/spark-configuration/)
- [Spark Queries: inspecting tables](https://iceberg.apache.org/docs/latest/spark-queries/)
- [Spark DDL: CREATE TABLE ... AS SELECT](https://iceberg.apache.org/docs/latest/spark-ddl/)

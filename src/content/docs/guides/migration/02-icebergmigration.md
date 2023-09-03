---
title: Apache Iceberg
description: Resources for migrating to Apache Iceberg
---

Migrating data management and storage solutions is a strategic endeavor that organizations undertake to unlock new capabilities, streamline processes, and enhance overall efficiency. Apache Iceberg, a cutting-edge open-source data table format, has garnered significant attention for its comprehensive capabilities. This page delves into the reasons for migrating to Apache Iceberg, various migration procedures, and the modules integrated into Iceberg for seamless migration from other platforms.

### Reasons to Migrate to Apache Iceberg:

****Table Evolution:**** Apache Iceberg offers built-in support for schema evolution, enabling efficient updates to table schemas without the need for extensive data rewriting.

****Efficient Metadata Handling:**** Iceberg's metadata management capabilities enhance query performance by minimizing the metadata overhead, resulting in quicker query execution.

****Data Lakehouse Compatibility:**** Iceberg seamlessly integrates with both data lakes and data warehouses, bridging the gap between the two and offering the best of both worlds.

****Time Travel and Snapshots:**** Iceberg enables time travel queries, allowing you to query data as it existed at a specific point in time, along with support for snapshot isolation.

### Migrating In-Place from Hive using the Migrate Procedure:

The in-place migration procedure is designed to smoothly transition tables from Hive to Iceberg without extensive data movement. It involves converting the existing Hive table into an Iceberg table format while preserving data and metadata.

### Migrating Parquet Files In-Place using the Add_Files Procedure:

The add_files procedure simplifies migration by adding Parquet files to an existing Iceberg table. This is particularly useful when you have data residing in Parquet format that needs to be incorporated into your Iceberg table.

### Migrating from Anywhere using a CTAS (Create Table As Select):

The CTAS approach is a versatile method that enables migrating data from various sources, including different file formats or databases, to an Apache Iceberg table. It involves creating a new Iceberg table by selecting data from the source and using Iceberg-specific options.

### Modules Built into Apache Iceberg for Converting Delta Lake and Hudi Tables:

**Delta Lake Migration:** Delta Lake is a popular open-source storage layer that brings ACID transactions to Apache Spark and big data workloads. Iceberg provides a Delta Lake integration module that allows seamless migration of Delta Lake tables to Iceberg, preserving metadata, data integrity, and transactional properties.

**Hudi Migration:** Apache Hudi is another open-source data lake storage layer designed for incremental data processing. Iceberg provides a Hudi integration module, enabling users to convert Hudi tables to Iceberg format while retaining data lineage and transactional characteristics.

### In Conclusion: Enhancing Data Management with Apache Iceberg Migration

Migrating to Apache Iceberg presents organizations with a gateway to modernized data management, improved query performance, and the ability to seamlessly combine data lake and data warehouse paradigms. Whether migrating in-place from Hive, incorporating Parquet files, or leveraging CTAS for diverse sources, Iceberg empowers data practitioners to transform their data ecosystem with minimal disruptions. Moreover, with integrated modules facilitating the migration of Delta Lake and Hudi tables, Apache Iceberg solidifies its position as a comprehensive solution for a diverse range of data migration needs.


## Further reading

- [Blog: How to Migrate a Hive Table to an Iceberg Table](https://www.dremio.com/blog/how-to-migrate-a-hive-table-to-an-iceberg-table/)
- [Blog: Migrating a Hive Table to an Iceberg Table Hands-on Tutorial](https://www.dremio.com/blog/migrating-a-hive-table-to-an-iceberg-table-hands-on-tutorial/)
- [Blog: Delta Lake to Apache Iceberg Migration](https://www.dremio.com/blog/3-ways-to-convert-a-delta-lake-table-into-an-apache-iceberg-table/)
- [Blog: How to Convert CSV into Apache Iceberg](https://www.dremio.com/blog/how-to-convert-csv-files-into-an-apache-iceberg-table-with-dremio/)
- [Blog: How to convert JSON into Apache Iceberg](https://www.dremio.com/blog/how-to-convert-json-files-into-an-apache-iceberg-table-with-dremio/)
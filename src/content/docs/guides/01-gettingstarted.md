---
title: "Hands-On With Data Lakehouses"
description: "Hands-on tutorials for building data lakehouses with Apache Iceberg, Dremio, Nessie, and MinIO — covering data ingestion, querying, BI dashboards, and real-world lakehouse architecture patterns."
---

Choose a task before opening a tutorial. These external walkthroughs use different product versions, so confirm the versions and commands on the linked page against your environment. The three starting links below were reachable on September 29, 2026; their instructions have not been revalidated here.

## Before you begin

- Have a laptop that can run containers, sufficient free disk space for local services, and a terminal.
- Pick a disposable development environment. Do not use production credentials or data for a first run.
- Expect to start storage, a catalog, and a query engine; ingest a small table; then query its rows. The exact commands depend on the tutorial you choose.

On this page you'll find guides walking you through data lakehouse tasks such as:

- Ingesting data into the data lakehouse
- Querying data in the data lakehouse

Start with the first tutorial to set up an environment on your laptop and run basic ingestion and querying exercises. If a service does not start, check container logs and port conflicts first; if a query cannot find a table, confirm the catalog connection and namespace before troubleshooting the query itself.

- [Building a Data Lakehouse on your Laptop with Dremio, Nessie, Iceberg and Minio](https://www.dremio.com/blog/intro-to-dremio-nessie-and-apache-iceberg-on-your-laptop/)
- [Building a Data Lakehouse on Your Laptop](https://dev.to/alexmercedcoder/data-engineering-create-a-apache-iceberg-based-data-lakehouse-on-your-laptop-41a8)
- [Building a Lakehouse on your laptop with Airbyte, Dremio, S3, and Iceberg](https://www.dremio.com/blog/how-to-create-a-lakehouse-with-airbyte-s3-apache-iceberg-and-dremio/)

## Further reading

#### Ingest & Query
- [Blog: Ingest with Fivetran, Query with Dremio](https://www.dremio.com/blog/building-your-data-lakehouse-just-got-a-whole-lot-easier-with-dremio-fivetran/)
- [Blog: Ingest with Flink using SQL](https://www.dremio.com/blog/getting-started-with-flink-sql-and-apache-iceberg/)
- [Blog: Ingest in Flink with Java, Query in Dremio](https://www.dremio.com/blog/using-flink-with-apache-iceberg-and-nessie/)

#### BI Dashboards
- [Blog: Connecting Tableau to Apache Iceberg Tables with Dremio](https://www.dremio.com/blog/connecting-tableau-to-apache-iceberg-tables-with-dremio/)
- [Blog: 5 Easy Steps to Migrate an Apache Superset Dashboard to Your Lakehouse](https://www.dremio.com/blog/5-easy-steps-to-migrate-an-apache-superset-dashboard-to-your-lakehouse/)

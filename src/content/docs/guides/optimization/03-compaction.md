---
title: "How to Optimize Apache Iceberg: Compaction & Small Files"
description: "Learn how to optimize Apache Iceberg tables by managing the small file problem. A complete guide to compaction, RewriteDataFiles, and best practices."
---

import { LinkCard } from '@astrojs/starlight/components';

Compaction stands as a crucial strategy to optimize storage efficiency and query performance in Apache Iceberg. By consolidating and reducing the number of data files (solving the "small file problem"), compaction significantly enhances data retrieval speed, reduces metadata overhead in manifest files, and improves overall data lakehouse efficiency. This documentation page delves into the concept of compaction in Iceberg, its benefits, best practices for implementation, and key mistakes to avoid.

### What is Compaction in Apache Iceberg?

Compaction, in the context of Apache Iceberg, refers to the process of merging multiple smaller data files into larger ones, typically using the `RewriteDataFiles` procedure. This consolidation reduces the total number of files, improving storage management and enhancing query performance. Compaction is particularly effective when dealing with small or fragmented data files, often generated through frequent streaming ingestion, frequent updates, or micro-batch inserts.

### Benefits of Iceberg Compaction for Lakehouse Performance:

- **Optimized Query Performance:** Compaction reduces the number of files that need to be scanned and opened during queries, which drastically cuts down on Amazon S3/cloud storage `GET` request latency.

- **Reduced Metadata Overhead:** Fewer data files mean smaller Iceberg manifest files. This reduces the metadata overhead during query planning, leading to faster execution times.

- **Enhanced Data Retrieval:** Larger, consolidated files allow for more efficient I/O operations, reducing the time required to read data.

- **Reduced Storage Costs:** Compaction reduces storage redundancy and can lead to cost savings, especially in cloud-based data lakehouses.

### Best Practices for Effective Compaction:

- **Schedule Regularly:** Implement a scheduled compaction process to ensure ongoing optimization of data files. The frequency of compaction depends on data update patterns.

- **Monitor Fragmentation:** Regularly monitor the fragmentation level of your data files. Higher fragmentation indicates the need for compaction.

- **Consider Data Size:** Consolidate smaller files to achieve a balance between improved query performance and manageable file sizes.

- **Test and Validate:** Before performing large-scale compaction, test the process on a smaller dataset to ensure it aligns with your objectives.

- **Backup Data:** Always keep backups of data before applying compaction to avoid data loss due to unexpected errors.

### Mistakes to Avoid:

- **Compacting Too Often:** Overcompacting can lead to unnecessary overhead and resource consumption. Choose an appropriate frequency based on data patterns.

- **Lack of Monitoring:** Neglecting to monitor data fragmentation can lead to inefficient storage usage and hinder query performance.

- **Insufficient Testing:** Failing to test the compaction process on smaller datasets can lead to unforeseen issues in production environments.

- **No Backup:** Performing compaction without data backups can result in irretrievable data loss in case of errors.

### In Conclusion: Streamlining Iceberg Efficiency through Compaction

Compaction emerges as a pivotal strategy for enhancing storage efficiency and query performance within Apache Iceberg tables. By grasping the concept of compaction, utilizing built-in procedures like `RewriteDataFiles`, understanding its benefits, and adhering to best practices while avoiding common pitfalls, organizations can harness its power to optimize data organization, storage management, and query processing. By making informed compaction decisions and maintaining a balanced approach, you ensure that your data lakehouse operates at its peak efficiency.

## Further reading

<LinkCard title="What is an Agentic Lakehouse?" description="Learn how AI agents interact with your optimized Iceberg tables." href="/guides/agentic/01-agentic-ai-lakehouse/" />

- [Blog: Maintaining Iceberg Tables – Compaction, Expiring Snapshots, and More](https://www.dremio.com/blog/maintaining-iceberg-tables-compaction-expiring-snapshots-and-more/)
- [Blog: Compaction in Apache Iceberg: Fine-Tuning Your Iceberg Table’s Data Files](https://www.dremio.com/blog/compaction-in-apache-iceberg-fine-tuning-your-iceberg-tables-data-files/)
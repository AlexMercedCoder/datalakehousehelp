---
title: Hard Deletes
description: A guide to hard deleting lakehouse data and best practices.
---

The concept of hard deletion plays a critical role in maintaining data privacy, compliance, and efficient data management. Modern table formats, often associated with copy-on-write or merge-on-read approaches, introduce complexities when it comes to securely deleting data files while retaining data integrity. This section explores the nuances of hard deletion within data lakehouses, focusing on table snapshots, copy-on-write, and merge-on-read mechanisms, best practices for ensuring timely deletion of sensitive data like Personally Identifiable Information (PII), and key mistakes to avoid.

### Table Snapshots and Retention of Data Files:

Data lakehouse tables often maintain multiple snapshots, capturing different versions of the data. Each snapshot corresponds to a point in time, and these snapshots might reference the same underlying data files to provide a historical view. To ensure the integrity of snapshots, files associated with a specific snapshot should not be deleted until all snapshots referencing those files are expired.

### Copy-on-Write vs. Merge-on-Read: Managing Updates and Retention

Copy-on-Write (COW) and Merge-on-Read (MOR) are two prevalent mechanisms for handling updates in data lakehouse tables:

- **Copy-on-Write (COW):** In COW, when an update or insertion occurs, a new version of the data file is created, leaving the original data unchanged. This approach supports a consistent historical record but can lead to data redundancy.

- **Merge-on-Read (MOR):** MOR takes a different approach. Data updates are stored separately, and the updated data is merged with the original data when accessed. This reduces data redundancy but requires additional processing during query execution.

### Best Practices for Timely Deletion of Sensitive Data:

- **Data Classification:** Classify data based on sensitivity, identifying data that requires special handling during deletion.

- **Retention Policies:** Establish clear data retention policies that define the lifespan of data based on its relevance and regulatory requirements.

- **Automated Processes:** Implement automated processes to trigger data deletion based on retention policies, reducing the risk of human errors.

- **Data Masking:** Prior to deletion, consider data masking techniques to replace sensitive information with placeholder values, maintaining data structure while protecting privacy.

### Mistakes to Avoid:

- **Inconsistent Retention:**- ** Failing to ensure consistent deletion of associated files across all relevant snapshots can lead to data inconsistencies.

- **Overlooking Snapshots:**- ** Neglecting to track and manage snapshot expiration dates can result in unnecessary file retention.

- **Relying Solely on Soft Deletion:**- ** Relying solely on soft deletion (marking data as deleted) without proper file deletion can lead to storage bloat and potential data leaks.

- **Lack of Auditing:**- ** Failing to maintain audit trails of data deletion events can hinder regulatory compliance and accountability.

### In Conclusion: Safeguarding Data Privacy through Hard Deletion

Hard deletion of files within the data lakehouse environment is a multifaceted endeavor that requires a deep understanding of table snapshots, retention mechanisms, and data update strategies. By comprehending the nuances of copy-on-write and merge-on-read approaches, adhering to best practices, and avoiding common mistakes, organizations can ensure the timely and secure deletion of sensitive data while maintaining data integrity. By implementing a thoughtful approach to hard deletion, data lakehouses can uphold data privacy, regulatory compliance, and organizational trust, even in the face of evolving data management challenges.
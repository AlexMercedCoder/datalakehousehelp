---
title: "What is an Agentic Lakehouse?"
description: "Learn what an agentic lakehouse is and how AI agents query data lakehouses built on Apache Iceberg using MCP servers, REST APIs, and semantic layers."
---

import { LinkCard } from '@astrojs/starlight/components';

Agentic AI represents a paradigm shift in how organizations interact with their data. Rather than passive dashboards and manual queries, agentic AI systems autonomously plan multi-step data workflows, query data lakehouses in real time, and synthesize insights on demand. Apache Iceberg's open architecture makes it a natural fit for agentic workloads.

## What is Agentic AI?

An **AI agent** is a software system that can perceive context, plan a sequence of actions, use tools, and execute workflows autonomously to achieve a goal. In the data space, agents can:

- Formulate and run SQL queries against a data lakehouse
- Discover tables and schemas via a data catalog's REST API
- Retrieve time-travel snapshots from Apache Iceberg to answer historical questions
- Chain multiple data transformations to produce analytics reports
- Trigger data quality checks and surface anomalies without human intervention

The combination of **large language models (LLMs)** and **data lakehouse infrastructure** creates a powerful foundation for agentic analytics — where an agent can answer complex business questions by pulling from live, governed, open data.

## Why Apache Iceberg is Ideal for Agentic Workloads

Apache Iceberg's architecture provides several properties that make it exceptionally well-suited for agentic AI systems:

- **REST Catalog API:** Iceberg's REST catalog specification allows agents to programmatically discover namespaces, tables, schemas, and partitions without any bespoke integration. An agent can call the catalog API to understand what data exists before deciding what query to run.

- **Time Travel:** Agents can query historical snapshots of data using `AS OF` syntax, enabling reproducible reasoning and historical analysis without maintaining separate data copies.

- **Schema Evolution:** As data structures change, agents consuming Iceberg tables remain unaffected — Iceberg handles schema evolution transparently, ensuring agent queries remain valid over time.

- **Rich Metadata:** Iceberg's metadata layer exposes partition statistics, file manifests, and column-level statistics. An agent can use this metadata to plan efficient queries, selecting only relevant partitions before execution.

- **ACID Transactions:** Agents that write results back to the lakehouse can do so safely with full ACID guarantees, preventing corrupt or partial writes even in concurrent multi-agent scenarios.

## How Agents Connect to Data Lakehouses

### 1. Model Context Protocol (MCP)

The **Model Context Protocol (MCP)** is an emerging open standard that allows AI models and agents to connect to external data sources through a standardized tool interface. An MCP server can expose a data lakehouse's query engine (e.g., Dremio) as a tool an agent can invoke. With an MCP-enabled lakehouse:

- An agent receives a natural language question
- It formulates a SQL query using the table schemas it discovers via the catalog
- It executes the query through the MCP tool
- It interprets results and either returns an answer or plans the next step

### 2. REST Catalog API

Agents can directly call the Iceberg REST Catalog API to:

- List all available namespaces: `GET /v1/namespaces`
- Discover tables within a namespace: `GET /v1/namespaces/{namespace}/tables`
- Fetch table schemas and partition specs: `GET /v1/namespaces/{namespace}/tables/{table}`

This metadata-first approach lets agents reason about the data landscape before running expensive queries.

### 3. Semantic Layer

A **semantic layer** (as provided by Dremio's virtual dataset layer) abstracts raw Iceberg tables into business-friendly views. Agents querying a semantic layer interact with named metrics, dimensions, and business entities rather than raw table columns — dramatically improving the quality and accuracy of agent-generated queries.

### 4. Direct SQL via Query Engines

Agents can connect to data lakehouse query engines (Dremio, Apache Spark, Trino) via:
- JDBC/ODBC drivers
- Apache Arrow Flight SQL for high-throughput, columnar data transfer
- REST APIs

## Agentic AI Architecture Patterns

### Pattern 1: Question-Answer Agent

```
User Question → LLM Agent → Catalog Discovery → SQL Generation → Query Engine → Result → LLM Response
```

A single-turn agent resolves a user's business question by autonomously generating and executing a query against the lakehouse.

### Pattern 2: Multi-Step Analytics Agent

```
Goal → Agent Plan → [Step 1: Ingest] → [Step 2: Transform] → [Step 3: Query] → [Step 4: Visualize] → Report
```

A planning agent breaks down a complex analytics task into discrete steps, executing each one against the lakehouse and chaining results.

### Pattern 3: Data Quality Agent

```
Schedule Trigger → Agent → Scan Apache Iceberg Table → Validate Constraints → Flag Anomalies → Alert or Auto-Remediate
```

An autonomous agent monitors data quality on a schedule, querying Iceberg tables for freshness, completeness, and constraint violations.

## Agentic Lakehouse: The Next Architecture

The **Agentic Lakehouse** is an architecture that combines:

1. **Open Data Layer:** Apache Iceberg tables on object storage (S3, GCS, Azure Blob)
2. **Open Catalog:** REST-compliant catalog (Nessie, Apache Polaris) for programmatic schema discovery
3. **High-Performance Query Engine:** Dremio, Trino, or Apache Spark for SQL execution
4. **Semantic Layer:** Business-friendly virtual datasets for improved agent query accuracy
5. **AI Agent Framework:** LLM-powered agents (via MCP, LangChain, LlamaIndex, or custom) that orchestrate data workflows

Together, this stack enables organizations to move from manual reporting cycles to real-time, AI-driven data intelligence.

## Further Reading

<LinkCard title="What is a Data Lakehouse?" description="Understand the foundational architecture that powers Agentic AI." href="/reference/01-datalakehouse/" />
<LinkCard title="Migrating to Apache Iceberg" description="Learn how to upgrade your tables to the leading open format." href="/guides/migration/02-icebergmigration/" />

- [Blog: Agentic Analytics and the Data Lakehouse](https://www.dremio.com/blog/)
- [Blog: Apache Iceberg 101 — Your Guide to Learning Apache Iceberg](https://www.dremio.com/blog/apache-iceberg-101-your-guide-to-learning-apache-iceberg-concepts-and-practices/)
- [Blog: Intro to Dremio, Nessie, and Apache Iceberg on Your Laptop](https://www.dremio.com/blog/intro-to-dremio-nessie-and-apache-iceberg-on-your-laptop/)
- [Docs: Apache Iceberg REST Catalog Spec](https://iceberg.apache.org/docs/latest/spark-configuration/#catalog-configuration)
- [Docs: Model Context Protocol (MCP)](https://modelcontextprotocol.io)

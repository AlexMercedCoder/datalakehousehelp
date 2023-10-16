---
title: Glossary
description: Definition of Many Big Data Terms
---

Welcome to the Big Data Glossary, your guide to understanding key terms in the realm of data management, analytics, and technology. Whether you're a data professional or a curious learner, this glossary provides concise explanations of essential concepts within the big data ecosystem.

**MPP (Massively Parallel Processing):** A technique used to process large volumes of data by distributing tasks across multiple processors or nodes in a parallel computing environment.

**Hadoop:** An open-source framework for distributed storage and processing of large datasets across clusters of computers, based on the MapReduce and HDFS (Hadoop Distributed File System) concepts.

**Hive:** A data warehousing infrastructure built on top of Hadoop, allowing SQL-like querying and analysis of structured and semi-structured data.

**Partitioning:** The practice of dividing large datasets into smaller, more manageable segments based on specific attributes, enhancing data organization and query performance.

**Clustering:** The process of grouping similar data points together to discover patterns and relationships within the data.

**Data Lake:** A repository that stores vast amounts of raw data in its native format, offering flexibility for various data processing and analysis tasks.

**Data Warehouse:** A centralized repository that stores structured data from various sources, optimized for querying and reporting.

**Data Lakehouse:** An architecture that combines the best elements of data lakes and data warehouses, providing scalable storage, processing, and analysis capabilities.

**In-process Database:** A database system that resides in the same process as the application, offering fast and direct data access.

**Apache Foundation:** A nonprofit organization that supports and develops open-source software projects, including Apache Hadoop, Spark, and Kafka.

**Linux Foundation:** A nonprofit organization that promotes the growth of open-source software and collaboration, including projects related to the Linux operating system.

**Data Modeling:** The process of creating a conceptual, logical, and physical representation of data structures and relationships within a database.

**Kimball Methodology:** An approach to data warehousing and business intelligence that emphasizes dimensional modeling, designed for user-friendly querying and reporting.

**Inmon Methodology:** A data warehousing approach that focuses on building a centralized data repository, enabling integration of various data sources.

**Star Schema:** A data modeling technique where a central fact table is connected to dimension tables, facilitating efficient querying and analysis.

**Primary Key:** A unique identifier for a record in a database table, ensuring data integrity and supporting data retrieval.

**Foreign Key:** A reference in a database table that points to the primary key in another table, establishing relationships between tables.

**Observability:** The practice of monitoring, measuring, and understanding system behavior to gain insights into its performance and health.

**DataOps/Data-As-Code:** A methodology that applies DevOps principles to data management, treating data infrastructure and processes as code.

**Data Contracts:** Formal agreements that define the structure, format, and semantics of data exchanged between systems or teams.

**Metastore:** A centralized repository that stores metadata about data assets, enabling easier data discovery and management.

**Data Lakehouse Table Format:** A structured representation of data in data lakehouses, supporting efficient querying and analysis.

**Data Catalog:** A repository that indexes and organizes metadata about data assets, facilitating data discovery and governance.

**Semantic Layer:** An abstraction that provides a user-friendly representation of underlying data structures, enabling business users to query data without technical complexity.

**RBAC (Role-Based Access Control):** A security model that assigns access permissions based on user roles, ensuring controlled and authorized data access.

**ABAC (Attribute-Based Access Control):** A security model that determines access based on attributes and policies associated with data and users.

**SCD (Slowly Changing Dimensions):** A technique for handling changes to dimensional data over time, ensuring historical accuracy and analysis.

**Normalization:** A database design process that reduces data redundancy by organizing data into separate tables based on relationships.

**Denormalization:** A database design process that combines data from multiple tables to improve query performance and simplify analysis.

**Indexing:** The practice of creating data structures to optimize data retrieval, enhancing query performance in databases.

**Idempotent**: An operation or function is idempotent if applying it multiple times has the same effect as applying it once. In other words, it doesn't change the outcome beyond the first application. For example, deleting a file twice is the same as deleting it once because the file is gone after the first deletion.

**Monoid**: A monoid is a mathematical structure often used in programming where you have a set of values and an operation that combines two values from the set into another value within the same set. It has two key properties: associativity (you can group the operations in any way without changing the result) and an identity element (a special value that doesn't affect the result when combined with other values).

**Decoupled**: Decoupling in software development means separating different components or modules of a system so that they are independent and don't rely heavily on each other. It's like breaking a complex task into smaller, self-contained parts that can work on their own. This makes code more maintainable, reusable, and easier to understand.

**Dependency Injection**: Dependency injection is a design pattern in software development that allows you to inject (provide) dependencies, such as objects or services, into a class or component from the outside rather than having the class create them internally. This makes your code more flexible, testable, and less tightly coupled to specific implementations.

**Thread Locking**: Thread locking, or simply locking, is a mechanism used in multi-threaded programming to control access to shared resources to prevent conflicts and data corruption. It involves temporarily restricting access to a resource by one thread while another is using it. Locks ensure that only one thread can modify the resource at a time, preventing race conditions and maintaining data integrity.

**Eventual Consistency**: Eventual consistency is a property of distributed systems where, after a certain period of time and in the absence of further updates, all replicas or copies of data will converge to a consistent state. It allows for temporary inconsistencies between distributed data stores but guarantees that they will become consistent eventually.

**Exactly-Once Semantics**: Exactly-once semantics is a guarantee in messaging and data processing systems that ensures that an operation is performed exactly once and no more. This is particularly important in scenarios where duplicate processing can lead to incorrect results or data corruption.

**Lambda Architecture**: Lambda architecture is a design pattern used in big data and real-time data processing systems. It involves processing data through two separate paths: a batch layer for historical data analysis and a real-time layer for low-latency processing. The results from both layers are combined to provide comprehensive insights.

**Kappa Architecture**: Kappa architecture is an alternative to the Lambda architecture, emphasizing stream processing as the primary way to handle data. In Kappa architecture, all data is treated as an unbounded stream, and both real-time and batch processing are done using the same stream processing framework.

**Push vs. Pull**: Push and pull are two different mechanisms for data transfer. In push, data is sent or pushed from a source to a destination without the destination actively requesting it. In pull, the destination requests data from a source when it needs it. These mechanisms are used in various communication protocols and data transfer scenarios.

**Write-Audit-Publish**: Write-Audit-Publish is a software design pattern used for event sourcing and data integration. It involves three steps: writing data to a source system, auditing or tracking changes for accountability, and finally, publishing the data to one or more destination systems for further processing or storage.

**SOLID Principles**: SOLID is an acronym representing five design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion) in object-oriented programming that aim to create maintainable and flexible software by promoting clean and modular code.

**Single Responsibility Principle (SRP)**: The Single Responsibility Principle states that a class or module should have only one reason to change. It means that a class should have only one responsibility or job. This principle promotes modular and maintainable code by ensuring that each class has a clear and well-defined purpose.

**Open/Closed Principle (OCP)**: The Open/Closed Principle states that software entities (such as classes, modules, or functions) should be open for extension but closed for modification. In other words, you should be able to add new functionality to a system without changing existing code. This promotes code stability and reduces the risk of introducing bugs.

**Liskov Substitution Principle (LSP)**: The Liskov Substitution Principle states that objects of a derived class should be able to replace objects of the base class without affecting the correctness of the program. In essence, it ensures that subtypes must be substitutable for their base types without altering the desirable properties of the program.

**Interface Segregation Principle (ISP)**: The Interface Segregation Principle suggests that a class should not be forced to implement interfaces it doesn't use. It encourages breaking down large interfaces into smaller, more specific ones, so that classes can implement only the methods they actually need. This prevents unnecessary dependencies.

**Dependency Inversion Principle (DIP)**: The Dependency Inversion Principle emphasizes that high-level modules should not depend on low-level modules; both should depend on abstractions. It also encourages abstractions to not depend on details but rather details should depend on abstractions. This principle promotes decoupling and flexibility in software design.


**CAP (Consistency, Availability, Partition Tolerance)**: CAP is an acronym representing the trade-offs in distributed systems. It states that it's impossible for a distributed system to simultaneously provide all three guarantees: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition Tolerance (the system continues to function despite network partitions).

**ACID (Atomicity, Consistency, Isolation, Durability)**: ACID is an acronym representing a set of properties that ensure reliable processing of database transactions. Atomicity guarantees that transactions are treated as a single, indivisible unit. Consistency ensures that a transaction brings the database from one valid state to another. Isolation prevents transactions from interfering with each other. Durability guarantees that committed transactions are permanent and survive system failures.

**Sharding**: Sharding is a database scaling technique used in distributed systems. It involves splitting a large database into smaller, more manageable pieces called shards. Each shard is hosted on a separate server, allowing for horizontal scalability and improved performance.

**Caching**: Caching is a technique used to store and retrieve frequently accessed data in a faster and more efficient manner. It involves temporarily storing copies of data in a cache (usually a fast-access memory) so that subsequent requests for the same data can be served quickly without the need to fetch it from the original source.

**PubSub (Publish-Subscribe)**: Publish-Subscribe is a messaging pattern where senders (publishers) of messages do not directly communicate with receivers (subscribers). Instead, a message broker or intermediary is used. Publishers "publish" messages to topics, and subscribers "subscribe" to topics of interest. When a message is published to a topic, all subscribers interested in that topic receive the message.


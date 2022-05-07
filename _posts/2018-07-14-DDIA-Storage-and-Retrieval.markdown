---
layout: post
title:  "Notes: Storage and Retrieval"
date:   2018-07-13 15:07:43 -0500
permalink: /programming/ddia-storage-and-retrieval/
---

source: [Designing Data Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) by Martin Kleppmann (Chapter 3)

---

A database has two jobs:
1. store data
2. retrieve data
it's important to pick the most appropriate storage engine for your application. Main types optimize for one of two things:
- transactional workloads
- analytics

## Database Data Structures
**Log File:** *an append only sequence of records*. This is the simplest form of a database. Appending takes O(1), but reading takes O(n), so let's not.

Solution? The **index**, *a data structure to help you find a key in a database*. This structure is *derived* from primary data. It makes it so that writing takes a little longer, but it's almost always worth it.

### Hash Indexes
*A **hash index** is an in-memory hash map of **keys** and **byte offsets***. The database uses the hash index to read values from disk.
- **Segment Files**: What you get when you separate out your database into a set of files. Because segment files are separated out and can exist without getting read, we can *merge* and *compact* them in the background
- **Compaction**: getting rid of duplicates in a log file. You do this to decrease the amount of space your database takes up
- **tombstones**: a deletion record for an append-only log file

There are a few ways we can make log files more resilient and efficient:
- it saves space to safe log files in binary format
- if you store a hash map for each segment on disk, you can recover after a crash more quickly
- Use checksums to prevent corrupted data

Append only design is nice because it's so simple. This means that you can write quickly, and crash recovery is straightforward. Also, you can merge segments quickly because you don't have to worry about them being updated while you're merging them.

On the other hand, append-only design has some limitations. The hash table must fit in memory for this to work, so append only design is better for situations where you have lots of writes to a view keys. Also, range queries are pretty inefficient

### SSTables & LSM-Trees
**Sorted String Table** (SSTable), **Log-Structured Merge-Tree** (LSM-Tree): What we get when we sort a segment file by key. In order to make sure the LSM-Tree is sorted, you need the following:
1. An in-memory memtable
    - The memtable represents a tree structure, so you insert key/value pairs in order
    - When the memtable gets too big, you save it to disk as a segment file
2. On-disk Segment files
    - You merge and compact these segment files from time to time
    - in the event of a tie on merge, the most recent key/value pair is what you pay attention to
3. An on-disk log file
    - write to this log file every time you insert a value into the memtable
    - this protects agains crashes
If you want to read from this type of database structure, you conduct a search starting with the most recent thing. This means that you start with the memtable, then move on to the on-disk segments.

There are a few ways to optimize LSM-Trees:
- **Bloom filters**: memory efficient data structures. Use these to approximate the contents of a data set
- **Size-tiered compaction**: Newer SSTables are smaller, and they get bigger as they get older. These older SSTables get accessed less often, so merging is less disruptive
- You can also infer the location of a key's byte offset based on the location ok keys around it, so you don't need to keep all of the keys in memory

LSM Trees have faster writes and better compression than B-Trees.
- BUT if you end up compressing data, and the process coincides with that data being queried, it will cause a bottleneck
- compressing data takes longer for big databases, so LSM trees don't really scale

### B-Trees
The standard implementation for almost all relational databases (and many non-relational databases)
  - information is stored in key/value pairs. These key/value pairs are stored in pages
  - to find the value of a key, you traverse the tree
  - to add a key, you find a page whose range the key is in. If it fits, great. Add it to the page. Otherwise, you'll need to split the page into two half pages, add the new value, and update the parent of the original page to point to the new pages

Important things to know about B-Trees:
  - **pages** (blocks): chunks of data (usually 4kb chunks). These act as nodes for the tree
  - **the root**: entry point for tree traversal. Contains references to other pages in the tree
  - **leaf pages**: endpoint of a tree traversal. Contains values (or at least pointers to values)
  - **branching factor**: number of references per page. This usually determines the key depth. *A B-tree with n keys has a depth of O(log(n))*
  - B-Trees have faster reads than LSM Trees, but slower writes. This is because of **write amplification**, the fact that you often have to make several writes to several locations for each update because of the structure of B-Trees.

#### Making B-Trees Reliable, Optimized
A **Write-Ahead Log** (WAL, redo log): is an additional append-only file on disk
  - every time you update a B-Tree, you also update this WAL
  - protects against crashes. You can use the WAL to reconstruct updates 

You can use a **Copy-on-write Scheme** as an alternative to a WAL
  - Instead of inserting to a page, just make a new page with all of the original data, plus the key/value pair you want to insert
  - When you're done with that, update the references of the parent page

You can also abbreviate keys to increase the branching factor.

It's also good to keep pages close to each other. This decreases the overhead required to jump from one page to another when you're traversing the tree

### Other Indexing Structures
Secondary indexes (as opposed to primary keys) are usually used to perform *efficient joins*
- you have to get around the fact that these second indexes are not unique. You do this by including a row identifier
- you can represent secondary indexes using B-Trees or LSM trees

#### Storing values in the index
- **Clustered Index**: an index that stores an entire row. These make for faster reads, but require more storage and write overhead
- **Nonclustered Index**: an index that stores references to rows. These require less storage and are faster to write to, but a query has to jump to the *heap file*, which takes more time
- **Heap File**: Place where the rows are stored. Often unordered. References in a nonclustered index point to the heap
- **Covering Index**: (AKA **Index with included columns**) a compromise between a clustered and nonclustered index. It stores *some* of the columns in a row, but not all

#### Multi Column Indexes
- **Concatenated Index**: most common multi-column index, and it just combines columns in a specific order
- **R-Trees**: specialized spacial indexes. One alternative to R-Trees is to transalte 2-D spacial indexes into a single number

#### Fuzzy Indexes
These allow for mispelling and assume you don't have the exact key. One way to do this is to use an in-memory SSTable to determine the offset (or how bad your mispelling can be)
- Full-text search engines (like lucene) do this

#### In-memory Databases
Using disk for databases is a little awkward (because you have to format data to go on disk), and the cost-per-gigabyte in RAM is going down, so in-memory databases is a thing
- advantage: they can offer more data structures (redis uses priority queues, for example)
- to keep in mind: they must protect against power outages

## Data Warehousing
- **Online Transaction Processing** (OLTP): exist for daily transactions, like item sales or inventory
  - reads and writes happen on close to a human scale
  - used in real time, so they should be responsive
  - use cases usually include reading/writing one row at a time
- **Online Analytics Processing** (OLAP):
  - used for business intellegence
  - users generally want to aggregate a *lot* of data at once

Because OLAP might interfere with OLTP, create a separate database for it. These separate databases are **data warehouses**. Data warehouses are generally read-only, and the data comes initially from the OLTP database
- **extract** (you *extract* data from the OLTP DB. Either batch it or stream it)
- **transform** (*transform* the data you grabbed to an analysis-friendly schema)
- **load** (*load* the data to the warehouse)

Once it's in a data warehouse, analysts run computationally heavy queries without interfering with operations. Warehouses are usually relational

#### Star Schema
data warehouse setup where there's a **fact table** (usually represents events that you're interested in) and **dimention tables** (which act as picklists). If you map this out, it'll look like a star.

One mutation on star schema is the **snowflake schema**, which is a star schema, but where the dimention tables are broken down into subdimentions

## Column Oriented Storage
warehouse databases are gigantic, so we have to find a faster way to query them. Thankfully, the typical analytical qeury is really only interested in a few columns, so we can use that. If each column is *in its own file*, a query only needs to parse columns in that file
- column-based storage advantage: helps reduce the bottleneck of moving things from disk to memory

### Column Compression
Because data in columns is often repetative, its a good candiate for *column compression*.
- **Bitmap encoding**: a compression technique where we break a bitwise representation of a value down based on the locations of ones and zeroes
- representing data in this way makes it possible to use bitwise operations, which makes queries faster
- **Vectorized processing**: when you use bitwise operations (on a vector/one dimentional array) to process data quickly

### Sorting Columns
Now that the columns are all in their own files, we can sort them. We have the constraint of making sure not to scramble the information. Information in the *nth* row of once column file must correspond with information in the *nth* row of every other column file
- **primary columm**: if you know which column you query most often (like a SKU), that's the one you sort. We can also compress it to make it faster to query
- **secondary column**: because sorted values in the primary column are often pretty repetitive (like, if there are several instances of a SKU being sold), we can sort the next-most-queried column within that.
- a drawback to this is that you can't insert new rows efficiently. These databases use LSM trees and merge in the background
- **neat thing**: Vertica introduced the idea of having several primary columns. Since it already stores redundant data warehouses, there's no reason for each instance of the warehouse to have the same primary column

### Views and Cubes
Another way to get around the huge amount of raw data is to precompute it. If, for instance, you precompute the total sales per day, you can use the results to power more complex calculations
- **Materialized Views**: A cache of results in the form of a table. A drawback to these is that you need to update them every time you enter new information (write overhead).
- **Virtual Views**: A shortcut for writing queries
- **Data Cubes**: A grid of aggregates grouped by dimention. This makes a lot of queries faster, but it's not good for edge cases. The edge cases just use the raw data


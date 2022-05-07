---
layout: post
title:  "Notes:  Replication"
date:   2018-07-13 15:07:43 -0500
permalink: /programming/ddia-replication/
---

source: [Designing Data Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) by Martin Kleppmann (Chapter 5)

---

When you scale a database out, it's normal to have some sort of combination of replication and partitioning. **Partitioning** (sharding) is when you split a big database up, and is discussed in chapter 6. **Replication** is when you keep a copy of the same database on two different nodes.

- **Replication**: keeping a copy of the same date on multiple machines that are connected by a network. Advantages:
  - reduced latency
  - increased availability
  - increased read throughput

Replication is easy when your data doesn't change over time, but in the case of most databases, it does. You can use different types of replication to handle the changes:
- single-leader
- multi-leader
- leaderless

You also have the choice between synchronous and asynchronous replication

## Single Leader Replication
- **replica**: a node that stores a copy of a database
- **Single Leader Replication** (also called master-slave replication, or active-passive replication): one replica gets designated as leader, and clients can only write to that replica. The leader replica sends write updates to follower replicas whenever a client writes to it. This is used for relational databases and distributed message brokers like Kafka or RabitMQ
- **Synchronous Replication**: leader waits until a follower responds before reporting success to a client
  - this way, the follower *always* has and up-to-date copy of the data
  - synchronous replication is susceptible to network faults. If a follower crashes, the whole system grinds to a halt
- **Asynchronous Replication**: Leader sends a write message without waiting for a response
  - way faster, but writes aren't guaranteed
  - advantage: leader node can continue operations regardless of follower node status
- **Semi-Synchronous Replication**: replication where only one follower is synchronous. If that follower isn't available, just send a synchronous write to the next node

### Setting Up New Followers
If you want to set up a new follower node, you can't just copy/paste the leader node. It's in flux, so you'd have to lock it. Here's how to spin up a new node without locking the database:
1. Make *periodic snapshots* of the database. In between snapshots, continuously write updates to *logs*. These logs should indicate which snapshots they correspond to.
2. Spin up a new node and copy the latest database snapshot to it.
3. Apply all the changes from the logfile to the node until it's up to date
4. All set! You can now start processing write requests from the leader node

### Handling Node Outages
Nodes fail all the time, sometimes as part of routine updates.

#### Follower Failure
If a follower fails, it's pretty easy to get it back online. If it has a *logfile*, it's easy to know the last transaction it received. Just request all of the transactions it missed until it's up to date.

#### Leader Failure
- **Failover**: Process for when a leader fails. One of the followers needs to be promoted to be the new leader, and if you automate this process, it happens in stages:
  a. *determine that the old leader has failed.* This is usually done with a timeout
  b. *choose a new leader*. This can be done a few different ways:
    - election process, or a *controller node* picks the new leader
    - whichever node is the most up-to-date
  c. reconfigure the system to use the new leader
    - You need to make sure that clients will send write requests to the new leader
    - The old leader needs to know that it's not the leader anymore

Things can go wrong during failover
- if asynchronous replication was being used, the old leader will need to discard all of the writes that it didn't pass on, so you lose some data.
- *discarding writes can be dangerous* if there's a chance that a separate storage system got the data. You'll have conflicting data
- **split brain**: a case where two nodes both think they're the leader
- Unnecessary failovers can cause more harm than good. For example, if a leader doesn't respond in time due to a load spike

### Replication Log Implementation
- **Statement-based Replication**: Just pass on the INSERT/UPDATE/DELETE statements.
  - not great if you're using any nondeterministic statements like NOW(), RAND(), or anything with side-effects
- **Write-Ahead Log Shipping**: Use the append-only log file that describes the database writes (either log segments or WAL)
  - drawback: This describes writes for that specific data structure. Prevents you from using follower nodes with any other database structure, which is something you want to do if you want the ability to make rolling updates
- **Logical Replication** (Row-based replication): use a *logical log* for replication, as opposed to a *physical log*
  - this represents updates for reach row, and allows the *replication log* to be decoupled from the leader's physical database, allows for flexibility
  - stores writes with *row granularity*
  - **data change capture**: when an external application parses your logical log
- **Trigger-based Replication**: You can use built-in trigger functions to replicate data when a row is updated
  - more flexible, but more prone to bugs. Also, more overhead

### Replication Lag
*Replication lag* is the delay in write from leader to follower
- **eventual consistency**: Leaders and followers have inconsistent data, but it will become consistent when you stop writing to the leader... *eventually*
  - An effect caused by replication lag
  - Happens when you have asynchronous followers

#### Reading your own writes
Replication lag might cause a user to see data that feel behind the very update they *just* made, which is a problem. Possible solutions:
- You could give your user permissions to read from the leader node, or...
- you could track the time of the most recent update and compare it to the follower

#### Monotonic Reads
If you don't deal with replication lag properly, a user could refresh a page and see information "go back in time". This happens if, on their first viewing, they see a more up-to-date node, and see an outdated node after refreshing.
- One way to avoid this: Make sure that a user reads from the same replica for every page refresh

#### Consistent Prefix Reads
This is a way to prevent users from reading events out of order. It prevents violations of causality
- This is especially a problem for partitioned databases
- **transactions**: Ways for databases to provide guarantees. Might be expensive for replicated databases

## Multi-Leader Replication
More than one leader (each leader follows every other leader)
- good for multiple datacenters
- you need to make sure to handle conflicts
- good for clients that go offline sometimes (like collaborative editing, or calendar clients)

### Write Conflicts
synchronous conflict detection makes writes take just as long as they would in a single-leader system, but with asynchronous detection, you might find a conflict *after* you told the user that the change was confirmed
- you can avoid conflicts by routing all writes *for a particular record* to a single leader
- databases must resolve conflicts in a **convergent** way. This can be prone to data loss, but you can prompt applications or users to resolve conflicts on read or write

### Multi-Leader Replication Topologies
- **Topologies** describe communication paths along which writes are propagated
  - All-to-all (most common)
  - circular (default for MySQL): all leaders have one parent and one child
  - star (can be generalized to a tree)
- you need to include *node IDs* to prevent infinite loops
- circular and star topologies are susceptible to node failures
- all-to-all topologies need to handle cases where messages overtake each other

## Leaderless Replication
**Dynamo-Style Databases**: open datastores with leaderless replication models
- clients send write-requests to all replicas, and also send read-requests to all replicas. These requests happen in parallel
- **Read-Repair**: Clients detect stale data when they read
- **Anti-entropy process**: background process that looks for discrepancies
- **quorum read/writes**: the minimum number of votes it takes to make a read/write valid. In order for a system to tolerate unavailable nodes:
```
w + r > n
```
where *w*= writeable nodes, *r*= readable nodes, and *n* = total nodes

- it's generally difficult to monitor staleness.
- if you can configure *w* to be big, it might make the database more fault tolerant, but it could make your writes slower


---
layout: post
title:  "Notes: Stream Processing"
date:   2022-07-06 15:07:43 -0500
permalink: /programming/ddia-stream-processing/
---

source: [Designing Data Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) by Martin Kleppmann (Chapter 11)

---

A lot of data is unbounded - it arrives gradually over time. Processing unbounded data in batches might not make sense in every situation

**Stream Processing** - run processing continuously. Alternative to batch processing

- **event streams** - data made incrementally available over time

# Transmitting Event Streams
**event** - small, self-contained immutable object. Contains the details for something that happened at some point in time

- can be encoded
- **producer (publisher)** generates events
- **consumers (subscribers)** process events
- **topic** **(stream)** a group of related events

## Messaging Systems
In a **messaging system**, producers send events to consumers. In a **publish/subscribe model**, we can have multiple producers and consumers:

1. one or more **producers** sends a message with an event to a **topic**
2. the message gets pushed to one or more consumers

Solutions to cases where consumers aren’t fast enough to process all of the messages:

1. drop messages
2. buffer messages in a queue
3. apply **backpressure** (blocking producer from sending messages)

### Direct messaging from producers to consumers
possibility of message loss, and there’s no recovering data if a consumer goes offline. Examples: 

- UDP multicast (finance)
- brokerless messaging libraries (ZeroMQ)

### Message brokers
a database - optimized for handling event streams

- better fault tolerance
- consumers are async

### Message brokers compared to databases
- message brokers automatically delete messages once they get consumed
- topics are analogous to DB indexes
- message brokers don’t support arbitrary queries

### Multiple consumers
**load balancing** - each message gets delivered to one consumer. Allows for parallel processing

**fan out** - each message is delivered to all consumers. Allows different consumers to process the same data in different ways

### Acknowledgement and redelivery
a broker will only delete a message from its queue if it gets an ack from the consumer. If the consumer consumes the message, then breaks before it can send the ack, the broker will send the message to another consumer

This can lead to messages being processed out of order. One way to avoid this issue is to route all related messages to a single consumer


## Partitioned Logs
**log-based message brokers** are a hybrid of:

- databases (durable storage) - this means that messages don’t get deleted when consumers process them
- messaging - means low-latency notifications

### Using logs for message storage
A log is an **append-only sequence of records** on disk

- we can use this for message brokers
- these logs can be partitioned
- each partition has an **offset** for every message. These are ordered within a partition

products: Kafka, Amazon Kenesis, DistributedLog

### Logs compared to traditional messaging
No need for fan-out messaging, since each consumer can read the log independently

A consumer consumes *all* the logs for a specific topic. Downsides:

- max num nodes for a topic is the number of the topic’s log partition
- slow messages can cause lags for all the subsequent messages

### Consumer Offsets
Consumers pay attention to message offsets as they work through a log

### Disk space usage
We don’t have infinite disk space. One way to deal with this is to delete expired data as the log gets too big

**circular buffer** - bounded-size buffer that deletes old messages when it gets full

### When consumers can’t keep up with producers
options: drop messages, buffer, apply backpressure

it’s normal to monitor consumers to make sure they don’t get too far behind

one advantage to partitioned logs: if one consumer falls behind, it doesn’t affect the others in any way

### Replaying old messages
If you want to replay old messages, just reset the consumer offset. The message broker doesn’t know anything about the offset, so it won’t affect anything else


# Databases and Streams
there’s a fundamental connection between databases and streams

## Keeping Systems in Sync
related (or replicated) data in different locations needs to be kept in sync. Some possible solutions:

- **dual writes** write to both systems at once - we get problems if one fails while the other succeeds
- periodic database dumps - downside is that there’s high latency

## Change Data Capture (CDC)
the process of observing all data changes written to a database and extracting those changes in a form that is readable to other systems

### Implementing change data capture
**derived data systems** log consumers for CDC

you can use DB triggers to implement CDC, but this is fragile

CDC is usually async, so you have to keep in mind that there might be lag

### Initial snapshot
a DB snapshot should correspond to a known position in the change log

### Log compaction
- throw away duplicate logs to free up space
- if a key is frequently overwritten, garbage-collect old values

## Event Sourcing
technique: store all the changes to the application state as a log of events

- developed by the domain-driven design community
- application logic is built on immutable events written to a log (append only)
- Deriving current state from the event log

Applications that use event sources should be able to take a stream of events and turn it into an application state

Log compaction isn’t possible with event sourcing (as opposed to CDC) because events are modeled on a higher level

### Commands and events
a **command** is a request when it first arrives. Once that requests gets saved, it’s considered an **event**

- once a command becomes an event, it’s in the app’s history
- command validation should happen asynchronously

## State, Streams and Immutability
a math-y way of thinking about this is that

$state(now) = \int_{t=0}^{now}stream(t)dt$

and

$stream(t) = {d state(t)}/dt$

### advantages of immutable events
- auditability - data is never deleted
- more information - you have an app’s entire history

### Deriving several views from the same event log
You can use the same data for different features

one advantage of keeping the event log around is that you can use it if you want to develop a new feature. The new feature has the entire history of the app’s events, so it’s up to date immediately

**Command Query Responsibility Segregation** - you get flexibility by separating write data from read data

### Concurrency control
event sourcing means async processes, which mean lag

- if this is a problem, you might want to wrap log writes and reads in a transaction

### Limitations of immutability
- you run out of space
- you might *want* to delete some logs - it’s hard when the information is scattered all over the place

# Processing Streams

**operator (job)** piece of code that processes streams. It has three options for processing streams:

1. Save to DB
2. Push the events to a user
3. Process stream to make an output stream
- option to combine it with other data sources, including other streams

Stream processors can be run in parallel on partitioned streams. This is similar to MapReduce dataflow engines - transforming and filtering records works the same

Stream processing never ends, so some things don’t make sense to do in stream processing (like sorting)

## Uses of Stream Processing
used to just be monitoring, but we have more use cases now

### complex event processing
use a query language to describe a pattern of events to look for. When the processor sees a sequence of events that match, it emits a **complex event**

### stream analytics
aggregations and statistical metrics over a large number of events

- usually computed over fixed time intervals (**windows**)
### Maintaining materialized views
**materialized view** - an alternate view of a dataset

- can be queried more efficiently
- updates when the underlying data changes

You need all events to make a materialized view

### Search of streams
When you search a stream (for something like string matching), you have to store it first


## Reasoning about time
this is hard, but most frameworks use the clock on the processing machine (**processing time**)

- you run into problems if there’s a lot of lag
### Event time vs processing time
it’s important to model these as distinct, especially in situations where there’s some lag

### Knowing when you’re ready
You can’t be sure when all events for a particular window have been delivered

- unless all the publishers publish events that say “no more events for this time window”

ways to handle stragglers:

- ignore them
- publish a correction

### Which clock do you use
three possible timestamps:
    1. time the event happened
    2. time the event was sent
    3. time the event was received by the server

### Types of windows
- **tumbling window** - fixed length, every event belongs to exactly one window
- **hopping window** - fixed length, allows for windows to overlap a little
- **sliding window** - fixed length, contains events that happen within some interval of each other
- **session window** - no fixed duration, just group all the events that  happened close together in time

## Stream Joins
Joining data on a stream is challenging because new events can appear any time

### Stream-stream join (window join)
challenge: the two events might happen far apart from each other

- you’ll have to save the first event in memory. You have to save **state**

### Stream-table join (stream enrichment)
for each event, query the DB

- helps, because you can query old data
- to reduce roundtrip time, it might help to keep a copy of the DB on the processor

### Table-table join (materialized view maintenance)
Keep a cache of events, if they’re too expensive to push to the DB immediately

### Time-dependence of joins
The order of events is important, if they depend on each other


## Fault Tolerance
with streams, you can’t wait for the processing to end before you make the results visible (because it’s infinite)

### Microbatching and checkpointing
Just make a batch out of one second of data and process it right away. Save the data

If your stream operator crashes, it can just start from the most recent saved data

### Atomic commits
Wrap processing and side effects in a transaction. We don’t want side effects to happen if the processing fails

### Idempotence
When you can perform an operation multiple times, and it has the same effect as if it was performed one time
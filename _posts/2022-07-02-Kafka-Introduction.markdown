---
layout: post
title:  "Notes: Kafka Introduction"
date:   2022-06-02 15:07:43 -0500
permalink: /programming/kafka-introduction/
---

source: [Kafka: The Definitive Guide](https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153//) by Neha Narkhede, Gwen Shapira, Todd Palino (Chapter 1)

---
# Publish/Subscribe Messaging

- **message** - a base unit of information. Often has a category
- **publisher** - sends and classifies messages, but does not direct them anywhere
- **subscriber** - receives certain classes of messages
- **broker** - central point where messages are published to

# Enter Kafka

a “distributed commit log”, or a “distributed streaming platform”

Designed to store data *durably* and *in order*. This means that it can be read deterministically

Another key feature of Kafka is that the *data is distributed*

## Messages and Batches

**message** - unit of data within Kafka. Kafka has no knowledge about the content of the message

**key** - an optional component of a message. Used to control how messages are written to partition

**batch** - collection of messages being produced to the same topic and partition

- larger batches lead to messages being handled more efficiently, but individual messages take longer to propagate

## Schemas

Optional, but recommended. Allow engineers to decouple writing and reading messages 

- human-readable schemas (JSON, XML) lack type handling and schema versions
- alternatives, like **Apache Avro**, have compact serialization formats, type handling and separate schemas

## Topics & Partitions

**topics** - how messages in Kafka are organized. Can be broken down into partitions

**partitions** - a single log that messages are appended to

- can be hosted on different servers
- time ordering is guaranteed within a partition but not a topic

**stream** - represent data moving from the producers to consumers for a given topic

## Producers & Consumers

Kafka clients can be users or consumers

- Kafka Connect API - advanced client API for data integration
- Kafka Streams - for stream processing

### producers

create new messages. Generally publish messages to specific topics and usually don’t care which partition the message goes to

### consumers

consume messages. Can be subscribed to one or more topics, reads messages in order

**offset** - metadata (a counter) given to each message within a partition

- a consumer will use this to keep track of which messages it’s already consumed

**consumer group** - a set of consumers reading from a topic. Each partition is read by a single consumer

**ownership** - mapping of a consumer to a partition

## Brokers & Clusters

A **broker** is a single Kafka server

- it receives messages from producers, assigns offsets to them, and commits them to disk
- services fetch requests from consumers
- owns a partition

A **cluster** is a group of brokers

A **controller** is responsible for administrative operations

A broker that is the **leader** of a partition is responsible for receiving messages from producers and for replicating the partition to other brokers in its cluster

**retention** - durable storage of messages

- can be for a period of time *or* dictated by a data limit
- expired messages are deleted

## Multiple Clusters

You might want multiple clusters for

- data segregation
- security isolation
- redundancy

**Mirror Maker** - like a mega-kafka. Messages are consumed from one cluster and produced for another

# Why Kafka?

- multiple producers and consumers
- data is easy to retain
- scalable and performant

## Use Cases for Kafka

- activity tracking
- messaging
- metrics & logging
- stream processing

# Kafka’s Origin

created at LinkedIn to address a data pipeline problem

released as an open source project on GitHub in 2010

It’s named after Franz Kafka, but for no particular reason. Just because it sounded cool
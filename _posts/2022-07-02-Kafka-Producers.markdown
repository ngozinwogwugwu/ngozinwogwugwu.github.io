---
layout: post
title:  "Notes: Kafka Producers"
date:   2022-07-02 15:07:43 -0500
permalink: /programming/kafka-producers/
---

source: [Kafka: The Definitive Guide](https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153//) by Neha Narkhede, Gwen Shapira, Todd Palino (Chapter 3)

---
Producers write messages to Kafka

- you can use the built-in API or use a third party one

**ProducerRecord -** A key/value pair to be sent to Kafka

- includes (required) **topic name**, an (optional) **partition number**, and an (optional) **key and value**.

The **producer** serializes the key and value objects into ByteArrays, then sends it to a **partitioner**

- it adds the record to a **batch of records**. All these records will be sent to the same topic and partition
- a separate thread actually sends the batches to the right Kafka brokers

The **broker** acks when it gets the messages

### Serializers

Kafka includes serializers for integers and byteArrays by default, but that doesn’t cover other types. It’s recommend that people use a generic serialization library (like Protobuf)

### Partitions

Kafka uses a message’s **keys** to determine which topic partition to put the message into

- if you don’t include a key, the producer will chose a partition at random (round robin)
- if you do include a key, the producer hashes it and maps the hash to a partition

Because the partition depends on the key:

- You can use this information to optimize your application
- if the partition is unavailable, you’ll get an error
- once you add more partitions, Kafka can’t guarantee that messages map to partitions
---
layout: post
title:  "Notes:  Encoding and Evolution"
date:   2018-07-13 15:07:43 -0500
permalink: /programming/ddia-encoding-and-evolution/
---

source: [Designing Data Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) by Martin Kleppmann (Chapter 4)

---

Since applications change over time, we need a good way to roll out the changes
- **Rolling upgrade** (or **staged rollout**): if you have a server-side application, and it's running on multiple nodes, you can deploy the new version to a few nodes at a time. That way, you can check to see if everything is okay before continuing
- **Backward Compatibility**: New code that reads old data
- **Forward Compatibility**: Old code that reads new data

## Formats for Encoding Data
*in-memory data* is usually kept in a data structure, using pointers. *data on disk*, on the other hand, is generally stored as self-contained byte sequences. We need a way to get data from one format to the other.
- **encoding** (or **serialization**, **marshalling**): translation from in-memory data to a byte sequence
- **decoding** (or **deserialization**, **unmarshalling**): the reverse of encoding

There are three main formats for encoded data:
1. Language-Specific
2. Text-based formats (JSON/XML/CSV)
3. Binary Encoding

### Language-Specific Data Encoding
programming language can come with built-in serialization, but there are a lot of drawbacks
- it ties your serialized data to a programming language, which makes it hard to de-serialize if theres a different programming language on the other end
- there's a security issue: because the decoding process will decode an arbitrary sequence of bytes to instantiate an arbitrary class, an attacker could get your application to do basically anything
- Versioning is kind of an afterthought. Bad forward/backward compatibility
- Efficiency is also an afterthought

### Text-Based Data Encoding
- **XML**: drawbacks: it's quite verbose. Also, it doesn't distinguish variable types. Ints look like strings
- **JSON**: popular because of built-in web browser support, and it differentiates numbers/strings, but not ints/floats
- **CSV**: good for large, unique, controlled datasets, but CSV is less powerful than JSON, and there can be parsing errors

### Binary Encoding
Binary encoding makes messages more compact, and it's easier to parse.
- there are some binary encodings for JSON
- one benefit is that you can distinguish between types

#### Protocol Buffers and Thrift
Protocol Buffers and Thrift are *binary encoding libraries* that require *schema* to encode data.
- They come with code generation tools. The generated code will encode and decode data based on the schema you made
- **Protocol Buffers** were developed at Google
- **Apache Thrift** was developed at Facebook, and it has two binary encoding formats (one is more compact than the other)
- **field tags**: analogous to keys in JSON objects. You define them in schema definitions
- In an encoded message, each field has a *type annotation*, and some fields have length annotations
- *Schema* include the following: field tags, types, names, optional/required bool
  - the optional/required flag doesn't make a difference in the encoded data, but it's used at runtime to catch bugs

#### Schema Evolution
**Schema evolution** is when schemas change over time. Binary encoding libraries need a way to handle this, and they use field tags.
- to handle *forward capability*, just ignore unrecognized field tags
- to handle *backward capability*, you need to make sure that any new fields in the schema are either optional or have a default value
  - you can also remove fields, but you can never remove a required field, and you can never reuse a tag

#### Avro
A binary encoding format with *no field tags*. Instead of field tags, reads rely on field placement within the byte sequence. This means that the app that reads the data must have *the exact same schema* as the app that writes it
- **Schema Resolution**: How Avro handles cases where the writer's schema is different from the reader's schema. It compares both schemas side by side, and matches up fields by field name. This means you can only remove a field if it has a default value, and new fields must have default values

Situations where Avro is great:
- If you're sending over a big file with lots of records, just include the schema in the beginning
- If you're sending messages to a database with individually written records, make sure the database has a list of  all possible schemas, and include the schema version number in your message. This is also just great for documentation
- If you have a network connection, negotiate schema when connecting, and just use that schema for the lifetime of the connection

Avro can be used without code generation, but it doesn't have to be. Avro's boject container files embed an objects schema, including all its metadata.

#### Code Generation
Code generation for binary encoding works best for statically-typed languages. It allows for in-memory structures to be used.

For dynamically-typed languages, there's not compile-time checker. This means that code generation is an extra step, and doesn't provide extra value. Avro is good for dynamically-typed languages, because it doesn't require code generation


#### Merits of Schema
- Schemas are *simple to use* because they don't support complex validation rules (as opposed to XML and JSON)
- Schema make binary encodings *more compact* because you can predefine formats
- Schemas make for *good documentation*. They provide the source of truth

## Dataflow
When processes don't share memory, but still share data, they need a way to handle dataflow. Here are some ways:
1. Databases
2. Service calls (REST, RPC)
3. Asynchronous message passing

### Dataflow through Databases
Databases are used by new processes and old processe, sometimes at the same time. This means that they need to have forwards and backwards compatibility.
- ALSO: if an old program reads new data, it needs to make sure not to inadvertantly leave out data it's not aware of

You should assume that *data outlives code*, so you need to sometimes **migrate** data.
- This is expensive, so most relational databases allow simple schema updates: just add a new column instead of updating a whole row. The database fills in null for missing columns on read

This schema evolution makes it look like the whole database has always had the same schema. When you take snapshots of your database, just use the same schema for everything

### Dataflow through Services
- **Servers**: Expose an API through a network (like a web server)
- **Services**: APIs exposed by services
- **Clients**: Connect to the service (like a web browser)
- **Microservice Architecture**: (or service-oriented architecture) a way of building applications, where you decompose an application into smaller *services* by area of functionality. They're easier to maintain than monoliths
- **Web services**: services that use HTTP for the underlying protocol
- **Middleware**: one service talking to another, in the same datacenter, as a part of the same microservice architecture

#### REST
REST, or *Representational State Transfer*, is a design philosophy that builds on HTTP principles. A service built with these principles is described as *RESTful*, and RESTful services are often associated with microservices.
- RESTful APIs use URLs to identify resources, use HTTP features for cache control, authentication and content type negotiation

#### SOAP
SOAP, or *Simple Object Access Protocol* is an XML-based protocol for making network API requests
- uses the **web service framework** and the **web service description language**
- SOAP is less popular because it can be difficult to work with

#### RPCs
*Remote Procedure Calls* act like normal functions, but they actually make a requests to a different network. This abstraction is called **location transparency** (the use of names to identify network resources, rather than their actual location).

RPC are fundamentally flawed, because network requests are fundamentally different from function calls
- network requests are way less predictable, so you need to handle them using timeouts
- the [response time](DDIA-Reliable-Maintainable-Scalable-Applications#latency-vs-response-time) for network requests can also vary pretty wildly, so you need to take that into account
- You need to handle cases where you send the message more than once (if the reply was lost, for instance) using idempotence or deduplication
  - **idempotence**: how you would describe a system whose state remains the same after duplicate messages
  - **deduplication**: the process of removing duplicate information
- you need to *encode* your data before sending it
- you need to deal with the fact that data types are slightly different in different languages

**Evolvability**: we can assume that the server gets upgraded before the client does, so we only need to worry about compatibility in one direction, BUT: since RPCs often happen between organizations, it's hard to control a client's version.
- a solution to this is to include the client's version in the header, or keep it associated with an API key

### Asynchronous Message Passing
One way to handle data flow is with an **asynchronouse communication pattern**, which uses a **message broker** (AKA **message queue**). It's an intermediary between client & server
- adds resilliency by handling cases where a recipient is unavailable. Will automatically retry
- abstracts away information about senders and recipients. This is especially handy when there is more than one recipient, or when the IP address is fluid
- **queue/topic**: What a sender sends a message to
- **consumer/subscriber**: what the message broker eventually sends the message to

Consumers don't publish replies directly back to the sender. They either reuse the original queue, or use a separate message queue for replies.
- *note*: to handle cases of forward compatibility, make sure to perserve unknown fields

### Distributed Actor Frameworks
- **Actor Model**: programming model, provides concurrency in a single process. Alternative to using threads, which can be messy
- **Actors**: contain logic for handing messages. Each actor may have an internal state.
- Actors communicate with each other with async messages, and they assume the messages can be lost
- **distributed actor frameworks**: programming model used to scale applications across multiple notes. Location transparency works well this way, because actors assume that their messages can be lost
- drawback: This model isn't great for forward/backward compatibility
---
layout: post
title:  "Notes: Data Models and Query Languages"
date:   2018-07-13 15:07:43 -0500
permalink: /programming/ddia-data-models-and-query-languages/
---

source: [Designing Data Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) by Martin Kleppmann (Chapter 2)

---

Data models help you abstract out information, which helps you present it efficiently the next level up (or the next level down).

## Relational vs Document Models

### Relational Model
Proposed in 1970, the basis for SQL. Data is organized into:
- relations (tables)
- tuples (rows)

The goal of the relational model is to **hide implementation details**. The relational model is **remarkably adaptive**. You can compare it to the *network model* and the *hierarchical model*.

### NoSQL
**Document Model**. NoSQL databases will probably exist alongside relational databases. This is called **polyglot persistence**. Advantages of NoSQL:
- number of open source tools
- scalability (for for large datasets and datasets with high write throughput)
- there are some specific query operations that don't exist for relational databases
- they don't have restrictive schemas

### The Object-Relational Mismatch
One disadvantage of relational databases is that they don't play well with object-oriented applications. This disconnect is called the **impedance mismatch**
- In order to represent an object that an application needs, your database often has to do a fair amount of joining
- Solution: **Object-Relational Mapping Framworks** (ORMs), tools to reduce the translation layer
- Another Solution: JSON models (or document databases) can reduce the impedance mismatch.
  - These work best when data is contained in one place(**locality**)

### Many-to-Many/One Relationships
Plenty of fields that can be stored as a string can also be stored as an ID that you can join on. Advantages:
- creates a single source of truth. This reduces redundant data and ambiguity
- Makes updating easier
- called **Normalizing** data

#### Hierarchical Models
model of storing data from the 1960's, similar to JSON. This model was bad for many-to-many relationships and bad for normalization, because you often had to duplicate data
- **Denormalization**: duplicating data and storing it in different places (like using a string, instead of an ID and just joining the tables)

#### The Network Model
A different old data model. Links between records were basically like pointers, and you had to travers the path to get all the information
- **Access path**: path from the *root* of a *chain of nodes*
The network model is basically dead

#### Query Optimizers
These are for relational databases. Since the structure of a relational database isn't too different from a database that uses the network model, *query optimizers are used to determine the access path*. This means:
- which parts of the query to execute in which order
- which indexes to use
Note: When you declare a new index, you give your query optimizer a new option when it comes to creating an access path and querying the data

#### Document Databases and Joins
Document databases will use **references** (foreign keys) to handle many-to-many/many-to-one relationships

#### Optimizing for Simple Code
- **Document Models**: Might fit an application better if loading a managably-sized tree of one-to-many relationships. It reduces the need for joins by denormalizing data
  - disadvantage: Difficult to refer to objects that are nested within a document
  - disadvantage: You might emulate a join by handling it with your application. This is less performative and makes your application more complex
- **Relational Models**: Good fit if you have a lot of many-to-many relationships
  - shredding: splitting a document up into several tables. This can be a disadvantage of the relational model

## Query Languages for Data
**declarative** vs **imperative**: In a declarative query language, you just *declare* what you want, and the database takes care of the implementation. This is opposed to an imperative language, where you tell the database exactly how to get the information.

### Declarative Queries
SQL is an example of a declarative language, but not the only one. CSS is also declarative. Advantages of declarative languages:
- easier to work with and learn
- implementation details are hidden from the user. This means that they can be updated without the user noticing
- easier to **parallelize**. Imperative operations must run in a sequence

### MapReduce Querying
Made to process large amounts of data in bulk across machines. It's not quite declarative or imperative, but kind of in the middle. *It uses a series of pure functions to **mold** and **aggregate** data*, then present that data neatly.
- pure functions are required so that the database can run them in any order without messing things up
- MapReduce uses javascript
- A little more difficult to learn and use
- alternative: aggregation pipeline (MongoDB)

## Graph-like Data Models
good for handling complex many-to-many relationships, like social networks or links between pages on the internet.
- **vertices** (nodes, entities)
- **edges** (relationships, arcs)

### Property Graphs
A combination of *vertices* and *edges*, makes for flexible arrangements. You can build up a graph that you can traverse that represents complex relationships very simply

### The Cypher Query Language
A declarative query language for property graphs. One alternative to cypher query languages is to store the information in relational databases and use SQL's recursive joins, but the queries end up being imperative, so they're longer, harder to read/maintain, and less performative.

### Triple Stores, SPARQL
The triple store model is similar to the property graph model, but the data is arranged in a slightly different mannner (subject, predicate/verb, object). The predicate here is like an edge that connects two vertices

#### The Semantic Web
Concept of making pages machine readable

#### The RDF Data Model
**Resource Description Framework** (RDF) - mechanism for websites to publish data in a consisten format. The goal of RDF is to create a "web of data", or a "database of everything". Examples of this include Turtle language, or XML
- designed to use triple stores, but in a format that is tolerant to different predicates. This makes it easier for two organizations to work together

#### SPARQL
Query language for triple stores using the RDF data model. Structure is similar to [Cypher](#the-cypher-query-language) because RDF doesn't distinguish between properties and edges (both are predicates)

### Datalog
from the 1980's, uses triple store model. The Rules define what to do

---
layout: post
title:  "Notes: Reliable, Maintainable & Scalable Applications"
date:   2018-07-13 15:07:43 -0500
permalink: /programming/ddia-reliable-maintainable-scalable-applications/
---

source: [Designing Data Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) by Martin Kleppmann (Chapter 1)

---

Data has replaced raw CPU power as the limiting factor for computer systems. It's more of a problem to solve when data is:
- high volume
- complex
- changing in real time

### Thinking about Data Systems
Lots of tools (like databases, queues, caches) are types of data systems, so it's a pretty broad category. They're important to think about, though, because *applications are usually just a collection of data systems*.

When building a product, it's important to consider both *functional* and *nonfunctional* requirements.
- *functional requirements* describe what a system should do
- *nonfunctional requirements* include security, reliability, scalability and maintainability

For data intensive applications, we need five things:
1. Databases
2. Caches
3. Search Indexes
4. Stream Processing
5. Batch Processing

## Reliability
Reliable systems tolerate user error, abuse and large loads.
### **fault** vs **failure**:
- *Faults* are when a component in a system deviates from its specifications
- *Failures* are when a while system stops providing the required service
We want fault-tolerant (resillient) systems, as opposed to fault-free systems. Faults are to some degree inevitable, and when a system isn't fault tolerant, it just fails.

An exception to this would be matters of security. The goal is prevention for security features.

### Hardware Faults
These happen all the time, especially when more machines are involved. Solve that problem using **redundancy** and **backups**. If we have multiple machines for a given system, the system should (ideally) be tolerant of one more more machines going down

### Software Errors
Software errors are harder to anticipate, and tend to be more likely to cause system failures.
- they can affect shared resources more easily
- they can also cause cascading failures
**lots of software bugs are caused when assuptions about an environment are wrong**
There's not quick fix, but partial solutions include:
- thinking ahead
- unit tests, integration tests
- monitoring

### Human Errors
Humans are *really* unreliable. To get areound this, use good UIs, sandboxes, failing hard/loudly, integration/unit tests, detailed monitoring and good processes

## Scalability
when measuring scalability, think of it as: `(resources)/(load) = performance`
So if you want to investigate scalability, you can do it in a couple of ways
1. increase load but keep resources the same. See how that affects performance
3. increase load, increase resources to keep performance the same. Keep track of what you need to change

### Determining Load
In Twitter's case, the key metric to determine load is either users or followers. What's the best way to design for a user with 30 million followers? What about dealing with millions of users, each with about 70 followers? The algorithm (to deliver tweets to mailboxes) that scales well depends on the type of user.

### Measuring Performance
There are lots of good metrics for performance, like throughput and response time. It's best to look at these metrics in terms of percentiles (rather than average or median), since looking at the 99th percentile can be more instructive than looking at the 55th percentile.
- reason for this: queing delays, head-of-line blocking. Bottlenecks in your system can exaserbate outliers
- Even when you're runnign things in parallel, the longest running process determines response time for the whole application
- Shorthand for 99th percentile: P99. 99.9th percentile -> P999, 50th percentile -> P50

#### latency vs response time
*response time* (or how long it takes for a user to get a reponse) often depends on the *latency* (amount of time an operation waits to be handled) of a set of systems.

### Strategies for Scaling
The architecture you use to scale *depends on your system*, and you typically have a mix of the following:
- **scaling up** (vertical scaling): using a more powerful machine
  - this is better for stateful services
- **scaling out** (horizontal scaling): using more machines
  - this is better for stateless services

**Elastic Systems**: scale automatically when load changes. This is opposed to more simple systems, where humans anticipate changes to load and manually scale the system. Elastic systems are not nessecary for a lot of applications, but they're better for unpredictable environments.

## Maintainability
You can determine maintainability based on how happy your developers are. You make systems maintainable to reduce headache. The three methods are:
1. operability
2. simplicity
3. evolvability

### Operability
Ops teams do a lot (monitering system health, dealing with issues, security patches, maintenance, capacity planning...) so *good data systems should make life easier for operations teams*. Good tools for this include:
- runtime visibility tools
- automization
- documentation
- redundancy
- predictability

### Simplicity
complexity causes all sorts of problems that lead to software bugs.
- **Accidental Complexity** isn't inherent to the problem that a piece of software is solving, but it comes from implementation
- **Abstraction**: tool for removing accidental complexity. Just hide the implementation behind a facade.

### Evolvability
Most systems, obviously, change over time. Use **Agile working patterns** to provide a framework for change. **simplicity and operability** are also super helpful


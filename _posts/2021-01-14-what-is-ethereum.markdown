---
layout: post
title:  "Notes: What is Ethereum"
date:   2021-01-14 15:07:43 -0500
permalink: /programming/what-is-ethereum/
---
source: [Mastering Ethereum, Chapter 1](https://github.com/ethereumbook/ethereumbook/blob/develop/01what-is.asciidoc) by Andreas Antonopoulos

---
fundamentally, Ethereum is a **state machine**

- *deterministic* but *practically unbounded*
- **globally accessible** singleton state

at a higher level, Ethereum is an open source, decentralized computing infrastructure.

- executes **smart contracts**
- uses a blockchain to synchronize state changes
- cryptocurrency: **ether** - used to constrain execution resource costs

### similarities to Bitcoin

- peer-to-peer network
- Byzantine fault-tolerant consensus algorithm
- use of cryptographic primitives

### differences from Bitcoin

- Ethereum isn’t primarily for digital payment
- general-purpose programmable blockchain
- programming language is Turing complete
- tracks more than currency ownership

## Ethereum as a blockchain

- **a peer-to-peer network** uses gossip protocol
    - the *Ethereum main network*
- **transactions** cause state transitions
    - network messages, include values, data payload
- **consensus rules**
    - defined in the Yellow Paper
- **a state machine**
    - the **Ethereum Virtual Machine (EVM)** executes **bytecode**
    - **smart contracts:** EVM programs
- **a chain of blocks** (cryptographically secure), acts as a journal
- a **consensus algorithm** forcing participants to cooperate
    - uses sequential blocks
    - currently uses **proof of work**, but moving to **proof of stake**
- data structures
    - Ethereum’s state is on each node as a database
    - **Merkle Patricia Tree** serialized hashed datastructure, contains transactions and system state

### Ethereum is a general purpose blockchain

tracks state transitions of a **general purpose data store** (key-value tuples)

- stores code *and* data

### Turing completeness

a system is **Turing complete** if it can be used to simulate any Turing machine

- **Universal Turing machine (UTM)** a Turing complete system
- Ethereum is a UTM. It can execute any stored program in the EVM

Turing completeness is easy to achieve, and it’s dangerous. It means infinite loops are possible

- it’s impossible to predict when or if a program will finish

### Solution? Gas

Each instruction has a predetermined cost in units of gas. This limits computation for individual programs

- Ether needs to be included in transactions

## DApps

web applications, built on top of open, decentralized, p2p infrastructure services. Includes:

- smart contracts on a blockchain
- a web frontend

### web3

The third “version” of the web, centered around DApps

the **web3.js** JavaScript library - meant to work with the Ethereum blockchain
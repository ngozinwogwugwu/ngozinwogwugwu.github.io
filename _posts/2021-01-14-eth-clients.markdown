---
layout: post
title:  "Notes: Ethereum Clients"
date:   2021-01-16 15:07:43 -0500
permalink: /programming/eth-clients/
---
source: [Mastering Ethereum, Chapter 3](https://github.com/ethereumbook/ethereumbook/blob/develop/03clients.asciidoc) by Andreas Antonopoulos

---

Ethereum clients are software applications

- communicate over peer-to-peer network
- implement Ethereum specification

a client **interoperates** if it complies with the communication protocols

- also the ethereum specification (defined in **the Yellow Paper**)

The code for all major Ethereum clients is open source

There are currently six main implementations of the Ethereum protocol (written in different languages)

- common clients are Parity (rust) and Geth (go)

## Ethereum Networks

There are a bunch of networks

- they conform to the Ethereum Yellow Paper specification
- they don’t interoperate with each other

### Running a full node

the more *independently operated* and *geographically dispersed* full nodes there are, the healthier the blockchain

There exists a **mainnet**, but you can do almost everything with a **testnet** or a **local private blockchain**

a **remote client** is like a wallet that offers an API

- does not validate block headers or transactions
- trusts a full client for access to the blockchain

**Light Clients** validate block headers and transactions (unlike remote clients)

- they have a similar level of security to a full node

**Running a full node** is a hassle, but you’re able to do more on the blockchain

**Running a testnet node** is much easier and there aren’t any stakes
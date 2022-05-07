---
layout: post
title:  "Notes: Ethereum Basics"
date:   2021-01-14 15:07:43 -0500
permalink: /programming/eth-basics/
---
source: [Mastering Ethereum, Chapter 2](https://github.com/ethereumbook/ethereumbook/blob/develop/02intro.asciidoc) by Andreas Antonopoulos

---

## Ether

(ETH, $\Xi$) Currency unit for Ethereum

subdivided into **wei**. $10^{18}$wei is one ether

## Wallets

software application - helps you manage your Ethereum account

- holds your **keys**
- broadcasts **transactions** for you

Wallets only work if they have access to your private keys, so don’t get a sketchy wallet

### controlling your keys

the highest security is an **air-gapped device**

never store your private key in plain form (especially digitally)

use a password manager or pen and paper

### Switching Networks within a Wallet

MetaMask connects to the main Ethereum network by default, but you could also connect to other networks

- **Ropsten Test Network** - public testing network, ETH has no value
- [**localhost](http://localhost) 8545**

## The World Computer

You can think of the EVM (Ethereum Virtual Machine) as a global singleton running smart contracts on a single thread. Use Ether to pay to run smart contracts

## Externally Owned Accounts (EOAs)

accounts that have a private key (as opposed to a **contract account**, which has an address but no private key)

## Creating a Contract

you need to send the bytecode to the **zero address**
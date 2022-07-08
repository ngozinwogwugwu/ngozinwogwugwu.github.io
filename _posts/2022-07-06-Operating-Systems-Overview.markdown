---
layout: post
title:  "Notes: Operating Systems Overview"
date:   2022-07-06 15:07:43 -0500
permalink: /programming/operating-systems-overview/
---

source: [Operating System Concepts](https://codex.cs.yale.edu/avi/os-book/OS10/index.html) by Avi Silberschatz, Peter Baer Galvin, Greg Gagne (Chapter 1)

---
# Introduction

An **Operating System** is software that manages a computer’s hardware

- provides basis for application programs
- acts as intermediary between user and hardware
- allocates resources to computer programs

## What Operating Systems Do

Components to a computer system:

- hardware
- operating system
- application systems
- user

### System View

from a computer’s point of view, the OS is the program most intimately involved with the hardware. It’s a **resource allocator**

A **control program** manages the execution of user programs

- prevents improper use of the computer

### Defining Operating Systems

Can be defined as a combination of the kernel and system programs

- **the kernel**: the operating system is the one program that’s always running. This is one possible definition of an operating system
- **system programs:** associated with the operating system, but not part of the kernel

**middleware:** a set of software frameworks that provide additional services to application developers

## Computer-System Organization

### Interrupts

An interrupt is a signal from the hardware to the CPU, usually by the system bus, which causes the CPU to stop what it’s doing and transfer execution to a fixed location. These locations could be hardcoded, or stored in a table of pointers called the **interrupt vector**

### Storage Structure

Computers run most of their programs from main memory (or **RAM**), which is volatile. You have to load the program to main memory beforehand

- **DRAM:** Dynamic Random-Access Memory

**Bootstrap Program** - the first program to run on a computer. Uses firmware storage to store the program, since RAM is volatile

We can’t store programs in main memory for two reasons

- Main memory is too small to store all our programs
- Main memory is volatile

### I/O Structure

Operating systems handle I/O

## Computer-System Architecture

There are single processor systems and multi processor systems

- **core** - the component that executes instructions

### Multiprocessor systems

have processors that share resources (clock, memory, etc)

- Primary advantage: increased throughput
- Disadvantage: One processor could sit idle

**Multicore Systems** - have multiple cores on a single chip (for faster communication)

### Clustered Systems

composed of two more more **nodes** (individual systems) that are loosely coupled

- redundancy leads to high availability

**Parallelization** - a technique which divides a program into separate components so they can be run in parallel

## Operating System Operations

**system daemons** programs that are loaded into memory at boot time. Services that are provided outside of the kernel

### Multiprogramming and Multitasking

**Multiprogramming** increases CPU utilization by keeping several processes in memory simultaneously. Gives processing time to a new program when the current program is idle

**Multitasking** **-** when the CPU switches between programs

### Dual-Mode and Multi-Mode Operation

Computers must distinguish between operating-system code and user-defined code. This prevents misuse of the computer.

To implement this, we need two **modes of operation**

- Kernel mode (AKA supervisor mode, system mode, privileged mode)
- user mode

**mode bit** - indicates the current mode, added to the hardware of the computer

### Timer

a timer can be set to interrupt the computer after a specified period

## Resource Management

# Operating-System Structures
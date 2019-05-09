---
layout: post
title:  "SQLite as a Teacher"
date:   2019-05-09 15:07:43 -0500
categories: sqlite databases
---

The University of Chicaco published a collection of programming assignments designed for teaching the internals of databases. It's called [chidb](http://chi.cs.uchicago.edu/chidb/index.html), and I'm giving it a try. I've been using relational databases for years, but chidb has been a great way for me to view database management systems as something other than a black box. Bonus: This'll help me get acquainted with C

### chidb quickstart
One drawback to this online course is that there's not a lot of guidance. This means that it took me a couple days to get set up. If you want to give chidb a try, and you _don't_ want to spend a couple days getting setup, try using my [chidb quickstart repo](https://github.com/ngozinwogwugwu/chidb_quickstart). If you clone it and follow the steps in the readme, you'll have a working docker container with a chidb bind mount in about five minutes. This means that you'll be able to make changes to the chidb repo on your own machine, and use a docker container to install and run it. My favorite part about this is that you won't need to install any mystery software on your own machine.

### SQLite Header Viewer
Getting though the unit tests for [Assignment 1, Step 1](http://chi.cs.uchicago.edu/chidb/assignment_btree.html#step-1-opening-a-chidb-file) takes quite a bit of time if you're starting from scratch. If you want to view the SQLite headers that chidb uses for the unit tests, you can use [hexdump](http://man7.org/linux/man-pages/man1/hexdump.1.html), or you can try out my [SQLite Header Viewer](https://ngozinwogwugwu.github.io/mini_frontend_projects/), which will tell you exactly what is wrong with a corrupted SQLite header

### notes
If you'd like to check out [my notes](https://github.com/ngozinwogwugwu/chidb_quickstart/blob/master/ngozis_notes.md) or [my work](https://github.com/ngozinwogwugwu/chidb_quickstart/tree/master/ngozis_work), they're both on the chidb quickstart github repo
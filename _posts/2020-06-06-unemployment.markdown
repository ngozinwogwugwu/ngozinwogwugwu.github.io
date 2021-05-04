---
layout: post
title:  "Unemployment 2020"
date:   2020-07-02 15:07:43 -0500
categories: architecture
---

I wanted to review computer science fundametals during quarentine, so I took an [algorithms course](https://www.coursera.org/learn/algorithms-part1). I decided to do my homework using Python rather than Java, and I published my work [here](https://github.com/ngozinwogwugwu/exercises/tree/master/data_structures_homeworks)

The homework I had the most fun with was [percolation](https://github.com/ngozinwogwugwu/exercises/tree/master/data_structures_homeworks/percolation)

# Percolation
![percolation_animation.png](/assets/unemployment/percolation_animation.png)


I model [percolation](https://en.wikipedia.org/wiki/Percolation) here using an _n_ by _n_ grid. The grid percolates if there is a path from the top to the bottom through open nodes.

The goal is to use a Monte Carlo simulation to determine the value _p_, which represents the ratio of open nodes to total nodes in the system where we can expect the system to percolate.



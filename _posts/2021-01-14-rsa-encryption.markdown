---
layout: post
title:  "Notes: RSA Encryption"
date:   2021-01-16 15:07:43 -0500
permalink: /programming/rsa-encryption/
---

source: [This YouTube Video](https://www.youtube.com/watch?v=QSlWzKNbKrU)

---

RSA encryption is a form of asymmetric cryptography

- it’s **not used for Ethereum**, but I want to know how it works anyway
- invented in 1977. Was patented until 2000

You use the **public key**  for **encryption**. You use the **private key** for **decryption**

- anyone can put suggestions in the suggestion box. You need a key to open it

$y = e_{kpub}(x), x = d_{kprv}(y)$

## Step 1: Key generation

1. choose two large primes, $p$ and $q$
    1. large means $2^{512}$
2. get $n$. $n=p*q$
3. get $\phi(n) = (p-1)(q-1)$
4. Chose $e$, where:
    1.  $1 < e < \phi(n)$
    2. $e$ and $n$ are **relatively prime**, which means they don’t share any prime factors
    3. you can pick any one of these numbers. It doesn’t even have to be random
5. find $d$, the **modular inverse** of $e$ w.r.t $\phi(n)$
    1. in other words, $(e*d)$ % $\phi(n)=1$
    2. you need to use an **extended euclidean algorithm** for this
6. $key_{pub}=n, e$
$key_{priv} =n, d$
    1. $p$, $q$ and $\phi(n)$ should all be secret. They can be used to calculate $d$

### example with small prime numbers

1. $p = 5$, $q = 11$
2. $n = 5 * 11 = 55$
3. $\phi(n) = (p-1)(q-1) = (4)(10) = 40$
4. prime factors of 40: 2, 2, 2, 5. This means that we can use the following prime factors: 3, 7, 11, 13, 17, 19, 23, 29, 31, 37
    1. let’s just go with 7
    2. $e = 7$
5. we need the modular inverse of $e$ w.r.t $\phi(n)$
    1. $(e*d)$ % $\phi(n) = 7d$ % $40 = 1$
    2. aka $40x + 7y=1$. We just need to find two whole numbers where this actually works
    3. [this video goes into detail](https://www.youtube.com/watch?v=kYasb426Yjk)
    4. the answer: $x=3, y=-17$ (this means $(40)(3)-(17)(7)=120-119=1$ )
    5. **it’s negative**, so we find its inverse, which is $\phi(n)-e=40-17=23$
    6. let’s test this out? $7*23 = 161$. $161$ % $40 = 1$
6. $key_{pub} = (55, 7)$
$key_{priv} = (55, 23)$

## Step 2: Encryption

given a public key, $key_{pub}=n, e$, you can encrypt a number, $x$, where $1 < x < n$

$c = x^e$%$n$, where $1 < x < n$

## Step 3: Decryption

given a private key, $key_{priv}=n, d$, you can decrypt a number, $x$, where $1 < x < n$

$x = d_{keypriv}(y) = y^d$ % $n$

## example

using the public and private key we found above, let’s say we want to encrypt 5

$x^e$%$n =$   $5^7$ % $55 = 25$ $= y$

let’s decrypt it now

$x = y^d$ % $n = 25^{23}$ % $55 = 5$
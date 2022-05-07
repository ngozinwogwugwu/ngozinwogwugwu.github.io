---
layout: post
title:  "Notes: Writing Smart Contracts"
date:   2022-01-16 15:07:43 -0500
permalink: /programming/cryptozombies/
---
source: [CryptoZombies](https://cryptozombies.io/)

---

# CryptoZombies

[https://cryptozombies.io](https://cryptozombies.io/en/lesson/1/chapter/1)

### make a zombie factory

### goal & pragma

requirements for a zombie factory

- database with all zombies
- function to create zombies
- each zombie will be unique

**zombie dna** represented as an int. Different parts of the int map to different zombie traits

a **contract** is the fundamental building block of ethereum applications

- all variables and functions belong to a contract
- **solidarity** object oriented programming language

**version pragma** declaration of the version for the compiler

- all solidarity code starts with this, prevents issues with future compiler versions

example contract

```solidity
pragma solidity >=0.5.0 <0.6.0;

contract ZombieFactory {}
```

### variables and math

**state variables** permanently stored in contract storage. They're written to the blockchain, similar to writing to a database

**uint** unsigned int, can't be negative

math operations in solidity are pretty straightforward

### structs & arrays

**structs**

```solidity
struct Person {
	uint age;
	string name;
}
```

**arrays** there are **fixed** and **dynamic** arrays. To make an array dynamic, don't specify the length. You can also create arrays out of structs

```solidity
uint[2] fixedArray;
uint[] dynamicArray;
Person[] public people;
```

if you create a dynamic array of structs, it gets stored in the blockchain. It's like storing structured data in a database

if you declare an array as `public`, solidity will create a `getter` method for it. Makes them readable but not writable by other contracts

you can `push` structs and variables to arrays

### functions

**functions** look like this

```solidity
function eatHamburgers(string memory _name, uint _amount) public {}
function sayHello() public view returns (string memory) {}
```

- `public` specifies the visibility of the function. Functions are public by default
- `public` functions are only visible by other functions within the contract. Private functions start with an underscore
- `memory` indicates that `_name` should be stored in memory. This is **required for reference types**

**types of arguments** - you can pass them in **by value** or **by reference**

- any variable that you pass around by reference (arrays, strings, structs, mappings) vs
- any variable that you pass into the function. **Changes to these variables are limited to the function**

**return values** - the function declaration contains the return value type

**function modifiers** - a way to document the type of function you're writing

- **view** - it's viewing data from the blockchain but not modifying it
- **pure** - not even accessing data from the app

### using `Keccak256` to create a random zombie

`keccak256` is a hash function that outputs a 256-bit hex number

- input of type bytes

**to pack a string into bytes** use the function `abi.encodePacked`

- code so far
    
    ```solidity
    pragma solidity >=0.5.0 <0.6.0;
    
    contract ZombieFactory {
    
        // declare our event here
    
        uint dnaDigits = 16;
        uint dnaModulus = 10 ** dnaDigits;
    
        struct Zombie {
            string name;
            uint dna;
        }
    
        Zombie[] public zombies;
    
        function _createZombie(string memory _name, uint _dna) private {
            zombies.push(Zombie(_name, _dna));
            // and fire it here
        }
    
        function _generateRandomDna(string memory _str) private view returns (uint) {
            uint rand = uint(keccak256(abi.encodePacked(_str)));
            return rand % dnaModulus;
        }
    
        function createRandomZombie(string memory _name) public {
            uint randDna = _generateRandomDna(_name);
            _createZombie(_name, randDna);
        }
    
    }
    ```
    

### events

your contract can listen to **events** on the blockchain and take an action

### the frontend

Ethereum has a Javascript library called **Web3.js**

# Make the zombie app more game

### Addresses and Mappings

**accounts** similar to bank accounts

- owned by an individual or contract
- holds a balance of **ether**, can send or receive ether

**addresses** hex identifiers for the accounts. 

**mappings** key-values stores. Defined like this:

```solidity
mapping (account => uint) public accountBalance;
```

### msg.sender

this function returns the address of whatever (person or contract) that called the current function

### require

`require` makes the function throw an exception if some conditions are not met

### inheritance and import

the syntax `contract descendentContract is ancestorContract {}` will create an inherited contract

the syntax `import "./another_file.sol";` will import a file

### storage and memory

**storage** gets stored on the blockchain. This is analogous to writing to disk

**memory** variables in memory are temporary, and disappear when the function ends

you include these as keywords when you declare variables

### Internal & External

functions in solidity have different visibilities:

- `internal` is the same as `private`, except it includes inherited classes
- `external` is like `public` - except `external` functions are **only** accessible from outside the contract

### reading from other contracts

we need to define an **interface** to interact with other contracts. Interfaces look like this:

```solidity
contract exampleInterface {
	function otherFunction(uint inputVar) public view returns (uint);
}
```

### cryptokitties

source code is here ([github](https://github.com/dapperlabs/cryptokitties-bounty/blob/master/contracts/KittyCore.sol#L91))

we initialize the contract using the address of the contract

# Ethereum

Ethereum contracts are **immutable**. This makes security a huge concern. Because of this, it make sense to have getters and setters for some contract variables, like `setKittyContractAddress`

**constructors** - optional functions that get executed when an object gets created

**function modieifer** modify other functions, usually to check some requirements before the execution (like `onlyOwner`)

- uses the keyword `modifier`
    - uses `_;` - when this gets run, it jumps to the modified function

### ownable contracts

In order to prevent randos from changing the contract, you make a contract `ownable`

`OpenZeppelin` solidity library

- has secure smart contracts that you can use in your own dapps

It makes sense to be careful with ownable contracts. The owners can add backdoors for themselves

- this means you should read code before you trust it

## gas

you can buy gas with ether

gas required to execute a function depends on the function’s complexity. This encourages code optimization

### struct packing

Solidity reserves 256 bits for all uints (8, 16, 32...)

**exception**: inside of structs. You’ll want to use the smallest possible integer sub-types and cluster identically-typed fields

### time

`now` - built in

`days`, `months`, `minutes` - you can say `now + 5 minutes` to mean five minutes from now

the **2038 problem** - it will be so many seconds since 1970 that we’ll have overflows from a `uint32`

default is `uint256`, so we should cast dates to `uint32`s

### passing references to structs

You can pass a pointer to a struct in a function like this

```solidity
function myFunc(MyStruct storage _myStruct) {}
```

### function modifiers can take input variables

You declare them like any other function with input variables

```solidity
modifier olderThan(uint _age, User storage _user) {
	require(user.age > _age)
	_;
}

```

And you’d input the variables in your function definition

```solidity
function DrinkAlcohol(User storaage _user) public olderThan(16, _user) { }
```

### gas & view functions

If you call a view function externally, it will just find the value on your local ethereum node. **This does not cost you gas**

- if you call a view function from *inside* a contract, **it will cost you gas**

### gas & building variables on the fly

writing data to storage is one of the most expensive things you can do on the blockchain, so in a lot of cases it makes sense to create things on the fly

- in order to make sure your arrays stay in memory, use the `memory` tag when you declare them
    
    ```solidity
    uint[] memory values = new uint[][3]
    for(uint i=0; i<3; i++) {
    	values[i] = i+3;
    }
    ```
    

Also for loop look like this

# ERC271, Crypto collectibles

## Tokens on Ethereum

Tokens are basically contracts that follow a standard set of rules

- implements the same functions (`transferFrom`, `balanceOf`...)

Now that we have a standard, we can build on top of tokens more easily. For example, and exchange can work with any kind of ERC20 token

We have ERC20 tokens (similar to currencies) and ERC271 tokens (NFTs). NFTs are not interchangeable or divisible

## ERC271 standard, multiple inheritance

If we want to make an NFT, we inherit from ERC271. This means we need to implement **multiple inheritance** by using the following syntax:

```solidity
contract ChildClass is ParentA, ParentB { }
```

## Transfer Logic

We have two different ways to transfer NFTs here:

1. **transferFrom** - the owner transfers the NFT to the recipient
2. **approve** and **transferFrom** - the owner approves a transfer to a specific address, then the recipient calls the `transferFrom` fununction
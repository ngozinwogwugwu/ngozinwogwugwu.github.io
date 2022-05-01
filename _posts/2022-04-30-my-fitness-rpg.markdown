---
layout: post
title:  "My Fitness RPG"
date:   2022-04-30 15:07:43 -0500
categories: games, fitness
---

I made a simple phone game that draws on fitness stats from your wearable. The game's concept is quite simple: Fight monsters to gain experience points and gold. The game uses several out-of-game factors to determine its behavior.

My goal is to pull elements of the real world into a fantastical game world. Fitness stats like cardiovascular strain and sleep determine a character's hit strength and health. Other real-world factors, such as current weather and moon phase, determine which monsters appear. By using mundane events in the real world to create fun game mechanics, I hope to encourage my players to view daily life with a layer of whimsey.

[I published a demo. Try it out!](https://witch-game-text-adventure-i26wf.ondigitalocean.app/)

| ------------- | ------------- | ------------- | ------------- |
| ![IMG_9150.PNG](/assets/witch_game/IMG_9150.PNG) | ![IMG_9151.PNG](/assets/witch_game/IMG_9151.PNG) | ![IMG_9152.PNG](/assets/witch_game/IMG_9152.PNG) | ![IMG_9153.PNG](/assets/witch_game/IMG_9153.PNG) |

## How did I make this?

The tech stack I used for this is quite straightforward. I used **PostgreSQL** to store data, **Django** to create a REST API. I used **Expo/ReactNative** to generate a mobile-friendly frontend because I want the option to publish my game as an iOS app. I'm using **DigitalOcean** to host the entire app.

## Aspirations

I want to pull in more real-time data and make the game more complex and story-driven. I would also consider adding NFT items as a way for the game to generate profit.

## Learnings

I view the current incarnation of this game as a proof-of-concept, and I learned quite a bit while building this version of the game. Here's what I'll do for my next version:
- **Deploy early and often** - I want to publish a live version of my game as early as possible so I can get feedback at every step of development.
- **Start with the integrations** - I'm moving from Whoop to Apple Health, since Apple Health has far more users and allows for developer integration.
- **Mobile first, but web is too!** - Getting published on the App Store is a whole thing. I want immediate feedback on my app, so I'll publish my game to the web before I focus on creating an iOS app
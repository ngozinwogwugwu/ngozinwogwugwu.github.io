---
layout: post
title:  "Recurse Center S.O.U.T.H. Hackathon"
date:   2019-04-27 15:07:43 -0500
categories: projects hackathon
---

I've participated in hackathons before, but S.O.U.T.H was the first hackathon where I acted as a participant and a planner. Because the theme was "silly projects", I ended up making [Postweather](https://ngozinwogwugwu.github.io/postweather/): the weather app that says you should have brought an umbrella yesterday, because it rained.

During the project, I learned how easy it is to overestimate what I can do in eight hours, and I found a few tools that I want to try using

## Organizing the Hackathon
I participated in organizing with ten other recursers, and it was a real team effort. We needed to reserve space, order food, advertize and execute the event, and plan a demonstration session. I was in charge of zulip communication, and I led a pre-hackathon git discussion, so that hackathon participants could collaborate more effectively.

Attending organizational meetings made it clear to me how much thought and work goes into events like this. We mainly emphasized removing barriers to participation and using a "silly event" as a chance to learn something new.

## Ideation
Our pre-hackathon ideation session mirrored an improv class: we tried to be as silly and spontaneous as possible. I paired with a new person every thirty seconds and tried to find clever ways to turn useful tools into useless technology. We spent most of our time laughing at our ideas, and it was quite freeing to remove the pressure of coming up with that "million dollar idea".

## Initial Project Idea
I grabbed the idea of a "post weather app" from another participant because it made me laugh the hardest. Imagine an app that pings you _the day after_ it rains, to sanctimoniously tell you that you really should have remembered your umbrella yesterday. Pretty useless, right?

I really wanted to deploy a full stack application, since I had never done that before. I chose a combination of React and Django, because I knew that I could start an app quickly. I also wanted to see if I could send actual texts to my users, so I looked into [twilio](twilio.com)

## Trimming down the project
Halfway through the day, I realized that I had been a little too ambitious. Although I was able to build [a quick frontend](https://ngozinwogwugwu.github.io/postweather/), I was struggling to connect it to my Django app, and I was nowhere close to deployment.

Instead of using the frontend as only a signup page, I moved all of my functionality to the frontend. A user gets their useless, annoying lecture the moment they enter their zip code, rather than first thing the morning after

## Future goals
I still have ambitions to deploy a Django app, especially one with text functionality. That way I can play with twillio and feel confident about my ability to deploy a project

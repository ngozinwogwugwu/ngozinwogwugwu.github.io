---
layout: post
title:  "How to Dockerize a Project"
date:   2018-07-13 15:07:43 -0500
permalink: /programming/dockerize-project/
---

sources: [Docker's Website](https://docs.docker.com/get-started/), [Tutorial from Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

Basic steps:
1. create a **Dockerfile** in the base directory of the project
2. create a **.dockerignore** file in that same directory
3. build the image and run it

## Creating a Dockerfile
```bash
# this grabs the official node docker image from https://hub.docker.com/_/node/
# the image has the basic setup for the environment you want (specifically npm)
FROM node:8

# Create a working directory for the application
WORKDIR /usr/src/app

# Install app dependencies (you have to move all your requirements files into the working directory first) 
COPY package*.json ./
RUN npm install

# Bundle app source (I'm still not quite sure what that means)
COPY . .

# run your application!
EXPOSE 8080
CMD [ "npm", "start" ]
```

## Creating a .dockerignore file
This is pretty straightforward. Just create a **.dockerignore** file with everything you don't want to include in your published image. In this case, the following file names:
- ```node-modules```
- ```npm-debug.log```

## Build and run the image
To build the **scooter-app** image under the username **nnwogwugwu**:
- docker build -t nnwogwugwu/scooter-app .

To run the dockerized scooter app:
- docker run -p 49160:3000 -d nnwogwugwu/scooter-app

Note: the -d flag runs the docker image in the background. the -p flag lets you specify the port. Use it to map a public port to the private port in your container. The Node.js article uses 49160:8080, since the node application uses port 8080. Create-react-app defaults to port 3000, so make sure to keep that in mind.

To view the dockerized application, go to http://localhost:49160/

### Example of Projects that I've dockerized
[Scooter table repo](https://github.com/ngozinwogwugwu/scooter_table)


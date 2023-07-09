# HeckerGround
Spring boot + react web playground
Guide for running local server below:

## Prerequisites

- [Install docker](https://docs.docker.com/desktop/install/windows-install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)

## Build local server
This will host a local server at localhost:3000
> frontend: port 3000 <br/>
> backend: port 8080 <br/>
> mysql: port 3306
```
docker-compose -f docker-compose.yml up --build
```

# Project Overview

## Branch Structure

Our project follows a structured Git branching model:

- **master**: Reserved for stable production-ready releases.
- **release**: Used for preparing stable versions before deployment.
- **develop**: Active development branch where all files and new features are currently being worked on.

## Current Status

Since `master` and `release` branches are required to have a working version, but we do not have a stable release yet, all our files and active development take place in the `develop` branch.


# Buddy Builder Database Setup

This guide provides instructions for setting up and running the MySQL database using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Steps to Set Up and Run the MySQL Database

1. **Create `docker-compose.yml` File**

   Ensure you have the following `docker-compose.yml` file in your project directory (ignore the 3 comments and yaml, you just need it):

   ```yaml
   
   version: '3.8'

   services:
     mysql:
       image: mysql:8.0
       container_name: mysql_container
       environment:
         MYSQL_ROOT_PASSWORD: rootpassword
         MYSQL_DATABASE: mydatabase
         MYSQL_USER: user
         MYSQL_PASSWORD: password
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql

   volumes:
     mysql_data:


# Run the following commands
# docker-compose up -d
# docker ps (to ensure its running)
# docker exec -it mysql_container mysql -u user -p
# USE mydatabase;

# Done, You can then use sql commands into the database
# To backup the database, docker exec mysql_container mysqldump -u user -p mydatabase > backup.sql
# To restore to backup, docker exec -i mysql_container mysql -u user -p mydatabase < backup.sql
# To stop the container, docker-compose down
---
title: Docker
description: Reference for using Docker
---

## Docker: Containerization Simplified
Docker is a platform for developing, shipping, and running applications inside lightweight, portable, and self-sufficient containers. It has become an essential tool in modern software development and infrastructure management. In this section, we'll explore what Docker is, how it differs from virtual machines (VMs), and its various use cases.

### What is Docker?
Docker is an open-source containerization platform that allows developers to package applications and their dependencies into a single unit called a container. Containers are isolated environments that contain everything an application needs to run consistently, including code, runtime, libraries, and system tools. They are based on a technology known as containerization, which abstracts the underlying infrastructure and ensures that applications run consistently across different environments.

### Docker vs. Virtual Machines
Docker containers are often compared to traditional virtual machines, but they have some key differences:

#### 1. Resource Efficiency:
**Docker Containers:** Containers share the host operating system's kernel, making them lightweight and efficient. They consume fewer resources (CPU, memory, storage) compared to VMs.

**Virtual Machines:** VMs run a full operating system, including its kernel, which consumes more resources. Running multiple VMs on a single host can be resource-intensive.

#### 2. Isolation:
**Docker Containers:** Containers are isolated from each other, but they share the same kernel. This provides process-level isolation, making them more efficient. However, it may pose security risks if not properly configured.

**Virtual Machines:** VMs are fully isolated, with each VM having its own kernel and OS. This offers stronger isolation but is heavier in terms of resource usage.

#### 3. Portability:
**Docker Containers:** Containers are highly portable across different environments, such as development, testing, and production. They ensure that applications behave consistently across these environments.

**Virtual Machines:** VMs can be less portable due to differences in hypervisors and operating systems. Moving VMs between environments can be more complex.

#### 4. Start-up Time:
Docker Containers: Containers start up quickly since they leverage the host OS kernel. This makes them ideal for microservices architectures and scaling applications.

**Virtual Machines:** VMs take longer to start because they need to boot an entire OS. This can slow down development and scaling processes.

### Use Cases for Docker
Docker is used across various stages of the software development and deployment lifecycle. Some common use cases include:

**Application Packaging:** Docker simplifies the process of packaging applications and their dependencies into containers. This makes it easier to distribute and deploy software consistently.

**Microservices:** Docker is well-suited for building and deploying microservices-based architectures. Each microservice can run in its own container, providing flexibility and scalability.

**Continuous Integration and Continuous Deployment (CI/CD):** Docker containers can be used in CI/CD pipelines to create reproducible build and deployment environments. This ensures that code tested in one environment behaves the same way in production.

**Development Environments:** Developers can use Docker to create isolated development environments that match the production environment. This reduces the "it works on my machine" problem.

**Scaling Applications:** Docker makes it easy to scale applications up or down by creating or destroying containers as needed. This is especially useful for web applications experiencing varying levels of traffic.

**Cloud Migration:** Docker containers simplify the process of migrating applications to the cloud, as they abstract away underlying infrastructure differences.

**Multi-Tenancy:** Containers can be used to run multiple instances of an application on a single host while maintaining isolation.

In summary, Docker is a powerful tool for containerization that provides a lightweight, efficient, and portable way to package and run applications. It is particularly beneficial in modern application development and deployment scenarios, where consistency, scalability, and efficiency are paramount.

## Writing Dockerfiles: Building Container Images
A Dockerfile is a text file that contains instructions for building a Docker container image. It defines a set of steps to create a reproducible and self-contained environment for running an application. Writing Dockerfiles is an essential part of the Docker workflow. In this section, we'll explore how to write Dockerfiles effectively.

### Anatomy of a Dockerfile
A Dockerfile consists of a series of instructions, each of which represents a specific action to be taken during the image build process. Here's an overview of common Dockerfile instructions:

`FROM`: Specifies the base image to build upon. Every Docker image starts with a base image, such as an official Linux distribution or a specialized image like node:14 for Node.js applications.

```dockerfile
FROM node:14
```

`WORKDIR`: Sets the working directory inside the container. This is where subsequent commands will be executed.

```dockerfile
WORKDIR /app
```

`COPY and ADD`: Copies files and directories from the host machine into the image.

```dockerfile
COPY package.json .
COPY . .
```
`RUN`: Executes commands within the container during the build process. Commonly used for installing dependencies, setting up the environment, and running build scripts.

```dockerfile
RUN npm install
RUN npm run build
```

`EXPOSE`: Specifies the network ports on which the container will listen at runtime. This is informational and does not publish the ports.

```dockerfile
EXPOSE 3000
```

`CMD` and `ENTRYPOINT`: Define the default command to run when the container starts. CMD is typically used to provide default arguments to the entrypoint command.

```dockerfile
CMD ["npm", "start"]
```

`ENV`: Sets environment variables within the container.

```dockerfile
ENV NODE_ENV production
```

### Best Practices for Writing Dockerfiles
To write efficient and maintainable Dockerfiles, consider the following best practices:

- **Use Official Base Images:** Whenever possible, start from official base images provided by Docker or trusted sources. These images are well-maintained and regularly updated with security patches.

- **Leverage Caching:** Arrange your Dockerfile commands so that the most stable and infrequently changing steps are at the top. This allows Docker to use cached layers for faster builds.

- **Minimize Layer Size:** Combine multiple commands into a single RUN instruction to minimize the number of layers in your image. This reduces the image size and improves performance.

- **Clean Up After Yourself:** Remove unnecessary files and dependencies in the same RUN instruction to reduce the image size. Use && to chain commands together.

```dockerfile
RUN apt-get update && apt-get install -y \
    package-name \
 && rm -rf /var/lib/apt/lists/*
```

- **Label Your Images:** Add metadata labels to your images to provide information about the image version, maintainer, or any other relevant details.

```dockerfile
LABEL version="1.0"
LABEL maintainer="yourname@example.com"
```

- **Keep Secrets Secure:** Avoid hardcoding sensitive information (e.g., API keys) in the Dockerfile. Instead, use environment variables or secrets management solutions.

- **Multi-Stage Builds:** For complex applications, consider using multi-stage builds to create a smaller production image that only contains necessary files and dependencies.

- **Testing in Containers:** Use Docker containers for testing to ensure that the image behaves as expected before deployment.

### Writing a Complete Dockerfile Example
Here's an example of a simplified Dockerfile for a Node.js application:

```dockerfile
# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
```

This Dockerfile starts from an official Node.js image, sets up the working directory, copies the application files, installs dependencies, and defines the command to run the application.

### Dockerfile Command Reference

#### Part 1
| Keyword            | Purpose                                            | Example                                   |
| -------------------|---------------------------------------------------| -----------------------------------------|
| `FROM`             | Specifies the base image to build upon.          | `FROM node:14`                           |
| `WORKDIR`          | Sets the working directory inside the container. | `WORKDIR /app`                           |
| `COPY`             | Copies files and directories from the host to the image. | `COPY package.json .`                |
| `RUN`              | Executes commands during the image build process. | `RUN npm install`                        |
| `EXPOSE`           | Informs Docker that the container will listen on specified ports at runtime. | `EXPOSE 3000`            |
| `CMD`              | Defines the default command to run when the container starts. | `CMD ["npm", "start"]`           |
| `ENTRYPOINT`       | Sets the primary command that cannot be overridden when running the container. | `ENTRYPOINT ["node", "app.js"]` |
| `ENV`              | Sets environment variables within the container.  | `ENV NODE_ENV=production`               |
| `LABEL`            | Adds metadata labels to the image for documentation and labeling. | `LABEL version="1.0"`               |
| `ARG`              | Defines build-time variables that can be passed to the builder. | `ARG MY_VAR=default_value`         |
| `VOLUME`           | Creates a mount point and marks it for external volumes. | `VOLUME ["/data"]`               |
| `USER`             | Sets the user or UID to use when running the image. | `USER node`                             |
| `HEALTHCHECK`      | Defines a command to check the container's health. | `HEALTHCHECK CMD curl -f http://localhost/ || exit 1` |
| `ONBUILD`          | Adds instructions that will be executed when the image is used as a base image. | `ONBUILD COPY . /app/src`    |
| `STOPSIGNAL`       | Sets the system call signal to stop the container. | `STOPSIGNAL SIGTERM`                    |
| `SHELL`            | Overrides the default shell used for executing commands. | `SHELL ["/bin/bash", "-c"]`         |
| `ADD`              | Similar to `COPY`, but also allows extracting compressed files. | `ADD myapp.tar.gz /opt`        |
| `ENTRYPOINT`       | Similar to `CMD`, but cannot be overridden by `docker run` arguments. | `ENTRYPOINT ["node", "app.js"]`  |
| `WORKDIR`          | Sets the working directory inside the container. | `WORKDIR /app`                           |
| `COPY`             | Copies files and directories from the host to the image. | `COPY app.js /app/`                   |
| `EXPOSE`           | Informs Docker that the container will listen on specified ports at runtime. | `EXPOSE 80`                |
| `CMD`              | Specifies the default command to run when the container starts. | `CMD ["node", "app.js"]`       |
| `ENTRYPOINT`       | Sets the primary command that cannot be overridden when running the container. | `ENTRYPOINT ["npm", "start"]` |
| `ENV`              | Sets environment variables within the container. | `ENV NODE_ENV=production`               |
| `LABEL`            | Adds metadata labels to the image for documentation and labeling. | `LABEL version="1.0"`               |
| `ARG`              | Defines build-time variables that can be passed to the builder. | `ARG MY_VAR=default_value`         |
| `VOLUME`           | Creates a mount point and marks it for external volumes. | `VOLUME ["/data"]`               |
| `USER`             | Sets the user or UID to use when running the image. | `USER node`                             |
| `HEALTHCHECK`      | Defines a command to check the container's health. | `HEALTHCHECK CMD curl -f http://localhost/ || exit 1` |
| `ONBUILD`          | Adds instructions that will be executed when the image is used as a base image. | `ONBUILD COPY . /app/src`    |
| `STOPSIGNAL`       | Sets the system call signal to stop the container. | `STOPSIGNAL SIGTERM`                    |
| `SHELL`            | Overrides the default shell used for executing commands. | `SHELL ["/bin/bash", "-c"]`         |

## The `docker build` command

### Docker Build Command
The docker build command is used to build Docker images. It takes as input a Dockerfile and a context (usually a directory containing files and subdirectories needed for the build) and produces a Docker image.

Syntax:
```shell
docker build [OPTIONS] PATH | URL | -
```

### Flags and Options:
Here are some of the commonly used flags and options with the docker build command:

**-f, --file file :** Specify the Dockerfile name (default is 'Dockerfile').

**--build-arg key=value :** Set build-time variables that can be accessed in the Dockerfile.

**--cache-from image-name :** Use images from a previous build as a cache source.

**--disable-content-trust :** Skip image verification (not recommended for production).

**--label key=value :** Add metadata to the image as key-value pairs.

**--no-cache :** Do not use the cache during the build process.

**--pull :** Always attempt to pull a newer version of the base image.

**-q, --quiet :** Suppress the build output and only show the final image ID.

**--rm :** Remove intermediate containers after a successful build.

**-t, --tag name:tag :** Name and optionally tag the output image (e.g., myimage:1.0).

**--target stage-name :** Build a specific build stage defined in the Dockerfile.

### Example Usage:
Build an image from the Dockerfile in the current directory with the tag myimage:1.0:

```shell
docker build -t myimage:1.0 .
```
Build an image, disabling content trust verification:

```shell
docker build --disable-content-trust -t myimage:1.0 .
```

Build an image using build-time variables:

```shell
docker build --build-arg HTTP_PROXY=http://proxy.example.com -t myimage:1.0 .
```

Build an image from a specific Dockerfile:

```shell
docker build -f Dockerfile.dev -t myimage:dev .
```
Build an image and remove intermediate containers:

```shell
docker build --rm -t myimage:1.0 .
```

Build an image and specify a target build stage:

```shell
docker build --target my-stage -t myimage:1.0 .
```

These are some of the essential flags and options you can use with the docker build command to customize the image-building process to your requirements. The resulting image can then be run using the docker run command.

## Docker Compose: Simplifying Multi-Container Docker Applications
Docker Compose is a tool for defining and running multi-container Docker applications. It allows you to describe the services, networks, and volumes for your application in a single, easy-to-read Compose file, and then use a single command to start and run your entire application stack. Docker Compose simplifies the process of orchestrating multiple Docker containers that work together to provide a complete application.

### What is Docker Compose?
Docker Compose provides a way to define and manage a multi-container Docker application as a single unit. It is particularly useful for applications that consist of multiple interconnected containers, such as web applications with databases, microservices architectures, or development environments with various services.

### How Docker Compose Works:
Here's an overview of how Docker Compose works:

**Compose File:** You define your application's services, networks, and volumes in a YAML file called a "Compose file." This file typically includes information about the containers you want to run, their configuration, dependencies, and how they should communicate with each other.

**Service Definitions:** In the Compose file, you specify the services that make up your application. Each service is defined as a separate container. For example, you might define services for a web application, a database, and a caching server.

**Networking:** Docker Compose automatically creates a network for your application, allowing containers to communicate with each other using service names as hostnames. This simplifies the process of connecting containers and ensures they can find each other by name.

**Volume Management:** Docker Compose allows you to define named volumes, which provide persistent storage for your containers. These volumes can be shared among containers, allowing data to persist even when containers are stopped or removed.

**Configuration and Environment Variables:** You can specify environment variables, ports, and other configuration options in the Compose file, making it easy to customize container behavior.

**Single Command:** With a Compose file in place, you can start and manage your entire application stack using a single command: docker-compose up. Docker Compose will create and start the necessary containers, networks, and volumes based on your configuration.

**Orchestration:** Docker Compose also provides options for scaling services, running containers in the background, stopping and removing containers, and viewing logs and status information.

### Use Cases for Docker Compose:
Docker Compose is especially useful in the following scenarios:

**Development Environments:** Create development environments with multiple services, such as web servers, databases, and caching layers, to mirror your production setup.

**Microservices:** Define and manage a suite of microservices that work together to build a larger application.

**Testing and Continuous Integration:** Use Docker Compose to set up isolated testing environments with dependencies, ensuring consistent testing across different stages of development.

**Demonstrations and Training:** Share complex applications with others by providing a Compose file that allows them to run your application stack easily.

**Prototyping:** Quickly prototype and experiment with new application ideas using predefined containers and configurations.

In summary, Docker Compose simplifies the management of multi-container Docker applications, making it easier to define, run, and orchestrate complex application stacks. It streamlines development, testing, and deployment processes by providing a unified configuration file and a single command to manage your entire application.

## Writing Docker Compose Files: A Comprehensive Guide

Docker Compose is a powerful tool for defining and running multi-container Docker applications. It allows you to specify the configuration of your entire application stack in a single, easy-to-read YAML file called a "Compose file." In this guide, we'll walk you through the process of writing Docker Compose files and provide examples along the way.

### 1. Basic Structure of a Compose File
#### Version
Every Compose file starts with a version declaration. This indicates the format version of the Compose file. For example:

```yaml
version: '3.8'
```

Choose the version that corresponds to your Docker Compose installation. The version you select may affect which features and options are available.

#### Services
The services section is where you define the containers that make up your application. Each service has its own configuration, including the image to use, ports to expose, environment variables, and more.

#### Networks
In the networks section, you can define custom networks for your services to connect to. Docker Compose automatically creates a default network for your application, but you can create additional custom networks for more complex setups.

#### Volumes
The volumes section allows you to define named volumes and specify where they should be mounted within your containers. Volumes provide a way to persist data and share it among containers.

Now, let's dive deeper into each aspect of a Compose file.

### 2. Defining Services
#### Service Name
Each service is identified by a name, which you specify under the services section. For example:

```yaml
services:
  web_app:
    # Service configuration goes here
```

#### Image
Specify the Docker image to use for the service. You can use official images from Docker Hub or custom images you've built. Example:

```yaml
services:
  web_app:
    image: nginx:latest
```

#### Ports
You can expose ports on the container and map them to ports on the host. This allows you to access services running in containers from your host machine. Example:

```yaml
services:
  web_app:
    image: nginx:latest
    ports:
      - "8080:80"
```

#### Environment Variables
Set environment variables for your containers using the environment section. Example:

```yaml
services:
  web_app:
    image: myapp:latest
    environment:
      DB_HOST: database
      DB_PORT: 5432
```

#### Volumes
Define volumes to provide persistent storage for your services. You can use named volumes or bind mounts. Example:

```yaml
services:
  database:
    image: postgres:latest
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

#### Dependencies
Specify dependencies between services using the depends_on option. It ensures that one service starts only after the specified services are up and running. Example:

```yaml
services:
  web_app:
    image: myapp:latest
    depends_on:
      - database
```

#### 3. Networking
#### Default Network

By default, Docker Compose creates a network for your application, and containers can communicate using service names as hostnames. You don't need to explicitly define this network; it's created automatically.

#### Custom Networks
You can define custom networks for more complex setups, especially when you want fine-grained control over how containers connect. Example:

```yaml
services:
  web_app:
    image: myapp:latest
    networks:
      - frontend
      - backend

networks:
  frontend:
  backend:
```

### 4. Volume Management
#### Named Volumes
Use named volumes to provide persistent storage for containers. You define them in the volumes section and then reference them in your service configurations. Example:

```yaml
services:
  database:
    image: postgres:latest
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

#### Bind Mounts
Bind mounts allow you to mount a directory from the host into a container. They're useful for development and testing. Example:

```yaml
services:
  web_app:
    image: myapp:latest
    volumes:
      - ./app:/app
```

### 5. Working with Multiple Compose Files
Compose files can be extended to reuse common configurations. You can specify a base Compose file and then extend it with additional services or configurations in other files.

Example of a base Compose file (docker-compose.yml):

```yaml
version: '3.8'

services:
  database:
    image: postgres:latest
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

Example of an extended Compose file:

```yaml
version: '3.8'

services:
  web_app:
    image: myapp:latest
    depends_on:
      - database

include:
  - docker-compose.base.yml
```

### 6. Environment Variables and Secrets
You can set environment variables in your Compose file. Additionally, Docker Compose supports managing secrets, which are more secure and suitable for sensitive data.

### 7. Healthchecks
Specify healthchecks for your services to monitor container health and ensure they are working correctly.

### 8. Scaling Services
Use Docker Compose to scale services up or down to handle varying workloads. The docker-compose up --scale command allows you to specify the number of containers to run for a particular service.

### 9. Orchestration
For more complex orchestration and scaling, consider using Docker Compose in conjunction with Docker Swarm or Kubernetes.

### 10. Running Docker Compose
To run your Docker Compose application, use the `docker-compose up` command in the directory containing your Compose file. You can also use options like `-d` to run containers in the background and `--build` to rebuild images.

### 11. Common Use Cases
#### Web Application with a Database
```yaml
version: '3.8'

services:
  web_app:
    image: myapp:latest
    ports:
      - "80:80"
    depends_on:
      - database
  database:
    image: postgres:latest
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

#### Microservices Architecture
```yaml
version: '3.8'

services:
  service1:
    image: service1:latest
  service2:
    image: service2:latest
    depends_on:
      - service1
```

#### Development Environments

```yaml
version: '3.8'

services:
  web_app:
    image: myapp:latest
    volumes:
      - ./app:/app
    ports:
      - "80:80"
```
### 12. Best Practices and Tips
- Keep your Compose file organized and well-documented.
- Use named volumes and bind mounts for data persistence.
- Avoid hardcoding values; use environment variables.
- Test your Compose configurations thoroughly.
- Regularly update your Docker images.

With this guide, you should be well-equipped to write Docker Compose files for your applications, whether they are simple web services or complex microservices architectures. Docker Compose simplifies the process of defining, running, and managing multi-container Docker applications, making it an invaluable tool for containerized development and deployment.
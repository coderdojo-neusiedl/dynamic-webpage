# This Dockerfile uses multiple stages. For further information visit https://docs.docker.com/develop/develop-images/multistage-build/.

# Use the official nodejs image as a parent image for building the application.
FROM node:current-slim AS builder

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY . .

# Run the command inside your builder image filesystem.
RUN npm install
RUN npx grunt

# Use the official nodejs image as a parent image
FROM node:current-slim 

# Set the working directory.
WORKDIR /usr/src/app

# Install dependencies required to run the application
COPY package.json .
RUN npm --production install

# Copy build artifacts
COPY --from=builder /usr/src/app/webroot/ ./webroot/
COPY --from=builder /usr/src/app/src/ ./src/
COPY --from=builder /usr/src/app/startWebserver.sh .

# Create folder for TingoDb database
RUN mkdir /usr/src/app/database

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 8080

# Set executable to run on container start.
ENTRYPOINT ["./startWebserver.sh"]

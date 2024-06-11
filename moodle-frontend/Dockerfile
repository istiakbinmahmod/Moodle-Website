# Stage 1: Build react client

# Use an official Node.js runtime as a parent image
FROM node:16.15.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
RUN ls

# Expose the port that your app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]

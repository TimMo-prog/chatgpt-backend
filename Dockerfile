# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Make port 5000 available to the world outside this container (or whatever port your backend runs on)
EXPOSE 5000

# Run the app when the container launches
CMD ["node", "server.js"]  # Replace server.js with your entry point if different

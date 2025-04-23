# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Expose TCP port used by your server
EXPOSE 3699

# Start the server
CMD ["node", "server.js"]

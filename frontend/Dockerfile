
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json first (for caching benefits)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory (including src)
COPY . .

# Set environment variables for React app
ENV NODE_ENV=development

ENV WDS_SOCKET_PORT=0

# Expose the port that React runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
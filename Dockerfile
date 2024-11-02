# STAGE 1 - Build the application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# STAGE 2 - Production image
FROM node:20-slim

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy only the necessary files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the built application and Prisma client from the build stage
COPY --from=build /app ./

# Ensure Prisma client is available in production
RUN npx prisma generate

# Expose the port
EXPOSE 3000

# Command to run the wait script, run Prisma migrations, and start the application
CMD ["sh", "-c", "npx prisma db push && HOST=0.0.0.0 npm run start"]


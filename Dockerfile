FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy the rest of the application
COPY . .

# Build the frontend (Vite)
RUN cd frontend && npm run build

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server (which also serves the frontend dist)
WORKDIR /app/backend
CMD ["node", "server.js"]

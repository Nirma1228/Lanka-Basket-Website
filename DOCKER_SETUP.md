# Docker Setup Guide - Lanka Basket Website

This guide walks you through setting up Docker for local development and production deployment.

## Phase 1: Docker Setup

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows
- Basic understanding of Docker concepts

### Step 1: Backend Dockerfile

The backend uses Node.js 18 Alpine for a lightweight production image.

**Location:** `server/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

**Test it individually:**
```bash
cd server
docker build -t lanka-basket-backend .
docker run -p 5000:5000 lanka-basket-backend
```

### Step 2: Frontend Dockerfile

The frontend uses a multi-stage build: Node.js for building, Nginx for serving.

**Location:** `client/Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Test it individually:**
```bash
cd client
docker build -t lanka-basket-frontend .
docker run -p 3000:80 lanka-basket-frontend
```

### Step 3: Nginx Configuration

**Location:** `client/nginx.conf`

This configuration:
- Serves the React app
- Handles client-side routing
- Proxies API requests to the backend

### Step 4: Docker Compose

Run all services together with `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./server
    container_name: backend
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://admin:password@mongodb:27017/lankabasket?authSource=admin
      JWT_SECRET: your_jwt_secret
    depends_on:
      - mongodb

  frontend:
    build: ./client
    container_name: frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

### Running the Full Stack

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **MongoDB:** mongodb://admin:password@localhost:27017

### Troubleshooting

**Build fails?**
```bash
# Clean up and rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build
```

**Can't connect to backend?**
- Check if backend container is running: `docker ps`
- Check logs: `docker-compose logs backend`
- Verify environment variables in docker-compose.yml

**MongoDB connection issues?**
- Ensure MongoDB is running: `docker-compose ps mongodb`
- Check connection string format
- Verify credentials match docker-compose.yml

### Next Steps

✅ **Completed:** Docker setup  
⬜ **Next:** [Kubernetes Setup](KUBERNETES_SETUP.md)  
⬜ **Then:** [CI/CD Pipeline](CI-CD-SETUP-GUIDE.md)

### Docker Hub Setup

Before CI/CD, push your images to Docker Hub:

1. Create account at [Docker Hub](https://hub.docker.com/)
2. Login locally:
   ```bash
   docker login
   ```
3. Tag images:
   ```bash
   docker tag lanka-basket-backend your-username/lanka-basket-backend:latest
   docker tag lanka-basket-frontend your-username/lanka-basket-frontend:latest
   ```
4. Push images:
   ```bash
   docker push your-username/lanka-basket-backend:latest
   docker push your-username/lanka-basket-frontend:latest
   ```

## Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

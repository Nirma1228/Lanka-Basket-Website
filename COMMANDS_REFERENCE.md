# Docker, Kubernetes & CI/CD - Quick Command Reference

Quick reference for all Docker, Kubernetes, and CI/CD commands.

## 🐳 Docker Commands

### Basic Docker Commands
```bash
# Build an image
docker build -t image-name .

# Run a container
docker run -p 3000:80 image-name

# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop container-id

# Remove a container
docker rm container-id

# List images
docker images

# Remove an image
docker rmi image-id

# View container logs
docker logs container-id

# Execute command in running container
docker exec -it container-id sh
```

### Docker Compose Commands
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Build and start
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Restart a service
docker-compose restart service-name

# List running services
docker-compose ps
```

### Docker Cleanup
```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove everything (careful!)
docker system prune -a

# See disk usage
docker system df
```

### Docker Hub
```bash
# Login to Docker Hub
docker login

# Tag an image
docker tag local-image:tag username/repo:tag

# Push to Docker Hub
docker push username/repo:tag

# Pull from Docker Hub
docker pull username/repo:tag
```

---

## ☸️ Kubernetes Commands

### Cluster Management
```bash
# Start Minikube
minikube start

# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete

# Check cluster status
minikube status
kubectl cluster-info

# Get cluster nodes
kubectl get nodes
```

### Application Deployment
```bash
# Apply a manifest
kubectl apply -f file.yaml

# Apply all manifests in directory
kubectl apply -f k8s/

# Delete resources
kubectl delete -f file.yaml

# Delete all resources in namespace
kubectl delete all --all
```

### Viewing Resources
```bash
# Get all resources
kubectl get all

# Get pods
kubectl get pods

# Get detailed pod info
kubectl get pods -o wide

# Watch pods in real-time
kubectl get pods -w

# Get services
kubectl get services

# Get deployments
kubectl get deployments

# Get secrets
kubectl get secrets

# Describe a resource
kubectl describe pod pod-name
kubectl describe service service-name
```

### Logs and Debugging
```bash
# View pod logs
kubectl logs pod-name

# Follow logs (like tail -f)
kubectl logs -f pod-name

# View previous container logs
kubectl logs pod-name --previous

# Execute command in pod
kubectl exec -it pod-name -- sh
kubectl exec -it pod-name -- bash

# Port forward to local machine
kubectl port-forward pod-name 8080:80
kubectl port-forward service/frontend 3000:80
```

### Scaling and Updates
```bash
# Scale deployment
kubectl scale deployment backend --replicas=3

# Auto-scale based on CPU
kubectl autoscale deployment backend --min=2 --max=10 --cpu-percent=80

# Update image
kubectl set image deployment/backend backend=new-image:tag

# Rollout status
kubectl rollout status deployment/backend

# Rollout history
kubectl rollout history deployment/backend

# Rollback to previous version
kubectl rollout undo deployment/backend

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2

# Restart deployment
kubectl rollout restart deployment/backend
```

### Minikube Specific
```bash
# Access service
minikube service frontend

# Get service URL
minikube service frontend --url

# Open dashboard
minikube dashboard

# SSH into Minikube
minikube ssh

# Get Minikube IP
minikube ip

# Enable addon
minikube addons enable dashboard
minikube addons enable metrics-server

# List addons
minikube addons list
```

### Troubleshooting
```bash
# Get events
kubectl get events --sort-by=.metadata.creationTimestamp

# Check pod status
kubectl get pods --all-namespaces

# Describe failing pod
kubectl describe pod failing-pod-name

# Check resource usage
kubectl top nodes
kubectl top pods

# Get pod YAML
kubectl get pod pod-name -o yaml

# Edit deployment
kubectl edit deployment backend
```

---

## 🔄 CI/CD with GitHub Actions

### GitHub Commands
```bash
# Push to trigger pipeline
git add .
git commit -m "Trigger CI/CD"
git push origin main

# Create new branch
git checkout -b feature-branch

# Push branch
git push origin feature-branch

# View remote
git remote -v
```

### Checking Pipeline Status
1. Go to GitHub repository
2. Click **Actions** tab
3. View workflow runs

### Secrets Management
1. Go to repository **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret**

Required secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

---

## 🚀 Complete Workflow Commands

### First Time Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/Lanka-Basket-Website.git
cd Lanka-Basket-Website

# 2. Test with Docker Compose
docker-compose up --build

# 3. Set up Kubernetes
minikube start
kubectl apply -f k8s/

# 4. Access application
minikube service frontend

# 5. Push to GitHub (triggers CI/CD)
git add .
git commit -m "Initial setup"
git push origin main
```

### Daily Development Workflow
```bash
# 1. Make code changes
# Edit files...

# 2. Test locally
docker-compose up --build

# 3. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 4. Update Kubernetes deployment
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend
```

### Update Application in Kubernetes
```bash
# Method 1: Restart (pulls latest image)
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

# Method 2: Delete and recreate
kubectl delete -f k8s/
kubectl apply -f k8s/

# Method 3: Update specific image
kubectl set image deployment/backend backend=username/lanka-basket-backend:v2
```

---

## 🧪 Testing Commands

### Backend Tests
```bash
cd server
npm install
npm test
```

### Frontend Tests
```bash
cd client
npm install
npm test
```

### Build Frontend
```bash
cd client
npm run build
```

---

## 🔧 Environment Variables

### Docker Compose
Edit `docker-compose.yml`:
```yaml
environment:
  MONGO_URI: mongodb://admin:password@mongodb:27017/lankabasket?authSource=admin
  JWT_SECRET: your_jwt_secret
```

### Kubernetes
Edit `k8s/secrets.yaml`:
```yaml
stringData:
  MONGO_URI: "your-mongo-uri"
  JWT_SECRET: "your-jwt-secret"
```

Apply secrets:
```bash
kubectl apply -f k8s/secrets.yaml
```

---

## 📊 Monitoring Commands

### Docker Stats
```bash
# Real-time container stats
docker stats

# Specific container
docker stats container-name
```

### Kubernetes Stats
```bash
# Node resources
kubectl top nodes

# Pod resources
kubectl top pods

# All pods with CPU/Memory
kubectl top pods --all-namespaces
```

---

## 🧹 Cleanup Commands

### Clean Docker
```bash
# Stop everything
docker-compose down -v

# Remove all containers, images, volumes
docker system prune -a --volumes

# Clean build cache
docker builder prune
```

### Clean Kubernetes
```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete specific resources
kubectl delete deployment backend frontend
kubectl delete service backend frontend
kubectl delete secret backend-secrets

# Stop Minikube
minikube stop

# Delete Minikube
minikube delete
```

---

## 🐛 Common Issues & Fixes

### Docker Build Fails
```bash
# Clean cache and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

### Kubernetes Pods Not Starting
```bash
# Check pod status
kubectl get pods
kubectl describe pod pod-name

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp

# Restart deployment
kubectl rollout restart deployment/backend
```

### Can't Access Application
```bash
# Check services
kubectl get services

# Port forward for testing
kubectl port-forward service/frontend 3000:80

# Access via Minikube
minikube service frontend
```

### Image Pull Errors
```bash
# Verify image exists on Docker Hub
docker pull username/lanka-basket-backend:latest

# Update deployment with correct image
kubectl set image deployment/backend backend=username/lanka-basket-backend:latest
```

---

## 📝 Useful Aliases

Add to your `.bashrc` or `.bash_profile`:

```bash
# Docker aliases
alias dc='docker-compose'
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'

# Kubernetes aliases
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kl='kubectl logs -f'
alias kex='kubectl exec -it'
alias kdel='kubectl delete'
alias kapp='kubectl apply -f'

# Minikube aliases
alias mk='minikube'
alias mks='minikube start'
alias mkst='minikube stop'
alias mksvc='minikube service'
```

Reload shell:
```bash
source ~/.bashrc
# or
source ~/.bash_profile
```

---

## 🔗 Quick Links

- [Docker Hub](https://hub.docker.com/)
- [Kubernetes Dashboard](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)
- [GitHub Actions](https://github.com/your-username/Lanka-Basket-Website/actions)

---

## 📚 Reference Guides

- **[Docker Setup Guide](DOCKER_SETUP.md)** - Complete Docker tutorial
- **[Kubernetes Setup Guide](KUBERNETES_SETUP.md)** - Complete Kubernetes tutorial
- **[GitHub Actions Guide](GITHUB_ACTIONS_GUIDE.md)** - Complete CI/CD tutorial
- **[DevOps Learning Path](DEVOPS_LEARNING_PATH.md)** - Full learning journey

---

**Pro Tip:** Bookmark this page for quick reference! 🔖

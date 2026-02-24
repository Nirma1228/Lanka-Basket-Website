# Complete DevOps Learning Path - Lanka Basket Website

A comprehensive guide to containerize, orchestrate, and deploy your e-commerce application using Docker, Kubernetes, and CI/CD.

## 🎯 What You'll Build

By the end of this guide, you'll have:
- ✅ Containerized application with Docker
- ✅ Multi-stage builds for optimized images
- ✅ Local orchestration with Docker Compose
- ✅ Kubernetes deployment on Minikube
- ✅ Automated CI/CD pipeline with GitHub Actions
- ✅ Images automatically pushed to Docker Hub
- ✅ Production-ready deployment setup

## 📚 The Complete Learning Path

Follow these guides in order:

### Phase 1: Docker (Estimated time: 2-3 hours)
**Goal:** Containerize your application for consistent environments

📖 **[Docker Setup Guide](DOCKER_SETUP.md)**

**What you'll learn:**
- Creating production-ready Dockerfiles
- Multi-stage builds for smaller images
- Docker Compose for local development
- Networking between containers
- Volume management
- Environment variables and secrets

**Milestones:**
1. ✅ Build backend Docker image
2. ✅ Build frontend Docker image with Nginx
3. ✅ Run full stack with docker-compose
4. ✅ Access app at http://localhost:3000

**Commands to try:**
```bash
# Build and run everything
docker-compose up --build

# Your app is now running!
```

---

### Phase 2: Kubernetes (Estimated time: 3-4 hours)
**Goal:** Orchestrate containers for scalability and reliability

📖 **[Kubernetes Setup Guide](KUBERNETES_SETUP.md)**

**What you'll learn:**
- Kubernetes architecture (Pods, Services, Deployments)
- kubectl commands and operations
- Deployments and ReplicaSets
- Services and networking
- Secrets and ConfigMaps
- Scaling applications
- Rolling updates and rollbacks

**Milestones:**
1. ✅ Install Minikube and kubectl
2. ✅ Deploy backend to Kubernetes
3. ✅ Deploy frontend to Kubernetes
4. ✅ Scale to multiple replicas
5. ✅ Access app through Minikube service

**Commands to try:**
```bash
# Start Kubernetes
minikube start

# Deploy everything
kubectl apply -f k8s/

# Access your app
minikube service frontend

# Scale your backend
kubectl scale deployment backend --replicas=3
```

---

### Phase 3: CI/CD Pipeline (Estimated time: 2-3 hours)
**Goal:** Automate build, test, and deployment processes

📖 **[GitHub Actions Guide](GITHUB_ACTIONS_GUIDE.md)**

**What you'll learn:**
- GitHub Actions workflow syntax
- Automated testing
- Docker image building and pushing
- Environment secrets management
- Continuous Integration best practices
- Deployment automation

**Milestones:**
1. ✅ Create Docker Hub account
2. ✅ Set up GitHub secrets
3. ✅ Push code and watch pipeline run
4. ✅ Images automatically pushed to Docker Hub
5. ✅ Deploy updated images to Kubernetes

**Commands to try:**
```bash
# Trigger the pipeline
git add .
git commit -m "Initial CI/CD setup"
git push origin main

# Watch the magic happen on GitHub Actions!
```

---

## 🚀 Quick Start

### Option 1: Just Docker (Simplest)
```bash
docker-compose up --build
```
Access at: http://localhost:3000

### Option 2: Kubernetes (Recommended for learning)
```bash
# Start Minikube
minikube start

# Deploy
kubectl apply -f k8s/

# Access
minikube service frontend
```

### Option 3: Full CI/CD (Production-like)
1. Set up GitHub secrets
2. Push to GitHub
3. Watch automatic deployment

---

## 📁 Project Structure

```
Lanka-Basket-Website/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── client/
│   ├── Dockerfile             # Frontend production build
│   ├── nginx.conf             # Nginx configuration
│   └── ...                    # React application
├── server/
│   ├── Dockerfile             # Backend production build
│   └── ...                    # Node.js application
├── k8s/
│   ├── backend-deployment.yaml    # Backend K8s manifest
│   ├── frontend-deployment.yaml   # Frontend K8s manifest
│   └── secrets.yaml               # Secrets configuration
├── docker-compose.yml         # Local development
├── DOCKER_SETUP.md           # Phase 1 guide
├── KUBERNETES_SETUP.md       # Phase 2 guide
└── GITHUB_ACTIONS_GUIDE.md   # Phase 3 guide
```

---

## 🔧 Configuration Checklist

### Before You Start

- [ ] Install Docker Desktop
- [ ] Install Minikube
- [ ] Install kubectl
- [ ] Create Docker Hub account
- [ ] Create GitHub account
- [ ] Clone this repository

### Docker Setup

- [ ] Review `server/Dockerfile`
- [ ] Review `client/Dockerfile`
- [ ] Review `client/nginx.conf`
- [ ] Update environment variables in `docker-compose.yml`
- [ ] Build and run: `docker-compose up`

### Kubernetes Setup

- [ ] Update image names in `k8s/backend-deployment.yaml`
- [ ] Update image names in `k8s/frontend-deployment.yaml`
- [ ] Add your secrets to `k8s/secrets.yaml`
- [ ] Start Minikube: `minikube start`
- [ ] Deploy: `kubectl apply -f k8s/`

### CI/CD Setup

- [ ] Add `DOCKERHUB_USERNAME` to GitHub secrets
- [ ] Add `DOCKERHUB_TOKEN` to GitHub secrets
- [ ] Update image names in K8s manifests
- [ ] Push to GitHub: `git push origin main`
- [ ] Verify pipeline runs successfully

---

## 🎓 Learning Objectives

### Docker
- Understand containerization concepts
- Write efficient Dockerfiles
- Use multi-stage builds
- Manage container networking
- Use Docker Compose for multi-container apps

### Kubernetes
- Understand K8s architecture
- Deploy applications to K8s
- Manage pods, services, and deployments
- Scale applications horizontally
- Perform rolling updates
- Handle secrets and config

### CI/CD
- Automate build processes
- Implement continuous integration
- Push images to registries
- Deploy to Kubernetes automatically
- Handle environment secrets

---

## 🔍 Key Concepts Explained

### Why Docker?
- **Consistency:** Same environment everywhere (dev, test, prod)
- **Isolation:** Each service runs independently
- **Portability:** Run anywhere Docker is installed
- **Efficiency:** Lightweight compared to VMs

### Why Kubernetes?
- **Scalability:** Easy to scale up/down
- **Self-healing:** Restarts failed containers
- **Load balancing:** Distributes traffic automatically
- **Rolling updates:** Zero-downtime deployments
- **Service discovery:** Containers find each other automatically

### Why CI/CD?
- **Automation:** No manual deployment steps
- **Consistency:** Same process every time
- **Speed:** Deploy in minutes, not hours
- **Quality:** Automated testing catches bugs early
- **Rollback:** Easy to revert if something breaks

---

## 📊 Architecture Overview

```
Developer → GitHub → GitHub Actions → Docker Hub → Kubernetes → Users
    ↓          ↓            ↓              ↓           ↓
  Code      Trigger     Build/Test      Store     Deploy
           Pipeline     Images         Images     & Run
```

### Local Development Flow
```
Code Change → docker-compose up → Test locally → Push to GitHub
```

### Production Deployment Flow
```
Push to GitHub → GitHub Actions triggers
    ↓
  Run tests
    ↓
  Build Docker images
    ↓
  Push to Docker Hub
    ↓
  Deploy to Kubernetes (optional automation)
    ↓
  Application live!
```

---

## 📈 Scaling Your Application

### Horizontal Scaling (Add more pods)
```bash
# Scale backend to 5 replicas
kubectl scale deployment backend --replicas=5

# Auto-scale based on CPU
kubectl autoscale deployment backend --min=2 --max=10 --cpu-percent=80
```

### Vertical Scaling (More resources per pod)
Update deployment YAML:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# Clean everything and start fresh
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Kubernetes Issues
```bash
# Check pod status
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# Restart deployment
kubectl rollout restart deployment/backend

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

### CI/CD Issues
- Check GitHub Actions logs
- Verify secrets are set correctly
- Ensure Dockerfiles are in correct locations
- Check Docker Hub for pushed images

---

## 🌟 Best Practices

### Docker
- ✅ Use specific version tags (not `latest` in production)
- ✅ Use `.dockerignore` to exclude unnecessary files
- ✅ Multi-stage builds for smaller images
- ✅ Don't run as root user
- ✅ Minimize layers in Dockerfile

### Kubernetes
- ✅ Set resource limits and requests
- ✅ Use health checks (liveness/readiness probes)
- ✅ Use namespaces to organize resources
- ✅ Store secrets securely (not in Git)
- ✅ Use labels for organization

### CI/CD
- ✅ Run tests before building images
- ✅ Use semantic versioning for tags
- ✅ Implement rollback mechanisms
- ✅ Monitor pipeline failures
- ✅ Keep secrets secure

---

## 🚢 Deployment Options

### Free/Cheap Options
1. **Render** - Easiest, free tier available
2. **Railway** - Free credits, simple setup
3. **Fly.io** - Free tier, great for Docker
4. **Heroku** - Classic PaaS (has free tier limitations)

### Cloud Kubernetes (Recommended for production)
1. **Google GKE** - $300 free credits
2. **Azure AKS** - $200 free credits
3. **AWS EKS** - Most popular, pay-as-you-go
4. **DigitalOcean** - Simple, affordable

### Self-Hosted
1. **Your own servers** - Full control
2. **VPS providers** - Cheap, manual setup

---

## 📚 Additional Resources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/actions)

### Learning
- [Docker Tutorial](https://docker-curriculum.com/)
- [Kubernetes Tutorial](https://kubernetes.io/docs/tutorials/)
- [Play with Docker](https://labs.play-with-docker.com/)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)

### Tools
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Minikube](https://minikube.sigs.k8s.io/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Lens](https://k8slens.dev/) - Kubernetes IDE

---

## 🎉 Congratulations!

You've completed the DevOps learning path! You now understand:
- Containerization with Docker
- Orchestration with Kubernetes
- Automation with CI/CD

### What's Next?

**Level Up:**
- Add monitoring (Prometheus + Grafana)
- Implement logging (ELK stack)
- Set up service mesh (Istio)
- Add database backups
- Configure SSL/TLS
- Implement blue-green deployments

**Get Hired:**
- Add this project to your portfolio
- Write a blog post about your journey
- Share on LinkedIn
- Contribute to open-source DevOps projects
- Study for Kubernetes certifications (CKA, CKAD)

---

## 💬 Need Help?

- Check troubleshooting sections in each guide
- Review error logs carefully
- Search for error messages on Stack Overflow
- Join Kubernetes Slack community
- Review GitHub Actions logs

---

**Happy Learning! 🚀**

Remember: DevOps is a journey, not a destination. Keep learning, keep building, and keep automating!

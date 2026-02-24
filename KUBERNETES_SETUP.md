# Kubernetes Setup Guide - Lanka Basket Website

This guide walks you through deploying your application to Kubernetes using Minikube locally.

## Phase 2: Kubernetes Deployment

### Prerequisites
- Complete [Docker Setup](DOCKER_SETUP.md) first
- Install [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- Install [kubectl](https://kubernetes.io/docs/tasks/tools/)

### Install Minikube (Windows)

```powershell
# Using Chocolatey
choco install minikube

# Or download installer from https://minikube.sigs.k8s.io/docs/start/
```

### Install kubectl (Windows)

```powershell
# Using Chocolatey
choco install kubernetes-cli

# Verify installation
kubectl version --client
```

### Step 1: Start Minikube

```bash
# Start Minikube with Docker driver
minikube start

# Verify it's running
minikube status

# Enable metrics (optional)
minikube addons enable metrics-server
```

### Step 2: Kubernetes Manifests

Your Kubernetes configuration is in the `k8s/` folder:

#### Backend Deployment (`k8s/backend-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-dockerhub-username/lanka-basket-backend:latest
        ports:
        - containerPort: 5000
        envFrom:
        - secretRef:
            name: backend-secrets
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - port: 5000
    targetPort: 5000
```

#### Frontend Deployment (`k8s/frontend-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-dockerhub-username/lanka-basket-frontend:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
```

#### Secrets (`k8s/secrets.yaml`)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
type: Opaque
stringData:
  MONGO_URI: "your-mongo-uri"
  JWT_SECRET: "your-jwt-secret"
  # Add other environment variables
```

### Step 3: Update Configuration

Before deploying, update the image names in the deployment files:

```bash
# Replace 'your-dockerhub-username' with your actual Docker Hub username
# In k8s/backend-deployment.yaml
# In k8s/frontend-deployment.yaml
```

Also update `k8s/secrets.yaml` with your actual values.

### Step 4: Deploy to Kubernetes

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Or apply them individually
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Step 5: Verify Deployment

```bash
# Check if pods are running
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# View logs for a specific pod
kubectl logs <pod-name>

# Describe a pod for more details
kubectl describe pod <pod-name>
```

### Step 6: Access the Application

```bash
# Get the frontend service URL
minikube service frontend

# Or manually get the URL
minikube service frontend --url
```

This will open your application in the browser!

### Common kubectl Commands

```bash
# Get all resources
kubectl get all

# Watch pods in real-time
kubectl get pods -w

# View pod logs
kubectl logs -f <pod-name>

# Execute command in pod
kubectl exec -it <pod-name> -- sh

# Delete a resource
kubectl delete -f k8s/backend-deployment.yaml

# Scale deployment
kubectl scale deployment backend --replicas=3

# Restart deployment
kubectl rollout restart deployment/backend

# View deployment history
kubectl rollout history deployment/backend

# Rollback to previous version
kubectl rollout undo deployment/backend
```

### Kubernetes Dashboard (Optional)

```bash
# Enable dashboard addon
minikube addons enable dashboard

# Launch dashboard
minikube dashboard
```

### Troubleshooting

**Pods not starting?**
```bash
# Check pod status
kubectl get pods

# Check detailed pod info
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

**Image pull errors?**
```bash
# Ensure images are pushed to Docker Hub
docker push your-username/lanka-basket-backend:latest
docker push your-username/lanka-basket-frontend:latest

# Update image pull policy
# In deployment YAML: imagePullPolicy: Always
```

**Service not accessible?**
```bash
# Check service endpoints
kubectl get endpoints

# Port forward for testing
kubectl port-forward service/backend 5000:5000

# Check Minikube IP
minikube ip
```

**Secrets not loading?**
```bash
# Verify secret exists
kubectl get secrets

# Check secret details
kubectl describe secret backend-secrets

# Recreate secret
kubectl delete secret backend-secrets
kubectl apply -f k8s/secrets.yaml
```

### Clean Up

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete individually
kubectl delete deployment backend frontend
kubectl delete service backend frontend
kubectl delete secret backend-secrets

# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete
```

### Production Considerations

For production deployments:

1. **Use namespaces** to organize resources
2. **Set resource limits** (CPU, Memory)
3. **Configure health checks** (liveness, readiness probes)
4. **Use ConfigMaps** for non-sensitive configuration
5. **Implement autoscaling** (HPA - Horizontal Pod Autoscaler)
6. **Set up Ingress** for proper routing
7. **Use sealed secrets** or external secret management
8. **Implement monitoring** (Prometheus, Grafana)
9. **Set up logging** (ELK stack or cloud solutions)

### Next Steps

✅ **Completed:** Docker setup  
✅ **Completed:** Kubernetes setup  
⬜ **Next:** [CI/CD Pipeline](CI-CD-SETUP-GUIDE.md)

### Cloud Kubernetes Options

Once comfortable with Minikube:

- **Azure Kubernetes Service (AKS)** - Free tier available
- **Google Kubernetes Engine (GKE)** - $300 free credits
- **Amazon EKS** - Pay per use
- **DigitalOcean Kubernetes** - Simple and affordable
- **Render** - Free tier, easy deployment
- **Railway** - Free tier with easy setup

## Learning Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Basics Tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

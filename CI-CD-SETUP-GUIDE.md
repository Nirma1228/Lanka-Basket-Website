# CI/CD Pipeline Setup Guide - Lanka Basket Website

This guide provides complete steps to set up a CI/CD pipeline using Docker and Kubernetes for the Lanka Basket e-commerce application.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Deployment](#deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This CI/CD pipeline automates:
- Code testing and linting
- Security vulnerability scanning
- Docker image building and pushing
- Kubernetes deployment
- Automatic rollback on failure
- Horizontal pod autoscaling

### Tech Stack
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Container Registry**: Docker Hub (or GitHub Container Registry)
- **Ingress Controller**: Nginx Ingress
- **Database**: MongoDB (StatefulSet)

---

## Prerequisites

### Local Machine Requirements
1. **Docker Desktop** (with Kubernetes enabled) or **Minikube**
2. **kubectl** - Kubernetes CLI
3. **Git**
4. **Node.js** (v18+ for server, v20+ for client)

### Cloud/Production Requirements
Choose one of the following Kubernetes platforms:
- **AWS EKS** (Elastic Kubernetes Service)
- **Google GKE** (Google Kubernetes Engine)
- **Azure AKS** (Azure Kubernetes Service)
- **DigitalOcean Kubernetes**
- **Self-hosted Kubernetes cluster**

### Accounts & Access
1. **Docker Hub account** (or GitHub Container Registry)
2. **GitHub account** (for CI/CD)
3. **Cloud provider account** (for hosting Kubernetes cluster)
4. **Domain name** (for production deployment)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│  (Push/PR triggers CI/CD pipeline)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions                             │
│  - Run tests                                                 │
│  - Security scanning                                         │
│  - Build Docker images                                       │
│  - Push to registry                                          │
│  - Deploy to Kubernetes                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Docker Registry                              │
│  (Docker Hub / GitHub Container Registry)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Kubernetes Cluster                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Client     │  │   Server     │  │   MongoDB    │     │
│  │  (Nginx)     │  │  (Node.js)   │  │              │     │
│  │  Replicas:2  │  │  Replicas:2  │  │  Replicas:1  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                           │                                  │
│                   ┌───────▼────────┐                        │
│                   │ Ingress (Nginx)│                        │
│                   └───────┬────────┘                        │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Users/Web    │
                    └────────────────┘
```

---

## Step-by-Step Setup

### Step 1: Set Up Docker Registry

#### Option A: Docker Hub
1. Create a Docker Hub account at https://hub.docker.com
2. Create two repositories:
   - `lanka-basket-client`
   - `lanka-basket-server`
3. Generate an access token:
   - Go to Account Settings → Security → New Access Token
   - Save the token securely

#### Option B: GitHub Container Registry
1. Enable GitHub Container Registry in your repository
2. Create a Personal Access Token with `write:packages` permission

### Step 2: Configure GitHub Secrets

Add these secrets to your GitHub repository:
- Go to: Settings → Secrets and variables → Actions → New repository secret

Required secrets:
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token
KUBE_CONFIG=<your-kubernetes-config-base64-encoded>
```

To get your kubeconfig in base64:
```bash
# On Linux/Mac
cat ~/.kube/config | base64 -w 0

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content $env:USERPROFILE\.kube\config -Raw)))
```

### Step 3: Set Up Kubernetes Cluster

#### For AWS EKS:
```bash
# Install eksctl
choco install eksctl

# Create cluster
eksctl create cluster \
  --name lanka-basket-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4 \
  --managed

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name lanka-basket-cluster
```

#### For Google GKE:
```bash
# Install gcloud CLI
# Create cluster
gcloud container clusters create lanka-basket-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --zone=us-central1-a

# Configure kubectl
gcloud container clusters get-credentials lanka-basket-cluster --zone=us-central1-a
```

#### For Azure AKS:
```bash
# Install Azure CLI
# Create resource group
az group create --name lanka-basket-rg --location eastus

# Create cluster
az aks create \
  --resource-group lanka-basket-rg \
  --name lanka-basket-cluster \
  --node-count 3 \
  --node-vm-size Standard_B2s \
  --enable-managed-identity \
  --generate-ssh-keys

# Configure kubectl
az aks get-credentials --resource-group lanka-basket-rg --name lanka-basket-cluster
```

#### For Local Development (Docker Desktop):
```bash
# Enable Kubernetes in Docker Desktop settings
# Verify
kubectl cluster-info
kubectl get nodes
```

### Step 4: Install Nginx Ingress Controller

```bash
# Using Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Or using kubectl
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Verify
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

### Step 5: Install Cert-Manager (for SSL/TLS)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt issuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Step 6: Configure Application Secrets

1. **Update secrets.yaml** with your actual values:
```bash
# Edit k8s/secrets.yaml with your actual secrets
# For production, use Sealed Secrets or external secret management

# Create the secrets
kubectl apply -f k8s/secrets.yaml
```

2. **Update configmap.yaml**:
```bash
# Edit k8s/configmap.yaml with your configuration
# Update CLIENT_URL and other non-sensitive configs

kubectl apply -f k8s/configmap.yaml
```

### Step 7: Update Deployment Configurations

1. **Update image registry** in workflow file:
   - Edit `.github/workflows/ci-cd.yml`
   - Replace `your-dockerhub-username` with your actual username

2. **Update image references** in Kubernetes manifests:
   - Edit `k8s/server-deployment.yaml`
   - Edit `k8s/client-deployment.yaml`
   - Replace `your-registry` with your actual registry

3. **Update domain** in ingress:
   - Edit `k8s/ingress.yaml`
   - Replace `your-domain.com` with your actual domain

### Step 8: Add Health Check Endpoint

Add a health check endpoint to your server:

```javascript
// Add to server/index.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});
```

### Step 9: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Add CI/CD pipeline configuration"

# Add remote and push
git remote add origin https://github.com/your-username/lanka-basket-website.git
git branch -M main
git push -u origin main
```

---

## Deployment

### Manual Deployment (First Time)

1. **Deploy namespace and configurations:**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
```

2. **Deploy MongoDB:**
```bash
kubectl apply -f k8s/mongo-deployment.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongo -n lanka-basket --timeout=300s
```

3. **Build and push images manually (first time):**
```bash
# Build server image
cd server
docker build -t your-dockerhub-username/lanka-basket-server:latest -f Dockerfile.prod .
docker push your-dockerhub-username/lanka-basket-server:latest

# Build client image
cd ../client
docker build -t your-dockerhub-username/lanka-basket-client:latest -f Dockerfile.prod .
docker push your-dockerhub-username/lanka-basket-client:latest
```

4. **Deploy applications:**
```bash
cd ..
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml

# Wait for deployments
kubectl rollout status deployment/server -n lanka-basket
kubectl rollout status deployment/client -n lanka-basket
```

5. **Deploy ingress:**
```bash
kubectl apply -f k8s/ingress.yaml
```

6. **Get the LoadBalancer IP:**
```bash
kubectl get ingress -n lanka-basket

# Or for LoadBalancer service
kubectl get svc nginx-ingress-controller -n ingress-nginx
```

7. **Configure DNS:**
   - Point your domain to the LoadBalancer IP
   - Wait for DNS propagation

### Automated Deployment (via CI/CD)

After the initial setup, every push to the `main` branch will:
1. Run tests
2. Run security scans
3. Build Docker images
4. Push images to registry
5. Deploy to Kubernetes cluster
6. Verify deployment
7. Rollback automatically if deployment fails

---

## Monitoring and Maintenance

### View Application Logs

```bash
# Server logs
kubectl logs -l app=server -n lanka-basket --tail=100 -f

# Client logs
kubectl logs -l app=client -n lanka-basket --tail=100 -f

# MongoDB logs
kubectl logs -l app=mongo -n lanka-basket --tail=100 -f
```

### Check Pod Status

```bash
# Get all resources
kubectl get all -n lanka-basket

# Describe pod for detailed info
kubectl describe pod <pod-name> -n lanka-basket

# Get pod events
kubectl get events -n lanka-basket --sort-by='.lastTimestamp'
```

### Scale Manually

```bash
# Scale server
kubectl scale deployment/server --replicas=5 -n lanka-basket

# Scale client
kubectl scale deployment/client --replicas=3 -n lanka-basket
```

### Update Application

```bash
# Update image (if needed manually)
kubectl set image deployment/server server=your-registry/lanka-basket-server:v2.0 -n lanka-basket

# Or trigger rollout
kubectl rollout restart deployment/server -n lanka-basket
```

### Rollback Deployment

```bash
# View rollout history
kubectl rollout history deployment/server -n lanka-basket

# Rollback to previous version
kubectl rollout undo deployment/server -n lanka-basket

# Rollback to specific revision
kubectl rollout undo deployment/server --to-revision=2 -n lanka-basket
```

### Database Backup

```bash
# Backup MongoDB
kubectl exec -n lanka-basket deployment/mongo -- mongodump --archive=/tmp/backup.archive

# Copy backup to local
kubectl cp lanka-basket/<mongo-pod-name>:/tmp/backup.archive ./backup.archive

# Restore MongoDB
kubectl cp ./backup.archive lanka-basket/<mongo-pod-name>:/tmp/backup.archive
kubectl exec -n lanka-basket deployment/mongo -- mongorestore --archive=/tmp/backup.archive
```

---

## Monitoring Tools (Optional but Recommended)

### Install Prometheus & Grafana

```bash
# Add Helm repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus Stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Default credentials: admin/prom-operator
```

### Install ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
# Add Helm repo
helm repo add elastic https://helm.elastic.co

# Install Elasticsearch
helm install elasticsearch elastic/elasticsearch -n logging --create-namespace

# Install Kibana
helm install kibana elastic/kibana -n logging

# Access Kibana
kubectl port-forward -n logging svc/kibana-kibana 5601:5601
```

---

## Troubleshooting

### Common Issues

#### 1. Pods Not Starting
```bash
# Check pod status
kubectl get pods -n lanka-basket

# Describe pod for events
kubectl describe pod <pod-name> -n lanka-basket

# Check logs
kubectl logs <pod-name> -n lanka-basket
```

**Common causes:**
- Image pull errors → Check registry credentials
- Resource limits → Increase CPU/memory limits
- Configuration errors → Verify ConfigMap and Secrets

#### 2. Database Connection Errors
```bash
# Test MongoDB connectivity
kubectl exec -it <server-pod-name> -n lanka-basket -- sh
# Inside pod:
ping mongo-service
nc -zv mongo-service 27017
```

#### 3. Ingress Not Working
```bash
# Check ingress status
kubectl get ingress -n lanka-basket
kubectl describe ingress lanka-basket-ingress -n lanka-basket

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

#### 4. CI/CD Pipeline Failures
- Check GitHub Actions logs
- Verify secrets are correctly set
- Ensure kubeconfig has proper permissions
- Check image registry credentials

#### 5. Certificate Issues
```bash
# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Check certificate status
kubectl get certificate -n lanka-basket
kubectl describe certificate lanka-basket-tls -n lanka-basket
```

### Debug Commands

```bash
# Execute commands in a pod
kubectl exec -it <pod-name> -n lanka-basket -- sh

# Port forward for local testing
kubectl port-forward -n lanka-basket svc/server-service 8080:8080
kubectl port-forward -n lanka-basket svc/client-service 8081:80

# View resource usage
kubectl top pods -n lanka-basket
kubectl top nodes

# Check HPA status
kubectl get hpa -n lanka-basket
kubectl describe hpa server-hpa -n lanka-basket
```

---

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use external secret management** (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
3. **Enable RBAC** (Role-Based Access Control)
4. **Use network policies** to restrict pod-to-pod communication
5. **Regularly update** base images and dependencies
6. **Scan images** for vulnerabilities (Trivy, Snyk, Aqua)
7. **Use non-root users** in containers
8. **Limit resource** requests and limits
9. **Enable pod security policies**
10. **Use TLS/SSL** for all communications

---

## Cost Optimization

1. **Use node autoscaling** to match demand
2. **Set appropriate resource** requests and limits
3. **Use spot instances** for non-critical workloads (AWS, GCP)
4. **Monitor and optimize** database queries
5. **Use CDN** for static assets
6. **Implement caching** (Redis)
7. **Clean up unused resources** regularly

---

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager Documentation](https://cert-manager.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)

---

## Support & Maintenance

### Regular Tasks
- **Weekly:** Check logs and metrics
- **Monthly:** Update dependencies and base images
- **Quarterly:** Review and optimize costs
- **As needed:** Scale resources based on traffic

### Emergency Procedures
1. **Service Down:** Check logs, rollback if recent deployment
2. **High CPU/Memory:** Scale horizontally or vertically
3. **Database Issues:** Check connections, backup if needed
4. **Security Breach:** Isolate affected pods, rotate secrets

---

## Next Steps

1. ✅ Complete the setup steps above
2. ✅ Test the CI/CD pipeline with a small change
3. ⬜ Set up monitoring (Prometheus/Grafana)
4. ⬜ Configure backup strategy
5. ⬜ Implement logging aggregation (ELK)
6. ⬜ Set up alerting (PagerDuty, Slack)
7. ⬜ Security hardening
8. ⬜ Performance optimization
9. ⬜ Documentation updates

---

**Last Updated:** February 24, 2026
**Version:** 1.0.0

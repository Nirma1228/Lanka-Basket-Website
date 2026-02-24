# Quick Reference - Lanka Basket CI/CD

## Common Commands

### Build & Run Locally
```bash
# Build production images
docker build -t lanka-basket-server:local -f server/Dockerfile.prod ./server
docker build -t lanka-basket-client:local -f client/Dockerfile.prod ./client

# Run with docker-compose (development)
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

### Docker Registry Operations
```bash
# Login to Docker Hub
docker login

# Tag images
docker tag lanka-basket-server:local your-username/lanka-basket-server:v1.0
docker tag lanka-basket-client:local your-username/lanka-basket-client:v1.0

# Push images
docker push your-username/lanka-basket-server:v1.0
docker push your-username/lanka-basket-client:v1.0
```

### Kubernetes Quick Commands
```bash
# Apply all configurations
kubectl apply -f k8s/

# Get everything
kubectl get all -n lanka-basket

# Get pods with more info
kubectl get pods -n lanka-basket -o wide

# Delete everything
kubectl delete namespace lanka-basket

# Restart deployments
kubectl rollout restart deployment/server -n lanka-basket
kubectl rollout restart deployment/client -n lanka-basket

# View logs
kubectl logs -f deployment/server -n lanka-basket
kubectl logs -f deployment/client -n lanka-basket

# Scale deployments
kubectl scale deployment/server --replicas=3 -n lanka-basket

# Port forward for testing
kubectl port-forward -n lanka-basket svc/server-service 8080:8080
kubectl port-forward -n lanka-basket svc/client-service 8081:80

# Execute commands in pod
kubectl exec -it <pod-name> -n lanka-basket -- sh

# Get ingress info
kubectl get ingress -n lanka-basket
kubectl describe ingress lanka-basket-ingress -n lanka-basket
```

### Debugging
```bash
# Check pod events
kubectl get events -n lanka-basket --sort-by='.lastTimestamp'

# Describe resources
kubectl describe pod <pod-name> -n lanka-basket
kubectl describe service server-service -n lanka-basket
kubectl describe deployment server -n lanka-basket

# Check resource usage
kubectl top nodes
kubectl top pods -n lanka-basket

# View HPA status
kubectl get hpa -n lanka-basket
kubectl describe hpa server-hpa -n lanka-basket
```

### Database Operations
```bash
# Access MongoDB shell
kubectl exec -it deployment/mongo -n lanka-basket -- mongosh

# Backup database
kubectl exec -n lanka-basket deployment/mongo -- mongodump --archive=/tmp/backup-$(date +%Y%m%d).archive

# Restore database
kubectl cp ./backup.archive lanka-basket/<mongo-pod>:/tmp/backup.archive
kubectl exec -n lanka-basket <mongo-pod> -- mongorestore --archive=/tmp/backup.archive
```

### CI/CD Pipeline
```bash
# Trigger pipeline (push to main)
git add .
git commit -m "Your commit message"
git push origin main

# View pipeline logs
# Go to: GitHub → Actions → Click on workflow run

# Force re-run failed pipeline
# Go to: GitHub → Actions → Select failed run → Re-run all jobs
```

### Certificate & SSL
```bash
# Check certificate status
kubectl get certificate -n lanka-basket
kubectl describe certificate lanka-basket-tls -n lanka-basket

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Manually trigger certificate renewal
kubectl delete certificate lanka-basket-tls -n lanka-basket
kubectl apply -f k8s/ingress.yaml
```

### Monitoring
```bash
# Access Grafana (if installed)
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Access Prometheus (if installed)
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090

# Access Kibana (if installed)
kubectl port-forward -n logging svc/kibana-kibana 5601:5601
```

### Cleanup
```bash
# Delete specific deployment
kubectl delete deployment server -n lanka-basket
kubectl delete deployment client -n lanka-basket

# Delete specific service
kubectl delete service server-service -n lanka-basket

# Delete all resources in namespace
kubectl delete all --all -n lanka-basket

# Delete namespace (deletes everything)
kubectl delete namespace lanka-basket

# Prune unused Docker images
docker image prune -a

# Clean up Docker system
docker system prune -a --volumes
```

### Rollback
```bash
# View rollout history
kubectl rollout history deployment/server -n lanka-basket

# Rollback to previous version
kubectl rollout undo deployment/server -n lanka-basket

# Rollback to specific revision
kubectl rollout undo deployment/server --to-revision=3 -n lanka-basket

# Check rollout status
kubectl rollout status deployment/server -n lanka-basket
```

## Environment Variables Checklist

### GitHub Secrets (Required)
- [ ] `DOCKER_USERNAME`
- [ ] `DOCKER_PASSWORD`
- [ ] `KUBE_CONFIG`

### Kubernetes Secrets (k8s/secrets.yaml)
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `BREVO_API_KEY`
- [ ] `STRIPE_SECRET_KEY`

### ConfigMap (k8s/configmap.yaml)
- [ ] `NODE_ENV`
- [ ] `PORT`
- [ ] `CLIENT_URL`

## Deployment Checklist

### Initial Setup
- [ ] Create Kubernetes cluster
- [ ] Install nginx-ingress controller
- [ ] Install cert-manager
- [ ] Configure domain DNS
- [ ] Set up GitHub secrets
- [ ] Update image registry in workflow
- [ ] Update domain in ingress
- [ ] Update secrets.yaml with actual values
- [ ] Update configmap.yaml with actual values

### Pre-Deployment
- [ ] Test locally with docker-compose
- [ ] Build and test production images
- [ ] Run security scans
- [ ] Backup existing data (if applicable)
- [ ] Plan rollback strategy

### Deployment
- [ ] Apply namespace
- [ ] Apply configmap and secrets
- [ ] Deploy MongoDB
- [ ] Wait for MongoDB to be ready
- [ ] Deploy server
- [ ] Deploy client
- [ ] Deploy ingress
- [ ] Verify all pods are running
- [ ] Test application access

### Post-Deployment
- [ ] Check application logs
- [ ] Test all major features
- [ ] Monitor resource usage
- [ ] Set up monitoring/alerting
- [ ] Document any issues
- [ ] Update team

## Troubleshooting Quick Fixes

### ImagePullBackOff
```bash
# Check secret
kubectl get secret -n lanka-basket
# Verify image exists in registry
docker pull your-username/lanka-basket-server:latest
# Update deployment with correct image
kubectl set image deployment/server server=correct-image:tag -n lanka-basket
```

### CrashLoopBackOff
```bash
# Check logs
kubectl logs <pod-name> -n lanka-basket --previous
# Check environment variables
kubectl exec <pod-name> -n lanka-basket -- env
# Check health endpoint
kubectl exec <pod-name> -n lanka-basket -- curl localhost:8080/health
```

### Pending Pods
```bash
# Check events
kubectl describe pod <pod-name> -n lanka-basket
# Check node resources
kubectl describe nodes
# Check PVC status
kubectl get pvc -n lanka-basket
```

### Service Not Accessible
```bash
# Check service
kubectl get svc -n lanka-basket
# Check endpoints
kubectl get endpoints -n lanka-basket
# Test from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- sh
curl http://server-service.lanka-basket:8080/health
```

## Performance Tuning

### Resource Adjustments
```yaml
# Increase resources in deployment
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### HPA Tuning
```yaml
# Adjust autoscaling thresholds
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Adjust based on load
```

## Security Commands

```bash
# Scan image for vulnerabilities
docker scan your-username/lanka-basket-server:latest

# Use Trivy for scanning
trivy image your-username/lanka-basket-server:latest

# Check pod security
kubectl auth can-i --list -n lanka-basket

# View secrets (base64 encoded)
kubectl get secret app-secrets -n lanka-basket -o yaml

# Rotate secrets
kubectl delete secret app-secrets -n lanka-basket
kubectl apply -f k8s/secrets.yaml
kubectl rollout restart deployment/server -n lanka-basket
```

## URLs & Access Points

### Local Development
- Client: http://localhost:5173
- Server: http://localhost:8080
- MongoDB: mongodb://localhost:27017

### Production (after deployment)
- Application: https://your-domain.com
- API: https://your-domain.com/api
- Health Check: https://your-domain.com/api/health

### Monitoring (if installed)
- Grafana: http://localhost:3000 (port-forwarded)
- Prometheus: http://localhost:9090 (port-forwarded)
- Kibana: http://localhost:5601 (port-forwarded)

## Support & Resources

- **Documentation**: See CI-CD-SETUP-GUIDE.md
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker Hub**: https://hub.docker.com/

---

**Tip**: Save this file for quick reference during deployments and troubleshooting!

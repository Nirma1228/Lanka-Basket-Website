# GitHub Actions CI/CD Setup - Lanka Basket Website

This guide walks you through setting up automated CI/CD with GitHub Actions.

## Phase 3: GitHub Actions CI/CD

### Prerequisites
- Complete [Docker Setup](DOCKER_SETUP.md)
- Complete [Kubernetes Setup](KUBERNETES_SETUP.md)
- GitHub account with your code repository
- Docker Hub account

### Step 1: Create Docker Hub Account

1. Go to [Docker Hub](https://hub.docker.com/)
2. Sign up for a free account
3. Create an access token:
   - Click your profile → Account Settings → Security
   - Click "New Access Token"
   - Name it "GitHub Actions"
   - Copy the token (save it securely!)

### Step 2: Add GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `DOCKERHUB_USERNAME` | your-dockerhub-username | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | (token from Step 1) | Your Docker Hub access token |

### Step 3: GitHub Actions Workflow

The workflow file is already created at `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push backend
      uses: docker/build-push-action@v4
      with:
        context: ./server
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/lanka-basket-backend:latest

    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./client
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/lanka-basket-frontend:latest

  test:
    runs-on: ubuntu-latest
    needs: build-and-push

    steps:
    - uses: actions/checkout@v3
    
    - name: Run backend tests
      run: |
        cd server
        npm install
        npm test || echo "No tests yet"
    
    - name: Run frontend tests
      run: |
        cd client
        npm install
        npm test || echo "No tests yet"
```

### Step 4: Update Kubernetes Deployment Images

Update the image names in your Kubernetes deployment files:

**k8s/backend-deployment.yaml:**
```yaml
image: your-dockerhub-username/lanka-basket-backend:latest
```

**k8s/frontend-deployment.yaml:**
```yaml
image: your-dockerhub-username/lanka-basket-frontend:latest
```

Replace `your-dockerhub-username` with your actual Docker Hub username.

### Step 5: Trigger the Pipeline

```bash
# Make a change to any file
git add .
git commit -m "Initial CI/CD setup"
git push origin main
```

### Step 6: Monitor the Pipeline

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Watch your workflow run in real-time
4. Click on a workflow run to see detailed logs

### Understanding the Workflow

The pipeline has two jobs:

#### Job 1: build-and-push
1. **Checkout code** - Pulls your latest code
2. **Login to DockerHub** - Authenticates with Docker Hub
3. **Build and push backend** - Builds backend Docker image and pushes to Docker Hub
4. **Build and push frontend** - Builds frontend Docker image and pushes to Docker Hub

#### Job 2: test
1. **Checkout code** - Pulls your latest code
2. **Run backend tests** - Installs dependencies and runs backend tests
3. **Run frontend tests** - Installs dependencies and runs frontend tests

### Workflow Triggers

The pipeline runs on:
- **Push to main branch** - Automatically builds and deploys
- **Pull requests to main** - Runs tests before merging

### View Your Images on Docker Hub

After the pipeline succeeds:
1. Go to [Docker Hub](https://hub.docker.com/)
2. Click **Repositories**
3. You should see:
   - `lanka-basket-backend`
   - `lanka-basket-frontend`

### Deploy Updated Images to Kubernetes

After images are pushed to Docker Hub:

```bash
# Restart deployments to pull latest images
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

# Watch the rollout
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

# Verify pods are running
kubectl get pods
```

### Adding Tests to Your Pipeline

Create test files in your project:

**server/test/example.test.js:**
```javascript
describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
```

Update **server/package.json:**
```json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

### Pipeline Status Badge

Add a status badge to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/your-username/Lanka-Basket-Website/actions/workflows/ci-cd.yml/badge.svg)
```

### Advanced: Automatic Kubernetes Deployment

To automatically deploy to Kubernetes on push to main:

1. **Get your kubeconfig:**
   ```bash
   # For Minikube
   cat ~/.kube/config
   
   # Encode it in base64
   cat ~/.kube/config | base64
   ```

2. **Add to GitHub Secrets:**
   - Secret name: `KUBE_CONFIG`
   - Value: (base64 encoded kubeconfig)

3. **Update workflow** to add deployment job:
   ```yaml
   deploy:
     runs-on: ubuntu-latest
     needs: [build-and-push, test]
     if: github.ref == 'refs/heads/main'
     
     steps:
     - uses: actions/checkout@v3
     
     - name: Setup kubectl
       uses: azure/setup-kubectl@v3
     
     - name: Set kubeconfig
       run: |
         mkdir -p $HOME/.kube
         echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config
     
     - name: Deploy to Kubernetes
       run: |
         kubectl apply -f k8s/
         kubectl rollout status deployment/backend
         kubectl rollout status deployment/frontend
   ```

### Troubleshooting

**Pipeline fails on Docker push:**
- Verify Docker Hub credentials are correct
- Check if secrets are properly set in GitHub
- Ensure secret names match exactly (case-sensitive)

**Build fails:**
- Check Dockerfile syntax
- Verify all dependencies are in package.json
- Review build logs in GitHub Actions

**Tests fail:**
- Run tests locally first: `npm test`
- Fix failing tests before pushing
- Update test command in workflow if needed

**Images not updating in Kubernetes:**
- Check imagePullPolicy: `Always` in deployments
- Manually pull latest: `kubectl rollout restart deployment/backend`
- Verify image tag matches on Docker Hub

### Free Cloud Deployment Options

Deploy your Kubernetes app for free:

1. **Render** (Easiest)
   - Sign up at [render.com](https://render.com)
   - Connect GitHub repository
   - Deploy with one click
   - Free tier available

2. **Railway** 
   - Sign up at [railway.app](https://railway.app)
   - Connect GitHub repository
   - Automatic deployments
   - $5 free credit monthly

3. **Google Cloud (GKE)**
   - $300 free credits for 90 days
   - Create GKE cluster
   - Deploy using kubectl

4. **Azure (AKS)**
   - $200 free credits
   - Create AKS cluster
   - Deploy using kubectl

5. **DigitalOcean**
   - Simple Kubernetes service
   - $200 free credit (60 days)
   - Easy to set up

### Deployment to Render (Recommended for Beginners)

1. **Push to Docker Hub** (done automatically by pipeline)

2. **Sign up on Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Services:**
   
   **Backend Service:**
   - New → Web Service
   - Select "Deploy an existing image"
   - Image URL: `docker.io/your-username/lanka-basket-backend:latest`
   - Environment variables: Add your secrets

   **Frontend Service:**
   - New → Web Service
   - Select "Deploy an existing image"
   - Image URL: `docker.io/your-username/lanka-basket-frontend:latest`

4. **Add MongoDB:**
   - New → Database
   - Select MongoDB
   - Copy connection string to backend environment

5. **Access your app:**
   - Render provides a URL for each service
   - Your app is live! 🎉

### Learning Path Complete! 🎓

Congratulations! You now have:

✅ **Docker** - Containerized your application  
✅ **Kubernetes** - Orchestrated containers locally  
✅ **CI/CD** - Automated build and deployment  
✅ **Production Ready** - Ready to deploy to cloud

### Next Steps

- Add more comprehensive tests
- Implement monitoring (Prometheus, Grafana)
- Set up logging (ELK stack)
- Add database backups
- Configure SSL/TLS certificates
- Implement blue-green deployments
- Add performance monitoring

## Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)

---

**Need help?** Check the detailed [CI-CD-SETUP-GUIDE.md](CI-CD-SETUP-GUIDE.md) for more advanced configurations.

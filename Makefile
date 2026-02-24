# Makefile for Lanka Basket Kubernetes Deployment
# Usage: make <target>

.PHONY: help build push deploy logs status clean rollback

# Variables
DOCKER_USERNAME ?= your-dockerhub-username
SERVER_IMAGE = $(DOCKER_USERNAME)/lanka-basket-server
CLIENT_IMAGE = $(DOCKER_USERNAME)/lanka-basket-client
VERSION ?= latest
NAMESPACE = lanka-basket

help: ## Show this help message
	@echo "Lanka Basket - Makefile Commands"
	@echo "================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build-server: ## Build server Docker image
	@echo "Building server image..."
	docker build -t $(SERVER_IMAGE):$(VERSION) -f server/Dockerfile.prod ./server

build-client: ## Build client Docker image
	@echo "Building client image..."
	docker build -t $(CLIENT_IMAGE):$(VERSION) -f client/Dockerfile.prod ./client

build: build-server build-client ## Build both Docker images

push-server: ## Push server image to registry
	@echo "Pushing server image..."
	docker push $(SERVER_IMAGE):$(VERSION)

push-client: ## Push client image to registry
	@echo "Pushing client image..."
	docker push $(CLIENT_IMAGE):$(VERSION)

push: push-server push-client ## Push both images to registry

login: ## Login to Docker registry
	docker login

deploy-namespace: ## Create namespace
	kubectl apply -f k8s/namespace.yaml

deploy-config: ## Deploy ConfigMap and Secrets
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/secrets.yaml

deploy-mongo: ## Deploy MongoDB
	kubectl apply -f k8s/mongo-deployment.yaml
	@echo "Waiting for MongoDB to be ready..."
	kubectl wait --for=condition=ready pod -l app=mongo -n $(NAMESPACE) --timeout=300s

deploy-server: ## Deploy server
	kubectl apply -f k8s/server-deployment.yaml
	kubectl rollout status deployment/server -n $(NAMESPACE)

deploy-client: ## Deploy client
	kubectl apply -f k8s/client-deployment.yaml
	kubectl rollout status deployment/client -n $(NAMESPACE)

deploy-ingress: ## Deploy ingress
	kubectl apply -f k8s/ingress.yaml

deploy: deploy-namespace deploy-config deploy-mongo deploy-server deploy-client deploy-ingress ## Deploy everything

status: ## Show deployment status
	@echo "Pods:"
	kubectl get pods -n $(NAMESPACE) -o wide
	@echo "\nServices:"
	kubectl get svc -n $(NAMESPACE)
	@echo "\nIngress:"
	kubectl get ingress -n $(NAMESPACE)

logs-server: ## View server logs
	kubectl logs -f deployment/server -n $(NAMESPACE)

logs-client: ## View client logs
	kubectl logs -f deployment/client -n $(NAMESPACE)

logs-mongo: ## View MongoDB logs
	kubectl logs -f deployment/mongo -n $(NAMESPACE)

restart-server: ## Restart server deployment
	kubectl rollout restart deployment/server -n $(NAMESPACE)

restart-client: ## Restart client deployment
	kubectl rollout restart deployment/client -n $(NAMESPACE)

restart: restart-server restart-client ## Restart all deployments

scale-server: ## Scale server (make scale-server REPLICAS=3)
	kubectl scale deployment/server --replicas=$(REPLICAS) -n $(NAMESPACE)

scale-client: ## Scale client (make scale-client REPLICAS=3)
	kubectl scale deployment/client --replicas=$(REPLICAS) -n $(NAMESPACE)

port-forward-server: ## Port forward server to localhost:8080
	kubectl port-forward -n $(NAMESPACE) svc/server-service 8080:8080

port-forward-client: ## Port forward client to localhost:8081
	kubectl port-forward -n $(NAMESPACE) svc/client-service 8081:80

port-forward-mongo: ## Port forward MongoDB to localhost:27017
	kubectl port-forward -n $(NAMESPACE) svc/mongo-service 27017:27017

rollback-server: ## Rollback server deployment
	kubectl rollout undo deployment/server -n $(NAMESPACE)

rollback-client: ## Rollback client deployment
	kubectl rollout undo deployment/client -n $(NAMESPACE)

rollback: rollback-server rollback-client ## Rollback all deployments

describe-server: ## Describe server deployment
	kubectl describe deployment server -n $(NAMESPACE)

describe-client: ## Describe client deployment
	kubectl describe deployment client -n $(NAMESPACE)

events: ## Show events in namespace
	kubectl get events -n $(NAMESPACE) --sort-by='.lastTimestamp'

top: ## Show resource usage
	kubectl top pods -n $(NAMESPACE)

clean: ## Delete all resources
	kubectl delete namespace $(NAMESPACE)

test-local: ## Test with docker-compose
	docker-compose up -d

stop-local: ## Stop docker-compose
	docker-compose down

backup-db: ## Backup MongoDB
	@echo "Creating backup..."
	kubectl exec -n $(NAMESPACE) deployment/mongo -- mongodump --archive=/tmp/backup-$$(date +%Y%m%d-%H%M%S).archive
	@echo "Backup created in MongoDB container at /tmp/"

install-ingress: ## Install nginx ingress controller
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	helm repo update
	helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace

install-cert-manager: ## Install cert-manager
	kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

install-monitoring: ## Install Prometheus & Grafana
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo update
	helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace

all: build push deploy status ## Build, push, and deploy everything

.DEFAULT_GOAL := help

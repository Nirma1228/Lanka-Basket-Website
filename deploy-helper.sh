#!/bin/bash

# Deployment Helper Script for Linux/Mac
# Lanka Basket - Kubernetes Deployment Helper

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_menu() {
    echo -e "${BLUE}Lanka Basket - Kubernetes Deployment Helper${NC}"
    echo -e "${BLUE}===========================================${NC}"
    echo ""
    echo -e "${YELLOW}Please select an option:${NC}"
    echo "1. Deploy all resources"
    echo "2. View pod status"
    echo "3. View logs"
    echo "4. Restart deployments"
    echo "5. Scale deployments"
    echo "6. Check ingress status"
    echo "7. Port forward services"
    echo "8. Rollback deployment"
    echo "9. Delete all resources"
    echo "0. Exit"
    echo ""
}

deploy_all() {
    echo -e "${GREEN}Deploying all resources...${NC}"
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/secrets.yaml
    kubectl apply -f k8s/mongo-deployment.yaml
    sleep 10
    kubectl apply -f k8s/server-deployment.yaml
    kubectl apply -f k8s/client-deployment.yaml
    kubectl apply -f k8s/ingress.yaml
    echo -e "${GREEN}Deployment complete!${NC}"
    echo -e "${YELLOW}Waiting for rollout...${NC}"
    kubectl rollout status deployment/server -n lanka-basket
    kubectl rollout status deployment/client -n lanka-basket
}

show_pods() {
    echo -e "${GREEN}Pod Status:${NC}"
    kubectl get pods -n lanka-basket -o wide
    echo ""
    echo -e "${GREEN}Services:${NC}"
    kubectl get svc -n lanka-basket
}

show_logs() {
    echo -e "${YELLOW}Select service to view logs:${NC}"
    echo "1. Server"
    echo "2. Client"
    echo "3. MongoDB"
    read -p "Enter choice: " choice
    
    case $choice in
        1) kubectl logs -f deployment/server -n lanka-basket ;;
        2) kubectl logs -f deployment/client -n lanka-basket ;;
        3) kubectl logs -f deployment/mongo -n lanka-basket ;;
        *) echo -e "${RED}Invalid choice${NC}" ;;
    esac
}

restart_deployments() {
    echo -e "${GREEN}Restarting deployments...${NC}"
    kubectl rollout restart deployment/server -n lanka-basket
    kubectl rollout restart deployment/client -n lanka-basket
    echo -e "${GREEN}Deployments restarted!${NC}"
}

scale_deployments() {
    read -p "Enter service name (server/client): " service
    read -p "Enter number of replicas: " replicas
    
    kubectl scale deployment/$service --replicas=$replicas -n lanka-basket
    echo -e "${GREEN}Scaling $service to $replicas replicas...${NC}"
}

show_ingress() {
    echo -e "${GREEN}Ingress Status:${NC}"
    kubectl get ingress -n lanka-basket
    echo ""
    kubectl describe ingress lanka-basket-ingress -n lanka-basket
}

port_forward() {
    echo -e "${YELLOW}Select service to port forward:${NC}"
    echo "1. Server (8080)"
    echo "2. Client (8081)"
    echo "3. MongoDB (27017)"
    read -p "Enter choice: " choice
    
    case $choice in
        1) 
            echo -e "${GREEN}Forwarding server to localhost:8080...${NC}"
            kubectl port-forward -n lanka-basket svc/server-service 8080:8080 
            ;;
        2) 
            echo -e "${GREEN}Forwarding client to localhost:8081...${NC}"
            kubectl port-forward -n lanka-basket svc/client-service 8081:80 
            ;;
        3) 
            echo -e "${GREEN}Forwarding MongoDB to localhost:27017...${NC}"
            kubectl port-forward -n lanka-basket svc/mongo-service 27017:27017 
            ;;
        *) echo -e "${RED}Invalid choice${NC}" ;;
    esac
}

rollback_deployment() {
    read -p "Enter service name (server/client): " service
    
    echo -e "${YELLOW}Rollout history for $service:${NC}"
    kubectl rollout history deployment/$service -n lanka-basket
    
    read -p "Rollback to previous version? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        kubectl rollout undo deployment/$service -n lanka-basket
        echo -e "${GREEN}Rollback initiated!${NC}"
    fi
}

delete_all() {
    echo -e "${RED}WARNING: This will delete all resources in lanka-basket namespace!${NC}"
    read -p "Are you sure? (type 'yes' to confirm): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo -e "${RED}Deleting all resources...${NC}"
        kubectl delete namespace lanka-basket
        echo -e "${GREEN}All resources deleted!${NC}"
    else
        echo -e "${YELLOW}Deletion cancelled.${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice: " choice
    echo ""
    
    case $choice in
        1) deploy_all ;;
        2) show_pods ;;
        3) show_logs ;;
        4) restart_deployments ;;
        5) scale_deployments ;;
        6) show_ingress ;;
        7) port_forward ;;
        8) rollback_deployment ;;
        9) delete_all ;;
        0) 
            echo -e "${BLUE}Exiting...${NC}"
            exit 0 
            ;;
        *) echo -e "${RED}Invalid choice, please try again.${NC}" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
done

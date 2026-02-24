# Deployment Helper Script
# PowerShell script for Windows

Write-Host "Lanka Basket - Kubernetes Deployment Helper" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

function Show-Menu {
    Write-Host "Please select an option:" -ForegroundColor Yellow
    Write-Host "1. Deploy all resources"
    Write-Host "2. View pod status"
    Write-Host "3. View logs"
    Write-Host "4. Restart deployments"
    Write-Host "5. Scale deployments"
    Write-Host "6. Check ingress status"
    Write-Host "7. Port forward services"
    Write-Host "8. Rollback deployment"
    Write-Host "9. Delete all resources"
    Write-Host "0. Exit"
    Write-Host ""
}

function Deploy-All {
    Write-Host "Deploying all resources..." -ForegroundColor Green
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/secrets.yaml
    kubectl apply -f k8s/mongo-deployment.yaml
    Start-Sleep -Seconds 10
    kubectl apply -f k8s/server-deployment.yaml
    kubectl apply -f k8s/client-deployment.yaml
    kubectl apply -f k8s/ingress.yaml
    Write-Host "Deployment complete!" -ForegroundColor Green
    Write-Host "Waiting for rollout..." -ForegroundColor Yellow
    kubectl rollout status deployment/server -n lanka-basket
    kubectl rollout status deployment/client -n lanka-basket
}

function Show-Pods {
    Write-Host "Pod Status:" -ForegroundColor Green
    kubectl get pods -n lanka-basket -o wide
    Write-Host ""
    Write-Host "Services:" -ForegroundColor Green
    kubectl get svc -n lanka-basket
}

function Show-Logs {
    Write-Host "Select service to view logs:" -ForegroundColor Yellow
    Write-Host "1. Server"
    Write-Host "2. Client"
    Write-Host "3. MongoDB"
    $choice = Read-Host "Enter choice"
    
    switch ($choice) {
        "1" { kubectl logs -f deployment/server -n lanka-basket }
        "2" { kubectl logs -f deployment/client -n lanka-basket }
        "3" { kubectl logs -f deployment/mongo -n lanka-basket }
        default { Write-Host "Invalid choice" -ForegroundColor Red }
    }
}

function Restart-Deployments {
    Write-Host "Restarting deployments..." -ForegroundColor Green
    kubectl rollout restart deployment/server -n lanka-basket
    kubectl rollout restart deployment/client -n lanka-basket
    Write-Host "Deployments restarted!" -ForegroundColor Green
}

function Scale-Deployments {
    $service = Read-Host "Enter service name (server/client)"
    $replicas = Read-Host "Enter number of replicas"
    
    kubectl scale deployment/$service --replicas=$replicas -n lanka-basket
    Write-Host "Scaling $service to $replicas replicas..." -ForegroundColor Green
}

function Show-Ingress {
    Write-Host "Ingress Status:" -ForegroundColor Green
    kubectl get ingress -n lanka-basket
    Write-Host ""
    kubectl describe ingress lanka-basket-ingress -n lanka-basket
}

function Port-Forward {
    Write-Host "Select service to port forward:" -ForegroundColor Yellow
    Write-Host "1. Server (8080)"
    Write-Host "2. Client (8081)"
    Write-Host "3. MongoDB (27017)"
    $choice = Read-Host "Enter choice"
    
    switch ($choice) {
        "1" { 
            Write-Host "Forwarding server to localhost:8080..." -ForegroundColor Green
            kubectl port-forward -n lanka-basket svc/server-service 8080:8080 
        }
        "2" { 
            Write-Host "Forwarding client to localhost:8081..." -ForegroundColor Green
            kubectl port-forward -n lanka-basket svc/client-service 8081:80 
        }
        "3" { 
            Write-Host "Forwarding MongoDB to localhost:27017..." -ForegroundColor Green
            kubectl port-forward -n lanka-basket svc/mongo-service 27017:27017 
        }
        default { Write-Host "Invalid choice" -ForegroundColor Red }
    }
}

function Rollback-Deployment {
    $service = Read-Host "Enter service name (server/client)"
    
    Write-Host "Rollout history for $service:" -ForegroundColor Yellow
    kubectl rollout history deployment/$service -n lanka-basket
    
    $confirm = Read-Host "Rollback to previous version? (y/n)"
    if ($confirm -eq "y") {
        kubectl rollout undo deployment/$service -n lanka-basket
        Write-Host "Rollback initiated!" -ForegroundColor Green
    }
}

function Delete-All {
    Write-Host "WARNING: This will delete all resources in lanka-basket namespace!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (type 'yes' to confirm)"
    
    if ($confirm -eq "yes") {
        Write-Host "Deleting all resources..." -ForegroundColor Red
        kubectl delete namespace lanka-basket
        Write-Host "All resources deleted!" -ForegroundColor Green
    } else {
        Write-Host "Deletion cancelled." -ForegroundColor Yellow
    }
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    Write-Host ""
    
    switch ($choice) {
        "1" { Deploy-All }
        "2" { Show-Pods }
        "3" { Show-Logs }
        "4" { Restart-Deployments }
        "5" { Scale-Deployments }
        "6" { Show-Ingress }
        "7" { Port-Forward }
        "8" { Rollback-Deployment }
        "9" { Delete-All }
        "0" { 
            Write-Host "Exiting..." -ForegroundColor Cyan
            exit 
        }
        default { Write-Host "Invalid choice, please try again." -ForegroundColor Red }
    }
    
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Clear-Host
    Write-Host "Lanka Basket - Kubernetes Deployment Helper" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
} while ($true)

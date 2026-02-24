#!/bin/bash

# Lanka Basket - Quick Start Script
# This script will test your Docker setup

echo "🚀 Lanka Basket Quick Start"
echo "============================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available."
    exit 1
fi

echo "✅ Docker Compose is available"
echo ""

# Start Docker Compose
echo "🔨 Building and starting containers..."
echo "   This may take a few minutes on first run..."
echo ""

docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Containers started successfully!"
    echo ""
    echo "📊 Container Status:"
    docker-compose ps
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo "   MongoDB:  mongodb://admin:password@localhost:27017"
    echo ""
    echo "📝 Useful Commands:"
    echo "   View logs:        docker-compose logs -f"
    echo "   Stop containers:  docker-compose down"
    echo "   Restart:          docker-compose restart"
    echo ""
    echo "📚 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Read DEVOPS_LEARNING_PATH.md for the full guide"
    echo "   3. Follow KUBERNETES_SETUP.md for Phase 2"
    echo ""
else
    echo ""
    echo "❌ Failed to start containers"
    echo "   Check the logs with: docker-compose logs"
    exit 1
fi

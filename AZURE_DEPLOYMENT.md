# Azure Deployment Guide

## Frontend (Azure Static Web Apps)
**URL**: https://lively-river-02e6bc000.1.azurestaticapps.net

### Environment Variables
Create a `.env` file in the `client` directory:
```
VITE_API_URL=https://lankabasket-dme4c4dcf0gea3c4.southindia-01.azurewebsites.net
```

### Build Commands
```bash
cd client
npm install
npm run build
```

## Backend (Azure App Service)
**URL**: https://lankabasket-dme4c4dcf0gea3c4.southindia-01.azurewebsites.net

### Environment Variables
Set these in Azure App Service Configuration:

#### Database Configuration
- `MONGODB_URI`: Your MongoDB connection string

#### Server Configuration
- `PORT`: 8080
- `FRONTEND_URL`: https://lively-river-02e6bc000.1.azurestaticapps.net

#### JWT Configuration
- `JWT_SECRET`: Your JWT secret key
- `JWT_REFRESH_SECRET`: Your JWT refresh secret key

#### Email Configuration (Brevo)
- `BREVO_API_KEY`: Your Brevo API key
- `BREVO_SMTP_HOST`: smtp-relay.brevo.com
- `BREVO_SMTP_PORT`: 587

#### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

#### Stripe Configuration
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

#### Email Templates
- `VERIFICATION_EMAIL_TEMPLATE_ID`: Your verification email template ID
- `FORGOT_PASSWORD_TEMPLATE_ID`: Your forgot password template ID

### Deployment Steps

1. **Backend Deployment**:
   - Deploy the `server` folder to Azure App Service
   - Set all environment variables in Azure App Service Configuration
   - Ensure Node.js version 18+ is selected

2. **Frontend Deployment**:
   - Deploy the `client` folder to Azure Static Web Apps
   - The `staticwebapp.config.json` will handle API routing

### API Endpoints
All API endpoints are prefixed with `/api/` and will be automatically routed to the backend.

### CORS Configuration
The backend is configured to accept requests from the frontend URL.

### Troubleshooting

1. **404 Errors**: Ensure the backend is running and environment variables are set
2. **CORS Errors**: Check that `FRONTEND_URL` is correctly set in backend
3. **Database Connection**: Verify `MONGODB_URI` is correct
4. **Build Errors**: Ensure all dependencies are installed

### Local Development
```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm run dev
```

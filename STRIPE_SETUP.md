# Stripe Payment Setup Instructions

## Issue: Online Payment Not Working

The online payment feature requires proper Stripe configuration. Here's what you need to do:

## 1. Get Your Stripe Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to "Developers" > "API keys"
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

## 2. Update Environment Variables

### Client Side (.env in client folder):
```
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key_here
```

### Server Side (.env in server folder):
```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_ENPOINT_WEBHOOK_SECRET_KEY=whsec_your_webhook_endpoint_secret_here
```

## 3. Webhook Setup (Optional for local development)

For production, you'll need to set up a webhook endpoint:
1. In Stripe Dashboard, go to "Developers" > "Webhooks"
2. Add endpoint: `https://your-domain.com/api/order/webhook`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret and add it to your server .env file

## 4. Test the Payment Flow

1. Make sure both frontend (port 5173) and backend (port 8080) are running
2. Add items to cart
3. Go to checkout page
4. Select an address
5. Click "Online Payment"
6. You should be redirected to Stripe checkout

## Current Status

✅ Payment controller is properly set up (Currency: LKR)
✅ Error handling has been improved  
✅ Frontend validation added
✅ Currency changed to LKR (Sri Lankan Rupee)
❌ Stripe public key needs to be configured
❌ Webhook secret needs to be configured

## Next Steps

1. Add your real Stripe public key to `client/.env`
2. Test the payment flow
3. Check browser console for any errors
4. Ensure you're using test credit card numbers from Stripe docs

## Test Credit Cards (Stripe Test Mode)

- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
- Requires authentication: 4000 0025 0000 3155

Use any future expiry date, any 3-digit CVC, and any postal code.

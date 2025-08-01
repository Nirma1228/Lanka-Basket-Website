import stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const Stripe = process.env.STRIPE_SECRET_KEY ? stripe(process.env.STRIPE_SECRET_KEY) : null

export default Stripe
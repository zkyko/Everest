import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Must match the Stripe SDK's supported apiVersion union type for this package version
  apiVersion: '2023-10-16',
})


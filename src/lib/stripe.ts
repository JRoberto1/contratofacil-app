import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_chavedeteste';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16' as any, // Using string casting if @types/stripe hasn't updated to latest types natively
  appInfo: {
    name: 'ContratoFácil',
    version: '2.0.0',
  },
});

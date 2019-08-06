import { requireEnv } from '@friends-library/types';
import Stripe from 'stripe';

const STRIPE_FLAT_FEE = 30;
const STRIPE_PERCENTAGE = 0.029;

export function feeOffset(desiredNet: number): number {
  if (!Number.isInteger(desiredNet) || desiredNet <= 0) {
    throw new TypeError('`desiredNet` must be positive integer (amount in cents)');
  }

  const withFlatFee = desiredNet + STRIPE_FLAT_FEE;
  const percentageOffset = calculatePercentageOffset(withFlatFee);
  return STRIPE_FLAT_FEE + percentageOffset;
}

function calculatePercentageOffset(amt: number, carry: number = 0): number {
  const offset = Math.round(amt * STRIPE_PERCENTAGE);
  if (offset === 0) {
    return carry;
  }
  return calculatePercentageOffset(offset, carry + offset);
}

let clientInstance: Stripe;

export default function client(): Stripe {
  if (clientInstance) return clientInstance;
  const { STRIPE_SECRET_KEY } = requireEnv('STRIPE_SECRET_KEY');
  clientInstance = new Stripe(STRIPE_SECRET_KEY);
  return clientInstance;
}

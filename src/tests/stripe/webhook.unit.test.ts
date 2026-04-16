import { processStripeEvent } from '@/app/api/stripe/webhook/_handler';
import type Stripe from 'stripe';

test('processStripeEvent handles unknown event type without throwing', async () => {
  const mockEvent = {
    id: 'evt_test',
    type: 'unknown.event',
    data: { object: {} },
  } as unknown as Stripe.Event;
  await expect(processStripeEvent(mockEvent)).resolves.toBeUndefined();
});

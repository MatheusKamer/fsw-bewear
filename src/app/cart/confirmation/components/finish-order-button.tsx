'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

import { createCheckoutSession } from '@/actions/create-checkout-session';
import { Button } from '@/components/ui/button';
import { useFinishOrder } from '@/hooks/mutations/use-finish-order';

export const FinishOrderButton = () => {
  const { mutateAsync: finishOrderMutation, isPending } = useFinishOrder();

  const handleFinishOrder = async () => {
    try {
      const { orderId } = await finishOrderMutation();

      if (!orderId) {
        throw new Error('Order ID is undefined');
      }

      const checkout = await createCheckoutSession({ orderId });

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );

      if (!stripe) {
        throw new Error('Stripe.js failed to load');
      }

      await stripe.redirectToCheckout({ sessionId: checkout.id });
    } catch (error) {
      console.error('Error finishing order:', error);
    }
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size={'lg'}
        disabled={isPending}
        onClick={handleFinishOrder}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Purchase
      </Button>
    </>
  );
};

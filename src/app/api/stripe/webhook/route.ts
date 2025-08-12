import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { db } from '@/db';
import { cartItemTable, cartTable, orderTable } from '@/db/schema';
import { auth } from '@/lib/auth';

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe secret key or webhook secret is not defined');
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  const user = session.user;

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    throw new Error('Missing Stripe signature');
  }

  const text = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.error();
    }

    await db
      .update(orderTable)
      .set({
        status: 'confirmed',
      })
      .where(eq(orderTable.id, orderId));

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, user.id),
      with: {
        shippingAddress: true,
        items: {
          with: {
            productVariant: true,
          },
        },
      },
    });

    if (cart) {
      await db.transaction(async (tx) => {
        await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
        await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
      });
    }
  }

  return NextResponse.json({ received: true });
};

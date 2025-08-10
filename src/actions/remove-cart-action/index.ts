'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartItemTable, cartTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { RemoveCartItemSchema, removeCartItemSchema } from './schema';

export const removeProductFromCart = async ({
  cartItemId,
}: RemoveCartItemSchema) => {
  removeCartItemSchema.parse({
    cartItemId,
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, cartItemId),
    with: { cart: true },
  });

  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;

  if (cartDoesNotBelongToUser) {
    throw new Error('Cart item does not belong to user');
  }

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};

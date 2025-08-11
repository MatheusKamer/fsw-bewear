'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartItemTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import {
  DecreaseCartProductQuantitySchema,
  decreaseCartProductQuantitySchema,
} from './schema';

export const decreaseCartProductQuantity = async ({
  cartItemId,
}: DecreaseCartProductQuantitySchema) => {
  decreaseCartProductQuantitySchema.parse({
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

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;

  if (cartDoesNotBelongToUser) {
    throw new Error('Cart item does not belong to user');
  }

  if (cartItem.quantity === 1) {
    return await db
      .delete(cartItemTable)
      .where(eq(cartItemTable.id, cartItem.id));
  }

  await db
    .update(cartItemTable)
    .set({
      quantity: cartItem.quantity - 1,
    })
    .where(eq(cartItemTable.id, cartItem.id));
};

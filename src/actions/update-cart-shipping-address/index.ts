'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import {
  UpdateCartShippingAddressSchema,
  updateCartShippingAddressSchema,
} from './schema';

export const updateCartShippingAddress = async ({
  shippingAddressId,
}: UpdateCartShippingAddressSchema) => {
  const validatedData = updateCartShippingAddressSchema.parse({
    shippingAddressId,
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const existingCart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });

    if (!existingCart) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
          shippingAddressId: validatedData.shippingAddressId,
        })
        .returning({ id: cartTable.id });

      return {
        success: true,
        cartId: newCart.id,
        message: 'Endereço vinculado ao carrinho com sucesso!',
      };
    } else {
      await db
        .update(cartTable)
        .set({
          shippingAddressId: validatedData.shippingAddressId,
        })
        .where(eq(cartTable.id, existingCart.id));

      return {
        success: true,
        cartId: existingCart.id,
        message: 'Endereço de entrega atualizado com sucesso!',
      };
    }
  } catch (error) {
    console.error('Error updating cart shipping address:', error);
    throw new Error('Erro ao vincular endereço ao carrinho. Tente novamente.');
  }
};

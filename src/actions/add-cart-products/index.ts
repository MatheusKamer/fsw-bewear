'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartItemTable, cartTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { AddProductToCartSchema, addProductToCartSchema } from './schema';

export const addProductToCart = async ({
  productVariantId,
  quantity,
}: AddProductToCartSchema) => {
  try {
    addProductToCartSchema.parse({
      productVariantId,
      quantity,
    });

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized');
    }

    const productVariant = await db.query.productVariantTable.findFirst({
      where: (productVariant, { eq }) =>
        eq(productVariant.id, productVariantId),
    });

    if (!productVariant) {
      throw new Error('Product variant not found');
    }

    console.log('Product Variant:', productVariant);

    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });

    let cartId = cart?.id;

    console.log('Cart ID:', cartId);

    if (!cartId) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
        })
        .returning();
      cartId = newCart.id;
    }

    console.log('Cart ID:', cartId);

    const cartItem = await db.query.cartItemTable.findFirst({
      where: (cartItem, { eq }) =>
        eq(cartItem.cartId, cartId) &&
        eq(cartItem.productVariantId, productVariantId),
    });

    console.log('Cart Item:', cartItem);

    if (cartItem) {
      await db
        .update(cartItemTable)
        .set({ quantity: cartItem.quantity + quantity })
        .where(eq(cartItemTable.id, cartItem.id));

      return;
    }

    console.log('Adding new cart item:', {
      cartId,
      productVariantId,
      quantity,
    });

    await db.insert(cartItemTable).values({
      cartId,
      productVariantId,
      quantity,
    });

    console.log('✅ Product successfully added to cart');
  } catch (error) {
    console.error('❌ Error in addProductToCart:', error);

    // Log specific error details
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Check if it's a database constraint error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error code:', (error as { code: unknown }).code);
      console.error(
        'Database error detail:',
        (error as { detail?: unknown }).detail,
      );
      console.error(
        'Database error constraint:',
        (error as { constraint?: unknown }).constraint,
      );
    }

    // Re-throw the error so it's handled by the frontend
    throw error;
  }
};

'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartTable, orderItemTable, orderTable } from '@/db/schema';
import { auth } from '@/lib/auth';

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  if (!cart.shippingAddress) {
    throw new Error('Shipping address not found');
  }

  const totalPriceInCents = cart.items.reduce((total, item) => {
    return total + item.productVariant.priceInCents * item.quantity;
  }, 0);

  let orderId: string | undefined;

  await db.transaction(async (tx) => {
    if (!cart.shippingAddress) {
      throw new Error('Shipping address not found');
    }

    const [order] = await tx
      .insert(orderTable)
      .values({
        zipCode: cart.shippingAddress.zipCode,
        city: cart.shippingAddress.city,
        country: cart.shippingAddress.country,
        complement: cart.shippingAddress.complement,
        neighborhood: cart.shippingAddress.neighborhood,
        number: cart.shippingAddress.number,
        phone: cart.shippingAddress.phone,
        recipientName: cart.shippingAddress.recipientName,
        state: cart.shippingAddress.state,
        street: cart.shippingAddress.street,
        userId: session.user.id!,
        totalPriceInCents,
        shippingAddressId: cart.shippingAddress!.id,
      })
      .returning();

    if (!order) {
      throw new Error('Failed to create order');
    }

    orderId = order.id;

    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> =
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariant.id,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      }));

    await tx.insert(orderItemTable).values(orderItemsPayload);
  });

  return { orderId };
};

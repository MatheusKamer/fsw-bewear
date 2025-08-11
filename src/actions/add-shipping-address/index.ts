'use server';

import { headers } from 'next/headers';

import { updateCartShippingAddress } from '@/actions/update-cart-shipping-address';
import { db } from '@/db';
import { shippingAddressTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { AddShippingAddressSchema, addShippingAddressSchema } from './schema';

export const addShippingAddress = async (data: AddShippingAddressSchema) => {
  const validatedData = addShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const [newAddress] = await db
      .insert(shippingAddressTable)
      .values({
        userId: session.user.id,
        recipientName: validatedData.recipientName,
        street: validatedData.street,
        number: validatedData.number,
        complement: validatedData.complement || '',
        neighborhood: validatedData.neighborhood,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        country: validatedData.country,
        phone: validatedData.phone,
      })
      .returning({ id: shippingAddressTable.id });
    try {
      await updateCartShippingAddress({ shippingAddressId: newAddress.id });
    } catch (cartError) {
      console.warn('Warning: Could not link address to cart:', cartError);
    }

    return {
      success: true,
      addressId: newAddress.id,
      message: 'Endereço adicionado e vinculado ao carrinho com sucesso!',
    };
  } catch (error) {
    console.error('Error adding shipping address:', error);
    throw new Error('Erro ao adicionar endereço. Tente novamente.');
  }
};

import z from 'zod';

export const updateCartShippingAddressSchema = z.object({
  shippingAddressId: z.uuid('ID do endereço inválido'),
});

export type UpdateCartShippingAddressSchema = z.infer<
  typeof updateCartShippingAddressSchema
>;

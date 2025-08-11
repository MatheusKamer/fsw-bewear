import z from 'zod';

export const addShippingAddressSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Nome do destinatário deve ter pelo menos 2 caracteres'),
  street: z.string().min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 8, 'CEP deve ter 8 dígitos'),
  country: z.string().min(2, 'País é obrigatório'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine(
      (val) => val.length >= 10 && val.length <= 11,
      'Telefone deve ter 10 ou 11 dígitos',
    ),
});

export type AddShippingAddressSchema = z.infer<typeof addShippingAddressSchema>;

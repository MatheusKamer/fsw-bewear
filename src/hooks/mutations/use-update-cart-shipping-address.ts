import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateCartShippingAddress } from '@/actions/update-cart-shipping-address';
import { UpdateCartShippingAddressSchema } from '@/actions/update-cart-shipping-address/schema';

import { getUseCartQueryKey } from '../queries/use-cart';

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
      }
    },
    onError: (error) => {
      toast.error('Erro ao vincular endereço ao carrinho. Tente novamente.');
      console.error('Error updating cart shipping address:', error);
    },
  });
};

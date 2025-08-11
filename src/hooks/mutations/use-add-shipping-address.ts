import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { addShippingAddress } from '@/actions/add-shipping-address';
import { AddShippingAddressSchema } from '@/actions/add-shipping-address/schema';

export const useAddShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddShippingAddressSchema) => addShippingAddress(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        // Invalida a query dos endereços para atualizar a lista
        queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
        // Também invalida o carrinho pois o endereço foi automaticamente vinculado
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error) => {
      toast.error('Erro ao salvar endereço. Tente novamente.');
      console.error('Error adding shipping address:', error);
    },
  });
};

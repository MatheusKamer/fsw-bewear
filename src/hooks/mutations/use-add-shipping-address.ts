import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { addShippingAddress } from '@/actions/add-shipping-address';
import { AddShippingAddressSchema } from '@/actions/add-shipping-address/schema';

import { getUserAddressesKey } from '../queries/use-user-addresses';

export const useAddShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddShippingAddressSchema) => addShippingAddress(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: getUserAddressesKey() });
      }
    },
    onError: (error) => {
      toast.error('Erro ao salvar endereço. Tente novamente.');
      console.error('Error adding shipping address:', error);
    },
  });
};

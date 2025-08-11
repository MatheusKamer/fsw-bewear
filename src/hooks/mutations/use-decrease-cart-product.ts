import { useMutation, useQueryClient } from '@tanstack/react-query';

import { decreaseCartProductQuantity } from '@/actions/decrease-cart-product-quantity';

import { getUseCartQueryKey } from '../queries/use-cart';

export const getUseDecreaseCartProductMutationKey = (cartItemId: string) =>
  ['decreaseCartProduct', cartItemId] as const;

export const useDecreaseCartProduct = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [getUseDecreaseCartProductMutationKey(cartItemId)],
    mutationFn: async () => {
      await decreaseCartProductQuantity({ cartItemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};

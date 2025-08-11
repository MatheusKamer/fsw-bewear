import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeProductFromCart } from '@/actions/remove-cart-action';

import { getUseCartQueryKey } from '../queries/use-cart';

export const getUseRemoveProductFromCartMutationKey = (cartItemId: string) =>
  ['removeCartItem', cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [getUseRemoveProductFromCartMutationKey(cartItemId)],
    mutationFn: async () => {
      await removeProductFromCart({ cartItemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};

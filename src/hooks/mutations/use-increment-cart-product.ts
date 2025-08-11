import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addProductToCart } from '@/actions/add-cart-products';

import { getUseCartQueryKey } from '../queries/use-cart';

export const getUseIncrementCartProductMutationKey = (
  productVariantId: string,
) => ['incrementCartProduct', productVariantId];

export const useIncrementCartProduct = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseIncrementCartProductMutationKey(productVariantId),
    mutationFn: async () => {
      await addProductToCart({ productVariantId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};

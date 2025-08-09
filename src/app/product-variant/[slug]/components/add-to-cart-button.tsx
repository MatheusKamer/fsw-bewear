'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { addProductToCart } from '@/actions/add-cart-products';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  productVariantId: string;
  quantity?: number;
}

export const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['addProductToCart', productVariantId, quantity],
    mutationFn: async () =>
      addProductToCart({
        productVariantId,
        quantity: quantity ? quantity : 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return (
    <Button
      disabled={isPending}
      className="rounded-full"
      size="lg"
      variant="outline"
      onClick={() => mutate()}
    >
      {isPending ? <Loader2 className="animate-spin" /> : 'Add to cart'}
    </Button>
  );
};

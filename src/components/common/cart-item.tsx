import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { addProductToCart } from '@/actions/add-cart-products';
import { decreaseCartProductQuantity } from '@/actions/decrease-cart-product-quantity';
import { removeProductFromCart } from '@/actions/remove-cart-action';
import { formatCentsToBRL } from '@/helpers/money';

import { Button } from '../ui/button';

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantPriceInCents: number;
  productVariantImageUrl: string;
  quantityProduct: number;
}

export const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantPriceInCents,
  productVariantImageUrl,
  quantityProduct,
}: CartItemProps) => {
  const [quantity, setQuantity] = useState(quantityProduct);

  const queryClient = useQueryClient();

  const { mutate: removeFromCart } = useMutation({
    mutationKey: ['removeCartItem', id],
    mutationFn: async () => {
      await removeProductFromCart({ cartItemId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const { mutate: decreaseProductQuantity } = useMutation({
    mutationKey: ['decreaseCartProductQuantity', id],
    mutationFn: async () => {
      await decreaseCartProductQuantity({ cartItemId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setQuantity((prev) => Math.max(prev - 1, 1));
    },
  });

  const { mutate: incrementProductQuantity } = useMutation({
    mutationKey: ['incrementCartProductQuantity', productVariantId],
    mutationFn: async () => {
      await addProductToCart({ productVariantId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setQuantity((prev) => prev + 1);
    },
  });

  const priceTotal = formatCentsToBRL(productVariantPriceInCents * quantity);
  return (
    <div className="relative flex items-center justify-between px-2" key={id}>
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-24 items-center justify-between rounded-lg border">
            <Button
              disabled={quantity === 1}
              size={'icon'}
              variant={'ghost'}
              onClick={() => decreaseProductQuantity()}
            >
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={() => incrementProductQuantity()}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex h-[78px] flex-col items-end justify-between">
        <p className="text-sm font-medium">{priceTotal}</p>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={() => removeFromCart()}
        >
          <TrashIcon className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

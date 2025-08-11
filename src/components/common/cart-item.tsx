import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { formatCentsToBRL } from '@/helpers/money';
import { useDecreaseCartProduct } from '@/hooks/mutations/use-decrease-cart-product';
import { useIncrementCartProduct } from '@/hooks/mutations/use-increment-cart-product';
import { useRemoveProductFromCart } from '@/hooks/mutations/use-remove-product-from-cart';

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

  const { mutate: removeFromCart } = useRemoveProductFromCart(id);
  const { mutate: decreaseProductQuantity } = useDecreaseCartProduct(id);
  const { mutate: incrementProductQuantity } =
    useIncrementCartProduct(productVariantId);

  function handleRemoveProductFromCart() {
    try {
      removeFromCart();
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  }

  function handleDecreaseQuantity() {
    try {
      decreaseProductQuantity();

      setQuantity((prev) => Math.max(prev - 1, 1));
    } catch (error) {
      console.error('Error decreasing product quantity:', error);
    }
  }

  function handleIncrementQuantity() {
    try {
      incrementProductQuantity();

      setQuantity((prev) => prev + 1);
    } catch (error) {
      console.error('Error incrementing product quantity:', error);
    }
  }

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
              disabled={quantity < 2}
              size={'icon'}
              variant={'ghost'}
              onClick={handleDecreaseQuantity}
            >
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={handleIncrementQuantity}
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
          onClick={handleRemoveProductFromCart}
        >
          <TrashIcon className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

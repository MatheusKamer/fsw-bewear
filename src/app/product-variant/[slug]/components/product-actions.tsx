'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { AddToCartButton } from './add-to-cart-button';

interface ProductActionsProps {
  productVariantId: string;
}

export const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantity</h3>
          <div className="flex w-24 items-center justify-between rounded-lg border">
            <Button size={'icon'} variant={'ghost'} onClick={decrement}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size={'icon'} variant={'ghost'} onClick={increment}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 px-5">
        <AddToCartButton productVariantId={productVariantId} quantity={1} />
        <Button className="rounded-full" size="lg">
          Buy now
        </Button>
      </div>
    </>
  );
};

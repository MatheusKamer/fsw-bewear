'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
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
  );
};

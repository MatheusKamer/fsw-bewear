import { useQuery } from '@tanstack/react-query';
import { ShoppingBasketIcon } from 'lucide-react';
import Image from 'next/image';

import { getCart } from '@/actions/get-cart';

import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

export const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => getCart(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={'icon'}>
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div>
          {cartIsLoading && <div>Loading...</div>}
          {cart?.items.map((item) => (
            <div className="flex items-center space-x-4" key={item.id}>
              <Image
                src={item.productVariant.imageUrl}
                alt={item.productVariant.name}
                width={100}
                height={100}
              />
              <div>{item.productVariant.name}</div>
              <div>{item.quantity}</div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

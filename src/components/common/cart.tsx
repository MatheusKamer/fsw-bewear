'use client';

import { ShoppingBasketIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { formatCentsToBRL } from '@/helpers/money';
import { useCart } from '@/hooks/queries/use-cart';

import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { CartItem } from './cart-item';

export const Cart = () => {
  const { data: cart } = useCart();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size={'icon'}>
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex h-full flex-col gap-8 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-5">
                {cart?.items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    productName={item.productVariant.product.name}
                    productVariantId={item.productVariant.id}
                    productVariantName={item.productVariant.name}
                    productVariantPriceInCents={
                      item.productVariant.priceInCents
                    }
                    productVariantImageUrl={item.productVariant.imageUrl}
                    quantityProduct={item.quantity}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {cart?.items && cart.items.length > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />
              <div className="flex items-center justify-between px-2">
                <p className="text-sm font-medium">Subtotal</p>
                <p className="text-sm font-medium">
                  {formatCentsToBRL(cart.totalPriceInCents)}
                </p>
              </div>

              <Separator />
              <div className="px-5">
                <Button
                  variant="default"
                  className="w-full rounded-full"
                  onClick={() => setIsSheetOpen(false)}
                  asChild
                >
                  <Link href="/cart/identification">Checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

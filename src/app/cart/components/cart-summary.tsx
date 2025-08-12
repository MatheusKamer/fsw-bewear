import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCentsToBRL } from '@/helpers/money';

interface CartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
}

export const CartSummary = ({
  subtotalInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Carrinho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(subtotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Shipping Tax</p>
          <p className="text-muted-foreground text-sm font-medium">FREE</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(totalInCents)}
          </p>
        </div>
        <Separator />

        {products.map((product) => (
          <div
            className="relative flex items-center justify-between"
            key={product.id}
          >
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-row gap-2">
                <Image
                  src={product.imageUrl}
                  alt={product.variantName}
                  width={78}
                  height={78}
                  className="rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">{product.productName}</p>
                  <p className="text-muted-foreground text-xs font-medium">
                    {product.variantName}
                  </p>
                  <p>{product.quantity}</p>
                </div>
              </div>
              <div className="flex h-[78px] flex-col items-end justify-between">
                <p className="text-sm font-medium">
                  {formatCentsToBRL(product.priceInCents * product.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

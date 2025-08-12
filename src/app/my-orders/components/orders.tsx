'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orderTable } from '@/db/schema';
import { formatCentsToBRL } from '@/helpers/money';

interface OrdersProps {
  orders: Array<{
    orderId: string;
    totalPriceInCents: number;
    status: (typeof orderTable.$inferInsert)['status'];
    createdAt: string;
    items: Array<{
      id: string;
      imageUrl: string;
      productName: string;
      productVariantName: string;
      priceInCents: number;
      quantity: number;
    }>;
  }>;
}

export const Orders = ({ orders }: OrdersProps) => {
  return (
    <div className="space-y-5">
      {orders.length === 0 && (
        <Card className="mb-3">
          <CardContent>
            <div className="space-y-3 py-2 text-center text-gray-500">
              <p>You don&apos;t have any orders yet.</p>
              <Button variant="default" className="rounded-full" size={'lg'}>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {orders.map((order) => (
        <Card key={order.orderId}>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value={`item-${order.orderId}`}>
                <AccordionTrigger>
                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <Badge className="rounded-full">Pending</Badge>
                    )}
                    {order.status === 'confirmed' && (
                      <Badge className="rounded-full">Paid</Badge>
                    )}
                    <p>
                      {`Order placed at ${new Date(
                        order.createdAt,
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}`}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {order.items.map((product) => (
                    <div
                      className="relative flex items-center justify-between"
                      key={product.id}
                    >
                      <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex flex-row gap-2">
                          <Image
                            src={product.imageUrl}
                            alt={product.productName}
                            width={78}
                            height={78}
                            className="rounded-lg"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold">
                              {product.productName}
                            </p>
                            <p className="text-muted-foreground text-xs font-medium">
                              {product.productVariantName}
                            </p>
                            <p>{product.quantity}</p>
                          </div>
                        </div>
                        <div className="flex h-[78px] flex-col items-end justify-between">
                          <p className="text-sm font-medium">
                            {formatCentsToBRL(
                              product.priceInCents * product.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Subtotal</p>
                      <p className="text-muted-foreground text-sm font-medium">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Shipping Tax</p>
                      <p className="text-muted-foreground text-sm font-medium">
                        FREE
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Total</p>
                      <p className="text-muted-foreground text-sm font-medium">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

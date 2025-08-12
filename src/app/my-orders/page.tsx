import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { orderTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { Orders } from './components/orders';

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: (orderTable, { desc }) => desc(orderTable.createdAt),
  });

  return (
    <div className="px-5">
      <Orders
        orders={orders.map((order) => ({
          orderId: order.id,
          totalPriceInCents: order.totalPriceInCents,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          items: order.items.map((item) => ({
            id: item.id,
            imageUrl: item.productVariant?.imageUrl ?? '',
            productName: item.productVariant?.product.name ?? '',
            productVariantName: item.productVariant?.name ?? '',
            priceInCents: item.priceInCents,
            quantity: item.quantity,
          })),
        }))}
      />
    </div>
  );
};

export default MyOrdersPage;

import { desc } from 'drizzle-orm';
import Image from 'next/image';

import { CategorySelector } from '@/components/common/category-selector';
import { PartnerBrands } from '@/components/common/partner-brands';
import { ProductsList } from '@/components/common/products-list';
import { db } from '@/db';
import { productTable } from '@/db/schema';

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany();

  return (
    <>
      <div className="space-y-6">
        <div className="px-5">
          <Image
            src={'/banners/banner-01.png'}
            alt="Live a life in style"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <PartnerBrands />

        <ProductsList title="Featured Products" products={products} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <Image
            src={'/banners/banner-02.png'}
            alt="Live a life in style"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductsList
          title="Recently Created Products"
          products={newlyCreatedProducts}
        />
      </div>
    </>
  );
}

import Image from 'next/image';

import { Header } from '@/components/common/header';
import { ProductsList } from '@/components/common/products-list';
import { db } from '@/db';

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  console.log(products);

  return (
    <>
      <Header />
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

        <ProductsList title="Featured Products" products={products} />

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
      </div>
    </>
  );
}

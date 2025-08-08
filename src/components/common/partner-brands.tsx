import Image from 'next/image';

import { Brands } from '@/mocks/brands';

export const PartnerBrands = () => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">Partner Brands</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {Brands.map((brand) => (
          <div key={brand.id} className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-28 items-center justify-center rounded-3xl border-2 border-gray-200 md:w-40">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <p className="font-semibold">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

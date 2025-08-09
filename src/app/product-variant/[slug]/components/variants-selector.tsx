'use client';

import Image from 'next/image';
import Link from 'next/link';

import { productVariantTable } from '@/db/schema';
import { cn } from '@/lib/utils';

interface VariantsSelectorProps {
  selectedVariant: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

export const VariantsSelector = ({
  selectedVariant,
  variants,
}: VariantsSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          key={variant.id}
          href={`/product-variant/${variant.slug}`}
          className={cn({ 'opacity-50': selectedVariant !== variant.slug })}
        >
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            width={68}
            height={68}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
};

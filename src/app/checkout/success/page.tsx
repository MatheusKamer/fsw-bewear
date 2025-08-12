'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

const CheckoutSuccessPage = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="flex flex-col items-center justify-center space-y-2">
          <Image
            src="/order-finished.svg"
            alt="Confirmation"
            width={200}
            height={200}
          />
          <DialogTitle className="text-2xl">Order Completed!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for your purchase! Your order has been successfully
            completed.
          </DialogDescription>
          <DialogFooter className="w-full">
            <Button className="rounded-full" size={'lg'} variant="outline">
              <Link href="/my-orders">Access my orders</Link>
            </Button>
            <Button className="rounded-full" size={'lg'}>
              <Link href="/">Return to the store</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutSuccessPage;

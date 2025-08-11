'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFinishOrder } from '@/hooks/mutations/use-finish-order';

export const FinishOrderButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: finishOrderMutation, isPending } = useFinishOrder();

  const handleFinishOrder = () => {
    try {
      finishOrderMutation();
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error finishing order:', error);
    }
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size={'lg'}
        disabled={isPending}
        onClick={handleFinishOrder}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Purchase
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          <DialogFooter>
            <Button className="rounded-full" size={'lg'}>
              <Link href="/">Return to the store</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

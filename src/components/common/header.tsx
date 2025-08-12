'use client';

import { LogInIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Cart } from './cart';

export const Header = () => {
  const { data: session } = authClient.useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-5">
      <Link href={'/'}>
        <Image src="/logo.svg" alt="Logo" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-2">
        <Cart />

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size={'icon'}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <div className="flex justify-between space-y-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={session.user.image as string | undefined}
                        alt={session.user.name}
                      />
                      <AvatarFallback>
                        {session.user.name?.split(' ')[0][0] || 'U'}
                        {session.user.name?.split(' ')[1][0] || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">{session.user.name}</h3>
                      <span className="text-muted-foreground block text-sm">
                        {session.user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      size={'icon'}
                      variant={'outline'}
                      onClick={() => {
                        authClient.signOut();
                        setIsSheetOpen(false);
                      }}
                    >
                      <LogInIcon />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Sign in</h2>
                  <Button
                    size={'icon'}
                    asChild
                    variant={'outline'}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Link href={'/authentication'}>
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SignInForm from './components/sign-in-form';
import SignUpForm from './components/sign-up-form';

export default function Authentication() {
  return (
    <>
      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="w-full md:w-[400px]">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up" className="w-full md:w-[400px]">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

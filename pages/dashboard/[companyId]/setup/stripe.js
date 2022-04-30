import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import SetupProgress from '@/components/ui/SetupProgress'; 
import SEOMeta from '@/components/SEOMeta'; 

export default function StripeSetupPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Add Stripe Account"/>
      <div className="py-16">
        <SetupProgress/>
        <div className="wrapper">
          <div className="max-w-xl mx-auto bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-2xl tracking-tight font-extrabold mb-6">
              {router.query.reconfirm ? 'Reconnect your Stripe account' : 'First things first...' }
            </h1>
            {
              router.query.reconfirm &&
              <p className="mb-8">We recently changed our Stripe account. Because of this, for security and privacy reasons we politely ask that you reconnect your account below.</p>
            }
            <div>
              <a 
                href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&scope=read_only&redirect_uri=https://localhost:3000/dashboard/stripe-verify`}
                target="_blank"
                className="w-full text-center block py-3 px-8 bg-primary hover:bg-primary-2 transition-all text-lg font-bold rounded-lg text-white"
              >
                Connect Stripe Account
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <a
              onClick={() => signOut()}
              href="#"
              className="text-md underline"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
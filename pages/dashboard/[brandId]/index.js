import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { useBrand } from '@/utils/BrandContext';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 

export default function InnerDashboardPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeBrand } = useBrand();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user, activeBrand]);

  return (
    <>
      <SEOMeta title="Dashboard"/>
      <div className="mb-12">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Dashboard</h1>
        </div>
      </div>
      <div className="wrapper">
        
      </div>
    </>
  );
}
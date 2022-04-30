import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 

export default function InnerDashboardPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user, activeCompany]);

  if(activeCompany?.stripe_account_data === null){
    router.replace(`/dashboard/${router?.query?.companyId}/setup`);
  }

  return (
    <>
      <SEOMeta title="Dashboard"/>
      <div className="mb-12">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Campaigns</h1>
        </div>
      </div>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
}
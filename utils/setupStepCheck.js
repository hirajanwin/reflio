import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';

export default function setupStepCheck() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  
  if(activeCompany?.stripe_account_data === null){
    router.replace(`/dashboard/${router?.query?.companyId}/setup/stripe`);
  }
}
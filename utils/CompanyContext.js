import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getCompanies, useUser } from '@/utils/useUser';

export const CompanyContext = createContext();

export const CompanyContextProvider = (props) => {
  const { user, userFinderLoaded, signOut } = useUser();
  const [userCompanyDetails, setUserCompanyDetails] = useState(null);
  const router = useRouter();
  let value;

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  useEffect(() => {
    if (userFinderLoaded && getCompanies && user && userCompanyDetails === null) {
      Promise.allSettled([getCompanies(user?.id)]).then(
        (results) => {
          setUserCompanyDetails(Array.isArray(results[0].value) ? results[0].value : [results[0].value])
        }
      );
    }
  });

  if(userCompanyDetails !== null && userCompanyDetails?.length === 0 && !router?.asPath?.includes('add-company')){
    router.replace('/dashboard/add-company');
  }
  
  if(userCompanyDetails !== null && userCompanyDetails?.length > 0 && router?.asPath === '/dashboard'){
    router.replace('/dashboard/'+userCompanyDetails[0]?.company_id+'');
  }

  if(userCompanyDetails !== null && userCompanyDetails?.length > 0 && router?.asPath?.includes('undefined')){
    router.replace('/dashboard/'+userCompanyDetails[0]?.company_id+'');
  }

  if(userCompanyDetails === null && router?.asPath?.includes('undefined')){
    signOut();
    router.replace('/signin');
  }

  let activeCompany = router?.query?.companyId ? userCompanyDetails?.filter(company => company?.company_id === router?.query?.companyId) : Array.isArray(userCompanyDetails) ? userCompanyDetails[0] : userCompanyDetails;
  if(Array.isArray(activeCompany)){
    activeCompany = activeCompany[0]
  }

  value = {
    activeCompany,
    userCompanyDetails
  };

  return <CompanyContext.Provider value={value} {...props}  />;
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a CompanyContextProvider.`);
  }
  return context;
};
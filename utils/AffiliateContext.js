import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getAffiliates, useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';

export const AffiliateContext = createContext();

export const AffiliateContextProvider = (props) => {
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const [userAffiliateDetails, setUserAffiliateDetails] = useState(null);
  const router = useRouter();
  let value;

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  useEffect(() => {
    if (userFinderLoaded && getAffiliates && user && userAffiliateDetails === null && activeCompany?.company_id) {
      Promise.allSettled([getAffiliates(activeCompany?.company_id)]).then(
        (results) => {
          setUserAffiliateDetails(Array.isArray(results[0].value) ? results[0].value : [results[0].value])
        }
      );
    }
  });

  value = {
    userAffiliateDetails
  };

  return <AffiliateContext.Provider value={value} {...props}  />;
}

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a AffiliatesContextProvider.`);
  }
  return context;
};
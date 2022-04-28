import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getBrands, useUser } from '@/utils/useUser';

export const BrandContext = createContext();

export const BrandContextProvider = (props) => {
  const { user, userFinderLoaded, signOut } = useUser();
  const [userBrandDetails, setUserBrandDetails] = useState(null);
  const router = useRouter();
  let value;

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  useEffect(() => {
    if (userFinderLoaded && getBrands && user && userBrandDetails === null) {
      Promise.allSettled([getBrands(user?.id)]).then(
        (results) => {
          setUserBrandDetails(Array.isArray(results[0].value) ? results[0].value : [results[0].value])
        }
      );
    }
  });

  console.log(userBrandDetails)

  if(userBrandDetails !== null && userBrandDetails?.length === 0 && !router?.asPath?.includes('add-brand')){
    router.replace('/dashboard/add-brand');
  }

  if(userBrandDetails !== null && userBrandDetails?.message){
    router.replace('/dashboard');
  }
  
  if(userBrandDetails !== null && userBrandDetails?.length > 0 && router?.asPath === '/dashboard'){
    router.replace('/dashboard/'+userBrandDetails[0]?.brand_id+'');
  }

  if(userBrandDetails !== null && userBrandDetails?.length > 0 && router?.asPath?.includes('undefined')){
    router.replace('/dashboard/'+userBrandDetails[0]?.brand_id+'');
  }

  if(userBrandDetails === null && router?.asPath?.includes('undefined')){
    signOut();
    router.replace('/signin');
  }

  let activeBrand = router?.query?.brandId ? userBrandDetails?.filter(brand => brand?.brand_id === router?.query?.brandId) : Array.isArray(userBrandDetails) ? userBrandDetails[0] : userBrandDetails;
  if(Array.isArray(activeBrand)){
    activeBrand = activeBrand[0]
  }

  value = {
    activeBrand,
    userBrandDetails
  };

  return <BrandContext.Provider value={value} {...props}  />;
}

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a BrandContextProvider.`);
  }
  return context;
};
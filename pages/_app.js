import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import '@/assets/main.css';
import '@/assets/chrome-bug.css';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import SEOMeta from '@/components/SEOMeta'; 

export default function MyApp({ Component, pageProps }) {
  const UserContextProvider = dynamic(() =>
    import("@/utils/useUser").then((module) => module.UserContextProvider)
  );
  const BrandContextProvider = dynamic(() =>
    import("@/utils/BrandContext").then((module) => module.BrandContextProvider)
  );
  const router = useRouter();
  
  useEffect(() => {
    document.body.classList?.remove('loading');

    if(router?.asPath?.indexOf("&token_type=bearer&type=recovery") > 0) {
      let access_token = router?.asPath?.split("access_token=")[1].split("&")[0];
      router.push('/reset-password?passwordReset=true&access_token='+access_token+'');
    }
  }, []);

  return (
    <>
      <SEOMeta/>
      <div>
        {
          router.pathname.indexOf('/dashboard') > -1 ?
            <UserContextProvider>
              <BrandContextProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </BrandContextProvider>
            </UserContextProvider>
          :
            <UserContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </UserContextProvider>
        }
      </div>
    </>
  );
}
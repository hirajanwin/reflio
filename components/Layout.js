import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Navbar from '@/components/ui/Navbar';
import { useCompany } from '@/utils/CompanyContext';

export default function Layout({ children, meta: pageMeta }) {
  const Toaster = dynamic(() =>
    import("react-hot-toast").then((module) => module.Toaster)
  );
  const Footer = dynamic(() => import('@/components/ui/Footer'));
  const AdminMobileNav = dynamic(() => import('@/components/ui/AdminNavbar/AdminMobileNav'));
  const AdminDesktopNav = dynamic(() => import('@/components/ui/AdminNavbar/AdminDesktopNav'));
  const SimpleNav = dynamic(() => import('@/components/ui/SimpleNav'));
  const router = useRouter();
  const { activeCompany } = useCompany();

  return (
    <>
      <>
        <Toaster
          position="bottom-center"
          reverseOrder={true}
          gutter={20}
          toastOptions={{
            className: '',
            duration: 5000,
            style: {
              background: '#fff',
              color: '#111827',
            },
            // Default options for specific types
            success: {
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              style: {
                background: '#DC2626',
                color: 'white',
              },
            },
          }}
        />
        {
          router.pathname !== '/' && router.pathname.indexOf('/dashboard') === -1 && router.pathname.indexOf('/dashboard/add-company') === -1 &&
          <Navbar />
        }
        { 
          router.pathname === '/dashboard/add-company' &&
          <SimpleNav/>
        }
        {
          router.pathname.indexOf('/dashboard') === -1 ?
            <main id="skip">{children}</main>
          : router.pathname === '/dashboard/add-company' ?
            <main id="skip">{children}</main>
          :
            <div className="h-screen flex overflow-hidden">
              <AdminDesktopNav/>
              <div className="flex-1 overflow-auto focus:outline-none">
                {
                  activeCompany && activeCompany !== null && activeCompany?.company_id && activeCompany?.stripe_id === null && activeCompany?.stripe_account_data !== null &&
                  <div className="bg-red-500 text-center text-white py-4 font-semibold">
                    <div className="wrapper">
                      <p>Your Stripe account is no longer connected and is not sending data. <a href={`/dashboard/${activeCompany?.company_id}/setup/stripe`} className="font-bold underline">Please reconnect your account</a> so that no data is missed, and referral data is tracked.</p>
                    </div>
                  </div>
                }
                <AdminMobileNav/>
                <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
                  <>
                    {children}
                  </>
                </main>
              </div>
            </div>
        }
        {
          router.pathname.indexOf('/dashboard') === -1 && router.pathname.indexOf('/dashboard/add-company') === -1 &&
          <Footer />
        }
      </>
    </>
  );
}

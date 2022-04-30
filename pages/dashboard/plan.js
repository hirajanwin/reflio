import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, getSubmissions } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import SEOMeta from '@/components/SEOMeta'; 
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import Button from '@/components/ui/Button'; 

export default function PlanPage() {
  const router = useRouter();
  const { user, session, userFinderLoaded, planDetails } = useUser();
  const { userCompanyDetails } = useCompany();
  const [submissions, setSubmissions] = useState(null);
  const [priceIdLoading, setPriceIdLoading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLtd, setLoadingLtd] = useState(false);
  const [ltdInput, setLtdInput] = useState(null);

  const handleCheckout = async (price) => {    
    setLoading(true);

    if (!session) {
      return router.push('/signin');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
        token: session.access_token
      });

      const stripe = await getStripe();
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert(error.message);
    } finally {
      setPriceIdLoading(false);
    }
  };

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url, error } = await postData({
      url: '/api/create-portal-link',
      token: session.access_token
    });
    if (error) return alert(error.message);
    window.location.assign(url);
    setLoading(false);
  };

  const handleLtd = async (code) => {
    setLoadingLtd(true);
    const { subscriptionId, error } = await postData({
      url: '/api/create-lifetime-deal',
      token: session.access_token,
      data: { couponCode: code }
    });
    if (error){
      alert(error.message);
      setLoadingLtd(false);
    }
    if(subscriptionId){
      setLoadingLtd(false);
      if (window.confirm('Your lifetime deal was successfully activated. Your plan may take a couple of minutes to update.')){
        window.location.href = window.location.href;
      }
    }
  };

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user, userCompanyDetails]);

  useEffect(() => {
    if (getSubmissions && user && submissions === null) {
      Promise.allSettled([getSubmissions(user?.id, null, null)]).then(
        (results) => {
          if(results[0].value){    
            console.log(results)  
            setSubmissions(results[0].value);
          }
        }
      );
    }
  }, [getSubmissions]);
    
  return (
    <>
      <SEOMeta title="Settings"/>
      <div className="pb-10 mb-12 border-b-4 border-secondary">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Your Plan</h1>
        </div>
      </div>
      <div className="wrapper">
        <div>
          <div className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300">
            <div className="p-6">
              <div className="flex items-center mb-2">
                <h2 className="text-xl leading-6 font-semibold text-gray-900">Current Plan</h2>
                <span className={`${planDetails === 'free' ? 'bg-primary' : 'bg-secondary' } text-white py-1 px-3 text-xs rounded-xl ml-2 uppercase font-semibold`}>{planDetails === 'free' ? 'Free' : planDetails}</span>
              </div>
              <p className="text-lg mb-1"><span className="font-semibold">{submissions?.length} of {planDetails === 'free' ? '15' : '∞'}</span> submissions received.</p>
              <p className="text-lg"><span className="font-semibold">{userCompanyDetails?.length} of {planDetails === 'free' ? '1' : '∞'}</span> companies created.</p>
              {
                planDetails === 'free' &&
                <p className="text-md bg-gray-100 rounded-xl p-4 mt-3">Upgrade to <span className="font-bold">PRO</span> for <span className="font-semibold">$14/month</span> to unlock unlimited submissions, unlimited companies, automatic console errors & more.</p>
              }
            </div>
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <Button
                large
                secondary
                onClick={e=>{  planDetails === 'free' ? handleCheckout('price_1KRfK8JFcHkAGyDvn1msohog') : redirectToCustomerPortal() }}
              >
                {loading ? 'Loading...' : planDetails === 'free' ? 'Upgrade to PRO' : 'Manage Plan' }
              </Button>
            </div>
          </div>
          {
            planDetails === 'free' &&
            <div className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300 mt-12">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl leading-6 font-semibold text-gray-900">Lifetime Deal</h2>
                </div>
                <div className="sm:col-span-12">
                  <label htmlFor="ltdCode" className="text-lg mb-2">
                    Have a lifetime deal code? Enter it below to activate your plan.
                  </label>
                  <div className="mt-2 flex rounded-lg">
                    <input
                      onInput={e=>{e.target.value.length > 0 ? setLtdInput(e.target.value) : setLtdInput(null)}}
                      minlength="3"
                      maxLength="50"
                      required
                      placeholder="Enter code here"
                      type="text"
                      name="ltdCode"
                      id="ltdCode"
                      className="flex-1 block w-full min-w-0 p-3 rounded-lg focus:outline-none sm:text-sm border-2 border-gray-300"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-200 flex items-center justify-start">
                <Button
                  large
                  secondary
                  onClick={e=>{ ltdInput !== null && handleLtd(ltdInput) }}
                >
                  {loadingLtd ? 'Activating...' : 'Activate'}
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}
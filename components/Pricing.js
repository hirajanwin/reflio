import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';
import { CalendarIcon, CheckIcon, PlusIcon, UsersIcon, ViewBoardsIcon, ViewListIcon } from '@heroicons/react/outline';

export default function Pricing({ products }) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState('month');
  const [priceIdLoading, setPriceIdLoading] = useState();
  const { session, userLoaded, subscription } = useUser();

  const checklist = [
    'Unlimited companies',
    'Unlimited submissions',
    'Custom embed styling',
    'Remove Reflio companying',
    'Collect user console errors',
  ]

  const handleCheckout = async (price) => {
    console.log(price)
    
    setPriceIdLoading(price);

    if (!session) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/dashboard/plan');
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

  if(products?.length){
    return (
      <div>
        <div className="relative bg-gradient-to-b from-secondary to-secondary-2">
          <div>
            <div className="py-16 px-4 sm:py-24 sm:px-6 lg:bg-none lg:px-0 lg:pl-8 lg:flex lg:items-center lg:justify-center">
            {products.map((product) => {
                const price = product.prices.find(
                  (price) => price.interval === billingInterval
                );
                const priceString = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency,
                  minimumFractionDigits: 0
                }).format(price.unit_amount / 100);
                return (
                  <div>
                    <div className="max-w-xl mx-auto w-full lg:mx-0 text-center">
                      <h1 className="text-4xl md:text-5xl font-semibold text-white text-center mb-8">
                        Become a Pro
                      </h1>
                      <div className="max-w-md mx-auto mb-8 flex bg-gray-400 rounded-lg overflow-hidden shadow-xl">
                        <button
                          onClick={() => setBillingInterval('month')}
                          type="button"
                          className={`${billingInterval === 'month' ? 'bg-white' : 'bg-secondary-3 text-white'} w-1/2 p-3 text-md sm:text-md font-medium outline-none focus:outline-none`}
                        >
                            Monthly billing
                        </button>
                        <button
                          onClick={() => setBillingInterval('year')}
                          type="button"
                          className={`${billingInterval === 'month' ? 'bg-secondary-3 text-white' : 'bg-white'} w-1/2 p-3 text-md sm:text-md font-medium outline-none focus:outline-none`}
                        >
                            Yearly billing
                        </button>
                      </div>
                      <div className="text-center mb-8">
                        <p>
                          <span className="text-5xl font-extrabold text-white tracking-tight">
                            {priceString}
                          </span>
                          <span className="font-medium text-xl text-white">
                          {' '}/{billingInterval}
                          </span>
                        </p>
                        {
                          billingInterval === 'year' &&
                          <span className="bg-white px-4 py-1 text-sm rounded-lg mt-3 font-semibold inline-block">
                            Limited time only: SAVE 40%
                          </span>
                        }
                      </div>
                      <ul role="list" className="rounded overflow-hidden grid gap-px sm:grid-cols-2 mb-14 relative">
                        {checklist.map((item) => (
                          <li
                            key={item}
                            className="bg-secondary bg-opacity-50 py-4 px-4 flex items-center space-x-3 text-sm text-white"
                          >
                            <CheckIcon className="h-6 w-6 text-indigo-300" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        disabled={session && !userLoaded}
                        loading={priceIdLoading === price.id}
                        onClick={() => handleCheckout(price.id)}
                        className="pricing-button gradient-bg px-8 py-4 inline-flex mx-auto rounded-lg font-semibold text-white transition-all text-xl md:px-16"
                      >
                        {product.name === subscription?.prices?.products.name
                          ? 'Manage'
                          : 'Get Started'}
                      </button>
                    </div>  
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return false;
  }
}
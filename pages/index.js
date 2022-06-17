import { useState } from 'react';
import Button from '@/components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/solid';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function Index() {
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);
  const {width, height} = useWindowSize();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if(e.target.email.value === null) return false;

    const data = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value
      })
    }).then(function(response) {
      return response.json();

    }).then(function(data) {
      return data;
    });

    if(data?.result?.id){
      setError(false);
      setSubscribed(true);
    } else {
      setError(true);
    }
  };

  return(
    <>
      <div id="intro" className="relative py-14 md:py-24 bg-white md:bg-gradient-to-b md:from-gray-50 md:to-gray-200">
        <div className="wrapper text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <div className="mb-7">
                <h1 className="inline text-4xl lg:text-6xl font-semibold md:text-transparent md:bg-clip-text md:bg-gradient-to-r from-secondary to-secondary-2 tracking-tight">
                  Create a referral program <span className="inline md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-secondary-2 md:to-primary">without breaking the bank.</span>
                </h1>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 font-light">
                Reflio puts <span className="text-gray-700 font-medium underline">digital privacy first</span> and is <a href="https://github.com/Reflio-com" className="text-gray-700 font-medium underline">proudly open-source.</a> All referrals are processed through <span className="text-gray-700 font-medium underline">European-owned infrastructure</span>, and our company is registered in the UK. With Reflio, referrals located in the EU are <span className="text-gray-700 font-normal underline">automatically required to confirm their consent</span> before a cookie is set. 
              </p>
            </div>
            <div className="mt-5 text-sm flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center text-gray-600 font-medium">
                <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                <p>Free plan available</p>
              </div>
              <div className="flex items-center text-gray-600 font-medium">
                <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                <p>Auto cookie consent collection</p>
              </div>
              <div className="flex items-center text-gray-600 font-medium">
                <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                <p>GDPR compliant</p>
              </div>
            </div>
            <div className="mt-10">
              <div>
                <form type="POST" onSubmit={handleSubscribe} className="md:flex md:items-center w-full max-w-xl mx-auto h-auto md:h-20 rounded-lg overflow-hidden shadow-lg border-4 border-primary-2 outline-none focus:outline-none">
                  <div className="flex items-center h-20 md:flex-grow">
                    <input type="email" id="email" name="email" placeholder="youremail@email.com" required className="w-auto flex-grow h-full border-none px-3 text-gray-700 text-md md:text-lg font-medium outline-none focus:outline-none"/>
                  </div>
                  <button disabled={subscribed === true ? true : false} type="submit" className={`${subscribed ? 'bg-primary-2' : 'bg-primary hover:bg-primary-2' } w-full h-full md:w-auto p-5 md:p-0 transition-all font-bold text-md md:text-lg px-3 md:px-5`}>{subscribed ? 'Your Subscribed' : 'Get Updates'}</button>
                </form>

                <p className="text-lg mt-3 text-gray-700">Sign up and be one of the first to get early access.</p>
                
                {
                  subscribed &&
                  <div className="mt-10 mx-auto bg-green p-5 rounded-lg bg-secondary max-w-xl border-4 border-secondary-2">
                    <p className="text-white font-bold text-lg">Thank you for signing up. We'll be sending out updates ASAP.</p>
                  </div>
                }
                
                {
                  error &&
                  <div className="mt-10 mx-auto bg-green p-5 rounded-lg bg-secondary max-w-xl border-4 border-secondary-2">
                    <p className="text-white font-bold text-lg">There was an error when signing up - please try again later.</p>
                  </div>
                }
              </div>
              {/* <Button
                xlarge
                primary
                href="/#intro"
              >
                <span>Get Updates</span>
              </Button> */}
            </div>
          </div>
          <div className="hidden md:block mt-16 -mb-40">
            <div className="max-w-4xl mx-auto">
              <div className="px-0 w-full h-auto bg-white rounded-3xl shadow-2xl mx-auto overflow-hidden">
                <img src="platform-screenshot.webp" alt="Screenshot of Reflio dashboard" className="mt-0 w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:pt-44 md:py-24 bg-gradient-to-b from-gray-200 to-gray-50 border-t-8 border-gray-300">
        <div className="wrapper">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">How we're different to competitors</h2>
          </div>
          <div>
            <Features/>
          </div>
        </div>
      </div>
      <div className="py-14 md:pt-24 md:pb-14 bg-gradient-to-b from-gray-200 to-gray-50">
        <div className="wrapper wrapper-sm">
          <div className="text-center">
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">We're proudly open-source</h2>
              <p className="text-2xl">Reflio is proudly OSS (Open source software). Our source code is available and accessible on GitHub so that anyone can read it, inspect it, review it and even contribute to make Reflio as great as possible.</p>
              <div className="mt-12">
                <Button
                  xlarge
                  primary
                  href="https://github.com/Reflio-com"
                >
                  <span>View on Github</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:py-24 bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">Your own dedicated affiliate signup page</h2>
              <p className="text-2xl">With Reflio, for each campaign you create you can send potential affiliates your very own signup page and brand it with your logo and colours.</p>
              <div className="mt-12">
                <Button
                  xlarge
                  primary
                  href="/#intro"
                >
                  <span>Get Updates</span>
                </Button>
              </div>
            </div>
            <div className="order-0 lg:order-1">
              <img loading="lazy" className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/invite-screenshot.webp" alt="Screenshot of join campaign feature"/>
            </div>
          </div>
        </div>
      </div>
      <div className="py-24 md:pb-32 bg-gradient-to-b from-gray-200 to-gray-50">
        <div className="wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
            <div className="order-0 lg:order-1">
              <img loading="lazy" className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/affiliate-screenshot.webp" alt="Screenshot of join campaign feature"/>
            </div>
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">One affiliate dashboard to rule them all</h2>
              <p className="text-2xl">Your affiliates can manage all of their different campaigns from one, easy to use dashboard. Having access to all of their campaigns from different brands in one place means both higher referral conversion and satisfaction rates.</p>
              <div className="mt-12">
                <Button
                  xlarge
                  primary
                  href="/#intro"
                >
                  <span>Get Updates</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="pricing" className="py-14 md:py-24 bg-gradient-to-b from-primary to-primary-2">
        <div className="wrapper wrapper-sm">
          <div className="text-center">
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">Pricing from $0/month</h2>
              <p className="text-2xl">Reflio starts from just $0/month with a 9% commission per successful referral, with different pricing plans available for larger-scale campaigns.</p>
              <div className="text-lg font-semibold mt-6 py-2 px-5 bg-white rounded-xl inline-flex mx-auto">We will be releasing our full list of pricing plans very soon.</div>
              <div className="mt-12">
                <Button
                  xlarge
                  secondary
                  href="/#intro"
                >
                  <span>Get Updates</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:pt-24 md:pb-36 bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="wrapper">
          <div>
            <Testimonials/>
          </div>
        </div>
      </div>
      <div className="py-24 bg-gradient-to-b from-secondary to-secondary-2">
        <div className="wrapper wrapper-sm text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">We're going live soon.</h2>
            <div className="mt-5">
              <Button
                xlarge
                primary
                href="/#intro"
              >
                <span>Get Updates</span>
              </Button>
            </div>
            <div className="mt-5 text-sm flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center text-white font-medium">
                <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                <p>Free plan available</p>
              </div>
              <div className="flex items-center text-white font-medium">
                <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                <p>Auto cookie consent collection</p>
              </div>
              <div className="flex items-center text-white font-medium">
                <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                <p>GDPR compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        subscribed &&
        <div className="w-full h-full absolute top-0 left-0 z-10">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={100}
            gravity={0.05}
            tweenDuration={8000}
          />
        </div>
      }
    </>
  )
}
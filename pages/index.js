import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Logo from '@/components/icons/Logo';

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

    console.log(data)

    if(data?.result?.id){
      setError(false);
      setSubscribed(true);
    } else {
      setError(true);
    }
  };
  
  return(
    <>
      <div className="relative py-12">
        <div className="wrapper wrapper-sm">
          <div className="mb-14">
            <Logo className="w-32 md:w-44 h-auto"/>
          </div>
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl mb-8">
              Create a <span className="italic font-bold">privacy-friendly referral program</span> for your SaaS.
            </h1>
            <p className="text-xl sm:text-3xl text-gray-500 font-light">
              Reflio puts <span className="text-gray-600 font-normal underline">digital privacy first</span>. All referrals are processed through <span className="text-gray-600 font-normal underline">European-owned infrastructure</span>, and our company is registered in the UK. With Reflio, referrals located in the EU are <span className="text-gray-600 font-normal underline">automatically required to confirm their consent</span> before a cookie is set. 
            </p>
          </div>
          <div className="mb-10">
            <p className="text-xl text-gray-600 font-light">
              Pricing will start from <span className="text-gray-600 font-normal underline">$0/month</span>, with a <span className="text-gray-600 font-normal underline">9% commission</span> per successful referral.
            </p>
          </div>
          <div>
            <p className="text-lg mb-3 text-gray-700">Sign up and be one of the first to get early access.</p>
            <form type="POST" onSubmit={handleSubscribe} className="md:flex md:items-center w-full max-w-xl h-auto md:h-20 rounded-lg overflow-hidden shadow-lg border-4 border-primary outline-none focus:outline-none">
              <div className="flex items-center h-20 md:flex-grow">
                <input type="email" id="email" name="email" placeholder="youremail@email.com" required className="w-auto flex-grow h-full border-none px-3 text-gray-700 text-md md:text-lg font-medium outline-none focus:outline-none"/>
              </div>
              <button disabled={subscribed === true ? true : false} type="submit" className={`${subscribed ? 'bg-secondary' : 'bg-secondary-2 hover:bg-secondary' } w-full h-full md:w-auto p-5 md:p-0 transition-all font-bold text-md md:text-lg px-3 md:px-5 text-white`}>{subscribed ? 'Your Subscribed' : 'Subscribe'}</button>
            </form>
            
            {
              subscribed &&
              <div className="mt-4 mx-auto bg-green p-5 rounded-lg">
                <p className="text-white font-bold text-lg">Thank you for signing up. I'll be sending out updates ASAP.</p>
              </div>
            }
            
            {
              error &&
              <div className="mt-4 mx-auto bg-red p-5 rounded-lg">
                <p className="text-white font-bold text-lg">There was an error when signing up - please try again later.</p>
              </div>
            }
          </div>
        </div>

        {
          subscribed &&
          <div className="w-full h-full absolute top-0 left-0 z-10">
            <Confetti
              width={width}
              height={height}
            />
          </div>
        }
      </div>
    </>
  )
}
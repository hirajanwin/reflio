import { useState } from 'react';
import SEOMeta from '@/components/SEOMeta'; 
import Logo from '@/components/icons/Logo'; 
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
      <SEOMeta/>
      <div className="relative py-24 flex flex-col items-center justify-center min-h-screen h-full bg-gradient-to-r from-secondary-3 to-secondary-2 text-white">
        <div className="wrapper text-center">
          <div className="mb-8">
            <Logo className="w-40 sm:w-52 h-auto mx-auto"/>
          </div>
          <div className="mb-14">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold mb-8">
              <span className="block text-primary">Create a referral program</span>
              <span><span className="italic text-secondary">without</span> breaking the bank.</span>
            </h1>
            <p className="text-lg sm:text-xl mx-auto">Launching soon. Follow along <a className="font-bold" href="https://twitter.com/richiemcilroy" target="_blank">@richiemcilroy</a> and watch me build <span className="font-bold">Reflio</span> live.</p>
          </div>
          <div>
            <p className="text-md sm:text-xl font-bold mb-3">Sign up and be <span className="underline">one of the first</span> to get early access</p>
            <form type="POST" onSubmit={handleSubscribe} className="md:flex md:items-center w-full max-w-xl mx-auto h-auto md:h-20 rounded-lg overflow-hidden shadow-lg border-4 border-primary outline-none focus:outline-none">
              <div className="flex items-center h-20 md:flex-grow">
                <input type="email" id="email" name="email" placeholder="youremail@email.com" required className="w-auto flex-grow h-full border-none px-3 text-gray-700 text-md md:text-lg font-medium outline-none focus:outline-none"/>
              </div>
              <button disabled={subscribed === true ? true : false} type="submit" className={`${subscribed ? 'bg-primary-2' : 'bg-primary hover:bg-primary-2' } w-full h-full md:w-auto p-5 md:p-0 text-secondary-2 transition-all font-bold text-md md:text-lg px-3 md:px-5`}>{subscribed ? 'Your Subscribed' : 'Subscribe'}</button>
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
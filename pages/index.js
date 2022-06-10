import Button from '@/components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/solid';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Image from 'next/image';

export default function Index() {
  return(
    <>
      <div className="relative py-14 md:py-24 bg-white md:bg-gradient-to-b md:from-gray-50 md:to-gray-200">
        <div className="wrapper text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-7">
                Create a <span className="italic font-bold">referral program</span> without breaking the bank.
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 font-light">
                Reflio puts <span className="text-gray-700 font-medium underline">digital privacy first</span>. All referrals are processed through <span className="text-gray-700 font-medium underline">European-owned infrastructure</span>, and our company is registered in the UK. With Reflio, referrals located in the EU are <span className="text-gray-600 font-normal underline">automatically required to confirm their consent</span> before a cookie is set. 
              </p>
            </div>
            <div className="mt-12">
              <Button
                xlarge
                primary
                href="#"
              >
                <span>Get started for free</span>
              </Button>
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
          </div>
          <div className="hidden md:block mt-16 -mb-40">
            <div className="max-w-4xl mx-auto">
              <div className="px-0 w-full h-96 bg-white rounded-3xl shadow-2xl mx-auto overflow-hidden relative">
                <Image layout="fill" objectFit="cover" src="/platform-screenshot.webp" alt="Screenshot of Reflio dashboard" className="mt-0 w-full h-auto" />
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
                  href="#"
                >
                  <span>Get started for free</span>
                </Button>
              </div>
            </div>
            <div className="order-0 lg:order-1">
              <img className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/invite-screenshot.webp" alt="Screenshot of join campaign feature"/>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:py-24 bg-gradient-to-b from-gray-200 to-gray-50">
        <div className="wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
            <div className="order-0 lg:order-1">
              <img className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/affiliate-screenshot.webp" alt="Screenshot of join campaign feature"/>
            </div>
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">One affiliate dashboard to rule them all</h2>
              <p className="text-2xl">Your affiliates can manage all of their different campaigns from one, easy to use dashboard. Having access to all of their campaigns from different brands in one place means both higher referral conversion and satisfaction rates.</p>
              <div className="mt-12">
                <Button
                  xlarge
                  primary
                  href="#"
                >
                  <span>Get started for free</span>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Ready to get started?</h2>
            <div className="mt-5">
              <Button
                xlarge
                primary
                href="#"
              >
                <span>Get started for free</span>
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
    </>
  )
}
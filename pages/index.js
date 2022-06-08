import Button from '@/components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/solid';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';

export default function Index() {
  return(
    <>
      <div className="relative py-14 md:py-24 bg-white md:bg-gradient-to-b md:from-gray-50 md:to-gray-200">
        <div className="wrapper text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl mb-8">
                Create a <span className="italic font-bold">privacy-friendly referral program</span> for your SaaS.
              </h1>
              <p className="text-xl sm:text-2xl text-gray-500 font-light">
                Reflio puts <span className="text-gray-600 font-normal underline">digital privacy first</span>. All referrals are processed through <span className="text-gray-600 font-normal underline">European-owned infrastructure</span>, and our company is registered in the UK. With Reflio, referrals located in the EU are <span className="text-gray-600 font-normal underline">automatically required to confirm their consent</span> before a cookie is set. 
              </p>
            </div>
            <div className="mt-12">
              <Button
                xlarge
                primary
                href="/signup"
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
              <div className="px-0 w-full h-auto bg-gray-900 rounded-3xl shadow-2xl mx-auto">
                <img src="platform-screenshot.webp" alt="GummySearch Audience Discovery" className="mt-0 w-full h-auto rounded-3xl" />
              </div>
              <p className="text-xs font-medium italic mt-4 text-left">This is the "Campaigns" view inside of the main Reflio dashboard.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:pt-48 md:py-24 bg-gradient-to-b from-gray-200 to-gray-50 border-t-8 border-gray-300">
        <div className="wrapper">
          <div>
            <Features/>
          </div>
        </div>
      </div>
      <div className="wrapper mb-14">
        <div className="py-8 md:py-24 px-8 md:px-20 bg-white rounded-xl shadow-lg border-4 border-gray-200">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
              <div className="order-1 lg:order-0">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">SEO friendly page to share with potential affiliates</h2>
                <p className="text-2xl">With Reflio, for each campaign you create you can send potential affiliates your very own signup page and brand it with your own logo and colours. These pages are fully SEO friendly and optimised for speed.</p>
                <div className="mt-12">
                  <Button
                    xlarge
                    primary
                    href="/signup"
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
      </div>
      <div className="wrapper mb-14 md:mb-24">
        <div className="py-8 md:py-24 px-8 md:px-20 bg-white rounded-xl shadow-lg border-4 border-gray-200">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
              <div className="order-0 lg:order-1">
                <img className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/affiliate-screenshot.webp" alt="Screenshot of join campaign feature"/>
              </div>
              <div className="order-1 lg:order-0">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">One affiliate dashboard to rule them all</h2>
                <p className="text-2xl">Your affiliates can manage all of their different Reflio campaigns from one, easy to use dashboard. Having access to all of their campaigns from different brands in one place means both higher referral conversion and satisfaction rates.</p>
                <div className="mt-12">
                  <Button
                    xlarge
                    primary
                    href="/signup"
                  >
                    <span>Get started for free</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:py-24 bg-gradient-to-b from-gray-200 to-gray-50">
        <div className="wrapper">
          <div>
            <Testimonials/>
          </div>
        </div>
      </div>
      <div className="py-24 bg-gradient-to-b from-secondary to-secondary-2">
        <div className="wrapper wrapper-sm text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-bold text-white">Ready to get started?</h2>
            <p className="text-xl text-white">Get started in minutes. Our setup process is friendly and intuitive, with guides available to help you.</p>
            <div className="mt-10">
              <Button
                xlarge
                primary
                href="/signup"
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
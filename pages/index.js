import Button from '@/components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/solid';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';

export default function Index() {
  return(
    <>
      <div className="relative py-24 bg-gradient-to-b from-gray-50 to-gray-200">
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
          <div className="hidden sm:block mt-16 -mb-40">
            <div className="px-0 w-full max-w-4xl h-auto bg-gray-900 rounded-3xl shadow-2xl mx-auto">
              <img src="platform-screenshot.webp" alt="GummySearch Audience Discovery" className="mt-0 w-full h-auto rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-48 pb-24 bg-gradient-to-b from-gray-200 to-gray-50 border-t-8 border-gray-300">
        <div className="wrapper">
          <div>
            <Features/>
          </div>
        </div>
      </div>
      <div className="pt-12 pb-24 bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="wrapper">
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold">Our wall of love</h2>
            </div>
            <Testimonials/>
          </div>
        </div>
      </div>
    </>
  )
}
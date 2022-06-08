import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';
import Link from 'next/link';
import Button from '@/components/ui/Button'; 

export default function Navbar() {

  const { user } = useUser();
  const [active, setActive] = useState(false);
  const navClass = 'lg:text-lg font-medium hover:underline mx-4';

  return (
    <>
      <div className="bg-secondary py-4">
        <div className="wrapper text-center">
          <p className="text-lg text-white font-semibold">We're currently in public beta whilst receiving feedback from users. <a className="underline" href="#">Learn more.</a></p>
        </div>
      </div>
      <div className="bg-gray-50 sticky top-0 z-50 border-b-2 border-gray-200">
        <div className="py-4 wrapper">
          <div className="flex justify-between">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                >
                  <a>
                    <Logo className="h-8 lg:h-10 w-auto"/>
                  </a>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center">
              <nav className="flex items-center justify-center">
                <a
                  href="/#features"
                  className={navClass}
                >
                  Features
                </a>
                <a
                  href="/#pricing"
                  className={navClass}
                >
                  Why Reflio
                </a>
                <a
                  href="/#pricing"
                  className={navClass}
                >
                  Pricing
                </a>
                <a
                  href="/#pricing"
                  className={navClass}
                >
                  Docs & Guides
                </a>
              </nav>
            </div>

            <button
              className='inline-flex rounded lg:hidden outline-none'
              onClick={e=>{active ? setActive(false) : setActive(true) }}
            >
              {
                active ?
                  <XIcon className="w-8 h-auto"/>
                : <MenuIcon className="w-8 h-auto"/>
              }
            </button>

            {
              active &&
              <div className="origin-top-right absolute left-0 top-auto overflow-hidden mt-12 w-full shadow-xl border-t-4 border-gray-200 bg-white z-50">
                <a className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/#features">Features</a>
                <a className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/#pricing">Pricing</a>
                <a className="block p-5 text-md bg:text-white hover:bg-gray-100 font-semibold" href={user ? '/dashboard' : '/signup'}>{user ? 'Dashboard' : 'Get Started For Free' }</a>
              </div>
            }

            <div className="hidden lg:flex items-center">
              {
                user ?
                <div className="flex-shrink-0">
                  <Button
                    small
                    primary
                    href="/dashboard"
                  >
                    <span>View Dashboard</span>
                  </Button>
                </div>
                :
                  <div className="flex-shrink-0">
                    <Button
                      small
                      primary
                      href="#"
                    >
                      <span>Get started for free</span>
                    </Button>
                  </div>        
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
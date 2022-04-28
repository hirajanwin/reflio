import { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';
import Link from 'next/link';
import Button from '@/components/ui/Button'; 

const Navbar = () => {

  const { user } = useUser();
  const [active, setActive] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="py-6 wrapper wrapper-max">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
              >
                <a>
                  <Logo className="h-8 md:h-12 w-auto"/>
                </a>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <nav className="flex items-center justify-center">
              {/* <a
                href="/#features"
                className="text-md lg:text-lg hover:underline mx-4 tracking-tight"
              >
                Features
              </a>
              <a
                href="/#pricing"
                className="text-md lg:text-lg hover:underline mx-4 tracking-tight"
              >
                Pricing
              </a> */}
            </nav>
          </div>

          {/* <button
            className='inline-flex rounded md:hidden outline-none'
            onClick={e=>{active ? setActive(false) : setActive(true) }}
          >
            {
              active ?
                <XIcon className="w-8 h-auto"/>
              : <MenuIcon className="w-8 h-auto"/>
            }
          </button> */}

          {/* {
            active &&
            <div className="origin-top-right absolute left-0 top-auto overflow-hidden mt-12 w-full shadow-xl border-t-4 border-gray-200 bg-white z-50">
              <a className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/#features">Features</a>
              <a className="block p-5 text-md bg:text-white hover:bg-gray-100 border-b-2 border-gray-200" href="/#pricing">Pricing</a>
              <a className="block p-5 text-md bg:text-white hover:bg-gray-100 font-semibold" href={user ? '/dashboard' : '/signup'}>{user ? 'Dashboard' : 'Get Started For Free' }</a>
            </div>
          } */}

          <div className="hidden md:flex items-center">
            {
              user ?
              <div className="flex-shrink-0">
                <Button
                  large
                  secondary
                  href="/dashboard"
                >
                  <span>View Dashboard</span>
                </Button>
              </div>
              :
                <div className="flex-shrink-0">
                  <Button
                    large
                    secondary
                    href="#"
                  >
                    <span>Coming Soon</span>
                  </Button>
                </div>        
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
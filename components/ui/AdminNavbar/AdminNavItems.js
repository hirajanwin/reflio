import { Fragment } from 'react';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import { classNames } from '@/utils/helpers';
import { useBrand } from '@/utils/BrandContext';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import {
  CreditCardIcon,
  TemplateIcon,
  CogIcon,
  ShareIcon,
  DocumentSearchIcon,
  DesktopComputerIcon,
  StarIcon,
  ChartPieIcon,
  UserGroupIcon,
  BellIcon,
  CurrencyDollarIcon
} from '@heroicons/react/outline';

export default function AdminNavItems() {
  const { signOut, planDetails } = useUser();
  const { activeBrand, userBrandDetails } = useBrand();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: `/dashboard/${activeBrand?.brand_id}`, icon: TemplateIcon },
    { name: 'Competitors', href: `/dashboard/${activeBrand?.brand_id}/competitors`, icon: UserGroupIcon },
    { name: 'SEO', href: `/dashboard/${activeBrand?.brand_id}/tools/seo`, icon: DocumentSearchIcon },
    { name: 'Socials', href: `/dashboard/${activeBrand?.brand_id}/tools/socials`, icon: ShareIcon },
    { name: 'Paid Ads', href: `/dashboard/${activeBrand?.brand_id}/tools/reviews`, icon: CurrencyDollarIcon },
    { name: 'Technologies', href: `/dashboard/${activeBrand?.brand_id}/tools/technologies`, icon: DesktopComputerIcon },
    { name: 'Compare', href: `/dashboard/${activeBrand?.brand_id}/tools/compare`, icon: ChartPieIcon },
    { name: 'Alerts', href: `/dashboard/${activeBrand?.brand_id}/tools/compare`, icon: BellIcon },
    { name: 'Settings', href: `/dashboard/${activeBrand?.brand_id}/settings`, icon: CogIcon },
  ];

  const secondaryNavigation = [
    { name: 'Changelog', href: '/changelog' },
  ];
  
  return(
    <>
      <nav className="mt-8 flex-1 flex flex-col overflow-y-auto" aria-label="Sidebar">
        <div className="px-4 space-y-1 pb-6">
          <Listbox onChange={value=>{router.replace('/dashboard/'+value+'')}} value={activeBrand?.brand_id}>
            {({ open }) => (
              <>
                <div className="relative">
                  <Listbox.Button className="relative w-full bg-secondary rounded-xl font-semibold pl-3 pr-10 py-3 flex text-left cursor-pointer focus:outline-none sm:text-sm">
                    <span className="relative w-5 h-5 rounded-full block mr-2">
                      {
                        activeBrand?.display_image &&
                        <Image src={activeBrand?.display_image} objectFit='contain' layout='fill' />
                      }
                    </span>
                    <span className="block truncate text-white">{activeBrand?.display_name}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="top-0 left-0 absolute rounded-lg z-20 w-full bg-secondary max-h-60 pt-1 text-base overflow-auto focus:outline-none sm:text-sm border-2 border-tertiary-2 shadow-xl shadow-tertiary"
                    >
                      {userBrandDetails?.map((brand) => (
                        <Listbox.Option
                          key={brand?.brand_id}
                          className={({ selected, active }) =>
                            classNames(
                              selected && 'text-primary',
                              'cursor-pointer select-none relative py-2 px-5'
                            )
                          }
                          value={brand?.brand_id}
                        >
                          {({ selected, active }) => (
                            <>
                            <div className="flex">
                              <span className="relative w-5 h-5 rounded-full block mr-2">
                                {
                                  brand?.display_image &&
                                  <Image src={brand?.display_image} objectFit='contain' layout='fill' />
                                }
                              </span>
                              <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate text-md text-white')}>
                                {brand?.display_name}
                              </span>
                            </div>

                              {selected ? (
                                <span
                                  className={classNames(
                                    selected ? 'text-white' : 'text-primary',
                                    'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                      <a href="/dashboard/add-brand" className="block bg-white cursor-pointer select-none font-semibold relative py-3 px-5">
                        + Add Brand
                      </a>
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div className="p-5">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                router?.asPath === item.href && 'bg-primary border-primary-2 hover:bg-primary hover:opacity-100',
                'flex items-center p-2 text-lg font-semibold rounded-md border-2 border-transparent hover:opacity-70'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              <span>{item.name}</span>
            </a>
          ))}
            <a
              href={`/dashboard/plan`}
              className={classNames(
                router?.asPath === `/dashboard/plan` && 'bg-primary border-primary-2 hover:bg-primary hover:opacity-100',
                'flex items-center p-2 text-lg font-semibold rounded-md border-2 border-transparent hover:opacity-70'
              )}
            >
              <CreditCardIcon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              <span>{planDetails === 'free' ? 'Upgrade' : 'PRO Plan'}</span>
              {
                planDetails === 'free' &&
                <span className="py-1 px-3 text-xs bg-secondary text-white rounded-xl ml-2 uppercase font-semibold">Pro</span>
              }
            </a>
        </div>
        <div className="pt-3 mt-auto">
          <div className="px-4 space-y-1">
            {secondaryNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  router?.asPath === item.href && 'bg-primary border-primary-2 hover:bg-primary hover:opacity-100',
                  'items-center px-2 py-2 text-md font-semibold rounded-md border-2 border-transparent'
                )}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => signOut()}
              className={'items-center px-2 py-2 text-md font-semibold rounded-md'}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </>
  )
};
import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';

export default function SetupProgress() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const companyId = router?.query?.companyId ? router?.query?.companyId : null;

  let steps = [
    { name: !activeCompany ? 'Add Company' : 'Edit company', href: !activeCompany ? '/dashboard/add-company' : `/dashboard/${activeCompany?.company_id}/settings`, status: 'upcoming' },
    { name: 'Connect Stripe', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/stripe`, status: 'upcoming' },
    { name: 'Choose a currency', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/currency`, status: 'upcoming' },
    { name: 'Create a campaign', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/campaign`, status: 'upcoming' },
    { name: 'Setup Reflio', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/add`, status: 'upcoming' },
    { name: 'Verify setup', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/verify`, status: 'upcoming' },
  ]

  return(
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'complete' ? (
              <a
                href={step.href}
                className="group pl-4 py-2 flex flex-col border-l-4 border-primary hover:border-primary-2 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-8"
              >
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.href === router?.asPath ? (
              <a
                href={step.href}
                className="pl-4 py-2 flex flex-col border-l-4 border-primary md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-8"
                aria-current="step"
              >
                <span className="text-xs font-semibold tracking-wide uppercase">{step.id}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-8"
              >
                <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
};
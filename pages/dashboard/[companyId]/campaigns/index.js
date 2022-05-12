import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 
import Button from '@/components/ui/Button'; 
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';

export default function CampaignsPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user, activeCompany]);
  
  return (
    <>
      <SEOMeta title="Campaigns"/>
      <div className="mb-12">
        <div className="pt-10 wrapper flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Campaigns</h1>
          <Button
            href={`/dashboard/${router?.query?.companyId}/campaigns/new`}
            medium
            primary
          >
            <span>Create campaign</span>
          </Button>
        </div>
      </div>
      <div className="wrapper">
        {
          activeCompany && userCampaignDetails ?
            userCampaignDetails !== null && userCampaignDetails?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md rounded-lg border-4 border-gray-300">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr className="divide-x-4 divide-gray-300">
                              <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold sm:pl-6">
                                Campaign
                              </th>
                              <th scope="col" className="px-4 py-3.5 text-sm font-semibold text-center">
                                Affiliates
                              </th>
                              <th scope="col" className="px-4 py-3.5 text-sm font-semibold text-center">
                                Revenue
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {userCampaignDetails?.map((campaign) => (
                              <tr key={campaign?.campaign_id} className="divide-x-4 divide-gray-200">
                                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium sm:pl-6">
                                  <p className="text-xl mb-2 font-semibold"><a className="underline" href={`/dashboard/${router?.query?.companyId}/campaigns/${campaign?.campaign_id}`}>{campaign?.campaign_name}</a></p>
                                  <p className="text-md">{campaign?.commission_type === 'percentage' ? `${campaign?.commission_value}% commission on all paid referrals` : `${activeCompany?.company_currency}${campaign?.commission_value} commission on all paid referrals`}</p>
                                  <div className="mt-3">
                                    <p className="text-gray-500">
                                      <span>New affiliates can join at&nbsp;</span>
                                      <CopyToClipboard text={`https://affiliates.reflio.com/invite/${campaign?.campaign_id}`} onCopy={() => toast.success('URL copied to clipboard')}>
                                        <button className="font-semibold underline" href={`https://affiliates.reflio.com/invite/${campaign?.campaign_id}`}>{`https://affiliates.reflio.com/invite/${campaign?.campaign_id}`}</button>
                                      </CopyToClipboard>
                                    </p>
                                  </div> 
                                </td>
                                <td className="whitespace-nowrap p-4 text-sm text-center">
                                  <a href="#" className="underline font-semibold">0 affiliates</a>
                                </td>
                                <td className="whitespace-nowrap p-4 text-sm text-center">$0 USD</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            :
              <div>
                <p>You have no campaigns.</p>
              </div>
          :
            <LoadingDots/>
        }
      </div>
    </>
  );
}
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser, newCampaign } from '@/utils/useUser';
import SetupProgress from '@/components/ui/SetupProgress'; 
import SEOMeta from '@/components/SEOMeta'; 
import Button from '@/components/ui/Button'; 
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';

export default function AddCompany() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rewardType, setRewardType] = useState('percentage');

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(loading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setLoading(true);

    await newCampaign(user, data, router?.query?.companyId).then((result) => {
      console.log(result);
      if(result === "success"){
        setErrorMessage(false);
        router.replace(`/dashboard/${router?.query?.companyId}/setup/add`)

      } else {
        setErrorMessage(true);
      }

      setLoading(false);
    });

  };

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Create a Campaign"/>
      <div className="py-12 border-b-4 border-gray-300">
        <div className="wrapper">
          <SetupProgress/>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Create a campaign</h1>
        </div>
      </div>
      <div className="wrapper">
        {
          userCampaignDetails !== null && userCampaignDetails?.length > 0 ?
            <div>
              <p className="text-lg mb-3">Your first campaign is ready.</p>
              <div className="mb-3">
                <p className="text-xl leading-6 font-semibold text-gray-900">Campaign name:</p>
                <p>{userCampaignDetails[0]?.campaign_name}</p>
              </div>
              <div className="mb-3">
                <p className="text-xl leading-6 font-semibold text-gray-900">Commission:</p>
                {
                  userCampaignDetails[0]?.commission_type === "percentage" ?
                    <p>{userCampaignDetails[0]?.commission_value}%</p>
                  :
                    <p>{activeCompany?.company_currency}{userCampaignDetails[0]?.commission_value}</p>
                }
                <p>{userCampaignDetails[0]?.commi}</p>
              </div>
              <div className="mb-8">
                <a className="underline font-semibold" href={`/dashboard/${router?.query?.companyId}/campaigns/${userCampaignDetails[0]?.campaign_id}`}>Edit campaign</a>
              </div>
              <div className="pt-8 border-t-4">
                <Button
                  small
                  primary
                  href={`/dashboard/${router?.query?.companyId}/setup/add`}
                >
                  <span>Next step</span>
                </Button>
              </div>
            </div>
          :
            <div>
              <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300" action="#" method="POST" onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                      <div>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-12">
                            <label htmlFor="campaign_name" className="block text-sm font-medium text-gray-700">
                              Campaign Name
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                minLength="3"
                                maxLength="25"
                                required
                                placeholder={`${activeCompany?.company_name}'s Referral Campaign`}
                                type="text"
                                name="campaign_name"
                                id="campaign_name"
                                autoComplete="campaign_name"
                                className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-12">
                            <label htmlFor="commission_type" className="block text-sm font-medium text-gray-700">
                              Reward type
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <select onChange={e=>{setRewardType(e.target.value)}} className="rounded-xl border-2 border-gray-300 outline-none p-4 w-full" required="required" name="commission_type" id="commission_type">
                                <option value="percentage">Percentage of sale</option>
                                <option value="fixed">Fixed amount</option>
                              </select>
                            </div>
                          </div>

                          {
                            rewardType === 'percentage' &&
                            <div className="sm:col-span-12">
                              <label htmlFor="commission_value" className="block text-sm font-medium text-gray-700">
                                Commission percentage
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                                <input
                                  minLength="20"
                                  maxLength="100"
                                  required
                                  placeholder="20"
                                  type="number"
                                  name="commission_value"
                                  id="commission_value"
                                  autoComplete="commission_value"
                                  className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none rounded-br-none border-gray-300"
                                />
                                <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 rounded-tl-none bg-gray-200 rounded-bl-none border-gray-300">%</span>
                              </div>
                            </div>
                          }

                          {
                            rewardType === 'fixed' &&
                            <div className="sm:col-span-12">
                              <label htmlFor="commission_value" className="block text-sm font-medium text-gray-700">
                                Amount
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                                <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none bg-gray-200 rounded-br-none border-gray-300">{activeCompany?.company_currency}</span>
                                <input
                                  minLength="1"
                                  maxLength="100"
                                  required
                                  placeholder="1"
                                  type="number"
                                  name="commission_value"
                                  id="commission_value"
                                  autoComplete="commission_value"
                                  className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 bor border-r-0 rounded-tl-none rounded-bl-none border-gray-300"
                                />
                              </div>
                            </div>
                          }

                          {/* <div className="sm:col-span-12">
                            <label htmlFor="loom_email" className="block text-sm font-medium text-gray-700">
                              Loom Email Address
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                required
                                placeholder="youremail@example.com"
                                type="text"
                                name="loom_email"
                                id="loom_email"
                                autoComplete="loom_email"
                                className="flex-1 block w-full min-w-0 rounded-md focus:outline-none sm:text-sm border-gray-300"
                              />
                            </div>
                          </div> */}

                        </div>
                      </div>

                      {
                        errorMessage &&
                        <div className="bg-red text-center p-4 mt-4 rounded-lg bg-red-600">
                          <p className="text-white font-medium">There was an error when creating your campaign, please try again later.</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                  <Button
                    large
                    primary
                    disabled={loading}
                  >
                    <span>{loading ? 'Creating Campaign...' : 'Create Campaign'}</span>
                  </Button>
                </div>
              </form>
            </div>
        }
      </div>
    </>
  );
}
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser, newCompany } from '@/utils/useUser';
import SetupProgress from '@/components/ui/SetupProgress'; 
import SEOMeta from '@/components/SEOMeta'; 
import Button from '@/components/ui/Button'; 
import { useCompany } from '@/utils/CompanyContext';

export default function AddCompany() {
  const router = useRouter();
  const { user, userFinderLoaded, planDetails } = useUser();
  const { userCompanyDetails } = useCompany();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

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

    await newCompany(user, data).then((result) => {
      console.log(result);
      if(result[0]?.company_id){
        setErrorMessage(false);
        window.location.href = "/dashboard/"+result[0]?.company_id+"";

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

  // if(planDetails === 'free' && userCompanyDetails?.length >= 1){
  //   router.replace('/dashboard/plan');
  // }

  return (
    <>
      <SEOMeta title="Add Company"/>
      {/* <div className="py-12 border-b-4 border-gray-300">
        <div className="wrapper">
          <SetupProgress/>
        </div>
      </div> */}
      <div className="wrapper">
        <div>
          <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300 mx-auto" action="#" method="POST" onSubmit={handleSubmit}>
            <div className="py-6 text-center border-b-4">
              <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Add company</h1>
            </div>
            <div className="p-6">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-12">
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            minLength="3"
                            maxLength="25"
                            required
                            placeholder="e.g. Google"
                            type="text"
                            name="company_name"
                            id="company_name"
                            autoComplete="company_name"
                            className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-12">
                        <label htmlFor="company_url" className="block text-sm font-medium text-gray-700">
                          Company Website
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            minLength="3"
                            maxLength="70"
                            required
                            placeholder="e.g. google.com"
                            type="text"
                            name="company_url"
                            id="company_url"
                            className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                          />
                        </div>
                      </div>
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
                    <div className="bg-red text-center p-4 mt-8 rounded-lg">
                      <p className="text-white text-sm font-medium">There was an error when creating your company, please try again later.</p>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <Button
                large
                secondary
                disabled={loading}
              >
                <span>{loading ? 'Adding Company...' : 'Add Company'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
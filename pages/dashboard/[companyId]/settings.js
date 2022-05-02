import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, deleteCompany, disableEmails, editCompanyWebsite } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import SEOMeta from '@/components/SEOMeta'; 
import { Switch } from '@headlessui/react';
import { classNames, checkValidUrl } from '@/utils/helpers';
import Button from '@/components/ui/Button'; 

export default function companiesettingsPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [websiteUrlInput, setWebsiteUrlInput] = useState(null);
  const [urlValid, setUrlValid] = useState(null);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this company?')){
      await deleteCompany(router?.query?.companyId).then((result) => {
        if(result === "success"){
          setErrorMessage(false);
          window.location.href = "/dashboard";
        } else {
          setErrorMessage(true);
        }
      });
    }
  };

  const handleDisableEmails = async (type) => {    
    await disableEmails(router?.query?.companyId, type).then((result) => {
      if(result === "success"){
        setErrorMessage(null);
        window.location.href = window.location.href;
      } else {
        setErrorMessage("Unable to change email notification status. Please try again later.");
      }
    });
  };

  const handleWebsiteUpdate = async (e) => {

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

    await editCompanyWebsite(router?.query?.companyId, data).then((result) => {
      if(result === "success"){
        setErrorMessage(false);
        router.replace(window.location.href);

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
  }, [userFinderLoaded, user, activeCompany]);
  
  return (
    <>
      <SEOMeta title="Settings"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Company Settings</h1>
        </div>
      </div>
      <div className="wrapper">
        <form action="#" method="POST" onSubmit={handleWebsiteUpdate} className="bg-white shadow-lg rounded-xl mt-5 max-w-3xl border-4 border-gray-200">
          <div className="p-6 sm:p-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Company Website</h3>
              <div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    minLength="3"
                    maxLength="25"
                    required
                    defaultValue={activeCompany?.company_url}
                    placeholder="https://mywebsite.com"
                    type="text"
                    name="company_url"
                    id="company_url"
                    autoComplete="company_url"
                    className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                    onChange={e=>{setUrlValid(checkValidUrl(e.target.value)), urlValid ? setWebsiteUrlInput(e.target.value) : setWebsiteUrlInput(null)}}
                  />
                </div>
              </div>
            </div>
          </div>
          {
            websiteUrlInput !== null && websiteUrlInput !== activeCompany?.company_url && urlValid &&
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <Button
                medium
                primary
                disabled={loading}
              >
                <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
              </Button>
            </div>
          }
          {
            !urlValid && urlValid !== null &&
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <div className="bg-red-600 text-center p-4 rounded-lg">
                <p className="text-white text-sm font-medium">The URL you entered is not valid. Please check it and try again.</p>
              </div>
            </div>
          }
        </form>
        <div className="bg-white shadow-lg rounded-xl mt-5 max-w-3xl border-4 border-gray-200">
          <div className="p-6 sm:p-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Email notifications</h3>
            <div className="mt-2 max-w-2xl text-gray-500">
              <p>When enabled, you will receive email notifications for this company whenever you receive a new sale via commission or affiliate signup.</p>
            </div>
            <div className="mt-5">
              <Switch
                checked={!activeCompany?.disable_emails}
                onChange={e=>{handleDisableEmails(activeCompany?.disable_emails ? false  : true)}}
                className={classNames(
                  !activeCompany?.disable_emails ? 'bg-green-600' : 'bg-red-600',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200'
                )}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    !activeCompany?.disable_emails ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-xl mt-6 max-w-3xl border-4 border-gray-200">
          <div className="p-6 sm:p-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Danger zone</h3>
            <div className="mt-2 max-w-2xl text-gray-500">
              <p>Once you delete your company, you will lose all data, including all campaigns and affiliates associated with it.</p>
            </div>
            <div className="mt-5">
              <button
                onClick={e=>{handleDelete()}}
                type="button"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete company
              </button>
            </div>
          </div>
        </div>
        {
          errorMessage &&
          <div className="bg-red-600 text-center p-4 mt-5 rounded-lg">
            <p className="text-white text-sm font-medium">Error saving changes</p>
          </div>
        }
      </div>
    </>
  );
}
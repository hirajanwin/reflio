import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser, newBrand } from '@/utils/useUser';
import { useBrand } from '@/utils/BrandContext';
import Button from '@/components/ui/Button'; 

export default function AddBrandPage() {
  const router = useRouter();
  const { user, userFinderLoaded, planDetails } = useUser();
  const { userBrandDetails } = useBrand();
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

    await newBrand(user, data).then((result) => {
      console.log(result);
      if(result[0]?.brand_id){
        setErrorMessage(false);
        window.location.href = "/dashboard/"+result[0]?.brand_id+"";

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

  if(planDetails === 'free' && userBrandDetails?.length >= 1){
    router.replace('/dashboard/plan');
  }

  return (
    <div className="bg-gray-100 min-h-screen h-full flex flex-col">
      <form className="flex-1 pt-12 space-y-8 divide-y divide-gray-200 wrapper h-full" action="#" method="POST" onSubmit={handleSubmit}>
        <div className="space-y-8 divide-y divide-gray-200 p-8 rounded-xl bg-white max-w-xl mx-auto shadow-md">
          <div>

            <h1 className="text-3xl font-extrabold mb-4 sm:tracking-tight text-center">
              Create a Brand
            </h1>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-12">
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                  Brand Name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    minLength="3"
                    maxLength="25"
                    required
                    placeholder="e.g. Google"
                    type="text"
                    name="display_name"
                    id="display_name"
                    autoComplete="display_name"
                    className="flex-1 block w-full min-w-0 p-3 rounded-md focus:outline-none sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div className="sm:col-span-12">
                <label htmlFor="domain_url" className="block text-sm font-medium text-gray-700">
                  Website Address
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    minLength="3"
                    maxLength="70"
                    required
                    placeholder="e.g. google.com"
                    type="text"
                    name="domain_url"
                    id="domain_url"
                    className="flex-1 block w-full min-w-0 p-3 rounded-md focus:outline-none sm:text-sm border-gray-300"
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

            <div className="flex justify-center">
              <Button
                large
                secondary
                className="mt-8"
                disabled={loading}
              >
                <span>{loading ? 'Creating Brand...' : 'Create Brand'}</span>
              </Button>
            </div>

            {
              errorMessage &&
              <div className="bg-red text-center p-4 mt-8 rounded-lg">
                <p className="text-white text-sm font-medium">There was an error when creating your brand, please try again later.</p>
              </div>
            }
          </div>
        </div>
      </form>
    </div>
  );
}
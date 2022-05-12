const ReflioScript = async function() {  
  const apiRoot = 'http://localhost:3000/api/v1';
  const rootDomain = window.location.href;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const reflioVerifyParam = urlParams.get("reflioVerify");
  const reflioReferralParam = urlParams.get("via") ? urlParams.get("via") : urlParams.get("ref") ? urlParams.get("ref") : null;
  let reflioReferralObject = localStorage.getItem('reflioReferral');
  const reflioInnerScript = document.querySelector("script[data-reflio]");

  class rfl {
    details(){
      return({
        companyId: reflioInnerScript.getAttribute("data-reflio") ? reflioInnerScript.getAttribute("data-reflio") : null,
        window: window,
        rooyDomain: rootDomain,
        apiRoot: apiRoot
      })
    }
    async checkDomainVerification(){
      return await fetch(apiRoot+'/verify-company').then(function(response) {
        return response.json();
      });
    }
    async impression(referralCode, companyId){
      if(!referralCode || !referralCode) console.warn("Reflio: could not track impression. Referral code / companyId not found.");
      
      return await fetch(apiRoot+'/record-impression', {
        method: 'POST',
        body: JSON.stringify({
          referralCode: referralCode,
          companyId: companyId
        }),
      }).then(function (response) {
        return response.json();
      })
    }
  }

  const Reflio = new rfl;

  console.log(Reflio.details())

  //Tracking script verification from server 
  if(reflioVerifyParam !== null){
    if(reflioVerifyParam === "true"){
      const verifyDomain = await Reflio.checkDomainVerification();

      if(verifyDomain?.verified === true){
        window.location.href = `http://localhost:3000/dashboard/${Reflio.details().companyId}/setup/verify`
      }
    }
  }

  //WIP: add local storage item if referral is valid
  if(reflioReferralParam !== null && Reflio.details().companyId !== null){
    const trackImpression = await Reflio.impression(reflioReferralParam, Reflio.details().companyId);

    console.log("Track Impression:")
    console.log(trackImpression)
  }

  // //WIP: track conversion from payment
  // window.addEventListener("Reflio.convert", function(e){
  //   if(e?.detail?.email){
  //     console.log("Customer: ", e?.detail.email);
  //   }
  // });

  if(!reflioInnerScript) {
    console.error("Could not load Reflio: make sure the <script> tag includes data-reflio='<companyId>'")
  }

}({});
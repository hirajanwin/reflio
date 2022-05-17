const ReflioScript = async function() {  
  const apiRoot = 'http://localhost:3000/api/v1';
  const rootDomain = window.location.host;
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
        rootDomain: rootDomain,
        apiRoot: apiRoot,
        domains: reflioInnerScript.getAttribute("data-domains") ? reflioInnerScript.getAttribute("data-domains") : null
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

  if(reflioReferralParam !== null && Reflio.details().companyId !== null){
    const trackImpression = await Reflio.impression(reflioReferralParam, Reflio.details().companyId);

    //If multiple domains, add referral to other domain
    if(trackImpression?.referral_details && Reflio.details().domains){
      document.querySelectorAll("[href]").forEach(link => {
        if(Reflio.details().domains?.includes(",")){
          Reflio.details().domains.split(',').map(domain => {
            if(link.href?.includes(domain.trim()) && !link.href.includes(Reflio.details().rootDomain)){
              let baseUrl = new URL(link.href);
              let searchParams = baseUrl.searchParams;
              
              // add "topic" parameter
              searchParams.set('ref', reflioReferralParam);
              
              baseUrl.search = searchParams.toString();
              
              let newUrl = baseUrl.toString();
      
              link.href = newUrl;
            }
          })
        }
      });

      //WIP: set cookie
      if(trackImpression?.referral_details){
        
      }

      console.log("Track Impression:")
      console.log(trackImpression?.referral_details)
    }
  }

  if(!reflioInnerScript) {
    console.error("Could not load Reflio: make sure the <script> tag includes data-reflio='<companyId>'")
  }

}({});
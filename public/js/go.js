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
        rootDomain: rootDomain,
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
    referral(){
      let name = "reflioData=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          try {
            return JSON.parse(c.substring(name.length, c.length))
          } catch (error) {
            return {
              "error": true
            };
          }
        }
      }
      return null;
    }
  }

  const Reflio = new rfl;

  //Tracking script verification from server 
  if(reflioVerifyParam !== null){
    if(reflioVerifyParam === "true"){
      const verifyDomain = await Reflio.checkDomainVerification();

      if(verifyDomain?.verified === true){
        window.location.href = `http://localhost:3000/dashboard/${Reflio.details().companyId}/setup/verify`
      }
    }
  }

  if(reflioReferralParam !== null && Reflio.details().companyId !== null && Reflio.referral() === null){
    const trackImpression = await Reflio.impression(reflioReferralParam, Reflio.details().companyId);

    //If multiple domains, add referral to other domain
    if(trackImpression?.referral_details && Reflio.details().domains){
      document.querySelectorAll("[href]").forEach(link => {
        if(Reflio.details().domains?.includes(",")){
          Reflio.details().domains.split(',').map(domain => {
            if(link.href?.includes(domain.trim()) && !link.href.includes(Reflio.details().rootDomain)){
              let baseUrl = new URL(link.href);
              let searchParams = baseUrl.searchParams;
              
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
        document.cookie = `reflioData=${JSON.stringify(trackImpression?.referral_details)}; expires=${trackImpression?.referral_details?.cookie_date}`;
      }
    }
  }

  if(!reflioInnerScript) {
    console.error("Could not load Reflio: make sure the <script> tag includes data-reflio='<companyId>'")
  }

}({});
const ReflioDomainRoot = 'http://localhost:3000';
const ReflioAPIRoot = ReflioDomainRoot+'/api/v1';
const rootDomain = window.location.host;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const reflioVerifyParam = urlParams.get("reflioVerify");
const reflioReferralParam = urlParams.get("via") ? urlParams.get("via") : urlParams.get("ref") ? urlParams.get("ref") : null;
let reflioReferralObject = localStorage.getItem('reflioReferral');
const reflioInnerScript = document.querySelector("script[data-reflio]");
let scrolledPercentage = (((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100).toFixed(0));

//Define base Reflio class.
class rfl {
  details(){
    return({
      companyId: reflioInnerScript.getAttribute("data-reflio") ? reflioInnerScript.getAttribute("data-reflio") : null,
      rootDomain: rootDomain,
      domains: reflioInnerScript.getAttribute("data-domains") ? reflioInnerScript.getAttribute("data-domains") : null,
      hidePopup: reflioInnerScript.getAttribute("hidePopup") ? true : false,
    })
  }
  async checkDomainVerification(){
    return await fetch(ReflioAPIRoot+'/verify-company').then(function(response) {
      return response.json();
    });
  }
  async impression(referralCode, companyId){
    if(!referralCode || !companyId) console.warn("Reflio: could not track impression. Referral code / companyId not found.");
    
    return await fetch(ReflioAPIRoot+'/record-impression', {
      method: 'POST',
      body: JSON.stringify({
        referralCode: referralCode,
        companyId: companyId
      }),
    }).then(function (response) {
      return response.json();
    })
  }
  async campaignDetails(referralCode, companyId){
    if(!referralCode || !companyId) console.warn("Reflio: could not get campaign details. Referral code / companyId not found.");
    
    return await fetch(ReflioAPIRoot+'/campaign-details', {
      method: 'POST',
      body: JSON.stringify({
        referralCode: referralCode,
        companyId: companyId
      }),
    }).then(function (response) {
      return response.json();
    })
  }
  checkCookie(){
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
  consentRequired(){
    if(Intl.DateTimeFormat().resolvedOptions().timeZone && Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") >= 0){
      return true;
    }

    return false;
  }
  cookieEligible(){
    if(reflioReferralParam !== null && Reflio.details().companyId !== null && Reflio.checkCookie() === null){
      return true;
    }

    return false;
  }
  cookieExists(){
    if(Reflio.checkCookie() === null){
      return false;
    }

    return true;
  }
  consentCleanup(){
    if(document.getElementById('reflio-confirm')){
      document.getElementById('reflio-confirm').parentNode.removeChild(document.getElementById('reflio-confirm'));
    }
    if(document.getElementById('reflio-confirm-styles')){
      document.getElementById('reflio-confirm-styles').parentNode.removeChild(document.getElementById('reflio-confirm-styles'));
    }
    if(document.getElementById('reflio-consent')){
      document.getElementById('reflio-consent').parentNode.removeChild(document.getElementById('reflio-consent'));
    }
  }
  async register(){
    if(Reflio.cookieEligible() === true){
      if(document.getElementById('reflio-confirm-button')){
        document.getElementById('reflio-confirm-button').innerText = "Loading...";
      }

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
    
    Reflio.consentCleanup();
  }
  async showPopup(){

    //If already denied popup, don't get campaign details etc and show popup again.
    if(localStorage.getItem('reflioNoConsent')) return false;

    //Gets public campaign details and discounts from API
    const campaign = await Reflio.campaignDetails(reflioReferralParam, Reflio.details().companyId);

    //If API call is invalid, don't show popup.
    if(!campaign?.campaign_details) return false;
    
    //Add cookie poup to body
    const popupHtml = `
      <div id="reflio-confirm">
        <div id="reflio-content-top">
        ${campaign?.campaign_details?.discount_value !== null && campaign?.campaign_details?.discount_type === 'fixed' && campaign?.campaign_details?.company_currency ?
            "<p id='reflio-content-title'>You've earned "+campaign?.campaign_details?.company_currency+""+campaign?.campaign_details?.discount_value+" off from a referral.</p>"
          : campaign?.campaign_details?.discount_value !== null ?
            "<p id='reflio-content-title'>You've earned "+campaign?.campaign_details?.discount_value+"% off from a referral.</p>"
          :
            "<p id='reflio-content-title'>The person who sent you here can earn a referral."
        }
          <p id="reflio-content-subtitle">To receive the discount code, please confirm that you consent to using cookies.</p>
        </div>
        <div id="reflio-buttons">
          <div id="reflio-confirm-button">Set cookie & get discount</div>
          <div id="reflio-cancel-button">No thanks</div>
        </div>
        <div id="reflio-content-bottom">
          <p>Please confirm that you're ok for a cookie to be set for our <span>privacy-friendly referral system</span>. The person who sent you here will earn a referral reward, and you'll be given a discount code to use on this site.</p>
        </div>
      </div>
    `;
    if(!document.getElementById('reflio-confirm')){
      document.body.innerHTML += popupHtml;
    }

    //Add fresh stylesheet to body
    if(!document.getElementById('reflio-confirm-styles')){
      const popupStyles = `
        #reflio-confirm {
          position: fixed;
          bottom: 0%;
          left: 50%;
          margin-bottom: 30px;
          transform: translateX(-50%);
          text-align: center;
          font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
          border-radius: 15px;
          overflow: hidden;
          z-index: 2147483647;
          background-color: #FFFFFF;
          border: 4px solid #e3e3e3;
          padding: 18px;
          width: 92%;
          max-width: 320px;
          box-shadow: 0 0 200px rgba(0,0,0,0.18);
          color: #000000;
        }
        #reflio-confirm * {
          box-sizing: border-box;
        }
        #reflio-content-title {
          font-size: 16px;
          line-height: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        #reflio-content-subtitle {
          font-size: 15px;
          line-height: 20px;
        }
        #reflio-confirm-button {
          padding: 15px;
          border-radius: 15px;
          font-size: 16px;
          font-weight: bold;
          background: #ddd;
          cursor: pointer;
          margin-top: 15px;
          border: 2px solid #cccccc;
          color: #000;
        }
        #reflio-confirm-button:hover {
          background-color: #cccccc;
        }
        #reflio-cancel-button {
          margin-top: 10px;
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
        }
        #reflio-content-bottom {
          margin-top: 15px;
          padding-bottom: 10px;
          border-top: 4px solid #e3e3e3;
        }
        #reflio-content-bottom p {
          margin-top: 15px;
          font-size: 13px;
          line-height: 18px;
          color: #848484;
        }
        #reflio-content-bottom span {
          font-weight: bold;
        }
      `;
      let styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = popupStyles;
      styleSheet.setAttribute('id','reflio-confirm-styles');
      document.head.appendChild(styleSheet);
    }

    //On popup confirm button click
    if(document.getElementById('reflio-confirm-button')){
      document.getElementById('reflio-confirm-button').addEventListener("click", function() {
        Reflio.register();
      });
    }

    //On popup cancel button click
    if(document.getElementById('reflio-cancel-button')){
      document.getElementById('reflio-cancel-button').addEventListener("click", function() {
        Reflio.consentCleanup();
        localStorage.setItem('reflioNoConsent', true);
      });
    }
  }
  async convert(email){
    if(!email || Reflio.checkCookie() === null || !Reflio.checkCookie().referral_id || !Reflio.checkCookie().campaign_id || !Reflio.checkCookie().affiliate_id || !Reflio.checkCookie().cookie_date){
      console.warn("Reflio: Conversion could not be tracked.")
      return false;
    }
    
    const convertData = await fetch(ReflioAPIRoot+'/convert-referral', {
      method: 'POST',
      body: JSON.stringify({
        referralId: Reflio.checkCookie().referral_id,
        campaignId: Reflio.checkCookie().campaign_id,
        affiliateId: Reflio.checkCookie().affiliate_id,
        cookieDate: Reflio.checkCookie().cookie_date,
        email: email
      }),
    }).then(function (response) {
      return response.json();
    });

    console.log("convertData:")

    return convertData;
  }
}

//Activate global class.
const Reflio = new rfl;

function activatePopup(){
  if(scrolledPercentage >= 33 && Reflio.details().hidePopup === false && Reflio.consentRequired() === true && Reflio.cookieExists() === false){
    setTimeout(() => {
      Reflio.showPopup();
    }, 4000);
  }
}

//Tracking script verification from server 
if(reflioVerifyParam !== null){
  if(reflioVerifyParam === "true"){
    const verifyDomain = Reflio.checkDomainVerification();

    if(verifyDomain?.verified === true){
      window.location.href = `${ReflioDomainRoot}/dashboard/${Reflio.details().companyId}/setup/verify`
    }
  }
}

if(Reflio.consentRequired() === false && Reflio.cookieEligible() === true){
  Reflio.register();
}

//Initially activate the function to check if already scrolled past 33% of the page.
activatePopup();

//Continually checks if 33% of the page has been scrolled etc.
window.addEventListener("scroll", function checkScrollPercentage() {
  scrolledPercentage = (((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100).toFixed(0));

  if(scrolledPercentage >= 33){
    window.removeEventListener("scroll", checkScrollPercentage, false);
    activatePopup();
  }

}, false);

//If cookie already exists, double check and remove all consent banners.
if(Reflio.cookieExists() === true){
  Reflio.consentCleanup();
}

if(!reflioInnerScript) {
  console.error("Could not load Reflio: make sure the <script> tag includes data-reflio='<companyId>'")
}
import emailBuilderServer from '@/utils/email-builder-server';

export const sendEmail = async (subject, to, type, settings) => {
  const SibApiV3Sdk = require('sib-api-v3-sdk');
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.SIB_API_KEY;
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  const emailHtml = emailBuilderServer(type, settings);
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = emailHtml;
  sendSmtpEmail.sender = {"name":"Richie from SEOCopy","email":"richie@seocopy.ai"};
  sendSmtpEmail.to = [{"email": to}];

  if(type === 'invite'){    
    sendSmtpEmail.params = {"parameter":"UserInvite","subject":"UserInvite"};
  }
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    return "success";
  }, function(error) {
    console.log(error);
    return "error";
  });

  return "success";
};

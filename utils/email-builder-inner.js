export default function emailBuilderInner(parsedDoc, type, settings) {
  if(parsedDoc === null) return false;
  
  let templateEmail = parsedDoc.serialize(parsedDoc);

  if(type === 'invite'){
    templateEmail = templateEmail.replace(/{{teamName}}/g, settings?.team_name);
    templateEmail = templateEmail.replace(/{{inviteURL}}/g, `${process.env.NEXT_PUBLIC_DOMAIN_URL}/dashboard`);
  }

  return templateEmail;
}
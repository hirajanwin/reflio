import emailBuilderInner from '@/utils/email-builder-inner';

export default function emailBuilderServer(type, settings) {
  let emailType = 'default';

  if(type === 'invite'){
    emailType = 'inviteUser';
  }

  const defaultEmail = require(`../emails/${emailType}.js`).default;
  let templateEmail = defaultEmail();
  const jsdom = require("jsdom").JSDOM;
  const parsedDoc = new jsdom(templateEmail);

  return emailBuilderInner(parsedDoc, type, settings);
}
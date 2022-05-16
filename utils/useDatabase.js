import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';
import { toDateTime } from './helpers';

// This entire file should be removed and moved to supabase-admin
// It's not a react hook, so it shouldn't have useDatabase format
// It should also properly catch and throw errors
const upsertProductRecord = async (product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error } = await supabaseAdmin
    .from('products')
    .insert([productData], { upsert: true });
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price) => {
  const priceData = {
    id: price.id,
    product_id: price.product,
    active: price.active,
    currency: price.currency,
    description: price.nickname,
    type: price.type,
    unit_amount: price.unit_amount,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata
  };

  const { error } = await supabaseAdmin
    .from('prices')
    .insert([priceData], { upsert: true });
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({ email, uuid }) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single();
  if (error) {
    // No customer record found, let's create one.
    const customerData = {
      metadata: {
        supabaseUUID: uuid
      }
    };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  if (data) return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (uuid, payment_method) => {
  const customer = payment_method.customer;
  const { name, phone, address } = payment_method.billing_details;
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: address,
      payment_method: payment_method[payment_method.type]
    })
    .eq('id', uuid);
  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId,
  customerId,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const {
    data: { id: uuid },
    error: noCustomerError
  } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    current_period_start: toDateTime(subscription.current_period_start),
    current_period_end: toDateTime(subscription.current_period_end),
    created: toDateTime(subscription.created),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null
  };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .insert([subscriptionData], { upsert: true });
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method)
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method
    );
};

const getCampaignData = async (companyId) => {
  const { data, error } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error) return null;

  return data;
}

//New submission
const addEmail = async (submissionId, submittedEmail) => {  
  if(submissionId === null || submittedEmail === null) return "error";

  const { error } = await supabaseAdmin
    .from('submissions')
    .update({
      submitted_email: submittedEmail
    })
    .match({ submission_id: submissionId })

  if(error) return "error";

  return "success"
};

export const getAccountEmail = async (id) => {
  const { data } = await supabaseAdmin
  .from('users_table')
  .select('email')
  .eq('id', id)
  .single();

  if(data){
    return data?.email ? data?.email : null;
  } else {
    return "error";
  }
}

export const getCompanyFromExternal = async (domain) => {
  let { data, error } = await supabaseAdmin
    .from('companies')
    .select('company_id, domain_verified, company_url')
    .eq('company_url', domain)
    .single();

    console.log('error here');
    console.log(error);

    if (error) return "error";

  if(data?.domain_verified === false){

    let { error } = await supabaseAdmin
    .from('companies')
    .update({
      domain_verified: true,
    })
    .eq('company_id', data?.company_id);

    console.log('error here 2');
    console.log(error);

    if (error) return "error";
  }

  return "success";
};

export const inviteAffiliate = async (user, companyId, campaignId, emailInvites) => {
  const { error } = await supabaseAdmin.from('affiliates').insert({
    id: user?.id,
    company_id: companyId,
    campaign_id: campaignId,
    invite_email: emailInvites
  });

  if (error) {
    return "error";
  } else {
    return "success";
  }
};

export const verifyReferral = async (referralCode, companyId) => {
  let referralData = null;
  let { data, error } = await supabaseAdmin
    .from('affiliates')
    .select('*')
    .eq('company_id', companyId)
    .eq('referral_code', referralCode)
    .single();
  
  if(data){
    referralData = data;
  } else {
    let { data, error } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('company_id', companyId)
      .eq('affiliate_id', referralCode)
      .single();

    if(data){
      referralData = data;
    }
  }
  
  
  if (error || referralData === null) {
    return "error";
  } else {
    return referralData;
  }
};

export const fireRecordImpression = async (id) => {
  const { error } = await supabaseAdmin.rpc('referralimpression', { x: 1, affiliateid: id })

  if (error) {
    return "error";
  } else {
    return "success";
  }
};

export const referralDetails = async (details) => {
  let { data, error } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('campaign_id', details?.campaign_id)
    .single();

  if(error){
    return "error";
  }
  
  if(data){
    let dateToday = new Date();
    if(data?.cookie_window){
      dateToday.setDate(dateToday.getDate() + data?.cookie_window);
    } else {
      dateToday.setDate(dateToday.getDate() + 60)
    }
    dateToday = dateToday.toUTCString();
    
    return {
      "campaign_id": data?.campaign_id,
      "cookie_date": dateToday,
      "campaign_name": data?.campaign_name,
      "affiliate_id": details?.affiliate_id
    }
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  addEmail
};


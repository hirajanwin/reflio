import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';
import { toDateTime } from './helpers';

// This entire file should be removed and moved to supabase-admin
// It's not a react hook, so it shouldn't have useDatabase format
// It should also properly catch and throw errors
export const upsertProductRecord = async (product) => {
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

export const upsertPriceRecord = async (price) => {
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

export const createOrRetrieveCustomer = async ({ email, uuid }) => {
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
export const copyBillingDetailsToCustomer = async (uuid, payment_method) => {
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

export const manageSubscriptionStatusChange = async (
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

export const getCampaignData = async (companyId) => {
  const { data, error } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error) return null;

  return data;
}

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
  let { data } = await supabaseAdmin
    .from('affiliates')
    .select('*')
    .eq('company_id', companyId)
    .eq('referral_code', referralCode)
    .single();
  
  if(data){
    referralData = data;
  } else {
    let { data } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('company_id', companyId)
      .eq('affiliate_id', referralCode)
      .single();

    if(data){
      referralData = data;
    }
  }
  
  if (referralData === null) {
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

export const createReferral = async (details) => {
  let campaignData = null;
  let { data, error } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('campaign_id', details?.campaign_id)
    .single();

  if(error){
    return "error";
  }
  
  if(data){
    campaignData = data;
    
    let dateToday = new Date();
    if(data?.cookie_window){
      dateToday.setDate(dateToday.getDate() + data?.cookie_window);
    } else {
      dateToday.setDate(dateToday.getDate() + 60)
    }
    let dateTodayIso = dateToday.toISOString();
    dateToday = dateToday.toUTCString();

    let referralData = { data, error } = await supabaseAdmin.from('referrals').insert({
      id: data?.id,
      affiliate_id: details?.affiliate_id,
      affiliate_code: details?.affiliate_code,
      campaign_id: data?.campaign_id,
      company_id: data?.company_id,
      commission_type: data?.commission_type,
      commission_value: data?.commission_value,
      cookie_window: data?.cookie_window,
      commission_period: data?.commission_period,
      minimum_days_payout: data?.minimum_days_payout,
      referral_expiry: dateTodayIso
    });

    if(referralData?.data){
      return {
        "campaign_id": campaignData?.campaign_id,
        "cookie_date": dateToday,
        "campaign_name": campaignData?.campaign_name,
        "affiliate_id": details?.affiliate_id,
        "referral_id": referralData?.data[0].referral_id
      }
    } else {
      return "error";
    }
  }
};

export const campaignInfo = async (code, companyId) => {
  let campaignData = null;
  const referralVerify = await verifyReferral(code, companyId);

  if(referralVerify === "error") return "error";

  let { data, error } = await supabaseAdmin
    .from('campaigns')
    .select('campaign_name, discount_code, discount_value, discount_type, company_id')
    .eq('campaign_id', referralVerify?.campaign_id)
    .single();

  if(error){
    return "error";
  }

  if(data){
    campaignData = data;
  }
  
  let companyData = await supabaseAdmin
    .from('companies')
    .select('company_currency')
    .eq('company_id', campaignData?.company_id)
    .single();

  if(companyData?.data !== null && companyData?.data?.company_currency){
    campaignData.company_currency = companyData?.data?.company_currency;
  }

  console.log(companyData?.data)

  return campaignData;
};

export const convertReferral = async (referralId, campaignId, affiliateId, cookieDate, email) => {
  let referralData = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('referral_id', referralId)
    .single();

  let commissionData = null;

  if(referralData?.data && cookieDate){

    let dateToday = new Date();
    let dateTodayTimestamp = dateToday.getTime();
    let cookieExpiryDate = new Date(cookieDate);
    let cookieExpiryDateTimestamp = cookieExpiryDate.getTime();

    if(dateTodayTimestamp > cookieExpiryDateTimestamp){
      return "expired";
    }

    //Get stripe ID from company
    let companyData = await supabaseAdmin
      .from('companies')
      .select('stripe_id')
      .eq('company_id', referralData?.data?.company_id)
      .single();

    console.log("Stripe ID: ",companyData?.data?.stripe_id)

    if(companyData?.data?.stripe_id){  
      const customer = await stripe.customers.list({
        email: email,
        limit: 1,
      }, {
        stripeAccount: companyData?.data?.stripe_id
      });

      //Payment intent flow
      if(customer?.data?.length){

        console.log("Customer ID: ",customer?.data[0]?.id)

        if(!customer?.data[0]?.metadata?.reflio_referral_id){
          //Add parameter to Stripe customer
          await stripe.customers.update(
            customer?.data[0]?.id,
            {metadata: {reflio_referral_id: referralData?.data?.referral_id}},
            {stripeAccount: companyData?.data?.stripe_id}
          );
        } else {
          console.log("---Customer already has metadata---")
          console.log(customer?.data[0]?.metadata?.reflio_referral_id)
        }

        if(customer?.data[0]?.email === email){
          const paymentIntent = await stripe.paymentIntents.list({
            customer: customer?.data[0]?.id,
            limit: 1,
          }, {
            stripeAccount: companyData?.data?.stripe_id
          });

          if(paymentIntent?.data?.length && paymentIntent?.data[0]?.metadata?.reflio_commission_id){

            //Check DB and make sure that the commission is still valid and exists.
            let commissionFromId = await supabaseAdmin
              .from('commissions')
              .select('commission_id, paid_at')
              .eq('commission_id', paymentIntent?.data[0]?.metadata?.reflio_commission_id)
              .single();

            if(commissionFromId?.data !== null && commissionFromId?.data?.length){
              commissionData = commissionFromId?.data[0];
              console.log("Payment intent has a commission ID")
            }

            if(commissionFromId?.data !== null && commissionFromId?.data?.length && commissionFromId?.data?.paid_at !== null){
              console.log("Commission has already been marked as paid.")
              return "commission_paid";        
            }
          }

          if(paymentIntent?.data[0]?.invoice){
            const invoice = await stripe.invoices.retrieve(
              paymentIntent?.data[0]?.invoice,
              {stripeAccount: companyData?.data?.stripe_id}
            );
            
            let invoiceTotal = invoice?.total;

            //----CALCULATE REUNDS----
            const refunds = await stripe.refunds.list({
              payment_intent: invoice?.payment_intent,
              limit: 10,
            }, {
              stripeAccount: companyData?.data?.stripe_id
            });

            if(refunds && refunds?.data?.length > 0){
              refunds?.data?.map(refund => {
                if(refund?.amount > 0){
                  invoiceTotal = parseInt(invoiceTotal - refund?.amount);
                }
              })
            }
            //----END CALCULATE REUNDS----

            let dueDate = new Date();
            if(referralData?.data?.minimum_days_payout){
              dueDate.setDate(dueDate.getDate() + referralData?.data?.minimum_days_payout);
            } else {
              dueDate.setDate(dueDate.getDate() + 30)
            }
            let dueDateIso = dueDate.toISOString();
            let commissionAmount = invoiceTotal > 0 ? referralData?.data?.commission_type === "fixed" ? referralData?.data?.commission_value : (parseInt((((parseFloat(invoiceTotal/100)*parseFloat(referralData?.data?.commission_value))/100)*100))) : 0;
            let invoiceLineItems = [];
            
            if(invoice?.paid === false){
              invoice?.lines?.data?.map(line => {
                invoiceLineItems?.push(line?.description);
              })
            }

            let referralUpdate = await supabaseAdmin
              .from('referrals')
              .update({
                referral_converted: true
              })
              .eq('referral_id', referralId);

            if(!referralUpdate?.error){

              let newCommissionValues = null;

              if(commissionData !== null){    

                newCommissionValues = await supabaseAdmin
                  .from('commissions')
                  .update({
                    commission_sale_value: invoiceTotal,
                    commission_total: commissionAmount,
                    commission_description: invoiceLineItems.toString()
                  })
                  .eq('commission_id', commissionData?.commission_id);

              } else {

                newCommissionValues = await supabaseAdmin.from('commissions').insert({
                  id: referralData?.data?.id,
                  company_id: referralData?.data?.company_id,
                  campaign_id: referralData?.data?.campaign_id,
                  affiliate_id: referralData?.data?.affiliate_id,
                  referral_id: referralData?.data?.referral_id,
                  payment_intent_id: invoice?.payment_intent,
                  commission_sale_value: invoiceTotal,
                  commission_total: commissionAmount,
                  commission_due_date: dueDateIso,
                  commission_description: invoiceLineItems.toString()
                });
              }

              if(newCommissionValues !== null && newCommissionValues?.data){

                //Add parameter to Stripe payment intent
                await stripe.paymentIntents.update(
                  invoice?.payment_intent,
                  {metadata: {reflio_commission_id: newCommissionValues?.data[0]?.commission_id}},
                  {stripeAccount: companyData?.data?.stripe_id}
                );

                //Add parameter to Stripe invoice
                await stripe.invoices.update(
                  invoice?.id,
                  {metadata: {reflio_commission_id: newCommissionValues?.data[0]?.commission_id}},
                  {stripeAccount: companyData?.data?.stripe_id}
                );

                return newCommissionValues?.data;
              }
            }
          }
        }
      }
    }
  }

  return "error";
};

//Deletes stripe ID from company account
export const deleteIntegrationFromDB = async (stripeId) => {
  const { error } = await supabaseAdmin
  .from('companies')
  .update({
    stripe_id: null
  })
  .eq({ stripe_id: stripeId })
  if (error) return "error";
};
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

const getBrandData = async (brandId) => {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('brand_id', brandId)
    .single();

  if (error) return null;

  return data;
}

//New submission
const newSubmission = async (brandId, details, headers) => {  
  if(brandId === null || details === null) return "error";

  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('brand_id', brandId)
    .single();

  if (error) return "error";

  const brandData = data;

  if(brandData){

    const userId = brandData?.id;
    const brandName = brandData?.display_name;
    let submissionId = null;

    const { data, error } = await supabaseAdmin.from('submissions').upsert({
      id: userId,
      brand_id: brandId,
      submission_text: details?.message !== null && details?.message?.length > 0 && details?.message !== 'none' ? details?.message : null,
      submission_video: details?.url !== null && details?.url?.length > 0 && details?.url !== 'none' ? details?.url : null,
      submission_type: details?.type !== null && details?.type?.length > 0 && details?.type !== 'none' ? details?.type : null,
      submission_reference: details?.userId !== null && details?.userId?.length > 0 && details?.userId !== 'none' ? details?.userId : null,
      metadata: {"origin": details?.websiteUrl !== null && details?.websiteUrl?.length > 0 ? details?.websiteUrl : null, "user-agent": headers['user-agent'], "errors": details?.errorLogs !== null && details?.errorLogs?.length > 0 ? details?.errorLogs : null}
    });
    
    if (error) return "error";

    if(data[0]?.submission_id){
      submissionId = data[0]?.submission_id;
    }

    const response = {
      "userId": userId, 
      "brandId": brandId, 
      "subject": `[${brandName} #REF-${submissionId.substring(1, 4)}] New Submission 🥳`,
      "type": 'submission',
      "details": details,
      "submissionId": submissionId
    };

    if(brandData?.disable_emails === true){
      return "do not send";
    } else {
      return response;
    }

  } else {

    return "error";

  }
};

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

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  getBrandData,
  newSubmission,
  addEmail
};

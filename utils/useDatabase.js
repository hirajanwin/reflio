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

const getcompanyData = async (companyId) => {
  const { data, error } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error) return null;

  return data;
}

//New submission
const newSubmission = async (companyId, details, headers) => {  
  if(companyId === null || details === null) return "error";

  const { data, error } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error) return "error";

  const companyData = data;

  if(companyData){

    const userId = companyData?.id;
    const companyName = companyData?.company_name;
    let submissionId = null;

    const { data, error } = await supabaseAdmin.from('submissions').upsert({
      id: userId,
      company_id: companyId,
      submission_text: details?.message !== null && details?.message?.length > 0 && details?.message !== 'none' ? details?.message : null,
      submission_video: details?.url !== null && details?.url?.length > 0 && details?.url !== 'none' ? details?.url : null,
      submission_type: details?.type !== null && details?.type?.length > 0 && details?.type !== 'none' ? details?.type : null,
      submission_reference: details?.userId !== null && details?.userId?.length > 0 && details?.userId !== 'none' ? details?.userId : null,
      metadata: {"origin": details?.companyUrl !== null && details?.companyUrl?.length > 0 ? details?.companyUrl : null, "user-agent": headers['user-agent'], "errors": details?.errorLogs !== null && details?.errorLogs?.length > 0 ? details?.errorLogs : null}
    });
    
    if (error) return "error";

    if(data[0]?.submission_id){
      submissionId = data[0]?.submission_id;
    }

    const response = {
      "userId": userId, 
      "companyId": companyId, 
      "subject": `[${companyName} #REF-${submissionId.substring(1, 4)}] New Submission 🥳`,
      "type": 'submission',
      "details": details,
      "submissionId": submissionId
    };

    if(companyData?.disable_emails === true){
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

export const getCompanyName = async (id) => {
  let { data } = await supabaseAdmin
  .from('companies')
  .select('company_name')
  .eq('company_id', id)
  .single();

  if(data){
    return data?.company_name ? data?.company_name : null;
  } else {
    return "error";
  }
}

export const checkCompanyInvites = async (user) => {
  let inviteData = null;

  let { data } = await supabaseAdmin
    .from('company_invites')
    .select('*')
    .eq('invite_email', user?.email)
    .eq('accepted', false)
    .single();

    if(data){
      inviteData = data;
      
      if(inviteData?.invite_email === user?.email){
    
        let { data } = await supabaseAdmin
        .from('companies')
        .select('company_name')
        .eq('company_id', inviteData?.company_id)
        .single();

        console.log('company data::')
        console.log(data)
  
        if(data){
          inviteData['company_name'] = data?.company_name
          console.log('company name: ', data?.company_name)
          return inviteData;
        }
      }
      
    } else {
      return "error";
    }
}

export const editCompany = async (companyId, editType, formData, userDetails) => {
  let editData = {};
  let companyUsers = null;
  let companyInviteEmail = formData?.invite_email ? formData?.invite_email : null;
  let companyUserEmail = formData?.user_email ? formData?.user_email : null;
  let proceed = false;

  //Get company data
  let { data } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('company_id', companyId);

  //If array, turn it into single object
  if(data){
    companyUsers = data[0]?.company_users;
  }

  //If edit type is invite
  if(editType === 'invite' && companyInviteEmail !== null){

    //Check if company already has users
    if(companyUsers === null){
      companyUsers = {
        users: [
          {
            user_email: companyInviteEmail,
            user_id: null,
            user_permission: null,
            invited: true,
            accepted: false,
            date: ((new Date()).toISOString())
          }
        ]
      };
    } else {
      companyUsers?.users?.push(
        {
          user_email: companyInviteEmail,
          user_id: null,
          user_permission: null,
          invited: true,
          accepted: false,
          date: ((new Date()).toISOString())
        }
      )
    }
    editData = {
      company_users: companyUsers
    };

    //Add new company invite
    let { error } = await supabaseAdmin
    .from('company_invites')
    .insert({
      id: userDetails?.id,
      invite_email: companyInviteEmail,
      company_id: companyId,
      accepted: false,
    })

    if (error) return "error"
    
    proceed = true;
  }

  if(editType === 'delete' && companyUsers){
    for (let i = 0; i < companyUsers?.users?.length; i++){
      if (companyUsers?.users[i]?.user_email === companyUserEmail) {

        //If user has not accepted invite, then delete the invite
        if(companyUsers?.users[i]?.accepted === false){
          let { error } = await supabaseAdmin
          .from('company_invites')
          .delete()
          .match({ invite_email: companyUserEmail });

          console.log("delete error:::")
          console.log(error)

          if (error) return "error";
        }

        //Delete user from users list
        companyUsers?.users?.splice(i,1);

        //Break the for loop once found
        break;
      }
    }
    editData = {
      company_users: companyUsers
    };
    proceed = true;
  }

  if(formData?.company_name){
    editData['company_name'] = formData?.company_name;
  }

  if(editData?.company_users?.users?.length === 0){
    editData['company_users'] = null;
  }

  if(proceed !== true) return "error";

  const { error } = await supabaseAdmin
    .from('companies')
    .update(editData)
    .eq('company_id', companyId);

  if (error) {
    console.log('errored here');
    console.log(error)
    return "error";
  } else {
    return "success";
  }
};

export const acceptInvite = async (userEmail, companyId, userDetails) => {
  if(userEmail === null || companyId === null || userDetails === null) return "error";

  let foundMatch = false;
  let companyData = null;

  let { data } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('company_id', companyId);

  if(data){
    companyData = data[0]?.company_users;
  }

  if(companyData !== null){
    companyData?.users?.forEach(user =>{
      if(user?.user_email === userEmail){
        foundMatch = true;
        user['accepted'] = true;
        user['user_id'] = userDetails?.id;
      }
    })
  }

  if(foundMatch === true && companyData !== null){
    let { error } = await supabaseAdmin
    .from('companies')
    .update({
      company_users: companyData
    })
    .eq('company_id', companyId);

    if(error){
      return "error";
    } else {
      let { error } = await supabaseAdmin
      .from('users')
      .update({
        company_id: companyId
      })
      .eq('id', userDetails?.id);
      if(error){
        return "error";
      } else {
        let { error } = await supabaseAdmin
        .from('company_invites')
        .update({
          accepted: true
        })
        .eq('invite_email', userDetails?.email);
        if (error) return "error"
      }
    }
  }

  return "success";
}

export const companyData = async (userEmail, companyId, user) => {
  if(userEmail === null || companyId === null) return "error";

  let foundMatch = false;
  let companyDataReturned = null;

  let { data } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('company_id', companyId);

  if(data){
    companyDataReturned = data[0];
  }

  if(companyDataReturned?.company_users !== null){
    companyDataReturned?.company_users?.users?.forEach(user =>{
      if(user?.user_email === userEmail){
        foundMatch = true;
      }
    })
  }

  if(user?.id === companyDataReturned?.id){
    foundMatch = true;
  }

  if(foundMatch === false){
    return "error";
  }

  return {
    companyDataReturned
  };
}

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  getcompanyData,
  newSubmission,
  addEmail
};

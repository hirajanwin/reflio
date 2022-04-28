import { stripe } from '@/utils/stripe';
import { getUser } from '@/utils/supabase-admin';
import { createOrRetrieveCustomer } from '@/utils/useDatabase';
import { getURL } from '@/utils/helpers';

const createLifetimeDeal = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const couponCode = req.body.couponCode;

    try {
      const promotionCode = await stripe.promotionCodes.list({
        code: couponCode,
        limit: 1
      })
      
      if(promotionCode?.data && promotionCode?.data[0]?.active === true){
        const user = await getUser(token);
        const customer = await createOrRetrieveCustomer({
          uuid: user.id,
          email: user.email
        });
        const subscription = await stripe.subscriptions.create({
          customer,
          items: [
            {price: 'price_1KRfK8JFcHkAGyDvU5gbZ3Ld'},
          ],
          cancel_at_period_end: false,
          payment_behavior: 'allow_incomplete',
          promotion_code: promotionCode?.data[0]?.id
        });
  
        return res.status(200).json({ subscriptionId: subscription.id });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default createLifetimeDeal;

import {
  EyeOffIcon,
  LightningBoltIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  GlobeIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';

export default function Features() {

  const features = [
    {
      name: "Automated privacy & GDPR compliance",
      description: 'All data processed through European-owned infrastructure, and our company is registered in the UK. With Reflio, referrals located in the EU are automatically required to confirm their consent before a cookie is set.',
      active: true,
      icon: EyeOffIcon
    },
    {
      name: 'Our embed script is fast',
      description: "Being under <13kb, our embed code is up to 5x faster than some of our competitors, meaning we're better for your SEO than they are.",
      active: true,
      icon: LightningBoltIcon
    },
    {
      name: 'Get started in minutes',
      description: 'Quickly connect your SaaS product to Reflio with pre-written code examples. You can instantly take advantage of word of mouth referrals to get higher quality sign ups to your app via your existing users.',
      active: true,
      icon: SparklesIcon
    },
    {
      name: 'Subscriptions or one-time charges',
      description: 'Reflio works with both subscriptions and one-time payments in Stripe. Future subscription payments that came from a referral are handled automatically and re-collected in your dashboard.',
      active: true,
      icon: CreditCardIcon
    },
    {
      name: 'Cross subdomain tracking',
      description: "Is your SaaS on a subdomain? Don't worry. We'll automatically track across your main domain to your sub domain with no extra work on your end.",
      active: true,
      icon: GlobeIcon
    },
    {
      name: 'Pricing from $0/month',
      description: "We're indie hacker friendly. Being indie hackers ourselves, we know that all new projects start from $0 MRR. Reflio starts from just $0/month with a 9% commission per successful referral.",
      active: true,
      icon: CurrencyDollarIcon
    },
  ];
  
  return(
    <div id="features">
      <dl className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-20 lg:grid-cols-2 lg:gap-x-20">
        {features.map((feature) => (
          <div>
            <dt>
              {
                feature.icon &&
                <feature.icon className="w-12 h-auto mb-3"/>
              }
              <p className="text-3xl font-semibold">{feature.name}</p>
            </dt>
            <dd className="mt-2 text-2xl">{feature.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small projects',
      price: '$9.99',
      period: '/month',
      features: [
        'Up to 10 GB storage',
        '100 GB bandwidth',
        'Basic support',
        '99.5% uptime SLA',
        '1 email account'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'For growing businesses',
      price: '$29.99',
      period: '/month',
      features: [
        'Up to 100 GB storage',
        'Unlimited bandwidth',
        'Priority support',
        '99.9% uptime SLA',
        'Unlimited email accounts',
        'Free SSL certificate',
        'Daily backups'
      ],
      cta: 'Get Started',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For large-scale operations',
      price: 'Custom',
      period: 'pricing',
      features: [
        'Unlimited storage',
        'Unlimited bandwidth',
        '24/7 dedicated support',
        '99.99% uptime SLA',
        'Unlimited email accounts',
        'Free SSL certificate',
        'Hourly backups',
        'Custom configurations'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - HostEver</title>
        <meta name="description" content="Affordable hosting plans for every need. Choose from our flexible pricing options." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your hosting needs. All plans include our core features and 24/7 support.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative flex flex-col ${
                  plan.highlighted ? 'ring-2 ring-blue-500 md:scale-105' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      plan.highlighted
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                    asChild
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600">Yes, you can change your plan at any time. Changes take effect on your next billing cycle.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
                <p className="text-gray-600">No, there are no hidden setup fees. You only pay the monthly subscription price.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise customers.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pricing;

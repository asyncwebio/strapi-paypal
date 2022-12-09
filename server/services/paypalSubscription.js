/* eslint-disable node/no-extraneous-require */

'use strict';

const axiosInstance = require('axios');

module.exports = () => ({
  // creating paypal product
  async createProduct(title, description, productType, accessToken, url) {
    const data = {
      name: title,
      description,
      type: productType,
    };

    const response = await axiosInstance.post(`${url}/v1/catalogs/products`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },

  // create paypal plan
  async createPlan(
    productId,
    title,
    description,
    paymentInterval,
    accessToken,
    url,
    productPrice,
    currency,
    checkoutSuccessUrl,
    checkoutCancelUrl
  ) {
    let paymentIntervalUnit;
    if (paymentInterval === 'YEAR') {
      paymentIntervalUnit = 1;
    } else if (paymentInterval === 'MONTH') {
      paymentIntervalUnit = 12;
    } else if (paymentInterval === 'WEEK') {
      paymentIntervalUnit = 52;
    }

    const data = {
      product_id: productId,
      name: title,
      description,
      billing_cycles: [
        {
          frequency: {
            interval_unit: paymentInterval,
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: paymentIntervalUnit,
          pricing_scheme: {
            fixed_price: {
              value: productPrice,
              currency_code: currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
        cancel_url: checkoutCancelUrl,
        return_url: checkoutSuccessUrl,
      },
    };

    const response = await axiosInstance.post(`${url}/v1/billing/plans`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // create paypal subscription
  async createSubscriptionPlan(planId, accessToken, url) {
    const data = {
      plan_id: planId,
    };

    const response = await axiosInstance.post(`${url}/v1/billing/subscriptions`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // create paypal subscription
  async createSubscription(
    title,
    productPrice,
    description,
    isSubscription,
    paymentInterval,
    trialPeriodDays,
    productType,
    accessToken,
    url,
    checkoutSuccessUrl,
    checkoutCancelUrl,
    currency
  ) {
    const product = await this.createProduct(title, description, productType, accessToken, url);
    let plan;
    if (product.id)
      plan = await this.createPlan(
        product.id,
        title,
        description,
        paymentInterval,
        accessToken,
        url,
        productPrice,
        currency,
        checkoutSuccessUrl,
        checkoutCancelUrl
      );
    //subscription
    let subscription;
    if (plan) subscription = await this.createSubscriptionPlan(plan.id, accessToken, url);

    return subscription;
  },
});

/* eslint-disable node/no-extraneous-require */
'use strict';

const axiosInstance = require('axios');

module.exports = () => ({
  // creating paypal order
  async createOrder(
    title,
    productPrice,
    description,
    accessToken,
    checkoutSuccessUrl,
    checkoutCancelUrl,
    currency,
    url
  ) {
    // get access token
    const data = {
      intent: 'CAPTURE',
      application_context: {
        return_url: checkoutSuccessUrl,
        cancel_url: checkoutCancelUrl,
        brand_name: 'EXAMPLE INC',
        locale: 'en-US',
        landing_page: 'BILLING',
      },
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: productPrice,
          },
        },
      ],
      items: [
        {
          name: title,
          description,
          unit_amount: {
            currency_code: currency,
            value: productPrice,
          },
          quantity: '1',
        },
      ],
    };

    const response = await axiosInstance.post(`${url}/v2/checkout/orders`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
});

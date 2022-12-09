/* eslint-disable node/no-extraneous-require */
/* eslint-disable node/no-missing-require */

'use strict';

const { ApplicationError } = require('@strapi/utils').errors;
const axiosInstance = require('axios');

module.exports = ({ strapi }) => ({
  async initialize() {
    const { paypalSandBoxUrl, paypalLiveUrl } = await strapi.config.get('plugin.strapi-paypal');
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-paypal',
    });
    const settings = await pluginStore.get({ key: 'paypalSetting' });

    return { settings, paypalSandBoxUrl, paypalLiveUrl };
  },

  async createStrapiProduct(
    title,
    productPrice,
    description,
    isSubscription,
    paymentInterval,
    trialPeriodDays,
    productType
  ) {
    try {
      // get access token
      const accessToken = await strapi
        .plugin('strapi-paypal')
        .service('paypalAccessToken')
        .getAccessToken();

      let result;

      const { settings, paypalSandBoxUrl, paypalLiveUrl } = await this.initialize();

      const { isLiveMode, checkoutCancelUrl, checkoutSuccessUrl, currency } = settings;

      const url = isLiveMode ? paypalLiveUrl : paypalSandBoxUrl;

      if (isSubscription) {
        result = await strapi
          .plugin('strapi-paypal')
          .service('paypalSubscription')
          .createSubscription(
            title,
            productPrice,
            description,
            isSubscription,
            paymentInterval,
            trialPeriodDays,
            productType,
            accessToken,
            url,
            checkoutCancelUrl,
            checkoutSuccessUrl,
            currency
          );
        const { id, links } = result;
        console.log('subscription', links);
        if (id) {
          const product = await strapi.query('plugin::strapi-paypal.paypal-product').create({
            data: {
              title,
              description,
              price: productPrice,
              currency: settings.currency,
              isSubscription,
              interval: paymentInterval,
              trialPeriodDays,
              paypalSubcriptionId: id,
              paypalLinks: links,
            },
            populate: true,
          });
          return product;
        }
      } else {
        // create paypal order
        result = await strapi
          .plugin('strapi-paypal')
          .service('paypalOrder')
          .createOrder(
            title,
            productPrice,
            description,
            accessToken,
            checkoutSuccessUrl,
            checkoutCancelUrl,
            currency,
            url
          );
        const { id, status, links } = result;
        console.log('order', links);
        // onsuccess create order store in database
        if (status === 'CREATED') {
          const create = await strapi.query('plugin::strapi-paypal.paypal-product').create({
            data: {
              title,
              description,
              price: productPrice,
              currency: settings.currency,
              isSubscription,
              interval: paymentInterval,
              trialPeriodDays,
              paypalOrderId: id,
              paypalLinks: links,
            },
            populate: true,
          });
          return create;
        }
      }
    } catch (error) {
      console.log(error.response.data);
      throw new ApplicationError(error.message);
    }
  },
  async find(offset, limit, sort, order) {
    try {
      let needToshort;
      if (sort === 'name') {
        needToshort = { title: `${order}` };
      } else if (sort === 'price') {
        needToshort = { price: `${order}` };
      }
      const count = await strapi.query('plugin::strapi-paypal.paypal-product').count();

      const response = await strapi.query('plugin::strapi-paypal.paypal-product').findMany({
        orderBy: needToshort,
        offset,
        limit,
        populate: true,
      });

      return { response, count };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(error.message);
    }
  },

  async findOne(id) {
    try {
      const response = await strapi
        .query('plugin::strapi-paypal.paypal-product')
        .findOne({ where: { id }, populate: true });
      return response;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(error.message);
    }
  },

  async getPaypalCheckout(isSubscription, paypalOrderId, paypalSubcriptionId) {
    try {
      // get access token
      const accessToken = await strapi
        .plugin('strapi-paypal')
        .service('paypalAccessToken')
        .getAccessToken();
      const { settings, paypalSandBoxUrl, paypalLiveUrl } = await this.initialize();

      const { isLiveMode } = settings;

      const url = isLiveMode ? paypalLiveUrl : paypalSandBoxUrl;
      let response;

      if (isSubscription) {
        // get paypal subscription details
        response = await axiosInstance.get(
          `${url}/v1/billing/subscriptions/${paypalSubcriptionId}`,

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // get paypal order details
        response = await axiosInstance.get(`${url}/v2/checkout/orders/${paypalOrderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(error.message);
    }
  },
});

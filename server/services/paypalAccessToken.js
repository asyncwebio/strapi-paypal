/* eslint-disable node/no-extraneous-require */

'use strict';

const { ApplicationError } = require('@strapi/utils').errors;
const axiosInstance = require('axios');
const qs = require('qs');
const moment = require('moment');

module.exports = ({ strapi }) => ({
  // get paypal access token
  async getAccessToken() {
    const { settings, paypalSandBoxUrl, paypalLiveUrl } = await strapi
      .plugin('strapi-paypal')
      .service('paypalService')
      .initialize();

    const {
      isLiveMode,
      livePaypalClientId,
      livePaypalSecret,
      testPaypalClientId,
      testPaypalSecret,
    } = settings;

    const clientId = isLiveMode ? livePaypalClientId : testPaypalClientId;
    const secret = isLiveMode ? livePaypalSecret : testPaypalSecret;
    const url = isLiveMode ? paypalLiveUrl : paypalSandBoxUrl;

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-paypal',
    });
    const sandboxAuth = await pluginStore.get({ key: 'sandboxAuth' });
    const liveAuth = await pluginStore.get({ key: 'liveAuth' });

    let authentication;
    const today = new Date();

    switch (settings.isLiveMode) {
      case false:
        if (
          sandboxAuth &&
          sandboxAuth.access_token &&
          moment(sandboxAuth.expires_in).isAfter(today)
        ) {
          authentication = sandboxAuth.access_token;
        } else {
          const response = await axiosInstance({
            method: 'post',
            url: `${url}/v1/oauth2/token`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
              grant_type: 'client_credentials',
            }),
            auth: {
              username: clientId,
              password: secret,
            },
          });
          await pluginStore.set({
            key: 'sandboxAuth',
            value: {
              access_token: response.data.access_token,
              expires_in: new Date(Date.now() + response.data.expires_in * 1000),
            },
          });
          authentication = response.data.access_token;
        }
        break;
      case true:
        if (liveAuth && liveAuth.access_token && moment(liveAuth.expires_in).isAfter(today)) {
          authentication = liveAuth.access_token;
        } else {
          const response = await axiosInstance({
            method: 'post',
            url: `${url}/v1/oauth2/token`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
              grant_type: 'client_credentials',
            }),
            auth: {
              username: clientId,
              password: secret,
            },
          });
          await pluginStore.set({
            key: 'liveAuth',
            value: {
              access_token: response.data.access_token,
              expires_in: new Date(Date.now() + response.data.expires_in * 1000),
            },
          });
          authentication = response.data.access_token;
        }
        break;
      default:
        throw new ApplicationError('Invalid paypal mode');
    }
    return authentication;
  },
});

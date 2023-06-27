'use strict';

module.exports = {
  async updateSetting(ctx) {
    const { isLiveMode, checkoutSuccessUrl, checkoutCancelUrl, currency, callbackUrl } =
      ctx.request.body.data;

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-paypal',
    });

    const response = await pluginStore.set({
      key: 'paypalSetting',
      value: {
        isLiveMode,
        checkoutSuccessUrl,
        checkoutCancelUrl,
        currency,
        callbackUrl,
      },
    });
    return ctx.send({ ok: true, response });
  },
  async getSetting(ctx) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-paypal',
    });
    const response = await pluginStore.get({ key: 'paypalSetting' });
    return ctx.send({ ok: true, response });
  },
};

'use strict';

module.exports = [
  {
    method: 'PUT',
    path: '/updateSettings',
    handler: 'configurationController.updateSetting',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/getSettings',
    handler: 'configurationController.getSetting',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/createProduct',
    handler: 'paypalController.createProduct',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/getProduct/:offset/:limit/:sort/:order',
    handler: 'paypalController.findProducts',
    config: {
      auth: false,
    },
  },

  {
    method: 'GET',
    path: '/getProduct/:id',
    handler: 'paypalController.findProductById',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/getPaypalCheckout/:id',
    handler: 'paypalController.getPaypalCheckout',
    config: {
      auth: false,
    },
  },
];

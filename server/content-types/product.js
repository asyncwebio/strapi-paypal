'use strict';

module.exports = {
  info: {
    tableName: 'PaypalProduct',
    singularName: 'paypal-product', // kebab-case mandatory
    pluralName: 'paypal-products', // kebab-case mandatory
    displayName: 'Product',
    description: 'Paypal Products',
    kind: 'collectionType',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    title: {
      type: 'string',
      min: 1,
      required: true,
      configurable: false,
    },
    slug: {
      type: 'uid',
      targetField: 'title',
      unique: true,
      required: true,
      configurable: false,
    },
    description: {
      type: 'string',
      min: 1,
      required: true,
      configurable: false,
    },
    price: {
      type: 'decimal',
      required: true,
      configurable: false,
    },
    currency: {
      type: 'string',
      min: 1,
      required: true,
      configurable: false,
    },
    // productImage: {
    //   type: "media",
    //   required: false,
    //   configurable: false,
    // },
    isSubscription: {
      type: 'boolean',
      default: false,
      configurable: false,
    },
    interval: {
      type: 'string',
      configurable: false,
    },
    trialPeriodDays: {
      type: 'integer',
      configurable: false,
    },
    paypalOrderId: {
      type: 'string',
      configurable: false,
    },
    paypalSubcriptionId: {
      type: 'string',
      configurable: false,
    },
    paypalLinks: {
      type: 'json',
      configurable: false,
    },
    paypalPayment: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'plugin::strapi-paypal.paypal-payment',
      mappedBy: 'paypalProduct',
      configurable: false,
    },
  },
};

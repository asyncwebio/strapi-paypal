"use strict";

const productSchema = require("./product");
const paymentSchema = require("./payment");

module.exports = {
  "paypal-product": { schema: productSchema }, //// should re-use the singularName of the content-type
  "paypal-payment": { schema: paymentSchema },
};

// @ts-nocheck
/* eslint-disable no-undef */
'use strict';

window.onload = () => {
  // for product Checkout
  const ppProduct = document.querySelectorAll('.PP_ProductCheckout');
  if (ppProduct) {
    ppProduct.forEach(product => {
      product.addEventListener('click', function handleClick(event) {
        PP_ProductCheckout(event.target.dataset.id, event.target.dataset.url);
      });
    });
  }
};

// product Checkout logic

function PP_ProductCheckout(productId, baseUrl) {
  localStorage.setItem('strapiPaypalUrl', baseUrl);
  const getProductApi = baseUrl + '/strapi-paypal/getPaypalCheckout/' + productId;
  // const checkoutSessionUrl = baseUrl + "/strapi-paypal/createCheckoutSession/";

  fetch(getProductApi, {
    method: 'get',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => response.json())
    .then(response => {
      if (response.id) {
        const filter = response.links.filter(links => links.rel === 'approve');
        window.location.replace(filter[0].href);
      }
    });
}

//  storing product payment order in strapi logic

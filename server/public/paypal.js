/* eslint-disable no-undef */
"use strict";

window.onload = () => {
  // for product Checkout
  const ppProduct = document.querySelectorAll(".PP_ProductCheckout");
  if (ppProduct) {
    ppProduct.forEach((product) => {
      product.addEventListener("click", function handleClick(event) {
        PP_ProductCheckout(event.target.dataset.id, event.target.dataset.url);
      });
    });
  }
  // for storing product payment order in paypal
  //   const params = new URLSearchParams(document.location.search);
  //   const checkoutSessionId = params.get('sessionId');
  //   if (checkoutSessionId) {
  //     SS_GetProductPaymentDetails(checkoutSessionId);
  //   }
};

// product Checkout logic

function PP_ProductCheckout(productId, baseUrl) {
  localStorage.setItem("strapiPaypalUrl", baseUrl);
  const getProductApi =
    baseUrl + "/strapi-paypal/getPaypalCheckout/" + productId;
  // const checkoutSessionUrl = baseUrl + "/strapi-paypal/createCheckoutSession/";

  fetch(getProductApi, {
    method: "get",
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.id) {
        const filter = response.links.filter(
          (links) => links.rel === "approve"
        );
        window.location.replace(filter[0].href);
      }
    });
}

//  storing product payment order in strapi logic

// function SS_GetProductPaymentDetails(checkoutSessionId) {
//   const baseUrl = localStorage.getItem("strapiStripeUrl");
//   const retrieveCheckoutSessionUrl =
//     baseUrl + "/strapi-stripe/retrieveCheckoutSession/" + checkoutSessionId;
//   fetch(retrieveCheckoutSessionUrl, {
//     method: "get",
//     mode: "cors",
//     headers: new Headers({
//       "Content-Type": "application/json",
//     }),
//   })
//     .then((response) => response.json())
//     .then((response) => {
//       if (response.payment_status === "paid") {
//         if (
//           window.performance
//             .getEntriesByType("navigation")
//             .map((nav) => nav.type)
//             .includes("reload")
//         ) {
//           console.info("website reloded");
//         } else {
//           // store payment in strapi
//           const stripePaymentUrl = baseUrl + "/strapi-stripe/stripePayment";
//           fetch(stripePaymentUrl, {
//             method: "post",
//             body: JSON.stringify({
//               txnDate: new Date(),
//               transactionId: response.id,
//               isTxnSuccessful: true,
//               txnMessage: response,
//               txnAmount: response.amount_total / 100,
//               customerName: response.customer_details.name,
//               customerEmail: response.customer_details.email,
//               stripeProduct: response.metadata.productId,
//             }),
//             mode: "cors",
//             headers: new Headers({
//               "Content-Type": "application/json",
//             }),
//           });
//         }
//       }
//     });
// }

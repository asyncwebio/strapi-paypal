import createInstance from './axiosInstance';

export async function savePaypalConfiguration(data, apiToken) {
  const axios = createInstance(apiToken);
  const response = await axios.put('/strapi-paypal/updateSettings', {
    data,
  });

  return response;
}

export async function getPaypalConfiguration(apiToken) {
  const axios = createInstance(apiToken);
  const response = await axios.get('/strapi-paypal/getSettings');

  return response;
}

export async function createPaypalProduct(
  title,
  price,
  description,
  isSubscription,
  paymentInterval,
  trialPeriodDays,
  productType,
  apiToken
) {
  const axios = createInstance(apiToken);
  const response = await axios.post('/strapi-paypal/createProduct', {
    title,
    price,
    description,
    isSubscription,
    paymentInterval,
    trialPeriodDays,
    productType,
  });

  return response;
}

export async function getPaypalProduct(offset, limit, sort, order, apiToken) {
  const axios = createInstance(apiToken);
  const response = await axios.get(`/strapi-paypal/getProduct/${offset}/${limit}/${sort}/${order}`);

  return response;
}

export async function getPaypalProductById(id, apiToken) {
  const axios = createInstance(apiToken);
  const response = await axios.get(`/strapi-paypal/getProduct/${id}`);

  return response;
}

export async function updatePaypalProduct(
  id,
  title,
  url,
  description,
  productImage,
  stripeProductId,
  apiToken
) {
  const axios = createInstance(apiToken);
  const response = await axios.put(`/strapi-paypal/updateProduct/${id}`, {
    title,
    url,
    description,
    productImage,
    stripeProductId,
  });

  return response;
}

export async function getProductPayments(productId, sort, order, offset, limit, apiToken) {
  const axios = createInstance(apiToken);
  const response = await axios.get(
    `/strapi-paypal/getPayments/${productId}/${sort}/${order}/${offset}/${limit}`
  );

  return response;
}

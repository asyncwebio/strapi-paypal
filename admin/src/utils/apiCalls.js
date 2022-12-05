import instance from "./axiosInstance";

const axios = instance;

export async function savePaypalConfiguration(data) {
  const response = await axios.put("/strapi-paypal/updateSettings", {
    data,
  });

  return response;
}

export async function getPaypalConfiguration() {
  const response = await axios.get("/strapi-paypal/getSettings");

  return response;
}

export async function createPaypalProduct(
  title,
  price,
  description,
  isSubscription,
  paymentInterval,
  trialPeriodDays,
  productType
) {
  const response = await axios.post("/strapi-paypal/createProduct", {
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

export async function getPaypalProduct(offset, limit, sort, order) {
  const response = await axios.get(
    `/strapi-paypal/getProduct/${offset}/${limit}/${sort}/${order}`
  );

  return response;
}

export async function getPaypalProductById(id) {
  const response = await axios.get(`/strapi-paypal/getProduct/${id}`);

  return response;
}

export async function updatePaypalProduct(
  id,
  title,
  url,
  description,
  productImage,
  stripeProductId
) {
  const response = await axios.put(`/strapi-paypal/updateProduct/${id}`, {
    title,
    url,
    description,
    productImage,
    stripeProductId,
  });

  return response;
}

export async function getProductPayments(
  productId,
  sort,
  order,
  offset,
  limit
) {
  const response = await axios.get(
    `/strapi-paypal/getPayments/${productId}/${sort}/${order}/${offset}/${limit}`
  );

  return response;
}

export async function uploadFiles(files) {
  const formDocument = new FormData();
  formDocument.append("files", files[0]);
  const response = await axios.post(`/upload`, formDocument);

  return response;
}

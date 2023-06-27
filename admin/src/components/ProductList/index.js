// @ts-nocheck
/**
 *
 * This component is the responsible for displaying all the created Products.
 *
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, Alert } from '@strapi/design-system';
import CreateProduct from '../CreateProduct';
import ProductTable from './productTable';
import {
  getPaypalProduct,
  createPaypalProduct,
  getPaypalConfiguration,
} from '../../utils/apiCalls';

const apiToken = process.env.STRAPI_ADMIN_API_TOKEN;

const limit = 5;
const ProductList = () => {
  const search = useLocation().search;
  const page = new URLSearchParams(search).get('page');
  const pageNumber = page ? parseInt(page, 10) : 1;

  const [isVisible, setIsVisible] = useState(false);
  const [productData, setProductData] = useState();
  const [isEditVisible] = useState(false);
  const [count, setCount] = useState();
  const [sortAscendingName, setSortAscendingName] = useState(true);
  const [sortAscendingPrice, setSortAscendingPrice] = useState(true);
  const [sortOrderName, setSortOrderName] = useState(true);
  const [sortOrderPrice, setSortOrderPrice] = useState(false);
  const [isPaypalSettings, setIsPaypalSettings] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [message] = useState('');

  const offset = pageNumber === 1 ? 0 : (pageNumber - 1) * limit;

  useEffect(() => {
    (async () => {
      let sort;
      let order;

      const setting = await getPaypalConfiguration(apiToken);

      if (setting.data.response) {
        setIsPaypalSettings(true);
      } else {
        setIsPaypalSettings(false);
      }

      if (sortOrderName) {
        sort = 'name';
        order = sortAscendingName ? 'asc' : 'desc';
      } else if (sortOrderPrice) {
        sort = 'price';
        order = sortAscendingPrice ? 'asc' : 'desc';
      }

      const response = await getPaypalProduct(offset, limit, sort, order, apiToken);

      setProductData(response.data.response);
      setCount(response.data.count);
    })();
  }, [isVisible, isEditVisible, offset, sortAscendingName, sortAscendingPrice]);

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  const handleSaveProduct = async data => {
    const {
      title,
      price,
      description,
      isSubscription,
      paymentInterval,
      trialPeriodDays,
      productType,
    } = data;

    const createProduct = await createPaypalProduct(
      title,
      price,
      description,
      isSubscription,
      paymentInterval,
      trialPeriodDays,
      productType,
      apiToken
    );

    if (createProduct?.data?.id) {
      setIsVisible(false);
    }
  };

  const handleSortAscendingName = () => {
    setSortAscendingName(true);
    setSortOrderName(true);
    setSortOrderPrice(false);
  };

  const handleSortDescendingName = () => {
    setSortAscendingName(false);
    setSortOrderName(true);
    setSortOrderPrice(false);
  };

  const handleSortAscendingPrice = () => {
    setSortAscendingPrice(true);
    setSortOrderName(false);
    setSortOrderPrice(true);
  };

  const handleSortDescendingPrice = () => {
    setSortAscendingPrice(false);
    setSortOrderName(false);
    setSortOrderPrice(true);
  };

  const handleCloseAlert = () => {
    setIsAlert(false);
  };

  const handleClickCreateProduct = () => setIsVisible(prev => !prev);

  return (
    <Box>
      <Box paddingTop={6} paddingLeft={7}>
        <Typography variant="alpha">Paypal</Typography>
        <Box>
          <Typography variant="omega">
            The payment plugin enables you to accept online payments using Credit Card on your
            Strapi website or app via Paypal.
          </Typography>
        </Box>
      </Box>
      <Box padding={3}>
        <Divider />
      </Box>
      <CreateProduct
        isVisible={isVisible}
        handleClose={handleCloseModal}
        handleClickSave={data => handleSaveProduct(data)}
      />

      {isAlert ? (
        <Box paddingLeft={6} paddingRight={6}>
          <Alert closeLabel="Close alert" title="Error" variant="danger" onClose={handleCloseAlert}>
            {message}
          </Alert>
        </Box>
      ) : (
        ''
      )}

      <Box>
        <ProductTable
          products={productData}
          handleSortAscendingName={handleSortAscendingName}
          handleSortDescendingName={handleSortDescendingName}
          totalCount={Math.ceil(count / limit)}
          page={pageNumber}
          sortAscendingName={sortAscendingName}
          handleSortAscendingPrice={handleSortAscendingPrice}
          handleSortDescendingPrice={handleSortDescendingPrice}
          sortAscendingPrice={sortAscendingPrice}
          handleClickCreateProduct={handleClickCreateProduct}
          isPaypalSettings={isPaypalSettings}
        />
      </Box>
    </Box>
  );
};

export default ProductList;

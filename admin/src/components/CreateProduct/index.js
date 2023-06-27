// @ts-nocheck
/**
 *
 * This component is the responsible for opening modal when the Add Product
 * button clicks.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Box,
  Button,
  Grid,
  GridItem,
  Flex,
  Typography,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  NumberInput,
  Textarea,
} from '@strapi/design-system';

const CreateProduct = ({ isVisible, handleClose, handleClickSave }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState();
  const [paymentType, setPaymentType] = useState('');
  const [isSubscription, setIsSubscription] = useState(false);
  const [description, setDescription] = useState('');
  const [paymentInterval, setPaymentInterval] = useState('');
  const [trialPeriodDays, setTrialPeriodDays] = useState();
  const [productType, setProductType] = useState('');
  const [heading, setHeading] = useState('Product');
  const [error, setError] = useState({
    title: '',
    price: '',
    description: '',
    paymentType: '',
    paymentInterval: '',
    productType: '',
  });

  const handleChange = event => {
    const { name, value } = event.target;

    if (name === 'title') {
      setTitle(value);
      setError({ ...error, title: '' });
    }
  };

  const handleChangePaymentType = value => {
    setPaymentType(value);
    setError({ ...error, paymentType: '' });

    if (value === 'subscription') {
      setIsSubscription(true);
      setHeading('Subscription');
    } else {
      setIsSubscription(false);
      setHeading('Product');
    }
  };

  const handleChangeProductType = value => {
    setProductType(value);
    setError({ ...error, productType: '' });
  };

  const handleChangePaymentInterval = value => {
    setPaymentInterval(value);
    setError({ ...error, paymentInterval: '' });
  };

  const handleChangeNumber = value => {
    setPrice(value);
    setError({ ...error, price: '' });
  };

  const handleChangeTrialPeriod = value => {
    setTrialPeriodDays(value);
  };

  const handleSaveProduct = async () => {
    if (!title && !price && !description && !paymentType) {
      setError({
        ...error,
        title: 'Title is required',
        price: 'Price is required',
        description: 'Description is required',
        paymentType: 'Payment Type is required',
        paymentInterval: '',
        productType: '',
      });
    } else if (!paymentType) {
      setError({
        ...error,
        title: '',
        price: '',
        description: '',
        paymentType: 'Payment Type is required',
        paymentInterval: '',
        productType: '',
      });
    } else if (!price) {
      setError({
        ...error,
        title: '',
        price: 'Price is required',
        description: '',
        paymentType: '',
        paymentInterval: '',
        productType: '',
      });
    } else if (!title) {
      setError({
        ...error,
        title: 'Title is required',
        price: '',
        description: '',
        paymentType: '',
        paymentInterval: '',
        productType: '',
      });
    } else if (!description) {
      setError({
        ...error,
        title: '',
        price: '',
        description: 'Description is required',
        paymentType: '',
        paymentInterval: '',
        productType: '',
      });
    } else if (isSubscription && !productType) {
      setError({
        ...error,
        title: '',
        price: '',
        description: '',
        paymentType: '',
        paymentInterval: '',
        productType: 'product Type is required',
      });
    } else if (isSubscription && !paymentInterval) {
      setError({
        ...error,
        title: '',
        price: '',
        description: '',
        paymentType: '',
        paymentInterval: 'Payment Interval is required',
        productType: '',
      });
    } else {
      handleClickSave({
        title,
        price,
        description,
        isSubscription,
        paymentInterval,
        trialPeriodDays,
        productType,
      });
      setTitle('');
      setPrice();
      setDescription('');
      setIsSubscription(false);
      setPaymentInterval('');
      setTrialPeriodDays('');
      setPaymentType('');
      setProductType('');
    }
  };

  return (
    <Box>
      {isVisible && (
        <ModalLayout onClose={handleClose} labelledBy="title">
          <ModalHeader>
            <Flex direction="column" justifyContent="start" alignItems="start">
              <Typography
                fontWeight="bold"
                textColor="neutral800"
                as="h2"
                id="title"
                variant="beta"
              >
                Create {heading}
              </Typography>

              <Box>
                <Typography variant="omega">
                  {heading === 'Product'
                    ? 'For a product, you would charge your customer only one-time.'
                    : 'For a subscription, you would charge your customer every month.'}
                </Typography>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Grid gap={5}>
              <GridItem col={6}>
                <SingleSelect
                  id="select1"
                  label="Payment Type"
                  required
                  clearLabel="Clear the payment type"
                  hint="Ex:One-Time or Subscription"
                  error={error.paymentType ? error.paymentType : ''}
                  onClear={() => setPaymentType('')}
                  onChange={value => handleChangePaymentType(value)}
                  value={paymentType}
                >
                  <SingleSelectOption value="oneTime">One-Time</SingleSelectOption>
                  <SingleSelectOption value="subscription">Subscription</SingleSelectOption>
                </SingleSelect>
              </GridItem>
              <GridItem col={6}>
                <NumberInput
                  label="Price"
                  name="price"
                  onValueChange={value => handleChangeNumber(value)}
                  value={price}
                  error={error.price ? error.price : ''}
                  required
                />
              </GridItem>
              <GridItem col={6}>
                <TextInput
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  error={error.title ? error.title : ''}
                  required
                />
              </GridItem>
              <GridItem col={6}>
                {isSubscription ? (
                  <SingleSelect
                    id="select2"
                    label="Product Type"
                    required={isSubscription}
                    disabled={!isSubscription}
                    clearLabel="Clear the product type"
                    hint="Ex:Product type:physical,digital,service"
                    error={error.productType ? error.productType : ''}
                    onClear={() => setProductType('')}
                    onChange={value => handleChangeProductType(value)}
                    value={productType}
                  >
                    <SingleSelectOption value="PHYSICAL">Physical goods</SingleSelectOption>
                    <SingleSelectOption value="DIGITAL"> Digital goods</SingleSelectOption>
                    <SingleSelectOption value="SERVICE">
                      Service(Example:technical support,online courses)
                    </SingleSelectOption>
                  </SingleSelect>
                ) : (
                  ''
                )}
              </GridItem>

              <GridItem col={12}>
                <Textarea
                  label="Description"
                  name="description"
                  onChange={e => {
                    setDescription(e.target.value);
                    setError({ ...error, description: '' });
                  }}
                  error={error.description ? error.description : ''}
                  required
                >
                  {description}
                </Textarea>
              </GridItem>
              <GridItem col={6}>
                {isSubscription ? (
                  <SingleSelect
                    id="select2"
                    label="Payment Interval"
                    required={isSubscription}
                    disabled={!isSubscription}
                    clearLabel="Clear the payment interval"
                    hint="Subscription billing frequency: weekly, monthly or yearly."
                    error={error.paymentInterval ? error.paymentInterval : ''}
                    onClear={() => setPaymentInterval('')}
                    onChange={value => handleChangePaymentInterval(value)}
                    value={paymentInterval}
                  >
                    <SingleSelectOption value="MONTH">Month</SingleSelectOption>
                    <SingleSelectOption value="YEAR">Year</SingleSelectOption>
                    <SingleSelectOption value="WEEK">Week</SingleSelectOption>
                  </SingleSelect>
                ) : (
                  ''
                )}
              </GridItem>
              <GridItem col={6}>
                {isSubscription ? (
                  <NumberInput
                    label="Trial Period Days"
                    name="trialPeriodDays"
                    disabled={!isSubscription}
                    hint="Free trial period for the subscription."
                    onValueChange={value => handleChangeTrialPeriod(value)}
                    value={trialPeriodDays}
                  />
                ) : (
                  ''
                )}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter
            startActions={
              <Button onClick={handleClose} variant="tertiary">
                Cancel
              </Button>
            }
            endActions={
              <Button variant="default" onClick={handleSaveProduct}>
                create
              </Button>
            }
          />
        </ModalLayout>
      )}
    </Box>
  );
};

CreateProduct.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleClickSave: PropTypes.func.isRequired,
};

export default CreateProduct;

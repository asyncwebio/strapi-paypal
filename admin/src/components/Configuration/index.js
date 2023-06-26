// @ts-nocheck
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * UI Elements of Stripe Configuration
 *
 */

import React, { useState, useEffect } from 'react';
import { SettingsPageTitle } from '@strapi/helper-plugin';
import Check from '@strapi/icons/Check';
import {
  Box,
  Button,
  Grid,
  GridItem,
  HeaderLayout,
  ContentLayout,
  Main,
  TextInput,
  Typography,
  Alert,
  Select,
  Switch,
  Flex,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';

import currencies from './constant';
import { savePaypalConfiguration, getPaypalConfiguration } from '../../utils/apiCalls';

const apiToken = process.env.STRAPI_ADMIN_API_TOKEN;

const Configuration = () => {
  const [paypalConfiguration, setPaypalConfiguration] = useState({
    isLiveMode: false,
    checkoutSuccessUrl: '',
    checkoutCancelUrl: '',
    currency: undefined,
    callbackUrl: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState({
    checkoutSuccessUrl: '',
    checkoutCancelUrl: '',
    currency: '',
  });

  useEffect(() => {
    (async () => {
      const response = await getPaypalConfiguration(apiToken);

      if (response.data?.response) {
        const { isLiveMode, checkoutSuccessUrl, checkoutCancelUrl, currency, callbackUrl } =
          response.data.response;
        setPaypalConfiguration({
          ...paypalConfiguration,
          isLiveMode,
          checkoutSuccessUrl,
          checkoutCancelUrl,
          currency,
          callbackUrl,
        });
      }
    })();
  }, []);

  const handleChangeCurrency = value => {
    setPaypalConfiguration({ ...paypalConfiguration, currency: value });
    setError({ ...error, currency: '' });
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setPaypalConfiguration({ ...paypalConfiguration, [name]: value });

    if (name === 'checkoutSuccessUrl') {
      setError({ ...error, checkoutSuccessUrl: '' });
    } else if (name === 'checkoutCancelUrl') {
      setError({ ...error, checkoutCancelUrl: '' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (
      !paypalConfiguration.checkoutSuccessUrl &&
      !paypalConfiguration.checkoutCancelUrl &&
      !paypalConfiguration.currency
    ) {
      setError({
        ...error,
        checkoutSuccessUrl: 'Checkout Success Page URL is required',
        checkoutCancelUrl: 'Checkout Cancel Page URL is required',
        currency: 'Currency is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.checkoutSuccessUrl) {
      setError({
        ...error,
        checkoutSuccessUrl: 'Checkout Success Page URL is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.checkoutCancelUrl) {
      setError({
        ...error,
        checkoutCancelUrl: 'Checkout Cancel Page URL is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.currency) {
      setError({
        ...error,
        currency: 'Currency is required',
      });
      setIsSubmitting(false);
    } else {
      const response = await savePaypalConfiguration(paypalConfiguration, apiToken);

      if (response.data.ok) {
        setShowAlert(true);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Main>
      <SettingsPageTitle name="Paypal" />
      <HeaderLayout
        title="Paypal Configuration"
        primaryAction={
          <Button
            type="submit"
            loading={isSubmitting}
            onClick={handleSubmit}
            startIcon={<Check />}
            size="L"
          >
            Save
          </Button>
        }
      />

      <ContentLayout>
        <Box paddingBottom={2}>
          {showAlert ? (
            <Alert
              closeLabel="Close alert"
              title="Stripe configuration"
              variant="success"
              onClose={() => {
                setShowAlert(false);
              }}
            >
              saved successfully.
            </Alert>
          ) : (
            ''
          )}
        </Box>

        <Box
          shadow="tableShadow"
          background="neutral0"
          paddingTop={6}
          paddingLeft={7}
          paddingRight={7}
          paddingBottom={6}
          hasRadius
        >
          <Box paddingBottom={2}>
            <Typography variant="delta">Global Setting</Typography>
          </Box>

          <Box paddingTop={2}>
            <Grid gap={4}>
              <GridItem col={12} s={12}>
                <Box paddingTop={3}>
                  <Flex alignItems="center">
                    <Box paddingRight={4}>
                      <Typography variant="delta">Live Mode</Typography>
                    </Box>

                    <Switch
                      label="Live Mode"
                      visibleLabels
                      offLabel="Paypal is in sandbox mode"
                      onLabel="Paypal is ready to accept payment"
                      selected={paypalConfiguration.isLiveMode}
                      onChange={() => {
                        setPaypalConfiguration({
                          ...paypalConfiguration,
                          isLiveMode: !paypalConfiguration.isLiveMode,
                        });
                      }}
                    />
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
          </Box>

          <Box paddingTop={2}>
            <Grid gap={4}>
              <GridItem col={6} s={12}>
                <Box paddingTop={2} paddingBottom={2}>
                  <TextInput
                    name="checkoutSuccessUrl"
                    label="Payment Success Page URL"
                    required
                    value={paypalConfiguration.checkoutSuccessUrl}
                    error={error.checkoutSuccessUrl ? error.checkoutSuccessUrl : ''}
                    onChange={handleChange}
                    hint="Redirects to the success page after the  payment successful"
                  />
                </Box>
              </GridItem>
              <GridItem col={6} s={12}>
                <Box paddingTop={2} paddingBottom={2}>
                  <TextInput
                    name="checkoutCancelUrl"
                    label="Payment Cancel Page URL"
                    required
                    value={paypalConfiguration.checkoutCancelUrl}
                    error={error.checkoutCancelUrl ? error.checkoutCancelUrl : ''}
                    onChange={handleChange}
                    hint="Redirects to the cancel page after the  payment failed"
                  />
                </Box>
              </GridItem>
              <GridItem col={6} s={12}>
                <Box paddingBottom={2}>
                  <SingleSelect
                    id="select1"
                    label="Choose Currency"
                    required
                    placeholder="Choose Currency"
                    clearLabel="Clear the Currency"
                    error={error.currency ? error.currency : ''}
                    onClear={() =>
                      setPaypalConfiguration({
                        ...paypalConfiguration,
                        currency: undefined,
                      })
                    }
                    onChange={value => handleChangeCurrency(value)}
                    value={paypalConfiguration.currency}
                  >
                    {currencies &&
                      currencies.map((currency, idx) => (
                        <SingleSelectOption value={currency.value} key={idx}>
                          {currency.label}
                        </SingleSelectOption>
                      ))}
                  </SingleSelect>
                </Box>
              </GridItem>
              <GridItem col={6} s={12}>
                <Box paddingBottom={2}>
                  <TextInput
                    name="callbackUrl"
                    label="Webhook URL"
                    value={paypalConfiguration.callbackUrl}
                    onChange={handleChange}
                    hint="The response from Paypal will be posted to this URL."
                  />
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Box>
        <br />

        <Box
          shadow="tableShadow"
          background="neutral0"
          paddingTop={6}
          paddingLeft={7}
          paddingRight={7}
          paddingBottom={6}
          hasRadius
        >
          <Box paddingTop={2}>
            <Grid gap={4}>
              <GridItem col={6} s={12}>
                <Typography variant="pi">Need help? Contact us at : support@asyncweb.io</Typography>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </ContentLayout>
    </Main>
  );
};

export default Configuration;

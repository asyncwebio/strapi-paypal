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
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { TextInput } from '@strapi/design-system/TextInput';
import { Typography } from '@strapi/design-system/Typography';
import { Alert } from '@strapi/design-system/Alert';
import { Select, Option } from '@strapi/design-system/Select';
import { Switch } from '@strapi/design-system/Switch';
import { Flex } from '@strapi/design-system/Flex';
import currencies from './constant';
import { savePaypalConfiguration, getPaypalConfiguration } from '../../utils/apiCalls';

const Configuration = () => {
  const [paypalConfiguration, setPaypalConfiguration] = useState({
    isLiveMode: false,
    livePaypalClientId: '',
    livePaypalSecret: '',
    testPaypalClientId: '',
    testPaypalSecret: '',
    checkoutSuccessUrl: '',
    checkoutCancelUrl: '',
    currency: undefined,
    callbackUrl: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState({
    livePaypalClientId: '',
    livePaypalSecret: '',
    testPaypalClientId: '',
    testPaypalSecret: '',
    checkoutSuccessUrl: '',
    checkoutCancelUrl: '',
    currency: '',
  });

  useEffect(() => {
    (async () => {
      const response = await getPaypalConfiguration();

      if (response.data?.response) {
        const {
          isLiveMode,
          livePaypalClientId,
          livePaypalSecret,
          testPaypalClientId,
          testPaypalSecret,
          checkoutSuccessUrl,
          checkoutCancelUrl,
          currency,
          callbackUrl,
        } = response.data.response;
        setPaypalConfiguration({
          ...paypalConfiguration,
          isLiveMode,
          livePaypalClientId,
          livePaypalSecret,
          testPaypalClientId,
          testPaypalSecret,
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

    if (name === 'livePaypalClientId') {
      setError({ ...error, livePaypalClientId: '' });
    } else if (name === 'livePaypalSecret') {
      setError({ ...error, livePaypalSecret: '' });
    } else if (name === 'testPaypalClientId') {
      setError({ ...error, testPaypalClientId: '' });
    } else if (name === 'testPaypalSecret') {
      setError({ ...error, testPaypalSecret: '' });
    } else if (name === 'checkoutSuccessUrl') {
      setError({ ...error, checkoutSuccessUrl: '' });
    } else if (name === 'checkoutCancelUrl') {
      setError({ ...error, checkoutCancelUrl: '' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (
      !paypalConfiguration.livePaypalClientId &&
      !paypalConfiguration.livePaypalSecret &&
      !paypalConfiguration.testPaypalClientId &&
      !paypalConfiguration.testPaypalSecret &&
      !paypalConfiguration.checkoutSuccessUrl &&
      !paypalConfiguration.checkoutCancelUrl &&
      !paypalConfiguration.currency
    ) {
      setError({
        ...error,
        livePaypalClientId: 'Live Stripe Publishable Key is required',
        livePaypalSecret: 'Live Stripe Secret Key is required',
        testPaypalClientId: 'Test Stripe Publishable Key is required',
        testPaypalSecret: 'Test Stripe Secret Key is required',
        checkoutSuccessUrl: 'Checkout Success Page URL is required',
        checkoutCancelUrl: 'Checkout Cancel Page URL is required',
        currency: 'Currency is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.livePaypalClientId) {
      setError({
        ...error,
        livePaypalClientId: 'Live Stripe Publishable Key is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.livePaypalSecret) {
      setError({
        ...error,
        livePaypalSecret: 'Live Stripe Secret Key is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.testPaypalClientId) {
      setError({
        ...error,
        testPaypalClientId: 'Test Stripe Publishable Key is required',
      });
      setIsSubmitting(false);
    } else if (!paypalConfiguration.testPaypalSecret) {
      setError({
        ...error,
        testPaypalSecret: 'Test Stripe Secret Key is required',
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
      const response = await savePaypalConfiguration(paypalConfiguration);

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
          <Box>
            <Typography variant="delta">Credentials</Typography>
          </Box>
          <Box paddingBottom={2} paddingTop={1}>
            <Typography variant="omega">Configure your Paypal Client id and secret.</Typography>
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

              <GridItem col={6} s={12}>
                <Box paddingTop={2} paddingBottom={3}>
                  <TextInput
                    name="livePaypalClientId"
                    label="Live Paypal Client Id"
                    placeholder="Live Paypal Client Id"
                    required
                    value={paypalConfiguration.livePaypalClientId}
                    error={error.livePaypalClientId ? error.livePaypalClientId : ''}
                    onChange={handleChange}
                  />
                </Box>
              </GridItem>
              <GridItem col={6} s={12}>
                <Box paddingTop={2} paddingBottom={3}>
                  <TextInput
                    name="livePaypalSecret"
                    placeholder="Live Paypal Secret"
                    label="Live Paypal Secret"
                    required
                    value={paypalConfiguration.livePaypalSecret}
                    error={error.livePaypalSecret ? error.livePaypalSecret : ''}
                    onChange={handleChange}
                  />
                </Box>
              </GridItem>
              <GridItem col={6} s={12}>
                <Box paddingBottom={2}>
                  <TextInput
                    name="testPaypalClientId"
                    placeholder="SandBox Paypal Client Id"
                    label="SandBox Paypal Client Id"
                    required
                    value={paypalConfiguration.testPaypalClientId}
                    error={error.testPaypalClientId ? error.testPaypalClientId : ''}
                    onChange={handleChange}
                  />
                </Box>
              </GridItem>
              <GridItem col={6} s={12}>
                <Box paddingBottom={2}>
                  <TextInput
                    name="testPaypalSecret"
                    placeholder="SandBox Paypal Secret"
                    label="SandBox Paypal Secret"
                    required
                    value={paypalConfiguration.testPaypalSecret}
                    error={error.testPaypalSecret ? error.testPaypalSecret : ''}
                    onChange={handleChange}
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
          <Box paddingBottom={2}>
            <Typography variant="delta">Global Setting</Typography>
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
                  <Select
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
                        <Option value={currency.value} key={idx}>
                          {currency.label}
                        </Option>
                      ))}
                  </Select>
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

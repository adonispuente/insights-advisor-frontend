import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Page } from '@patternfly/react-core';
import FlagProvider from '@unleash/proxy-client-react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { initStore } from '../Store';
import messages from '../../locales/translations.json';
import { staticUnleashFlagProviderConfig } from '../config/staticUnleashFlagProviderConfig';
import IopBridge from './IopBridge';
import IopAdvisorApp from './IopAdvisorApp';

const store = initStore();
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const IopAppEntry = () => (
  <Page className="iop-advisor-page" sidebar={null}>
    <HashRouter>
      <IopBridge>
        <FlagProvider
          config={staticUnleashFlagProviderConfig}
          startClient={false}
        >
          <IntlProvider locale="en" messages={messages}>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <NotificationsProvider>
                  <IopAdvisorApp />
                </NotificationsProvider>
              </QueryClientProvider>
            </Provider>
          </IntlProvider>
        </FlagProvider>
      </IopBridge>
    </HashRouter>
  </Page>
);
export default IopAppEntry;

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScalprumProvider } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { IOP_CHROME_INIT, IOP_ADVISOR_READY } from './constants';
import { createIopProviderOptions } from './createIopProviderOptions';
import { IopChromeContext } from './IopChromeContext';
import { useIopIframeHeightReporter } from './useIopIframeHeightReporter';

const normalizeAppRoute = (appRoute = '') =>
  `/${String(appRoute).replace(/^\/+/, '')}`;

// Listens for Foreman postMessage, wires Scalprum chrome/RBAC, navigates to the requested route.
const IopBridge = ({ children }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const location = useLocation();
  const locationRef = useRef(`${location.pathname}${location.search}`);
  const lastParentAppRouteRef = useRef(null);
  const pendingParentRouteRef = useRef(null);
  const [providerOptions, setProviderOptions] = useState(null);
  const [permissionsEpoch, setPermissionsEpoch] = useState(0);
  const [chromeReady, setChromeReady] = useState(false);
  const [embedded, setEmbedded] = useState(null);
  const lastPermissionsKeyRef = useRef('');

  locationRef.current = `${location.pathname}${location.search}`;
  navigateRef.current = navigate;

  useIopIframeHeightReporter(embedded);

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent
      ) {
        return;
      }

      if (event.data?.type !== IOP_CHROME_INIT) {
        return;
      }

      const {
        appRoute,
        embedded: nextEmbedded,
        ...payload
      } = event.data.payload || {};
      const permissionsKey = JSON.stringify(payload.permissions || []);

      if (permissionsKey !== lastPermissionsKeyRef.current) {
        lastPermissionsKeyRef.current = permissionsKey;
        setPermissionsEpoch((current) => current + 1);
        setProviderOptions(createIopProviderOptions(payload));
      } else {
        createIopProviderOptions(payload);
      }

      if (nextEmbedded !== undefined) {
        setEmbedded(nextEmbedded || null);
      }

      if (!appRoute || appRoute === lastParentAppRouteRef.current) {
        if (!pendingParentRouteRef.current) setChromeReady(true);
        return;
      }

      lastParentAppRouteRef.current = appRoute;

      const target = normalizeAppRoute(appRoute);
      if (locationRef.current !== target) {
        pendingParentRouteRef.current = target;
        setChromeReady(false);
        navigateRef.current(target, { replace: true });
      } else {
        pendingParentRouteRef.current = null;
        setChromeReady(true);
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage(
        { type: IOP_ADVISOR_READY },
        window.location.origin,
      );
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (
      pendingParentRouteRef.current === `${location.pathname}${location.search}`
    ) {
      pendingParentRouteRef.current = null;
      setChromeReady(true);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setProviderOptions(
        (current) => current || createIopProviderOptions({ permissions: [] }),
      );
    }, 2000);

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  if (!providerOptions) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
    <IopChromeContext.Provider
      value={{ permissionsEpoch, chromeReady, embedded }}
    >
      <ScalprumProvider {...providerOptions}>{children}</ScalprumProvider>
    </IopChromeContext.Provider>
  );
};

IopBridge.propTypes = {
  children: PropTypes.node,
};

export default IopBridge;

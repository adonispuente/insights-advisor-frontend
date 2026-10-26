import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { AppWithIopContext } from '../App';
import { useIopChromeContext } from './IopChromeContext';
import useIopNavigationSync from './useIopNavigationSync';

const IopAdvisorApp = () => {
  const { permissionsEpoch, chromeReady } = useIopChromeContext();
  useIopNavigationSync();
  if (!chromeReady)
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  return <AppWithIopContext key={permissionsEpoch} />;
};
export default IopAdvisorApp;

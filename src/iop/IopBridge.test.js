import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, useLocation } from 'react-router-dom';
import IopBridge from './IopBridge';
import { useIopChromeContext } from './IopChromeContext';

jest.mock('@scalprum/react-core', () => ({
  ScalprumProvider: ({ children }) => children,
}));

const Location = () => {
  const { pathname, search } = useLocation();
  const { permissionsEpoch } = useIopChromeContext();
  return <div>{`${pathname}${search} permissions=${permissionsEpoch}`}</div>;
};

const sendChrome = (payload, overrides = {}) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        source: window.parent,
        data: { type: 'IOP_CHROME_INIT', payload },
        ...overrides,
      }),
    );
  });

describe('Foreman iframe initialization', () => {
  it('ignores messages from another origin or source', () => {
    render(
      <MemoryRouter>
        <IopBridge>
          <Location />
        </IopBridge>
      </MemoryRouter>,
    );
    sendChrome({ appRoute: 'systems' }, { origin: 'https://other.example' });
    sendChrome({ appRoute: 'systems' }, { source: null });
    expect(screen.queryByText(/permissions=/)).not.toBeInTheDocument();
  });

  it('restores deep links with query parameters and refreshes permission state', async () => {
    render(
      <MemoryRouter>
        <IopBridge>
          <Location />
        </IopBridge>
      </MemoryRouter>,
    );
    const permissions = [{ permission: 'advisor:advisor_results:read' }];
    sendChrome({ permissions, appRoute: 'cves/CVE-2026-1234?limit=20' });
    expect(
      await screen.findByText('/cves/CVE-2026-1234?limit=20 permissions=1'),
    ).toBeInTheDocument();
    sendChrome({ permissions: [], appRoute: 'systems/host-uuid' });
    expect(
      await screen.findByText('/systems/host-uuid permissions=2'),
    ).toBeInTheDocument();
  });
});

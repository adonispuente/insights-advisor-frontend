import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import HybridInventory from '../SmartComponents/HybridInventoryTabs/HybridInventoryTabs';

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => {
  const React = require('react');
  const { useNavigate } = require('react-router-dom');
  return {
    __esModule: true,
    // Match Inventory's default and automatic Edge-tab navigation when empty.
    default: function InventoryTabs({
      accountHasEdgeImages = true,
      hasConventionalSystems,
      tabPathname,
      ConventionalSystemsTab,
    }) {
      const navigate = useNavigate();
      React.useEffect(() => {
        if (accountHasEdgeImages && !hasConventionalSystems) {
          navigate(`${tabPathname}/manage-edge-inventory`, { replace: true });
        }
      }, [accountHasEdgeImages, hasConventionalSystems, navigate, tabPathname]);
      return ConventionalSystemsTab;
    },
  };
});

jest.mock(
  '../SmartComponents/HybridInventoryTabs/ConventionalSystems/RecommendationSystems',
  () => ({
    __esModule: true,
    default: () => <div>No affected systems</div>,
  }),
);

jest.mock(
  '../SmartComponents/HybridInventoryTabs/ConventionalSystems/PathwaySystems',
  () => ({
    __esModule: true,
    default: () => <div>No affected systems</div>,
  }),
);

describe('IoP detail pages with no conventional systems', () => {
  const originalIop = process.env.IOP;
  beforeEach(() => {
    process.env.IOP = 'true';
  });
  afterEach(() => {
    if (originalIop === undefined) delete process.env.IOP;
    else process.env.IOP = originalIop;
  });

  it.each([
    ['/recommendations/test-rule', true],
    ['/recommendations/pathways/test-pathway', false],
  ])(
    'keeps %s open instead of redirecting to the list',
    async (path, isRecommendationDetail) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route
              path={path}
              element={
                <>
                  <h1>Detail page</h1>
                  <HybridInventory
                    conventionalSystemsCount={0}
                    areCountsLoading={false}
                    isRecommendationDetail={isRecommendationDetail}
                    tabPathname={`/insights/advisor${path}`}
                  />
                </>
              }
            />
            <Route
              path="/recommendations"
              element={<h1>Recommendations list</h1>}
            />
            <Route
              path="*"
              element={<Navigate replace to="/recommendations" />}
            />
          </Routes>
        </MemoryRouter>,
      );
      expect(
        await screen.findByText('No affected systems'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Detail page' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Recommendations list' }),
      ).not.toBeInTheDocument();
    },
  );
});

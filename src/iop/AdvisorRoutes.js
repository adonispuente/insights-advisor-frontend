import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ZeroStateWrapper } from '../ZeroStateWrapper';

const Recommendations = lazy(() => import('../SmartComponents/Recs/List'));
const Recommendation = lazy(() => import('../SmartComponents/Recs/Details'));
const Pathway = lazy(() => import('../SmartComponents/Recs/DetailsPathways'));
const Systems = lazy(() => import('../SmartComponents/Systems/List'));
const System = lazy(
  () => import('../PresentationalComponents/Inventory/InventoryDetails'),
);

const IopAdvisorRoutes = () => (
  <ZeroStateWrapper>
    <Routes>
      <Route path="recommendations" element={<Recommendations />} />
      <Route path="recommendations/pathways" element={<Recommendations />} />
      <Route path="recommendations/pathways/:id" element={<Pathway />} />
      <Route
        path="recommendations/pathways/systems/:id"
        element={<Pathway />}
      />
      <Route path="recommendations/:id" element={<Recommendation />} />
      <Route path="recommendations/:id/:inventoryId" element={<System />} />
      <Route
        path="recommendations/pathways/:id/:inventoryId"
        element={<System />}
      />
      <Route
        path="recommendations/pathways/systems/:id/:inventoryId"
        element={<System />}
      />
      <Route path="systems" element={<Systems />} />
      <Route path="systems/:inventoryId" element={<System />} />
      <Route path="*" element={<Navigate replace to="/recommendations" />} />
    </Routes>
  </ZeroStateWrapper>
);
export default IopAdvisorRoutes;

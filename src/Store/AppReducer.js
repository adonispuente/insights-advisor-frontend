import Advisor from '../SmartComponents/SystemAdvisor';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

export function systemReducer() {
  return applyReducerHash({
    ['SELECT_ENTITIES']: (state, { payload: { selected } }) => ({
      ...state,
      rows: selectRows(state.rows, selected),
    }),
  });
}
const selectRows = (rows, selected = []) =>
  (rows || []).map((row) => ({
    ...row,
    selected: selected.includes(row.id),
  }));

function enableApplications(state) {
  return {
    ...state,
    loaded: true,
    activeApps: [{ title: 'Insights', name: 'insights', component: Advisor }],
  };
}

export function entitiesDetailsReducer(ActionTypes) {
  return applyReducerHash(
    {
      [`${ActionTypes.LOAD_ENTITY}_FULFILLED`]: enableApplications,
    },
    {}
  );
}

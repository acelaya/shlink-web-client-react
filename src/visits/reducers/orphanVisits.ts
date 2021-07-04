import { Action, Dispatch } from 'redux';
import {
  OrphanVisit,
  OrphanVisitType,
  Visit,
  VisitsActionCommon,
  VisitsInfo,
  VisitsLoadFailedAction,
  VisitsLoadProgressChangedAction,
} from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { isOrphanVisit } from '../types/helpers';
import { getVisitsWithLoader } from './common';
import { CREATE_VISITS, CreateVisitsAction } from './visitCreation';

/* eslint-disable padding-line-between-statements */
export const GET_ORPHAN_VISITS_START = 'shlink/orphanVisits/GET_ORPHAN_VISITS_START';
export const GET_ORPHAN_VISITS_ERROR = 'shlink/orphanVisits/GET_ORPHAN_VISITS_ERROR';
export const GET_ORPHAN_VISITS = 'shlink/orphanVisits/GET_ORPHAN_VISITS';
export const GET_ORPHAN_VISITS_LARGE = 'shlink/orphanVisits/GET_ORPHAN_VISITS_LARGE';
export const GET_ORPHAN_VISITS_CANCEL = 'shlink/orphanVisits/GET_ORPHAN_VISITS_CANCEL';
export const GET_ORPHAN_VISITS_PROGRESS_CHANGED = 'shlink/orphanVisits/GET_ORPHAN_VISITS_PROGRESS_CHANGED';
/* eslint-enable padding-line-between-statements */

export interface OrphanVisitsAction extends Action<string>, VisitsActionCommon {}

type OrphanVisitsCombinedAction = OrphanVisitsAction
& VisitsLoadProgressChangedAction
& CreateVisitsAction
& VisitsLoadFailedAction;

const initialState: VisitsInfo = {
  visits: undefined, // Used undefined initial state to track when the visits were loaded for the first time
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export default buildReducer<VisitsInfo, OrphanVisitsCombinedAction>({
  [GET_ORPHAN_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_ORPHAN_VISITS_ERROR]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [GET_ORPHAN_VISITS]: (_, { visits, mostRecentVisit }) => ({ ...initialState, visits, mostRecentVisit }),
  [GET_ORPHAN_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_ORPHAN_VISITS_CANCEL]: (state) => ({ ...state, visits: undefined, cancelLoad: true }),
  [GET_ORPHAN_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [CREATE_VISITS]: (state, { createdVisits }) => {
    const { visits = [] } = state;
    const newVisits = createdVisits.map(({ visit }) => visit);

    return { ...state, visits: [ ...newVisits, ...visits ] };
  },
}, initialState);

const matchesType = (visit: OrphanVisit, orphanVisitsType?: OrphanVisitType) =>
  !orphanVisitsType || orphanVisitsType === visit.type;
const filterVisitsByType = (visits: Visit[], orphanVisitsType?: OrphanVisitType): Visit[] =>
  visits.filter((visit) => isOrphanVisit(visit) && matchesType(visit, orphanVisitsType));

export const getOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  query: ShlinkVisitsParams = {},
  orphanVisitsType?: OrphanVisitType,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getOrphanVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getOrphanVisits({ ...query, page, itemsPerPage })
    .then((result) => {
      const visits = filterVisitsByType(result.data, orphanVisitsType);

      return { ...result, data: visits };
    });
  const mostRecentVisitLoader = async () => getOrphanVisits({ itemsPerPage: 1 })
    .then(({ data }) => filterVisitsByType(data, orphanVisitsType)[0]);
  const shouldCancel = () => getState().orphanVisits.cancelLoad;
  const actionMap = {
    start: GET_ORPHAN_VISITS_START,
    large: GET_ORPHAN_VISITS_LARGE,
    finish: GET_ORPHAN_VISITS,
    error: GET_ORPHAN_VISITS_ERROR,
    progress: GET_ORPHAN_VISITS_PROGRESS_CHANGED,
  };

  return getVisitsWithLoader(visitsLoader, mostRecentVisitLoader, {}, actionMap, dispatch, shouldCancel);
};

export const cancelGetOrphanVisits = buildActionCreator(GET_ORPHAN_VISITS_CANCEL);

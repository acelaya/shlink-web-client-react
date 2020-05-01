import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

export const SET_REAL_TIME_UPDATES = 'shlink/realTimeUpdates/SET_REAL_TIME_UPDATES';

export const SET_SERVERS_SYNC_API_KEYS = 'shlink/realTimeUpdates/SET_SERVERS_SYNC_API_KEYS';

export const SettingsType = PropTypes.shape({
  realTimeUpdates: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
  }),
  serversSync: PropTypes.shape({
    dropboxApiKey: PropTypes.string,
    googleDriveApiKey: PropTypes.string,
  }),
});

const initialState = {
  realTimeUpdates: {
    enabled: true,
  },
  serversSync: {
    dropboxApiKey: undefined,
    googleDriveApiKey: undefined,
  },
};

export default handleActions({
  [SET_REAL_TIME_UPDATES]: (state, { realTimeUpdates }) => ({ ...state, realTimeUpdates }),
  [SET_SERVERS_SYNC_API_KEYS]: (state, { apiKeys }) => ({ ...state, serversSync: apiKeys }),
}, initialState);

export const setRealTimeUpdates = (enabled) => ({
  type: SET_REAL_TIME_UPDATES,
  realTimeUpdates: { enabled },
});

export const setServerSyncApiKeys = (apiKeys) => ({
  type: SET_SERVERS_SYNC_API_KEYS,
  apiKeys,
});

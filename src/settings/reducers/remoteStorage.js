import { handleActions } from 'redux-actions';
import RemoteStorage from 'remotestoragejs';
import { prop } from 'ramda';
import { hasValue } from '../../utils/utils';
import { SET_SERVERS_SYNC_API_KEYS } from './settings';

const SERVERS_FILE_NAME = 'servers.json';

const shlinkServersRsModule = {
  name: 'shlinkWebClient',
  builder: (client) => ({
    exports: {
      saveServers: (servers) => client.storeFile('application/json', SERVERS_FILE_NAME, JSON.stringify(servers)),
      loadServers: () => client.getFile(SERVERS_FILE_NAME),
    },
  }),
};

const createRemoteStorage = () => {
  const remoteStorage = new RemoteStorage({ modules: [ shlinkServersRsModule ], cache: false });

  remoteStorage.on(
    'connected',
    () => remoteStorage.shlinkWebClient.loadServers()
      .then(prop('data'))
      .then(JSON.parse)
      .then(console.log)
      .catch(console.error)
  );

  return remoteStorage;
};

const initialState = createRemoteStorage();

const withApiKeys = ({ dropboxApiKey, googleDriveApiKey }, remoteStorage) => {
  remoteStorage.setApiKeys({
    dropbox: hasValue(dropboxApiKey) ? dropboxApiKey : undefined,
    googledrive: hasValue(googleDriveApiKey) ? googleDriveApiKey : undefined,
  });

  return remoteStorage;
};

export default handleActions({
  [SET_SERVERS_SYNC_API_KEYS]: (state, { apiKeys }) => withApiKeys(apiKeys, state),
}, initialState);

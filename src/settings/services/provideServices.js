import RealTimeUpdates from '../RealTimeUpdates';
import ServersSync from '../ServersSync';
import Settings from '../Settings';
import { setRealTimeUpdates, setServerSyncApiKeys } from '../reducers/settings';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates', 'ServersSync');

  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator('RealTimeUpdates', connect([ 'settings' ], [ 'setRealTimeUpdates' ]));

  bottle.serviceFactory('ServersSync', () => ServersSync);
  bottle.decorator('ServersSync', connect([ 'remoteStorage', 'settings' ], [ 'setServerSyncApiKeys' ]));

  // Actions
  bottle.serviceFactory('setRealTimeUpdates', () => setRealTimeUpdates);
  bottle.serviceFactory('setServerSyncApiKeys', () => setServerSyncApiKeys);
};

export default provideServices;

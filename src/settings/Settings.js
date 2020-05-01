import React from 'react';
import NoMenuLayout from '../common/NoMenuLayout';

const Settings = (RealTimeUpdates, ServersSync) => () => (
  <NoMenuLayout>
    <div className="row">
      <div className="col-md-6 mb-4">
        <RealTimeUpdates />
      </div>
      <div className="col-md-6 mb-4">
        <ServersSync />
      </div>
    </div>
  </NoMenuLayout>
);

export default Settings;

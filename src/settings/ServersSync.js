import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import PropTypes from 'prop-types';
import Widget from 'remotestorage-widget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDropbox, faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { SettingsType } from './reducers/settings';
import './ServersSync.scss';

const propTypes = {
  remoteStorage: PropTypes.object,
  settings: SettingsType,
  setServerSyncApiKeys: PropTypes.func,
};

const ServersSync = ({ remoteStorage, settings: { serversSync }, setServerSyncApiKeys }) => {
  const { dropboxApiKey, googleDriveApiKey } = serversSync || {};

  useEffect(() => {
    const widget = new Widget(remoteStorage);
    const container = document.createElement('div');

    container.id = 'remoteStorageWidget';

    document.querySelector('.remote-storage-container').appendChild(container);
    widget.attach('remoteStorageWidget');

    return () => {
      container.remove();
      document.querySelector('.remotestorage-widget-modal-backdrop').remove();
    };
  }, [ remoteStorage, serversSync ]);

  return (
    <Card>
      <CardHeader>Servers sync</CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-6">
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText><FontAwesomeIcon icon={faDropbox} /></InputGroupText>
                </InputGroupAddon>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dropbox API key"
                  value={dropboxApiKey}
                  onChange={(e) => setServerSyncApiKeys({ dropboxApiKey: e.target.value, googleDriveApiKey })}
                />
              </InputGroup>
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText><FontAwesomeIcon icon={faGoogleDrive} /></InputGroupText>
                </InputGroupAddon>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Google Drive API key"
                  value={googleDriveApiKey}
                  onChange={(e) => setServerSyncApiKeys({ dropboxApiKey, googleDriveApiKey: e.target.value })}
                />
              </InputGroup>
            </FormGroup>
          </div>
        </div>
        <div className="remote-storage-container" />
      </CardBody>
    </Card>
  );
};

ServersSync.propTypes = propTypes;

export default ServersSync;

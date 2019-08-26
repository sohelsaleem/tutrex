import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';

require.context('./assets', true, /.*/);

import socketServer from 'sources/SocketServer';
socketServer.openConnection();

import SocketHelper from 'helpers/SocketHelper';

import WebRTCService from 'helpers/videoChat/WebRTCService';

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
    ReactDOM.render(
        <AppContainer store={store}/>,
        MOUNT_NODE
    )
};

// Add store listeners & dispatchers
socketServer.addStore(store);
new SocketHelper().addStore(store);
WebRTCService.addStore(store);


// This code is excluded from production bundle
if (__DEV__) {
    if (module.hot) {
        // Development render functions
        const renderApp = render;
        const renderError = (error) => {
            const RedBox = require('redbox-react').default ;

            ReactDOM.render(<RedBox error={error}/>, MOUNT_NODE)
        };

        // Wrap render in try/catch
        render = () => {
            try {
                renderApp()
            } catch (error) {
                console.error(error);
                renderError(error);
            }
        };

        // Setup hot module replacement
        module.hot.accept();
    }
}

// ========================================================
// Go!
// ========================================================
render();

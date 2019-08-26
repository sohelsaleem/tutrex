import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import reducer from 'reducers/reducer'

import {getSocket} from '../sources/SocketServer';
import socketSendMiddleware from 'middleware/socketSendMiddleware';
import socketUploadMiddleware from 'middleware/socketUploadMiddleware';
import socketRequestMiddleware from 'middleware/socketRequestMiddleware';
import videoChatMiddleware from 'middleware/videoChatMiddleware';

export default (initialState = {}) => {
    // ======================================================
    // Middleware Configuration
    // ======================================================
    const middleware = [
        thunk,
        socketSendMiddleware(getSocket()),
        socketUploadMiddleware(getSocket()),
        socketRequestMiddleware(getSocket()),
        videoChatMiddleware()
    ];

    // ======================================================
    // Store Enhancers
    // ======================================================
    const enhancers = [];

    let composeEnhancers = compose;

    if (__DEV__) {
        const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (typeof composeWithDevToolsExtension === 'function') {
            composeEnhancers = composeWithDevToolsExtension
        }
    }

    // ======================================================
    // Store Instantiation and HMR Setup
    // ======================================================
    return createStore(
        reducer,
        initialState,
        composeEnhancers(
            applyMiddleware(...middleware),
            ...enhancers
        )
    );
}

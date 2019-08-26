import {
    SOCKET_CONNECTED,
    SOCKET_DISCONNECTED
} from 'actions/socketConnection';

const initialState = {
    connected: false,
    internetFail: false
};

export default function socketServerReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SOCKET_CONNECTED:
            return {
                ...state,
                connected: true,
                internetFail: false
            };

        case SOCKET_DISCONNECTED:
            return {
                ...state,
                connected: false,
                internetFail: true
            };

        default:
            return state;
    }
}

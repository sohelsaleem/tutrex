import {getSocket} from '../sources/SocketServer';

import {SOCKET_ATTENDEE_KICKED} from 'actions/attendeeList';

export default class SocketHelper {

    constructor() {
        this.store = null;

        getSocket()
            .then(socket => {
                socket.on('message', ::this.handleSocketMessage);
            });
    }

    handleSocketMessage(message) {
        if (message.requestId)
            return;

        const {event, body} = message;

        this.dispatchToStore({
            type: event,
            ...body
        });

        if (event == SOCKET_ATTENDEE_KICKED) {
            getSocket()
                .then(socket => {
                    socket.close();
                });
        }
    }

    addStore(store) {
        this.store = store;
    }

    dispatchToStore(action) {
        this.store.dispatch(action);
    }
}

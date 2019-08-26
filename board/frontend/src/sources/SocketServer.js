import io from 'socket.io-client';
import config from '../config';
import {SOCKET_CONNECTED, SOCKET_DISCONNECTED} from 'actions/socketConnection';
import {SOCKET_CLOSED} from 'actions/socketConnection';

class SocketServer  {

    addStore(store) {
        this.store = store;
    }

    openConnection() {
        this.socket = new Promise(resolve => {
            console.log('Connecting to', config.socketURL);

            const socket = io(config.socketURL);

            socket.on('connect', () => {
                console.log('Connected to', config.socketURL);
                this.dispatchToStore({type: SOCKET_CONNECTED});
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from server');

                const SOCKET_EVENT = this.isKicked() ? SOCKET_CLOSED : SOCKET_DISCONNECTED;

                this.dispatchToStore({type: SOCKET_EVENT});
            });

            resolve(socket);
        });

        return this;
    }

    isKicked(){
        const state = this.store.getState();
        return _.get(state, 'room.kicked', false);
    }

    dispatchToStore(action) {
        this.store.dispatch(action);
    }
}

const socketServer = new SocketServer();

export default socketServer;

export function getSocket() {
    return socketServer.socket;
}

const uuid = require('node-uuid');

const REQUEST_TIMEOUT = 30 * 60 * 1000; // 30 min

export default function socketRequestMiddleware(socketPromise) {
    return ({dispatch, getState}) => next => action => {
        if (typeof action === 'function')
            return action(dispatch, getState);

        const {socketRequest, types, ...rest} = action;
        if (!socketRequest)
            return next(action);

        const [REQUEST, SUCCESS, FAILURE] = types;

        next({
            ...rest,
            type: REQUEST
        });

        const channel = new SocketChannel(socketPromise, socketRequest);
        channel.request()
            .then(
                result => {
                    next({
                        type: SUCCESS,
                        result
                    });
                },
                error => {
                    if (error.code === 500)
                        console.error('Internal server error', error);

                    next({
                        type: FAILURE,
                        error
                    });
                })
            .catch(error => console.error(error));
    };
}

class SocketChannel {
    constructor(socketPromise, message) {
        this.socketPromise = socketPromise;
        this.message = message;

        this.requestId = uuid.v4();

        this.requestPromise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    request() {
        this.sendRequest();
        this.waitResponse();

        return this.requestPromise;
    }

    sendRequest() {
        const {event, body} = this.message;
        const {requestId} = this;

        this.socketPromise.then(socket => socket.send({requestId, event, body}));
    }

    waitResponse() {
        this.setResponseExpiration();
        this.socketPromise.then(socket => socket.on('message', this.handleMessage));
    }

    setResponseExpiration() {
        this.expirationTimer = setTimeout(() => {
            this.destroyListeners();
            this.reject(new Error('timeout'));
        }, REQUEST_TIMEOUT);
    }

    destroyListeners() {
        clearTimeout(this.expirationTimer);
        this.socketPromise.then(socket => socket.off('message', this.handleMessage));
    }

    handleMessage = message => {
        if (message.requestId !== this.requestId)
            return;

        this.destroyListeners();

        const {status, body, code} = message;

        if (status === 'success')
            this.resolve(body);
        else
            this.reject({code, message: message.message});
    };
}

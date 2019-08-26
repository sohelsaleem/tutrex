import {EventEmitter} from 'events';
import ss from 'socket.io-stream';
import socketUploadChannelTable from './upload/SocketUploadChannelTable';

export default function socketUploadMiddleware(socketPromise) {
    return ({dispatch, getState}) => next => action => {
        if (typeof action === 'function')
            return action(dispatch, getState);

        const {socketUpload} = action;
        if (!socketUpload)
            return next(action);

        if (socketUpload.cancel)
            return cancelUploadRequest(action, next, socketPromise);

        return startUploadRequest(action, next, socketPromise);
    }
}

function startUploadRequest(action, next, socketPromise) {
    const {socketUpload, types, ...rest} = action;
    const [PROGRESS, SUCCESS, CANCEL, FAILURE] = types;
    const {requestId} = socketUpload;

    next({...rest});

    const channel = new SocketUploadChannel(socketPromise, socketUpload);
    socketUploadChannelTable.put(requestId, channel);

    channel.upload();

    channel.on('progress', progress => {
        next({
            type: PROGRESS,
            progress
        });
    });

    channel.once('finish', result => {
        next({
            type: SUCCESS,
            result
        });
    });

    channel.once('cancel', () => {
        next({
            type: CANCEL
        });
    });

    channel.once('error', error => {
        console.error(error);

        next({
            type: FAILURE,
            error
        });
    });

    channel.once('end', () => {
        channel.removeAllListeners();
        socketUploadChannelTable.remove(requestId);
    });
}

function cancelUploadRequest(action, next, socketPromise) {
    const {socketUpload: {requestId}, ...rest} = action;

    const socketUploadChannel = socketUploadChannelTable.find(requestId);

    if (!socketUploadChannel)
        return;

    socketUploadChannel.cancel();

    next({...rest});
}

class SocketUploadChannel extends EventEmitter {

    constructor(socketPromise, message) {
        super();
        this.socketPromise = socketPromise;
        this.message = message;
    }

    upload() {
        this.sendRequest();
        this.waitResponse();
    }

    sendRequest() {
        const {event, body, file, requestId} = this.message;

        this.socketPromise.then(socket => {
            this.netStream = ss.createStream();
            ss(socket).emit('file', this.netStream, {requestId, event, body});

            this.fileStream = ss.createBlobReadStream(file);
            this.fileStream.pipe(this.netStream);

            this.listenProgressEvents(file);
        });
    }

    listenProgressEvents(file) {
        let uploadedBytes = 0;

        this.fileStream.on('data', chunk => {
            uploadedBytes += chunk.length;
            const progress = uploadedBytes / file.size;

            this.emit('progress', progress);
        });
    }

    waitResponse() {
        this.socketPromise.then(socket => socket.on('message', this.handleMessage));
    }

    destroyListeners() {
        this.socketPromise.then(socket => socket.off('message', this.handleMessage));
    }

    handleMessage = message => {
        if (message.requestId !== this.message.requestId)
            return;

        const {status, body, code} = message;

        if (status === 'success')
            this.handleSuccessMessage(body);
        else
            this.emit('error', {code, message: message.message});

        this.emit('end');
        this.destroyListeners();
    };

    handleSuccessMessage(body) {
        if (body.cancelled) {
            this.disposeStreams();
            return this.emit('cancel');
        }

        this.emit('finish', body);
    }

    disposeStreams() {
        this.fileStream.unpipe();
        this.netStream.end();
    }

    cancel() {
        const {event, requestId} = this.message;

        this.socketPromise.then(socket => {
            socket.send({
                event: event + ':cancel',
                requestId
            });
        });
    }
}

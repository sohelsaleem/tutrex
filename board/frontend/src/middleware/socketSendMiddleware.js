export default function socketSendMiddleware(socketPromise) {
    return ({dispatch, getState}) => next => action => {
        if (typeof action === 'function')
            return action(dispatch, getState);

        const {socketSend, ...rest} = action;
        if (!socketSend)
            return next(action);

        next({
            ...rest
        });

        const {event, body} = socketSend;

        socketPromise
            .then(socket => socket.send({event, body}));
    };
}

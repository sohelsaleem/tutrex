export const CREATE_POLL = 'poll/CREATE_POLL';
export const CREATE_POLL_SUCCESS = 'poll/CREATE_POLL_SUCCESS';
export const CREATE_POLL_FAILURE = 'poll/CREATE_POLL_FAILURE';

export const GET_POLL = 'poll/GET_POLL';
export const GET_POLL_SUCCESS = 'poll/GET_POLL_SUCCESS';
export const GET_POLL_FAILURE = 'poll/GET_POLL_FAILURE';

export const VOTE_POLL = 'poll/VOTE_POLL';
export const VOTE_POLL_SUCCESS = 'poll/VOTE_POLL_SUCCESS';
export const VOTE_POLL_FAILURE = 'poll/VOTE_POLL_FAILURE';

export const TOGGLE_SHOW_RESULTS = 'poll/TOGGLE_SHOW_RESULTS';

export const END_POLL = 'poll/END_POLL';
export const REQUEST_END_POLL = 'poll/REQUEST_END_POLL';
export const CANCEL_END_POLL = 'poll/CANCEL_END_POLL';
export const OPEN_POLL_MODAL = 'poll/OPEN_POLL_MODAL';
export const CLOSE_POLL_MODAL = 'poll/CLOSE_POLL_MODAL';

export const SOCKET_START_POLL = 'poll:start';
export const SOCKET_END_POLL = 'poll:end';
export const SOCKET_UPDATE_POLL = 'poll:update';

export function createPoll({question, answers}) {
    return {
        types: [CREATE_POLL, CREATE_POLL_SUCCESS, CREATE_POLL_FAILURE],
        socketRequest: {
            event: 'poll:create',
            body: {
                question,
                answers
            }
        }
    };
}

export function getPoll() {
    return {
        types: [GET_POLL, GET_POLL_SUCCESS, GET_POLL_FAILURE],
        socketRequest: {
            event: 'poll:get',
            body: {}
        }
    };
}

export function votePoll(answerKey) {
    return {
        types: [VOTE_POLL, VOTE_POLL_SUCCESS, VOTE_POLL_FAILURE],
        socketRequest: {
            event: 'poll:vote',
            body : {
                answerKey
            }
        }
    };
}

export function toggleShowResults() {
    return {
        type: TOGGLE_SHOW_RESULTS,
        socketSend: {
            event: 'poll:toggleShowResults',
            body: {}
        }
    };
}

export function endPoll() {
    return {
        type: END_POLL,
        socketSend: {
            event: 'poll:end',
            body: {}
        }
    };
}

export function openPollModal() {
    return {
        type: OPEN_POLL_MODAL
    };
}

export function closePollModal() {
    return {
        type: CLOSE_POLL_MODAL
    };
}

export function requestEndPoll() {
    return {
        type: REQUEST_END_POLL
    };
}

export function cancelEndPoll() {
    return {
        type: CANCEL_END_POLL
    };
}
import RequestReducerHelper from 'helpers/RequestReducerHelper';
import {
    OPEN_POLL_MODAL,
    CLOSE_POLL_MODAL,
    END_POLL,
    REQUEST_END_POLL,
    CANCEL_END_POLL,
    GET_POLL,
    GET_POLL_SUCCESS,
    GET_POLL_FAILURE,
    CREATE_POLL,
    CREATE_POLL_SUCCESS,
    CREATE_POLL_FAILURE,
    VOTE_POLL,
    VOTE_POLL_SUCCESS,
    VOTE_POLL_FAILURE,
    TOGGLE_SHOW_RESULTS,
    SOCKET_START_POLL,
    SOCKET_END_POLL,
    SOCKET_UPDATE_POLL
} from '../actions/poll';

const initialState = {
    showPoll: false,
    poll: null,
    endPollRequested: false
};

export default function (state = initialState, action = {}) {
    const pollHelper = new RequestReducerHelper('poll');

    switch (action.type) {
        case CREATE_POLL:
        case CREATE_POLL_SUCCESS:
        case CREATE_POLL_FAILURE:
        case GET_POLL:
        case GET_POLL_SUCCESS:
        case GET_POLL_FAILURE:
            let newState = pollHelper.getNextState(state, action);
            if (newState.poll) {
                newState.showPoll = true;
            }

            return newState;
        case VOTE_POLL:
        case VOTE_POLL_SUCCESS:
        case VOTE_POLL_FAILURE:
            return pollHelper.getNextState(state, action);
        case OPEN_POLL_MODAL:
            return showPoll(state);
        case CLOSE_POLL_MODAL:
            return closePoll(state);
        case TOGGLE_SHOW_RESULTS:
            return toggleShowResults(state);
        case REQUEST_END_POLL:
            return requestEndPoll(state);
        case CANCEL_END_POLL:
            return cancelEndPoll(state);
        case END_POLL:
        case SOCKET_END_POLL:
            return endPoll(state);
        case SOCKET_START_POLL:
            return startPoll(state, action);
        case SOCKET_UPDATE_POLL:
            return updatePoll(state, action);
        default:
            return state;
    }
}

function showPoll(state) {
    return {
        ...state,
        showPoll: true
    };
}

function closePoll(state) {
    return {
        ...state,
        showPoll: false
    };
}

function endPoll(state) {
    return {
        ...state,
        poll: null,
        showPoll: false,
        endPollRequested: false
    };
}

function startPoll(state, action) {
    return {
        ...state,
        poll: action.poll,
        showPoll: true
    };
}

function updatePoll(state, action) {
    return {
        ...state,
        poll: action.poll
    };
}

function toggleShowResults(state) {
    const poll = state.poll;

    return {
        ...state,
        poll: {
            ...poll,
            showResults: !poll.showResults
        }
    };
}

function requestEndPoll(state) {
    return {
        ...state,
        endPollRequested: true
    };
}

function cancelEndPoll(state) {
    return {
        ...state,
        endPollRequested: false
    };
}

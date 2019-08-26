import RequestReducerHelper from '../helpers/RequestReducerHelper';
import getNewState from '../helpers/TextChatHelper';

import {
    SEND_TEXT_CHAT_MESSAGE,
    SOCKET_NEW_TEXT_CHAT_MESSAGE,

    GET_TEXT_CHAT_HISTORY,
    GET_TEXT_CHAT_HISTORY_SUCCESS,
    GET_TEXT_CHAT_HISTORY_FAILURE
} from 'actions/textChat';

const initialState = {
    chatItemList: [],
    newMessagesCounter: 0
};

export default function textChatReducer(state = initialState, action = {}) {
    const historyRequestHelper = new RequestReducerHelper('chatItemList');

    switch (action.type) {
        case SEND_TEXT_CHAT_MESSAGE:
        case SOCKET_NEW_TEXT_CHAT_MESSAGE:
            return getNewState(state, action);


        case GET_TEXT_CHAT_HISTORY:
        case GET_TEXT_CHAT_HISTORY_SUCCESS:
        case GET_TEXT_CHAT_HISTORY_FAILURE:
            return historyRequestHelper.getNextState(state, action);

        default:
            return state;
    }
}

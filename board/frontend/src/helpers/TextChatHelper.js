import {
    SEND_TEXT_CHAT_MESSAGE,
    SOCKET_NEW_TEXT_CHAT_MESSAGE
} from 'actions/textChat';

export default function getNewState(state, action) {
    const chatItemList = state.chatItemList.slice();
    chatItemList.push(action.textChatItem);

    const newState = {
        ...state,
        chatItemList
    };

    if (action.type === SOCKET_NEW_TEXT_CHAT_MESSAGE) {
        newState.newMessagesCounter = state.newMessagesCounter + 1;
    }

    return newState;
}

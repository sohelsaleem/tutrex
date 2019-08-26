export const SEND_TEXT_CHAT_MESSAGE = 'textChat/SEND_TEXT_CHAT_MESSAGE';
export const SOCKET_NEW_TEXT_CHAT_MESSAGE = 'textChat:message:new';

export const GET_TEXT_CHAT_HISTORY = 'textChat/GET_TEXT_CHAT_HISTORY';
export const GET_TEXT_CHAT_HISTORY_SUCCESS = 'textChat/GET_TEXT_CHAT_HISTORY_SUCCESS';
export const GET_TEXT_CHAT_HISTORY_FAILURE = 'textChat/GET_TEXT_CHAT_HISTORY_FAILURE';

export function sendMessage(textChatItem) {
    return {
        type: SEND_TEXT_CHAT_MESSAGE,
        socketSend: {
            event: 'textChat:message:create',
            body: {
                textChatItem
            }
        },
        textChatItem
    };
}

export function getTextChatHistory() {
    return {
        types: [GET_TEXT_CHAT_HISTORY, GET_TEXT_CHAT_HISTORY_SUCCESS, GET_TEXT_CHAT_HISTORY_FAILURE],
        socketRequest: {
            event: 'textChat:message:history',
            body: {}
        }
    };
}

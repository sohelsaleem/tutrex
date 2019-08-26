export const GET_ATTENDEE_LIST = 'attendeeList/GET_ATTENDEE_LIST';
export const GET_ATTENDEE_LIST_SUCCESS = 'attendeeList/GET_ATTENDEE_LIST_SUCCESS';
export const GET_ATTENDEE_LIST_FAILURE = 'attendeeList/GET_ATTENDEE_LIST_FAILURE';

export const SOCKET_ATTENDEE_LIST_ADDED = 'attendeeList:added';
export const SOCKET_ATTENDEE_LIST_UPDATED = 'attendeeList:updated';
export const SOCKET_ATTENDEE_LIST_REMOVED = 'attendeeList:removed';

export const CHANGE_ATTENDEE_MEDIA_STATE = 'attendeeList/CHANGE_ATTENDEE_MEDIA_STATE';
export const CHANGE_ATTENDEE_CAPABILITIES = 'attendeeList/CHANGE_ATTENDEE_CAPABILITIES';
export const KICK_ATTENDEE = 'attendeeList/KICK_ATTENDEE';
export const CHANGE_RAISE_HAND_STATE = 'attendeeList/CHANGE_RAISE_HAND_STATE';


export const SOCKET_ATTENDEE_KICKED = 'attendeeList:kicked';

export function getAttendeeList() {
    return {
        types: [GET_ATTENDEE_LIST, GET_ATTENDEE_LIST_SUCCESS, GET_ATTENDEE_LIST_FAILURE],
        socketRequest: {
            event: 'attendeeList:all',
            body: {}
        }
    };
}

export function changeMediaState(attendeeId, mediaState) {
    const message = {
        attendeeId: attendeeId,
        mediaState: mediaState
    };
    return {
        type: CHANGE_ATTENDEE_MEDIA_STATE,
        socketSend: {
            event: 'attendeeList:changeMediaState',
            body: message
        },
        message
    };
}

export function changeCapabilities(attendeeId, capabilities) {
    const message = {
        attendeeId: attendeeId,
        capabilities: capabilities
    };
    return {
        type: CHANGE_ATTENDEE_CAPABILITIES,
        socketSend: {
            event: 'attendeeList:changeCapabilities',
            body: message
        },
        message
    };
}

export function kickAttendee(attendeeId) {
    const message = {
        attendeeId: attendeeId
    };
    return {
        type: KICK_ATTENDEE,
        socketSend: {
            event: 'attendeeList:kick',
            body: message
        },
        message
    };
}

export function changeRaiseHandState(attendeeId, isRaiseHand) {
    const message = {
        attendeeId,
        isRaiseHand
    };

    return {
        type: CHANGE_RAISE_HAND_STATE,
        socketSend: {
            event: 'attendeeList:raiseHand',
            body: message
        },
        message
    };
}

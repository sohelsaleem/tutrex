import RequestReducerHelper from '../helpers/RequestReducerHelper';
import {
    GET_ATTENDEE_LIST,
    GET_ATTENDEE_LIST_SUCCESS,
    GET_ATTENDEE_LIST_FAILURE,

    SOCKET_ATTENDEE_LIST_ADDED,
    SOCKET_ATTENDEE_LIST_UPDATED,
    SOCKET_ATTENDEE_LIST_REMOVED,

    CHANGE_ATTENDEE_MEDIA_STATE,
    CHANGE_ATTENDEE_CAPABILITIES
} from 'actions/attendeeList';

const initialState = {
    attendeeList: []
};

export default function attendeeListReducer(state = initialState, action = {}) {
    const attendeeListRequestHelper = new RequestReducerHelper('attendeeList');

    switch (action.type) {
        case GET_ATTENDEE_LIST:
        case GET_ATTENDEE_LIST_SUCCESS:
        case GET_ATTENDEE_LIST_FAILURE:
            return attendeeListRequestHelper.getNextState(state, action);

        case SOCKET_ATTENDEE_LIST_ADDED:
            return addMember(state, action.member);

        case SOCKET_ATTENDEE_LIST_UPDATED:
            return updateMember(state, action.member);

        case SOCKET_ATTENDEE_LIST_REMOVED:
            return removeMember(state, action.member);

        default:
            return state;
    }
}

function addMember(state, newMember) {
    const {attendeeList} = state;

    if (attendeeList.some(m => m.id === newMember.id))
        return state;

    const nextAttendeeList = [...attendeeList, newMember];

    return {
        ...state,
        attendeeList: nextAttendeeList
    };
}

function removeMember(state, dirtyMember) {
    const {attendeeList} = state;
    const nextAttendeeList = attendeeList.filter(m => m.id !== dirtyMember.id);

    return {
        ...state,
        attendeeList: nextAttendeeList
    };
}

function updateMember(state, updatedMember) {
    const nextAttendeeList = state.attendeeList.slice();
    const updatingIndex = nextAttendeeList.findIndex((member) => {
        return member.id == updatedMember.id
    });
    
    if (updatingIndex >= 0) {
        nextAttendeeList[updatingIndex] = updatedMember;
    }

    return {
        ...state,
        attendeeList: nextAttendeeList
    };
}

import RequestReducerHelper from '../helpers/RequestReducerHelper';
import {
    REQUEST_VERSION,
    REQUEST_VERSION_SUCCESS,
    REQUEST_VERSION_FAIL
} from 'actions/version';

const initialState = {};

export default function versionReducer(state = initialState, action = {}) {
    const versionRequestHelper = new RequestReducerHelper('serverVersion');

    switch (action.type) {
        case REQUEST_VERSION:
        case REQUEST_VERSION_SUCCESS:
        case REQUEST_VERSION_FAIL:
            return versionRequestHelper.getNextState(state, action);

        default:
            return state;
    }
}

import {
    CHANGE_DIALOG_NAME_WHEN_FINISH_LESSON,
    TOGGLE_NEED_SHOW_INSTALL_EXT,
    PRESS_BY_SCREEN_SHARING,
    REMOVE_PRESS_BY_SCREEN_SHARING_VALUE
} from 'actions/displayStates';

const initialState = {
    dialogNameWhenFinishLesson: null,
    needShowInstallExt: false
};

export default function displayStatesReducer(state = initialState, action = {}) {
    switch (action.type) {
        case CHANGE_DIALOG_NAME_WHEN_FINISH_LESSON:
            return {
                ...state,
                dialogNameWhenFinishLesson: action.name
            };

        case TOGGLE_NEED_SHOW_INSTALL_EXT:
            return {
                ...state,
                needShowInstallExt: action.needShowInstallExt
            };

        case PRESS_BY_SCREEN_SHARING:
            return {
                ...state,
                pressedScreenSharing: true
            };
        case REMOVE_PRESS_BY_SCREEN_SHARING_VALUE:
            return {
                ...state,
                pressedScreenSharing: false
            };

        default:
            return state;
    }
}

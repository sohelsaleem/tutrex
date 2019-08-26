export const CHANGE_DIALOG_NAME_WHEN_FINISH_LESSON = 'displayStates/CHANGE_DIALOG_NAME_WHEN_FINISH_LESSON';
export const TOGGLE_NEED_SHOW_INSTALL_EXT = 'displayStates/TOGGLE_NEED_SHOW_INSTALL_EXT';

export const PRESS_BY_SCREEN_SHARING = 'displayStates/PRESS_BY_SCREEN_SHARING';
export const REMOVE_PRESS_BY_SCREEN_SHARING_VALUE = 'displayStates/REMOVE_PRESS_BY_SCREEN_SHARING_VALUE';
export const PRESS_BY_SCREEN_SHARING_FAIL = 'displayStates/PRESS_BY_SCREEN_SHARING_FAIL';

export function changeDialogNameWhenFinishLesson(name) {
    return {
        type: CHANGE_DIALOG_NAME_WHEN_FINISH_LESSON,
        name
    };
}

export function toggleNeedShowInstallExt(needShowInstallExt) {
    return {
        type: TOGGLE_NEED_SHOW_INSTALL_EXT,
        needShowInstallExt
    };
}

export function pressByScreenSharing() {
    return {
        type: PRESS_BY_SCREEN_SHARING
    };
}

export function removePressByScreenSharingValue() {
    return {
        type: REMOVE_PRESS_BY_SCREEN_SHARING_VALUE
    };
}

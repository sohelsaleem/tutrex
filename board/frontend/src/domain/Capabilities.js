const Capabilities = {
    WHITEBOARD: 'whiteboardAccess',
    CAMERA: 'cameraAccess',
    MIC: 'micAccess',
    MANAGE_RAISE_HANDS: 'manageRaiseHands'
};

export default Capabilities;

export function checkAccess(user) {
    return new AccessChecker(user);
}

export function checkAccessCurrentUser(state) {
    const user = getCurrentUser(state);
    return new AccessChecker(user);
}

function getCurrentUser(state) {
    if (!state.room.authInfo)
        return {capabilities: []};

    return state.room.authInfo.user;
}

class AccessChecker {
    constructor(user) {
        this.user = user;
    }

    canUseWhiteboard() {
        return this._check(Capabilities.WHITEBOARD);
    }

    _check(capability) {
        return this.user.capabilities[capability];
    }

    canPublishVideo() {
        return this._check(Capabilities.CAMERA);
    }

    canPublishAudio() {
        return this._check(Capabilities.MIC);
    }

    canManageRaiseHands(){
        return this._check(Capabilities.MANAGE_RAISE_HANDS);
    }
}

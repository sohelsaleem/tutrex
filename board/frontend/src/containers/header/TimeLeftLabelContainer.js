import {connect} from 'react-redux';

import {
    changeDialogNameWhenFinishLesson
} from 'actions/displayStates';

import {
    syncTime,
    pauseLesson
} from 'actions/room';

import TimeLeftLabel from 'components/header/TimeLeftLabel';

const mapStateToProps = (state) => {
    const {user, room} = state.room.authInfo;
    return {
        dialogNameWhenFinishLesson: state.displayStates.dialogNameWhenFinishLesson,
        user,
        room,
        lastServerTime: state.room.lastServerTime,
    };
};

const mapDispatchToProps = {
    onSyncTime: syncTime,
    onPauseLesson: pauseLesson,
    onChangeDialogNameWhenFinishLesson: changeDialogNameWhenFinishLesson
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeLeftLabel);

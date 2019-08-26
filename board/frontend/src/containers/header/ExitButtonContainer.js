import {connect} from 'react-redux';

import {
    changeDialogNameWhenFinishLesson
} from 'actions/displayStates';

import ExitButton from '../../components/header/ExitButton';

const mapStateToProps = (state) => {
    const {user} = state.room.authInfo;
    
    return {
        dialogNameWhenFinishLesson: state.displayStates.dialogNameWhenFinishLesson,
        user
    };
};

const mapDispatchToProps = {
    onChangeDialogNameWhenFinishLesson: changeDialogNameWhenFinishLesson
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitButton);

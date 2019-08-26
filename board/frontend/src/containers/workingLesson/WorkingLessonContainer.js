import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import BlockInterfaceInformationDialog from 'components/common/BlockInterfaceInformationDialog';

import {checkIsTeacherInRoom} from 'actions/room';

class WorkingLessonContainer extends Component {
    static propTypes = {
        user: PropTypes.object,
        isTeacherInRoom: PropTypes.bool,
        onCheckIsTeacherInRoom: PropTypes.func.isRequired,
        isLessonFinished: PropTypes.bool,
        isPaused: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            isLessonFinished: false,
            isLessonPaused: props.isPaused
        };
    }

    componentDidMount() {
        const {
            onCheckIsTeacherInRoom,
            user
        } = this.props;

        if (!user.isTeacher)
            onCheckIsTeacherInRoom();
    }

    componentWillReceiveProps(nextProps) {
        if (this.isLessonFinished(nextProps)) {
            this.setState({
                isLessonFinished: true,
                isLessonPaused: false
            });
            return;
        }
        this.setState({
            isLessonPaused: this.isLessonPaused(nextProps)
        });
    }

    isLessonFinished(nextProps) {
        return !this.props.isLessonFinished && nextProps.isLessonFinished;
    }

    isLessonPaused(nextProps) {
        return nextProps.isPaused;
    }

    render() {
        const {isTeacherInRoom, user} = this.props;
        const {isLessonFinished, isLessonPaused} = this.state;

        return (
            <div>
                {((!isLessonFinished && !isTeacherInRoom) || (isLessonPaused && !user.isTeacher)) &&
                <BlockInterfaceInformationDialog text='Waiting for teacher...'/>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {user, room} = state.room.authInfo;

    return {
        user,
        isTeacherInRoom: state.room.isTeacherInRoom,
        isLessonFinished: state.room.isLessonFinished,
        isPaused: room.isPaused
    };
};

const mapDispatchToProps = {
    onCheckIsTeacherInRoom: checkIsTeacherInRoom
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkingLessonContainer);

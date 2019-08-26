import React, {Component, PropTypes} from 'react';
import PollTeacherModal from './PollTeacherModal/PollTeacherModal';
import PollStudentModal from "./PollStudentModal/PollStudentModal";
import PollCancelModal from "./PollCancelModal";

export default class Poll extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        users: PropTypes.array.isRequired,
        poll: PropTypes.object,
        showPoll: PropTypes.bool,
        endPollRequested: PropTypes.bool,
        onCreatePoll: PropTypes.func.isRequired,
        onCloseModal: PropTypes.func.isRequired,
        onEndPoll: PropTypes.func.isRequired,
        onGetPoll: PropTypes.func.isRequired,
        onSelectAnswer: PropTypes.func.isRequired,
        onToggleShowResults: PropTypes.func.isRequired,
        onRequestEndPoll: PropTypes.func.isRequired,
        onCancelEndPoll: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.onGetPoll();
    }

    render() {
        const {showPoll, endPollRequested, onCancelEndPoll, onEndPoll} = this.props;

        if (!showPoll) {
            return null;
        }

        if (endPollRequested) {
            return <PollCancelModal onCancelEndPoll={onCancelEndPoll} onEndPoll={onEndPoll}/>;
        }

        return this.renderModal();
    }

    renderModal() {
        const {
            user,
            users,
            poll,
            onCreatePoll,
            onCloseModal,
            onSelectAnswer,
            onToggleShowResults,
            onRequestEndPoll
        } = this.props;

        if (!poll && user.capabilities.whiteboardAccess || poll.userId === user.id) {
            return <PollTeacherModal onCloseModal={onCloseModal}
                                     onRequestEndPoll={onRequestEndPoll}
                                     onCreatePoll={onCreatePoll}
                                     poll={poll}
                                     onToggleShowResults={onToggleShowResults}
                                     users={users}/>
        }

        if (poll) {
            return <PollStudentModal poll={poll}
                                     user={user}
                                     users={users}
                                     onSelectAnswer={onSelectAnswer}/>;
        }

        return null;
    }
}

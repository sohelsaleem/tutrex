import React, {Component, PropTypes} from 'react';
import PollCreate from "./PollCreate";
import PollShow from "../PollShow";

export default class PollTeacherModal extends Component {
    static propTypes = {
        onCloseModal: PropTypes.func.isRequired,
        onCreatePoll: PropTypes.func.isRequired,
        onToggleShowResults: PropTypes.func.isRequired,
        onRequestEndPoll: PropTypes.func.isRequired,
        poll: PropTypes.object,
        users: PropTypes.array.isRequired
    };

    render() {
        const {onCloseModal, onCreatePoll, onToggleShowResults, onRequestEndPoll, poll, users} = this.props;

        if (!poll) {
            return <PollCreate onCreatePoll={onCreatePoll} onCloseModal={onCloseModal}/>;
        }

        return <PollShow poll={poll}
                         onCloseModal={onRequestEndPoll}
                         isTeacher={true}
                         onToggleShowResults={onToggleShowResults}
                         users={users}/>;
    }
}
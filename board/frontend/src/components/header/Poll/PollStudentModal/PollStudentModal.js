import React, {Component, PropTypes} from 'react';
import PollShow from "../PollShow";
import PollVote from "./PollVote";

export default class PollStudentModal extends Component {
    static propTypes = {
        poll: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        users: PropTypes.array.isRequired,
        onSelectAnswer: PropTypes.func.isRequired
    };

    render() {
        const {poll, user, onSelectAnswer, users} = this.props;

        if (!poll.usersAnswered.includes(user.id)) {
            return <PollVote poll={poll}
                             onSelectAnswer={onSelectAnswer}
            />;
        }

        if (poll.showResults) {
            return <PollShow poll={poll}
                             users={users}
            />;
        }

        return null;
    }
}
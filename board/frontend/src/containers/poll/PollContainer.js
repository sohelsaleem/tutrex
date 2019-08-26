import {connect} from 'react-redux';
import Poll from 'components/header/Poll/Poll';

import {
    createPoll,
    closePollModal,
    endPoll,
    getPoll,
    votePoll,
    toggleShowResults,
    requestEndPoll,
    cancelEndPoll
} from 'actions/poll';

const mapStateToProps = (state) => {
    const {attendeeList} = state.attendeeList;
    let users = [];
    if (attendeeList)
        users = attendeeList.map(attendee => {
            return attendee.id;
        });

    return {
        user: state.room.authInfo.user,
        users,
        ...state.poll
    };
};

const mapDispatchToProps = {
    onCreatePoll: createPoll,
    onCloseModal: closePollModal,
    onEndPoll: endPoll,
    onGetPoll: getPoll,
    onSelectAnswer: votePoll,
    onToggleShowResults: toggleShowResults,
    onRequestEndPoll: requestEndPoll,
    onCancelEndPoll: cancelEndPoll
};

export default connect(mapStateToProps, mapDispatchToProps)(Poll);
import {connect} from 'react-redux';

import {getAttendeeList, changeMediaState, changeCapabilities, kickAttendee, changeRaiseHandState} from 'actions/attendeeList';

import AttendeeList from 'components/attendeeList/AttendeeList';

const mapStateToProps = (state) => ({
    ...state.attendeeList,
    currentUser: state.room.authInfo.user
});

const mapDispatchToProps = {
    onAppear: getAttendeeList,
    changeMediaState: changeMediaState,
    changeCapabilities: changeCapabilities,
    kickAttendee: kickAttendee,
    changeRaiseHandState: changeRaiseHandState
};

export default connect(mapStateToProps, mapDispatchToProps)(AttendeeList);


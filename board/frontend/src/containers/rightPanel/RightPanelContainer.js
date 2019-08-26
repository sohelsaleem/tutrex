import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import VideoChatContainer from 'containers/videoChat/VideoChatContainer';
import AttendeeListContainer from 'containers/attendeeList/AttendeeListContainer';
import TextChatContainer from 'containers/textChat/TextChatContainer';

import styles from 'containers/room/RoomContainer.scss';

class RightPanelContainer extends Component {
    static propTypes = {
        fullScreenEnabled: PropTypes.bool,
        teacherId: PropTypes.number,
        showPanel: PropTypes.bool
    };

    render() {
        const {
            fullScreenEnabled,
            teacherId,
            showPanel
        } = this.props;

        let rightPanelStyle = fullScreenEnabled ? {display: 'none'} : {};
        if (!fullScreenEnabled && showPanel)
            rightPanelStyle = {display: 'flex'};

        return(
            <div className={styles.rightPanel} style={rightPanelStyle}>
                <VideoChatContainer teacherId={teacherId}/>
                <AttendeeListContainer/>
                <TextChatContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {fullScreenEnabled} = state.whiteboard;

    return {
        fullScreenEnabled
    };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(RightPanelContainer);

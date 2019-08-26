import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import WhiteboardContainer from 'containers/whiteboard/WhiteboardContainer';
import VersionContainer from 'containers/version/VersionContainer';
import HeaderContainer from 'containers/header/HeaderContainer';
import ScreenSharingContainer from 'containers/header/ScreenSharingContainer';
import FullScreenContainer from 'containers/common/FullScreenContainer';
import RightPanelContainer from 'containers/rightPanel/RightPanelContainer';
import VideoDialogContainer from 'containers/dialogs/VideoDialogContainer';
import LessonFinishContainer  from 'containers/lessonFinish/LessonFinishContainer';
import WorkingLessonContainer  from 'containers/workingLesson/WorkingLessonContainer';
import LessonRecordContainer from 'containers/recording/LessonRecordContainer';
import UserAccessNotificationsContainer from 'containers/notifications/userAccessNotifications/UserAccessNotificationsContainer';
import PollContainer from 'containers/poll/PollContainer';

import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';
import {addNotification as notify} from 'reapop';

import styles from './RoomContainer.scss';

class RoomContainer extends Component {
    static propTypes = {
        room: PropTypes.object.isRequired
    };

    state = {
        showRightPanel: false,
        showHeader: false
    };

    render() {
        const {
            room: {canRecordClass, teacherId},
            onNotify
        } = this.props;
        const {showRightPanel, showHeader} = this.state;

        const rightPanelToggleClassname = classnames(styles.rightPanelToggle, {
            [styles.rightPanelToggleOpened]: showRightPanel
        });

        return (
            <div className={styles.roomContainer}>
                <div className={styles.mainPanel}>
                    <HeaderContainer isHeaderExpanded={showHeader} onToggleHeader={this.toggleHeader.bind(this)}/>
                    <WhiteboardContainer/>
                </div>

                <RightPanelContainer teacherId={teacherId} showPanel={showRightPanel}/>
                <div className={rightPanelToggleClassname}
                     onClick={this.toggleRightPanel.bind(this)}
                />
                <VersionContainer/>
                <FullScreenContainer/>
                <VideoDialogContainer />
                <ScreenSharingContainer/>
                <LessonFinishContainer/>
                <WorkingLessonContainer />
                <UserAccessNotificationsContainer onNotify={onNotify}/>
                <PollContainer/>

                <NotificationsSystem theme={theme}/>

                {canRecordClass && <LessonRecordContainer/>}
            </div>
        );
    }

    toggleRightPanel() {
        this.setState({
            showRightPanel: !this.state.showRightPanel,
            showHeader: false
        });
    }

    toggleHeader() {
        this.setState({
            showHeader: !this.state.showHeader,
            showRightPanel: false
        });
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.room.authInfo
    };
};

const mapDispatchToProps = {
    onNotify: notify
};

export default connect(mapStateToProps, mapDispatchToProps)(RoomContainer);

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {Scrollbars} from 'react-custom-scrollbars';

import CircularProgress from 'components/common/progress/CircularProgress';
import AttendeeListItem from './AttendeeListItem';
import WarningDialog from 'components/common/WarningDialog';

import Capabilities, {checkAccess} from 'domain/Capabilities';
import playAudio from 'helpers/AudioHelper';

import newRaiseHandSound from 'assets/sounds/raise_hand.wav';
import styles from './AttendeeList.scss';

const MAX_VIDEO_CHATS_COUNT = 4;

export default class AttendeeList extends Component {
    static propTypes = {
        attendeeListProcessing: PropTypes.bool,
        attendeeList: PropTypes.array,
        currentUser: PropTypes.object.isRequired,
        onAppear: PropTypes.func.isRequired,
        changeMediaState: PropTypes.func.isRequired,
        changeCapabilities: PropTypes.func.isRequired,
        kickAttendee: PropTypes.func.isRequired,
        changeRaiseHandState: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            limitReachedDialogVisible: false
        };
    }

    componentDidMount() {
        this.props.onAppear();
    }

    componentWillReceiveProps(next) {
        const {attendeeList} = next;
        if (!attendeeList)
            return;
        const isNeedToPlayRaiseHandSound = this.props.currentUser.isTeacher && attendeeList.some(a => {
            if (!a.isRaiseHand)
                return false;
            const prev = this.findPrevAttendeeState(a);
            if (!prev)
                return false;
            return this.isRaiseHandStateChanged(prev, a);
        });
        if (isNeedToPlayRaiseHandSound)
            playAudio(newRaiseHandSound);
    }

    findPrevAttendeeState(attendee) {
        const {attendeeList} = this.props;
        if (!attendeeList)
            return null;
        return attendeeList.find(a => a.id === attendee.id);
    }

    isRaiseHandStateChanged(prevAttendee, nextAttendee) {
        return prevAttendee.isRaiseHand !== nextAttendee.isRaiseHand;
    }

    handleCloseDialog() {
        this.setState({
            limitReachedDialogVisible: false
        });
    }

    render() {
        return (
            <div className={styles.attendeeListContainer}>
                <header className={styles.header}>Attendee list</header>
                <section className={styles.attendeeList}>
                    <Scrollbars style={{ height: '100%' }}
                                autoHeight
                                autoHeightMax={'100%'}
                    >
                        {this.renderContent()}
                    </Scrollbars>
                </section>
                {this.state.limitReachedDialogVisible && <WarningDialog title='Limit reached'
                                                                        text='Too much students with chat capability. Turn off capability for other student'
                                                                        onClose={this.handleCloseDialog.bind(this)}/>}
            </div>
        );
    }

    renderContent() {
        const {attendeeListProcessing} = this.props;

        if (attendeeListProcessing)
            return <CircularProgress/>;

        return this.renderAttendeeList();
    }

    renderAttendeeList() {
        const attendeeListChildren = _.chain(this.props.attendeeList || [])
            .orderBy('isTeacher', 'desc')
            .map(this.renderAttendeeListItem)
            .value();

        return (
            <div className={styles.list}>
                {attendeeListChildren}
            </div>
        );
    }

    isVideoChatsLimitReached() {
        let chatsCount = 0;
        this.props.attendeeList.forEach(attendee => {
            if (checkAccess(attendee).canPublishVideo()) {
                chatsCount++;
            }
        });
        return chatsCount >= MAX_VIDEO_CHATS_COUNT;
    }

    renderAttendeeListItem = (attendee, index) => {
        const {currentUser, changeMediaState, changeCapabilities, kickAttendee, changeRaiseHandState} = this.props;
        const isCurrentUser = attendee.id === currentUser.id;

        const attendeeAccessChecker = checkAccess(attendee);

        const canUseCamera = (isCurrentUser && attendeeAccessChecker.canPublishVideo()) || currentUser.isTeacher;
        const canUseMicrophone = (isCurrentUser && attendeeAccessChecker.canPublishAudio()) || currentUser.isTeacher;
        const canUseWhiteboard = attendeeAccessChecker.canUseWhiteboard();
        const canManageRaiseHands = checkAccess(currentUser).canManageRaiseHands();
        const canViewRaiseHand = (canManageRaiseHands && attendee.isRaiseHand) || (!attendee.isTeacher && isCurrentUser);

        const canKick = !isCurrentUser && currentUser.isTeacher;

        const cameraActive = isCurrentUser ? attendee.mediaState.video : attendeeAccessChecker.canPublishVideo();
        const micActive = isCurrentUser ? attendee.mediaState.audio : attendeeAccessChecker.canPublishAudio();

        const needShowWhiteboardAccessButton = currentUser.isTeacher && !isCurrentUser;

        const handleCameraActiveChange = () => {
            if (isCurrentUser) {
                changeMediaState(attendee.id, {
                    video: !cameraActive,
                    audio: micActive
                });
            } else if (currentUser.isTeacher) {
                if (this.isVideoChatsLimitReached() && !cameraActive) {
                    this.setState({
                        limitReachedDialogVisible: true
                    });
                    return;
                }
                const capabilities = {};
                capabilities[Capabilities.CAMERA] = !cameraActive;
                capabilities[Capabilities.MIC] = micActive;
                changeCapabilities(attendee.id, capabilities);
            }
        };

        const handleMicActiveChange = () => {
            if (isCurrentUser) {
                changeMediaState(attendee.id, {
                    video: cameraActive,
                    audio: !micActive
                });
            } else if (currentUser.isTeacher) {
                const capabilities = {};
                capabilities[Capabilities.CAMERA] = cameraActive;
                capabilities[Capabilities.MIC] = !micActive;
                changeCapabilities(attendee.id, capabilities);
            }
        };

        const handleKick = () => {
            if (currentUser.isTeacher) {
                kickAttendee(attendee.id);
            }
        };

        const handleWhiteboardAccessChange = () => {
            if (!currentUser.isTeacher) return;
            const capabilities = {};
            capabilities[Capabilities.CAMERA] = cameraActive;
            capabilities[Capabilities.MIC] = micActive;
            capabilities[Capabilities.WHITEBOARD] = !canUseWhiteboard;
            changeCapabilities(attendee.id, capabilities);
        };

        const handleChangeRaiseHandState = () => {
            if (!canManageRaiseHands && !isCurrentUser)
                return;
            const nextRaiseHandState = !attendee.isRaiseHand;
            changeRaiseHandState(attendee.id, nextRaiseHandState);
        };

        return (
            <AttendeeListItem key={index}
                              isCurrentUser={isCurrentUser}
                              canUseCamera={canUseCamera}
                              canUseMicrophone={canUseMicrophone}
                              canUseWhiteboard={canUseWhiteboard}
                              handleCameraActiveChange={handleCameraActiveChange}
                              handleMicActiveChange={handleMicActiveChange}
                              handleKick={handleKick}
                              handleWhiteboardAccessChange={handleWhiteboardAccessChange}
                              cameraActive={cameraActive}
                              canKick={canKick}
                              micActive={micActive}
                              needShowWhiteboardAccessButton={needShowWhiteboardAccessButton}
                              attendee={attendee}
                              canViewRaiseHand={canViewRaiseHand}
                              isRaiseHand={attendee.isRaiseHand}
                              handleChangeRaiseHandState={handleChangeRaiseHandState}/>
        );
    };
}

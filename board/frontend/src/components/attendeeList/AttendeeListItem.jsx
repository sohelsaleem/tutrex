import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './AttendeeListItem.scss';
import whiteboardActiveIcon from 'assets/state/whiteboard_access.svg';
import whiteboardNotActiveIcon from 'assets/state/whiteboard_access-off.svg';
import cameraActiveIcon from 'assets/state/camcorder.svg';
import cameraNotActiveIcon from 'assets/state/camcorder-off.svg';
import micActiveIcon from 'assets/state/microphone.svg';
import micNotActiveIcon from 'assets/state/microphone-off.svg';
import kickIcon from 'assets/state/kick.svg';
import raiseHandIcon from 'assets/state/raise-hand.svg';
import raisedHandIcon from 'assets/state/raised-hand.svg';

export default class AttendeeListItem extends Component {
    static propTypes = {
        attendee: PropTypes.object.isRequired,
        isCurrentUser: PropTypes.bool.isRequired,
        cameraActive: PropTypes.bool.isRequired,
        micActive: PropTypes.bool.isRequired,
        canUseCamera: PropTypes.bool,
        canUseMicrophone: PropTypes.bool,
        canKick: PropTypes.bool,
        canUseWhiteboard: PropTypes.bool,
        needShowWhiteboardAccessButton: PropTypes.bool,
        handleCameraActiveChange: PropTypes.func.isRequired,
        handleMicActiveChange: PropTypes.func.isRequired,
        handleKick: PropTypes.func.isRequired,
        handleWhiteboardAccessChange: PropTypes.func.isRequired,
        canViewRaiseHand: PropTypes.bool,
        handleChangeRaiseHandState: PropTypes.func.isRequired,
        isRaiseHand: PropTypes.bool
    };

    render() {
        const {
            attendee, isCurrentUser,
            canUseCamera, canUseMicrophone, canKick, canUseWhiteboard, needShowWhiteboardAccessButton,
            micActive, cameraActive,
            handleCameraActiveChange, handleMicActiveChange, handleKick, handleWhiteboardAccessChange,
            canViewRaiseHand, handleChangeRaiseHandState, isRaiseHand
        } = this.props;

        const suffix = this.getNameSuffix();

        const cameraIcon = cameraActive ? cameraActiveIcon : cameraNotActiveIcon;
        const micIcon = micActive ? micActiveIcon : micNotActiveIcon;
        const whiteboardAccessIcon = canUseWhiteboard ? whiteboardActiveIcon : whiteboardNotActiveIcon;
        const raiseHandStyles = classNames(styles.imgContainer, !canViewRaiseHand ? styles.invisible : '');

        return (
            <div className={styles.itemContainer}>
                <div className={styles.nameContainer}>
                    <span className={styles.attendeeName}>{attendee.name}</span>
                    {suffix && <span className={styles.nameSuffix}>{suffix}</span>}
                </div>
                <div className={styles.controlsContainer}>
                    <div className={raiseHandStyles}>
                        <img src={isRaiseHand ? raisedHandIcon : raiseHandIcon}
                             onClick={handleChangeRaiseHandState}/>
                    </div>
                    {canUseCamera ?
                        <div className={styles.imgContainer}>
                            <img src={cameraIcon} onClick={handleCameraActiveChange}/>
                        </div>
                        : null}
                    {canUseMicrophone ?
                        <div className={styles.imgContainer}>
                            <img src={micIcon} onClick={handleMicActiveChange}/>
                        </div>
                        : null}
                    {needShowWhiteboardAccessButton ?
                        <div className={styles.imgContainer}>
                            <img src={whiteboardAccessIcon} onClick={handleWhiteboardAccessChange}/>
                        </div>
                        : null}
                    {canKick ?
                        <div className={styles.imgContainer}>
                            <img src={kickIcon} onClick={handleKick} alt="Drop User" title="Drop User"/>
                        </div>
                        : null}
                </div>
            </div>
        );
    }

    getNameSuffix() {
        const {attendee, isCurrentUser} = this.props;

        if (isCurrentUser)
            return 'You';

        return attendee.isTeacher && 'Teacher';
    }
}

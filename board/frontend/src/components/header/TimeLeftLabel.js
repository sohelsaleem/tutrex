import React, {Component, PropTypes} from 'react';
import styles from './TimeLeftLabel.scss';
import classNames from 'classnames';
import moment from 'moment';
import momentDuration from 'moment-duration-format';

const FIVE_MINUTES = 5 * 60;

export default class TimeLeftLabel extends Component {
    static propTypes = {
        room: PropTypes.object,
        lastServerTime: PropTypes.number,
        onSyncTime: PropTypes.func.isRequired,
        onPauseLesson: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        onChangeDialogNameWhenFinishLesson: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const {room} = this.props;
        const now = Math.floor(new Date().getTime() / 1000);
        this.state = {
            now,
            shift: 0,
            endTime: room.startTime + (room.approxDuration)
        };
    }

    componentWillReceiveProps(props) {
        const {
            lastServerTime,
            onChangeDialogNameWhenFinishLesson
        } = props;

        if (this.props.lastServerTime != lastServerTime) {
            this.updateShiftAndNowTime(lastServerTime);
            if (this.isNeedToShowDialogThatMeetingTimeIsOver(props)) {
                this.isShowedDialogThatMeetingTimeIsOver = true;
                onChangeDialogNameWhenFinishLesson('dialogThatMeetingTimeIsOver');
            }
        }
        if (this.isLessonUnpaused(props)) {
            this.isShowedAddTimeDialog = false;
            const {room} = props;
            const newEndTime = room.startTime + (room.approxDuration);
            this.setState({endTime: newEndTime});
        }
    }

    isLessonUnpaused(next) {
        return this.props.room.isPaused && !next.room.isPaused;
    }

    isNeedToShowAddTimeDialog(props) {
        const {room, user} = props;
        return !this.isShowedDialogThatMeetingTimeIsOver && !this.isShowedAddTimeDialog
            && this.getAvailableTime() === 0
            && user.isTeacher && (room.approxDuration + FIVE_MINUTES <= room.maxDuration);
    }

    isNeedToShowDialogThatMeetingTimeIsOver(props) {
        return !this.isShowedDialogThatMeetingTimeIsOver && this.isLessonDurationExpired(props, 'maxDuration') && this.isTeacher(props.user);
    }

    updateShiftAndNowTime(lastServerTime) {
        const now = Math.floor(new Date().getTime() / 1000);
        const shift = now - lastServerTime;
        this.setState({
            now,
            shift
        });
    }

    componentDidMount() {
        this.syncTimer = setInterval(() => this.syncTime(), 5000);
        this.updateTimer = setInterval(() => this.updateTime(), 1000);
    }

    syncTime() {
        this.props.onSyncTime();
    }

    updateTime() {
        const {onPauseLesson, onChangeDialogNameWhenFinishLesson} = this.props;
        if (this.isNeedToShowAddTimeDialog(this.props)) {
            this.isShowedAddTimeDialog = true;
            onPauseLesson();
            onChangeDialogNameWhenFinishLesson('dialogAddTime');
        }
        this.setState({
            now: Math.floor(new Date().getTime() / 1000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.syncTimer);
        clearInterval(this.updateTimer);
    }

    isTeacher(user) {
        return user.isTeacher;
    }

    isLessonDurationExpired(props, duration) {
        return this.getMinutesLeft(props) >= this.getMinutesDuration(props, duration);
    }

    getMinutesLeft(props) {
        const {room} = props;
        const {now, shift} = this.state;

        return Math.max(Math.floor((now - shift - room.startTime) / 60), 0) - Math.floor(this.getPausedTime(props) / 60);
    }

    getMinutesDuration(props, duration) {
        const {room} = props;

        return room[duration] / 60 + Math.floor(this.getPausedTime(props) / 60);
    }

    getAvailableTime() {
        const {now, shift, endTime} = this.state;
        const available = endTime + this.getPausedTime(this.props) - (now - shift);
        return available < 0 ? 0 : available;
    }

    getPausedTime(props) {
        const {room} = props;
        const {now, shift} = this.state;
        const pausedTime = room.totalPauseTime;
        let duringPause = 0;
        if (room.isPaused) {
            duringPause = room.lastPauseTimestamp > 0 ? (now - shift) - room.lastPauseTimestamp : 0;
        }
        return pausedTime + duringPause;
    }

    render() {
        const minutesLeft = this.getMinutesLeft(this.props);
        const lessonApproximateDurationExpired = this.isLessonDurationExpired(this.props, 'approxDuration');

        const className = classNames(styles.timeLeft, {
            [styles.timeLeftRed]: lessonApproximateDurationExpired
        });

        return (
            <div className={className}>
                {this.timeLabelFromMinutes(minutesLeft)}
            </div>
        );
    }

    timeLabelFromMinutes() {
        const availableTime = this.getAvailableTime();
        return moment.duration(availableTime, 'seconds').format('h:mm:ss', {
            trim: false
        });
    }
}

import React, {Component, PropTypes} from 'react';

import styles from './VideoDialog.scss';

import Dialog from '../common/Dialog';

import CommonUtils from 'helpers/CommonUtils';

import YouTube from 'react-youtube';

const PLAYING = "playing";
const PAUSED = "paused";

export default class VideoDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        canControl: PropTypes.bool,
        youtubeURL: PropTypes.string,
        playbackState: PropTypes.string,
        playbackTime: PropTypes.number,
        onClose: PropTypes.func.isRequired,
        changePlaybackTime: PropTypes.func.isRequired,
        changePlaybackState: PropTypes.func.isRequired
    };

    componentWillReceiveProps(props) {
        if (this.props.playbackState !== props.playbackState) {
            this.changePlaybackState(props.playbackState);
        }
        if (this.props.playbackTime !== props.playbackTime) {
            this.updatePlaybackTime(props.playbackTime);
        }
    }

    componentWillUmmount() {
        this.stopSyncTimer();
    }

    startSyncTimer() {
        if (!this.props.canControl) return;
        this.updatingTimer = setInterval(() => this.handleUpdatePlaybackTime(), 1000);
    }

    handleUpdatePlaybackTime() {
        if (this.player)
            this.props.changePlaybackTime(this.player.getCurrentTime());
    }

    updatePlaybackTime(lastTime) {
        if (!this.props.canControl && this.player && this.player.getPlayerState() !== YouTube.PlayerState.PAUSED && Math.abs(this.player.getCurrentTime() - lastTime) > 1) {
            this.player.seekTo(lastTime, true);
        }
    }

    stopSyncTimer() {
        clearInterval(this.updatingTimer);
        this.updatingTimer = null;
    }

    handleClose = () => {
        if (this.props.canControl) {
            this.props.onClose();
        }
    };

    handlePlayerReady = (event) => {
        this.player = event.target;
        this.changePlaybackState(this.props.playbackState);
    };

    changePlaybackState(playbackState) {
        // remote control only for students
        if (!this.player) return;

        switch (playbackState) {
            case PLAYING:
                this.player.playVideo();
                break;
            case PAUSED:
                this.player.pauseVideo();
                break;
            default:
                break;
        }
    }

    handlePlaybackStateChanged(playbackState) {
        if (this.props.canControl) {
            this.props.changePlaybackState(playbackState);

            switch (playbackState) {
                case PLAYING:
                    this.startSyncTimer();
                    break;
                case PAUSED:
                    this.stopSyncTimer();
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        const {visible, youtubeURL, canControl} = this.props;

        if (!youtubeURL)
            return false;

        const controls = canControl ? 1 : 0;

        const videoId = CommonUtils.getYoutubeIdFromLink(youtubeURL);
        const opts = {
            width: false,
            height: 390,
            playerVars: {
                autoplay: 1,
                controls
            }
        };

        return (
            <Dialog visible={visible}
                    title='Shared video'
                    dialogClassName={styles.dialog}
                    closable={canControl}
                    containerClassName={styles.container}
                    onClose={this.handleClose}>
                <YouTube videoId={videoId}
                         onReady={this.handlePlayerReady}
                         onPlay={this.handlePlaybackStateChanged.bind(this, PLAYING)}
                         onPause={this.handlePlaybackStateChanged.bind(this, PAUSED)}
                         opts={opts} />
            </Dialog>
        );
    }
}

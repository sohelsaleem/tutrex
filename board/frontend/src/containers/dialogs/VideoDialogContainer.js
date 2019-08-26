import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';

import VideoDialog from 'components/dialogs/VideoDialog';

import {
    finishVideoSharing,
    changePlaybackState,
    changePlaybackTime,
    getVideoFileHistory
} from 'actions/videoFile';

class VideoDialogContainer extends Component {
    static propTypes = {
        finishVideoSharing: PropTypes.func.isRequired,
        onAppear: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onAppear();
    }

    handleClose = () => {
        this.props.finishVideoSharing();
    };

    render() {
        return (
            <VideoDialog {...this.props}
                         onClose={this.handleClose}/>
        );
    }
}

const mapStateToProps = state => {
    const {user} = state.room.authInfo;
    const {videoFile} = state;
    const canControl = user.isTeacher || videoFile.userId === user.id;

    return {
        youtubeURL: videoFile.youtubeURL,
        playbackState: videoFile.playbackState,
        playbackTime: videoFile.playbackTime,
        canControl,
        visible: Boolean(videoFile.youtubeURL)
    };
};

const mapDispatchToProps = {
    finishVideoSharing,
    changePlaybackState,
    changePlaybackTime,
    onAppear: getVideoFileHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoDialogContainer);



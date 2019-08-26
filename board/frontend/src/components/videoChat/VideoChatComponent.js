import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './VideoChatComponent.scss';

import VideoStream from 'components/common/VideoStream';

export default class VideoChatComponent extends Component {
    static propTypes = {
        stream: PropTypes.object,
        streamVideoShown: PropTypes.bool,
        needToMute: PropTypes.bool,
        fullWidth: PropTypes.bool,
        maxHeight: PropTypes.string
    };

    render() {

        const {streamVideoShown, fullWidth, maxHeight, needToMute, stream} = this.props;

        const videoClassName = streamVideoShown ? styles.videoTeacher : styles.noVideo;

        const videoContainerClassNames = classNames(styles.videoContainer, {
            [styles.fullVideoContainer]: fullWidth
        });

        const videoContainerClassName = streamVideoShown ? videoContainerClassNames : styles.noVideo;

        return (
            <div className={videoContainerClassName} style={{maxHeight: maxHeight}}>
                <VideoStream className={videoClassName}
                             muted={needToMute}
                             stream={stream}/>
            </div>
        );
    }
}

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import ToolsContainer from './ToolsContainer';
import CanvasContainer from './CanvasContainer';
import BoardTabContainer from './BoardTabContainer';
import {unpublishStream} from 'actions/videoChat';
import {StreamTypes} from 'helpers/videoChat/VideoChatUtils';
import VideoChatComponent from 'components/videoChat/VideoChatComponent';

import styles from './WhiteboardContainer.scss';

class WhiteboardContainer extends Component {
    static propTypes = {
        fullScreenEnabled: PropTypes.bool,
        screenStream: PropTypes.object,
        canStopScreenSharing: PropTypes.bool,
        unpublishStream: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        if (prevProps.canStopScreenSharing && !this.props.canStopScreenSharing)
            this.handleStopSharing();
    }

    handleStopSharing() {
        const {screenStream, unpublishStream} = this.props;
        unpublishStream(screenStream.userId, screenStream.streamType);
    }

    render() {
        const {fullScreenEnabled, screenStream, canStopScreenSharing} = this.props;
        const displayBoardTabs = !fullScreenEnabled;

        return (
            <div className={styles.whiteboardContainer}>
                <ToolsContainer/>
                <div className={styles.whiteboardPanel}>
                    {displayBoardTabs && <BoardTabContainer/>}
                    <CanvasContainer/>
                </div>
                {screenStream &&
                <div className={styles.screenShareContainer}>
                    <VideoChatComponent stream={screenStream.stream}
                                        key="screen_share"
                                        streamVideoShown={true}
                                        fullWidth={true}
                                        needToMute={false}
                                        maxHeight='100%' />
                    {canStopScreenSharing &&
                    <div className={styles.stopSharingContainer}>
                        <button className={styles.stopSharingButton} onClick={::this.handleStopSharing}>Stop Sharing</button>
                    </div>
                    }
                </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {fullScreenEnabled} = state.whiteboard;
    const authInfo = state.room.authInfo;
    const {streams} = state.videoChat;
    const screenStream = streams.find(stream => stream.streamType === StreamTypes.SCREEN);
    const isTeacher = _.get(authInfo, 'user.isTeacher', false);
    const hasWhiteboardAccess = _.get(authInfo, 'user.capabilities.whiteboardAccess', false);
    const canStopScreenSharing = isTeacher ||
        hasWhiteboardAccess && screenStream && screenStream.userId === _.get(authInfo, 'user.id');

    return {
        fullScreenEnabled,
        screenStream,
        canStopScreenSharing
    };
};

const mapDispatchToProps = {
    unpublishStream
};

export default connect(mapStateToProps, mapDispatchToProps)(WhiteboardContainer);
